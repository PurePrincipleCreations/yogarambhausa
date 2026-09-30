import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "student" | "manager" | "admin";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type AuthStore = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isReady: boolean;
  roles: AppRole[];
  enrolledSlugs: string[];
  isAuthModalOpen: boolean;
  authModalMode: "signin" | "signup";
  openAuthModal: (mode?: "signin" | "signup") => void;
  closeAuthModal: () => void;
  refreshAccess: () => Promise<void>;
  logout: () => Promise<void>;
};

let initialized = false;

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isReady: false,
  roles: [],
  enrolledSlugs: [],
  isAuthModalOpen: false,
  authModalMode: "signin",
  openAuthModal: (mode) =>
    set({ isAuthModalOpen: true, authModalMode: mode === "signup" ? "signup" : "signin" }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  refreshAccess: async () => {
    const user = get().user;
    if (!user) {
      set({ roles: [], enrolledSlugs: [] });
      return;
    }
    const [{ data: roles }, { data: enrollments }] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", user.id),
      supabase.from("enrollments").select("course_slug").eq("user_id", user.id),
    ]);
    set({
      roles: (roles ?? []).map((r) => r.role as AppRole),
      enrolledSlugs: (enrollments ?? []).map((e) => e.course_slug),
    });
  },
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false, roles: [], enrolledSlugs: [] });
  },
}));

export function isStaff(roles: AppRole[]) {
  return roles.includes("manager") || roles.includes("admin");
}

/** Call once on the client to keep the store in sync with the real session. */
export function initAuthListener() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  const apply = (session: Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"]) => {
    const u = session?.user;
    const user = u
      ? {
          id: u.id,
          email: u.email ?? "",
          name: (u.user_metadata?.full_name as string | undefined) ?? (u.email ?? "Student").split("@")[0],
        }
      : null;
    const prev = useAuthStore.getState().user?.id;
    useAuthStore.setState({ user, isAuthenticated: !!user, isReady: true });
    if (user?.id !== prev) void useAuthStore.getState().refreshAccess();
  };
  supabase.auth.onAuthStateChange((_event, session) => apply(session));
  void supabase.auth.getSession().then(({ data }) => apply(data.session));
}
