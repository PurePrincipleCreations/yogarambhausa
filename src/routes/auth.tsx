import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AuthForm } from "@/components/AuthModal";
import { Navbar } from "@/components/Navbar";
import { useAuthStore } from "@/stores/useAuthStore";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Yogarambha Academy" },
      { name: "description", content: "Sign in to your Yogarambha practice." },
      { property: "og:title", content: "Sign in — Yogarambha Academy" },
      { property: "og:description", content: "Sign in to your Yogarambha practice." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  useEffect(() => {
    if (isAuthenticated) void navigate({ to: "/community", replace: true });
  }, [isAuthenticated, navigate]);
  return (
    <>
      <Navbar />
      <main className="grid min-h-screen place-items-center bg-muted px-6 pt-28 pb-16">
        <div className="w-full max-w-md rounded-[2.5rem] bg-background p-8 shadow-2xl sm:p-10">
          <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
          <p className="mt-2 text-muted-foreground">Sign in to continue your practice.</p>
          <AuthForm />
        </div>
      </main>
    </>
  );
}
