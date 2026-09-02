import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const POINTS = [
  "You’re seeking the knowledge of yoga beyond postures — its history, philosophy and inner science.",
  "You’re fascinated with the human body and want to understand how it truly moves.",
  "You want to teach with confidence, clarity and a language that students actually understand.",
  "You’ve plateaued in your own practice and need precise, personal correction.",
  "You want strength, mobility and breath work integrated into one coherent system.",
  "You’re a movement athlete, dancer or trainer looking to deepen your toolkit.",
  "You want a small, immersive cohort rather than a crowded certification mill.",
];

export function Qualifications() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".qual-item", {
        x: -30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="w-full bg-slate-50 py-28">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
          OUR 200 HOUR TTC IS PERFECT FOR YOU IF…
        </h2>

        <ul className="mt-16">
          {POINTS.map((point) => (
            <li
              key={point}
              className="qual-item mb-4 flex flex-row items-center gap-5 rounded-2xl bg-white p-4 shadow-sm"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ember">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="white"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              <span className="font-medium leading-relaxed text-slate-700">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
