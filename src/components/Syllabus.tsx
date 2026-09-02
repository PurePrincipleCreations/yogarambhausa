import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

type Module = { title: string; items: string[] };

const MODULES: Module[] = [
  {
    title: "MODULE I - FOUNDATION",
    items: [
      "Posture correction",
      "Accessing the Deep Core",
      "Diaphragmatic breathing – The 360 Breath",
      "Primal movement mechanics and mobility",
      "Body recode and conditioning",
      "Yogic diet & modern nutrition science",
      "Yogic Dincharya – daily routines",
      "Cognitive practices for brain health",
      "Countermovement & tensegrity",
    ],
  },
  {
    title: "MODULE II - THE PRACTISE",
    items: [
      "Surya Kriya and Hasta Vinyasa",
      "Pranayama preparation and fundamentals",
      "History, theory and philosophy",
      "Alignment and muscular symmetry",
      "Anatomy and physiology – General",
      "Vinyasa Flow – Beginner to intermediate",
      "Primal Flow",
      "Yog Nidra",
    ],
  },
  {
    title: "MODULE III - ADVANCED",
    items: [
      "Mahamokshsadhana (ancient Tibetian practice under the Nath Yoga system)",
      "Arm balances and inversions",
      "Advanced Pranayama techniques",
      "Mind-body somatics",
      "Mantra & their role in meditation",
      "Exploring meditation techniques",
      "Neti, Nauli, Traatak (Kriyas)",
      "Creative Vinyasa Flow – Advanced",
    ],
  },
  {
    title: "MODULE IV - TEACHER DEVELOPMENT PROGRAM",
    items: [
      "Creative Vinyasa Flow – Sequencing",
      "Strength fundamentals",
      "Teaching methodology",
      "Accessing agility",
      "Marketing",
      "Anatomy & Physiology – Detailed",
      "Developing Confidence & Communication Skills",
    ],
  },
  {
    title: "TEACHING METHODOLOGY & PROTOCOLS",
    items: [
      "Progressive growth, streamlined sequences and easy cuing",
      "Principles behind creating a sequence using hip positions, spinal nutation and movement drivers",
      "Joint mobility to enable stable movement",
      "How to articulate clearly",
      "Teaching asana technique and alignment",
      "Micro-lessons approach",
      "Kinesthetic empathy",
      "Protocols for specific purposes (energy, knee pain, immunity)",
    ],
  },
];

function AccordionRow({
  module,
  isOpen,
  onToggle,
}: {
  module: Module;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useLayoutEffect(() => {
    const el = panel.current;
    if (!el) return;
    if (first.current) {
      first.current = false;
      gsap.set(el, { height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 });
      return;
    }
    gsap.killTweensOf(el);
    if (isOpen) {
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.5, ease: "power3.out" },
      );
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.4, ease: "power3.inOut" });
    }
  }, [isOpen]);

  return (
    <div className="border-b border-slate-100">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="group flex w-full items-center justify-between gap-6 py-6 text-left"
      >
        <span className="text-lg font-semibold tracking-wide text-slate-900 transition-colors duration-300 group-hover:text-ember md:text-xl">
          {module.title}
        </span>
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6 shrink-0 text-slate-400 transition-colors duration-300 group-hover:text-ember"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M4 12h16" />
          {!isOpen && <path d="M12 4v16" />}
        </svg>
      </button>
      <div ref={panel} className="overflow-hidden">
        <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-2">
          {module.items.map((item) => (
            <p key={item} className="leading-relaxed text-slate-600">
              {item}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Syllabus() {
  const [activeTab, setActiveTab] = useState<number | null>(0);

  return (
    <section className="w-full bg-white py-28">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-center font-serif text-4xl tracking-tight text-slate-900 md:text-5xl">
          TTC Course Outline &amp; Methodology
        </h2>
        <div className="mt-16">
          {MODULES.map((m, i) => (
            <AccordionRow
              key={m.title}
              module={m}
              isOpen={activeTab === i}
              onToggle={() => setActiveTab(activeTab === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
