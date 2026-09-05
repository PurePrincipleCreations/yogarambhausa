import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import veer from "@/assets/facilitator-veer.jpg";
import { Button } from "@/components/ui/button";
import { MENTORSHIP_DURATION_MONTHS, MENTORSHIP_PRICE } from "@/lib/mentorship";

gsap.registerPlugin(ScrollTrigger);

export function MentorshipTeaser() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".mentorship-reveal", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 76%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="w-full bg-canvas py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid overflow-hidden rounded-[2.5rem] bg-foreground text-background lg:grid-cols-[1.1fr_0.9fr]">
          <div className="mentorship-reveal p-10 md:p-14">
            <p className="text-xs font-semibold tracking-[0.24em] text-ember uppercase">
              Mentorship with Veer
            </p>
            <h2 className="mt-5 font-display text-4xl leading-[1.05] font-semibold md:text-6xl">
              GO BEYOND YOGA.
            </h2>
            <p className="mt-6 max-w-xl leading-relaxed text-background/70">
              A {MENTORSHIP_DURATION_MONTHS}-month private apprenticeship with the dedicated
              attention of your own teacher. Strength, breath, philosophy and practice, built
              around you alone.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Button asChild className="h-13 rounded-full bg-ember px-7 text-sm font-semibold text-primary-foreground hover:bg-ember/90">
                <Link to="/mentorship">
                  Explore the mentorship <ArrowUpRight aria-hidden="true" />
                </Link>
              </Button>
              <span className="text-sm text-background/60">${MENTORSHIP_PRICE}/month · limited roster</span>
            </div>
          </div>
          <div className="mentorship-reveal relative min-h-[18rem]">
            <img
              src={veer}
              alt="Veer mentoring a student"
              loading="lazy"
              width={1000}
              height={800}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/25 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
