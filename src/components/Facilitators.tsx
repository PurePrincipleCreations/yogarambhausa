import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import veer from "@/assets/facilitator-veer.jpg";
import claire from "@/assets/facilitator-claire.jpg";
import karam from "@/assets/facilitator-karam.jpg";

gsap.registerPlugin(ScrollTrigger);

const PEOPLE = [
  {
    name: "VEER",
    image: veer,
    titles: "Founder, Yogarambha Method / Strength & Mobility Expert",
    bio: "An ex-pilot, professional diver and human physiology expert with 10,000+ hours of teaching experience. Learnings stretch across CrossFit, kettlebell, FMA Kali, Tai Chi, Indian Akhada training. 800 hours of formal training in Yoga and Pranayama. Enjoys leading Himalayan camps, survival hikes, and cold immersions.",
  },
  {
    name: "CLAIRE",
    image: claire,
    titles: "Co-Founder / Women Empowerment Lead",
    bio: "Registered nurse specializing in preventative and rehabilitated care through yoga and movement arts. Leads the Shakti Synergy Women Empowerment program. India’s first Nicklestick Balintawak trainer, a flow artist with deep explorations into pre and postnatal care.",
  },
  {
    name: "KARAM",
    image: karam,
    titles: "Traditional Yoga & Akhada Expert",
    bio: "Expert in traditional yoga principles and Kasrat-Akhada techniques. Excels in simplifying challenging moves by helping students connect minds and bodies. Focuses on creating an inclusive yet challenging environment that facilitates easy absorption of fundamentals and flow.",
  },
];

export function Facilitators() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const el = track.current;
      if (!el) return;
      const getDistance = () => Math.max(0, el.scrollWidth - window.innerWidth + 48);
      if (getDistance() <= 0) return;

      gsap.to(el, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="w-full overflow-hidden bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-20 font-serif text-4xl tracking-tight text-slate-900 md:text-6xl">
          Our Core Facilitators
        </h2>
      </div>
      <div ref={track} className="flex gap-8 px-6 will-change-transform">
        {PEOPLE.map((p) => (
          <article
            key={p.name}
            className="group w-[400px] shrink-0 overflow-hidden rounded-[2.5rem] bg-white shadow-2xl"
          >
            <div className="h-64 overflow-hidden rounded-t-[2.5rem]">
              <img
                src={p.image}
                alt={`${p.name}, ${p.titles}`}
                loading="lazy"
                width={800}
                height={800}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="p-8">
              <h3 className="text-3xl font-bold text-slate-900">{p.name}</h3>
              <p className="mt-2 text-xs uppercase tracking-wide text-ember">{p.titles}</p>
              <p className="mt-5 leading-relaxed text-slate-600">{p.bio}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
