import { useState, type FormEvent } from "react";
import { LockKeyhole, Mail } from "lucide-react";
import { toast } from "sonner";
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

export function AuthModal() {
  const isOpen = useAuthStore((state) => state.isAuthModalOpen);
  const close = useAuthStore((state) => state.closeAuthModal);
  const login = useAuthStore((state) => state.login);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login();
    toast.success("Welcome to Yogarambha.");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md rounded-[2.5rem] border-background/50 bg-background/95 p-8 shadow-2xl backdrop-blur-2xl sm:p-10">
        <DialogHeader className="text-left">
          <span className="mb-4 grid size-12 place-items-center rounded-full bg-ember text-lg font-semibold text-primary-foreground">
            Y
          </span>
          <DialogTitle className="text-3xl font-bold text-foreground">
            {isCreatingAccount ? "Begin your practice" : "Welcome back"}
          </DialogTitle>
          <DialogDescription className="pt-2 leading-relaxed">
            {isCreatingAccount
              ? "Create your account to join live sessions and unlock the full practice library."
              : "Sign in to continue your Yogarambha practice."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="mt-4 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="auth-email">Email address</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input id="auth-email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" className="h-12 rounded-xl bg-background pl-11 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-ember" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="auth-password">Password</Label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input id="auth-password" name="password" type="password" autoComplete={isCreatingAccount ? "new-password" : "current-password"} required minLength={6} placeholder="••••••••" className="h-12 rounded-xl bg-background pl-11 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-ember" />
            </div>
          </div>
          <Button type="submit" className="h-12 w-full rounded-xl bg-ember text-primary-foreground transition-all duration-300 hover:bg-ember/90">
            {isCreatingAccount ? "Create Account" : "Log In"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isCreatingAccount ? "Already have an account?" : "New to Yogarambha?"}{" "}
          <Button type="button" variant="link" onClick={() => setIsCreatingAccount((current) => !current)} className="h-auto p-0 font-semibold text-ember">
            {isCreatingAccount ? "Log In" : "Create Account"}
          </Button>
        </p>
      </DialogContent>
    </Dialog>
  );
}