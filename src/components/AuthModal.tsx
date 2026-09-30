import { useEffect, useState, type FormEvent } from "react";
import { LockKeyhole, Mail, User } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Mode = "signin" | "signup" | "forgot";

const inputCls =
  "h-12 rounded-xl bg-background pl-11 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-ember";

export function AuthForm({ onDone }: { onDone?: () => void }) {
  const initialMode = useAuthStore((s) => s.authModalMode);
  const [mode, setMode] = useState<Mode>(initialMode);
  const [busy, setBusy] = useState(false);
  useEffect(() => setMode(initialMode), [initialMode]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const fullName = String(form.get("full_name") ?? "").trim();
    setBusy(true);
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Check your inbox for a reset link.");
        setMode("signin");
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin, data: { full_name: fullName } },
        });
        if (error) throw error;
        if (data.session) {
          toast.success("Welcome to Yogarambha.");
          onDone?.();
        } else {
          toast.success("Check your email to confirm your account.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back.");
        onDone?.();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <form onSubmit={submit} className="mt-4 space-y-5">
        {mode === "signup" && (
          <div className="space-y-2">
            <Label htmlFor="auth-name">Full name</Label>
            <div className="relative">
              <User className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input id="auth-name" name="full_name" required maxLength={100} placeholder="Your name" className={inputCls} />
            </div>
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="auth-email">Email address</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input id="auth-email" name="email" type="email" autoComplete="email" required maxLength={255} placeholder="you@example.com" className={inputCls} />
          </div>
        </div>
        {mode !== "forgot" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="auth-password">Password</Label>
              {mode === "signin" && (
                <button type="button" onClick={() => setMode("forgot")} className="text-xs font-medium text-ember hover:underline">
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input id="auth-password" name="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} required minLength={8} placeholder="••••••••" className={inputCls} />
            </div>
          </div>
        )}
        <Button type="submit" disabled={busy} className="h-12 w-full rounded-xl bg-ember text-primary-foreground transition-all duration-300 hover:bg-ember/90">
          {busy ? "Please wait…" : mode === "signup" ? "Create Account" : mode === "forgot" ? "Send reset link" : "Log In"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {mode === "signup" ? "Already have an account?" : mode === "forgot" ? "Remembered it?" : "New to Yogarambha?"}{" "}
        <Button type="button" variant="link" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="h-auto p-0 font-semibold text-ember">
          {mode === "signin" ? "Create Account" : "Log In"}
        </Button>
      </p>
    </>
  );
}

export function AuthModal() {
  const isOpen = useAuthStore((state) => state.isAuthModalOpen);
  const close = useAuthStore((state) => state.closeAuthModal);
  const mode = useAuthStore((state) => state.authModalMode);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md rounded-[2.5rem] border-background/50 bg-background/95 p-8 shadow-2xl backdrop-blur-2xl sm:p-10">
        <DialogHeader className="text-left">
          <span className="mb-4 grid size-12 place-items-center rounded-full bg-ember text-lg font-semibold text-primary-foreground">
            Y
          </span>
          <DialogTitle className="text-3xl font-bold text-foreground">
            {mode === "signup" ? "Begin your practice" : "Welcome back"}
          </DialogTitle>
          <DialogDescription className="pt-2 leading-relaxed">
            Sign in to continue your Yogarambha practice.
          </DialogDescription>
        </DialogHeader>
        <AuthForm onDone={close} />
      </DialogContent>
    </Dialog>
  );
}
