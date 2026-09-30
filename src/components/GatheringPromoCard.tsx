import { Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Mountain } from "lucide-react";

export function GatheringPromoCard({ className = "" }: { className?: string }) {
  return (
    <article className={`relative overflow-hidden rounded-[2rem] bg-earth p-7 text-earth-foreground shadow-2xl ${className}`}>
      <Mountain aria-hidden="true" className="pointer-events-none absolute -right-6 -bottom-6 size-40 text-amber-glow/10" strokeWidth={1} />
      <p className="text-[0.66rem] font-semibold tracking-[0.2em] text-amber-glow">GATHERING • OPEN TO ALL</p>
      <h3 className="mt-4 font-display text-3xl leading-tight font-semibold tracking-wide">HIMALAYAN IMMERSION</h3>
      <p className="mt-2 font-serif text-earth-foreground/80 italic">One week. One mountain. A shared practice.</p>
      <dl className="mt-6 space-y-2 border-t border-amber-glow/20 pt-5 text-xs tracking-[0.08em]">
        <div className="flex gap-2"><dt className="flex items-center gap-1.5 font-semibold text-amber-glow"><MapPin className="size-3.5" aria-hidden="true" />WHERE:</dt><dd>Naggar, Kullu</dd></div>
        <div className="flex gap-2"><dt className="font-semibold text-amber-glow">PRACTICE:</dt><dd>Tools, Yoga, Breath, Strength</dd></div>
      </dl>
      <Link
        to="/retreats"
        className="relative mt-7 inline-flex items-center gap-2 rounded-full bg-amber-glow px-5 py-2.5 text-sm font-semibold text-earth transition-transform hover:scale-[1.03]"
      >
        I'm interested <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </article>
  );
}
