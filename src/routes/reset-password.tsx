import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/Navbar";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set your password — Yogarambha Academy" },
      { name: "description", content: "Choose a password for your Yogarambha account." },
      { property: "og:title", content: "Set your password — Yogarambha Academy" },
      { property: "og:description", content: "Choose a password for your Yogarambha account." },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password"));
    if (password !== String(form.get("confirm"))) return toast.error("Passwords do not match.");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Password saved. Welcome to Yogarambha.");
    void navigate({ to: "/" });
  };

  return (
    <>
      <Navbar />
      <main className="grid min-h-screen place-items-center bg-muted px-6 pt-28 pb-16">
        <form onSubmit={submit} className="w-full max-w-md space-y-5 rounded-[2.5rem] bg-background p-8 shadow-2xl sm:p-10">
          <h1 className="text-3xl font-bold text-foreground">Set your password</h1>
          <p className="text-muted-foreground">Choose a password you'll use to sign in.</p>
          <div className="space-y-2">
            <Label htmlFor="pw">New password</Label>
            <Input id="pw" name="password" type="password" minLength={8} required className="h-12 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pw2">Confirm password</Label>
            <Input id="pw2" name="confirm" type="password" minLength={8} required className="h-12 rounded-xl" />
          </div>
          <Button type="submit" disabled={busy} className="h-12 w-full rounded-xl bg-ember text-primary-foreground hover:bg-ember/90">
            {busy ? "Saving…" : "Save password"}
          </Button>
        </form>
      </main>
    </>
  );
}
