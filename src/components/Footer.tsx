import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const linkClass = "w-fit text-sm text-primary-foreground/65 transition-all duration-300 hover:text-primary-foreground";

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-8 py-16 md:grid-cols-4 md:gap-8">
        <div>
          <Link to="/" className="inline-flex items-center gap-3 transition-opacity duration-300 hover:opacity-80">
            <span className="grid size-10 place-items-center rounded-full bg-ember font-semibold">Y</span>
            <span className="font-display text-sm font-semibold tracking-[0.18em] uppercase">Yogarambha</span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-primary-foreground/65">Bridging traditional wisdom with modern movement science.</p>
          <p className="mt-8 text-xs text-primary-foreground/45">© 2026 Yogarambha Academy</p>
        </div>

        <nav aria-label="Quick links" className="flex flex-col gap-3">
          <h2 className="mb-1 text-xs font-semibold tracking-[0.16em] uppercase">Quick Links</h2>
          <Link to="/" hash="programs" className={linkClass}>Programs</Link>
          <Link to="/retreats" className={linkClass}>Retreats</Link>
          <Link to="/live-ttc" className={linkClass}>Live TTC</Link>
        </nav>

        <nav aria-label="Legal" className="flex flex-col gap-3">
          <h2 className="mb-1 text-xs font-semibold tracking-[0.16em] uppercase">Legal</h2>
          <Link to="/legal/$document" params={{ document: "terms" }} className={linkClass}>Terms</Link>
          <Link to="/legal/$document" params={{ document: "privacy" }} className={linkClass}>Privacy Policy</Link>
          <Link to="/legal/$document" params={{ document: "liability-waiver" }} className={linkClass}>Liability Waiver</Link>
        </nav>

        <div>
          <h2 className="text-xs font-semibold tracking-[0.16em] uppercase">Practice Notes</h2>
          <p className="mt-4 text-sm leading-relaxed text-primary-foreground/65">Occasional teachings, retreat dates and live session updates.</p>
          <form className="mt-5 flex gap-2" onSubmit={(event) => { event.preventDefault(); event.currentTarget.reset(); toast.success("You’re on the list."); }}>
            <Input type="email" required aria-label="Email address for newsletter" placeholder="Email address" className="h-11 rounded-xl border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/45 focus-visible:ring-ember" />
            <Button type="submit" size="icon" aria-label="Subscribe" className="size-11 shrink-0 rounded-xl bg-ember text-primary-foreground hover:bg-ember/90"><ArrowRight aria-hidden="true" /></Button>
          </form>
        </div>
      </div>
    </footer>
  );
}