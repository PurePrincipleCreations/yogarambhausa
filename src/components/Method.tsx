import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PRINCIPLES = ["TRUTH", "SKILL", "STRENGTH", "SELF-CARE"];

export function Method() {
  const root = useRef<HTMLElement>(null);
  const left = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (window.matchMedia("(min-width: 768px)").matches) {
        ScrollTrigger.create({
          trigger: left.current,
          start: "top 20%",
          endTrigger: root.current,
          end: "bottom 90%",
          pin: true,
          pinSpacing: false,
        });
      }

      gsap.from(".principle-card", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: ".principle-grid", start: "top 80%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative w-full bg-white py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 md:grid-cols-2">
        <div ref={left} className="self-start">
          <h2 className="font-serif text-4xl leading-tight tracking-tight text-slate-900 md:text-6xl">
            The Yogarambha Method
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-slate-700">
            A unique approach that treats the body as one intelligent system — where breath,
            mobility, strength and stillness are trained together rather than as separate
            disciplines.
          </p>
          <p className="mt-5 text-lg leading-relaxed text-slate-700">
            Our method is a product of a decade spent between traditional Indian akhadas, modern
            strength science and clinical human physiology, distilled into a practice that is as
            precise as it is soulful.
          </p>
        </div>

        <div className="principle-grid grid grid-cols-1 gap-6 sm:grid-cols-2">
          {PRINCIPLES.map((p) => (
            <div
              key={p}
              className="principle-card group flex h-56 items-center justify-center rounded-3xl bg-white shadow-xl ring-1 ring-slate-100 transition-transform duration-300 hover:scale-105"
            >
              <span className="text-xl font-semibold tracking-[0.2em] text-slate-800 transition-colors duration-300 group-hover:text-ember">
                {p}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
