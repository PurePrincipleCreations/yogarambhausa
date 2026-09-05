import { Suspense, lazy, useEffect, useRef, useState } from "react";
import gsap from "gsap";

const HeroBackground = lazy(() => import("./HeroBackground"));

const headline = ["WHY CHOOSE", "YOGARAMBHA ACADEMY", "FOR YOUR STUDIES?"];

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(".hero-eyebrow", { y: 20, opacity: 0, duration: 0.8 }, 0.15)
        .from(
          ".hero-line-inner",
          { yPercent: 118, opacity: 0, duration: 1.15, stagger: 0.14 },
          0.25,
        )
        .from(".hero-sub", { y: 24, opacity: 0, duration: 1 }, "-=0.45")
        .from(".hero-cta", { y: 20, opacity: 0, duration: 0.8, stagger: 0.1 }, "-=0.6")
        .from(cardRef.current, { y: 40, opacity: 0, duration: 1.1 }, "-=0.7");

      gsap.to(cardRef.current, {
        y: -16,
        duration: 4.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 1.6,
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative flex h-screen min-h-[680px] w-full items-center justify-center overflow-hidden bg-canvas"
    >
      <div className="absolute inset-0" aria-hidden="true">
        {mounted && (
          <Suspense fallback={null}>
            <HeroBackground />
          </Suspense>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/70 via-white/20 to-white/80" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 text-center">
        <div className="hero-eyebrow mb-8 inline-flex items-center gap-5 rounded-full border border-white/60 bg-white/60 px-6 py-3 backdrop-blur-md">
          <img src={yogarambhaLogo.url} alt="Yogarambha" className="h-9 w-auto object-contain sm:h-11" />
          <span className="h-8 w-px bg-slate-800/15" aria-hidden="true" />
          <img src={kasratshalaLogo.url} alt="Kasratshala" className="h-9 w-auto object-contain sm:h-11" />
        </div>


        <h1 className="font-display text-[2rem] leading-[1.06] font-semibold tracking-[-0.02em] text-slate-800 sm:text-5xl lg:text-6xl">
          {headline.map((line) => (
            <span key={line} className="block overflow-hidden py-[0.12em]">
              <span className="hero-line-inner block">{line}</span>
            </span>
          ))}
        </h1>

        <p className="hero-sub mx-auto mt-7 max-w-2xl text-base leading-relaxed text-slate-800/70 sm:text-lg">
          After years of research and exploration into the world of movement arts, yoga,
          pranayama, teaching and philosophy, we were able to create the best way to learn
          this wonderful, ancient art.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button className="hero-cta rounded-full bg-ember px-7 py-3.5 text-sm font-semibold text-white shadow-[0_24px_50px_-20px_oklch(0.7_0.2_42/0.95)] transition-transform duration-200 hover:scale-[1.04]">
            Explore Programs
          </button>
          <button className="hero-cta rounded-full border border-white/70 bg-white/60 px-7 py-3.5 text-sm font-semibold text-slate-800 backdrop-blur-md transition-transform duration-200 hover:scale-[1.04]">
            Our Philosophy
          </button>
        </div>
      </div>

      <div
        ref={cardRef}
        className="absolute right-4 bottom-8 z-10 hidden w-[22rem] rounded-[2rem] border border-white/60 bg-white/45 p-6 shadow-[0_40px_80px_-40px_oklch(0.28_0.03_260/0.6)] backdrop-blur-lg lg:right-12 lg:bottom-14 lg:block"
      >
        <p className="font-display text-[0.95rem] leading-relaxed text-slate-800/85">
          "Where is the delusion when truth is known? Where is the disease when the mind is
          clear? Where is death when the Breath is controlled? Therefore surrender to Yoga."
        </p>
        <p className="mt-4 text-[0.7rem] font-medium tracking-[0.22em] text-ember uppercase">
          T. Krishnamacharya
        </p>
      </div>
    </section>
  );
}
