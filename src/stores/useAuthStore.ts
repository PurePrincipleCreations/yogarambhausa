import { create } from "zustand";

export type AuthUser = {
  name: string;
  email: string;
};

type AuthStore = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: () => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isAuthModalOpen: false,
  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  login: () => {
    const user = { name: "Guest", email: "guest@example.com" };
    set({ user, isAuthenticated: true, isAuthModalOpen: false });
    console.info("[Yogarambha auth] signed in", { isAuthenticated: true });
  },
  logout: () => {
    set({ user: null, isAuthenticated: false, isAuthModalOpen: false });
    console.info("[Yogarambha auth] signed out", { isAuthenticated: false });
  },
}));