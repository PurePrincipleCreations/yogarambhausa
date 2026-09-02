import { useEffect, useRef } from "react";
import gsap from "gsap";
import { LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const links = [
  { label: "Programs", to: "/" as const, hash: "programs" },
  { label: "Retreats", to: "/retreats" as const },
  { label: "Philosophy", to: "/" as const, hash: "philosophy" },
];

export function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    if (!navRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        y: -40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.1,
      });
      gsap.from(".nav-item", {
        y: -12,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.35,
      });
    }, navRef);
    return () => ctx.revert();
  }, []);

  const initials = (user?.name ?? "Guest")
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <header
      ref={navRef}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 sm:pt-6"
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6 rounded-full border border-white/50 bg-white/60 px-4 py-3 shadow-[0_18px_50px_-24px_oklch(0.28_0.03_260/0.45)] backdrop-blur-md sm:px-6">
        <Link to="/" className="nav-item flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-full bg-ember text-sm font-semibold tracking-tight text-white shadow-[0_10px_25px_-10px_oklch(0.7_0.2_42/0.9)]">
            Y
          </span>
          <span className="font-display text-[0.95rem] font-semibold tracking-[0.18em] text-slate-800 uppercase">
            Yogarambha
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.label} className="nav-item">
              {"hash" in l ? (
                <Link
                  to={l.to}
                  hash={l.hash}
                  className="relative text-sm font-medium text-slate-800/80 transition-colors hover:text-slate-800 after:absolute after:-bottom-1.5 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:rounded-full after:bg-ember after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100"
                >
                  {l.label}
                </Link>
              ) : (
                <Link
                  to={l.to}
                  className="relative text-sm font-medium text-slate-800/80 transition-colors hover:text-slate-800 after:absolute after:-bottom-1.5 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:rounded-full after:bg-ember after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100"
                >
                  {l.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className="nav-item flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open your profile"
                  className="size-10 rounded-full border border-background/70 bg-background/80 text-xs font-semibold tracking-wide text-foreground shadow-[0_12px_30px_-16px_oklch(0.28_0.03_260/0.7)] hover:bg-background"
                >
                  {initials}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
                <DropdownMenuLabel>
                  <span className="block">{user?.name}</span>
                  <span className="block truncate text-xs font-normal text-muted-foreground">{user?.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={logout} className="rounded-lg py-2.5">
                  <LogOut aria-hidden="true" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              onClick={login}
              className="rounded-full px-4 text-sm font-medium text-slate-800 hover:bg-white/70"
            >
              Log In
            </Button>
          )}
          {!isAuthenticated && (
            <Button onClick={login} className="rounded-full bg-ember px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_16px_35px_-14px_oklch(0.7_0.2_42/0.95)] hover:bg-ember/90">
              Sign Up
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
