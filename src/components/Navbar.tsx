import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { label: "Programs", href: "#programs" },
  { label: "Retreats", href: "#retreats" },
  { label: "Philosophy", href: "#philosophy" },
];

export function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const { isLoggedIn, name, logIn, logOut } = useAuth();

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

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <header
      ref={navRef}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 sm:pt-6"
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6 rounded-full border border-white/50 bg-white/60 px-4 py-3 shadow-[0_18px_50px_-24px_oklch(0.28_0.03_260/0.45)] backdrop-blur-md sm:px-6">
        <a href="/" className="nav-item flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-full bg-ember text-sm font-semibold tracking-tight text-white shadow-[0_10px_25px_-10px_oklch(0.7_0.2_42/0.9)]">
            Y
          </span>
          <span className="font-display text-[0.95rem] font-semibold tracking-[0.18em] text-slate-800 uppercase">
            Yogarambha
          </span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.label} className="nav-item">
              <a
                href={l.href}
                className="relative text-sm font-medium text-slate-800/80 transition-colors hover:text-slate-800 after:absolute after:-bottom-1.5 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:rounded-full after:bg-ember after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-item flex items-center gap-2 sm:gap-3">
          {isLoggedIn ? (
            <button
              onClick={logOut}
              aria-label="Open your profile"
              className="grid size-10 place-items-center rounded-full border border-white/70 bg-white/80 text-xs font-semibold tracking-wide text-slate-800 shadow-[0_12px_30px_-16px_oklch(0.28_0.03_260/0.7)] transition-transform duration-200 hover:scale-105"
            >
              {initials}
            </button>
          ) : (
            <button
              onClick={logIn}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-800 transition-colors hover:bg-white/70"
            >
              Log In
            </button>
          )}
          <button className="rounded-full bg-ember px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_35px_-14px_oklch(0.7_0.2_42/0.95)] transition-transform duration-200 hover:scale-[1.04]">
            Sign Up
          </button>
        </div>
      </nav>
    </header>
  );
}
