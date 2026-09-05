import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, Check, Compass, Infinity as InfinityIcon, MessageSquare, Target, Video } from "lucide-react";
import veer from "@/assets/facilitator-veer.jpg";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { MentorshipScheduler } from "@/components/MentorshipScheduler";
import { MENTORSHIP_DURATION_MONTHS } from "@/lib/mentorship";

gsap.registerPlugin(ScrollTrigger);

const PILLARS = [
  {
    icon: Target,
    title: "One teacher, one student",
    body: "No cohorts, no shared attention. Veer works with a deliberately small roster so every programme is built around your body, history and goals.",
  },
  {
    icon: Video,
    title: "Monthly 1:1 video labs",
    body: "Live sessions where your practice is assessed on camera, corrected in real time and rebuilt into the next month's plan.",
  },
  {
    icon: MessageSquare,
    title: "Direct line, all year",
    body: "Send footage, questions and setbacks any day. You get considered answers from your teacher, not a support desk.",
  },
  {
    icon: Compass,
    title: "Beyond the mat",
    body: "Strength, breath, mobility, philosophy and recovery treated as one system — the way this practice was meant to be transmitted.",
  },
  {
    icon: InfinityIcon,
    title: "A twelve-month arc",
    body: "Four phases across the year: assess, rebuild, load, refine. Progress measured, not guessed.",
  },
  {
    icon: Check,
    title: "Full library access",
    body: "Every Yogarambha programme, retreat priority and live TTC access included for the duration of your mentorship.",
  },
];

const FAQ = [
  { q: "Who is this mentorship for?", a: "It is for sincere practitioners who want close guidance and are ready to engage consistently. Your current level matters less than your willingness to learn." },
  { q: "How is the mentorship shaped around me?", a: "Veer begins with your history, present practice, body and aspirations, then adapts the work as you develop. There is no standard syllabus imposed on every student." },
  { q: "What happens after the discovery call?", a: "If the mentorship feels right for both you and Veer, you will receive a personal recommendation for the way forward, including the commitment and practical details." },
];

export function MentorshipPage() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".mentor-hero-line", { y: 40, opacity: 0, duration: 1, stagger: 0.12, ease: "power4.out", delay: 0.2 });
      gsap.from(".mentor-pillar", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.09,
        ease: "power3.out",
        scrollTrigger: { trigger: ".mentor-pillars", start: "top 78%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="min-h-screen bg-canvas font-sans antialiased">
      <Navbar />

      <section className="relative flex min-h-[88vh] items-center overflow-hidden bg-foreground">
        <img
          src={veer}
          alt="Veer, founder of the Yogarambha Method, teaching"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
          width={1600}
          height={1000}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/85 to-foreground/35" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-32">
          <p className="mentor-hero-line text-xs font-semibold tracking-[0.28em] text-ember uppercase">
            Mentorship with Veer · {MENTORSHIP_DURATION_MONTHS} months
          </p>
          <h1 className="mentor-hero-line mt-6 font-display text-5xl leading-[1.02] font-semibold tracking-[-0.02em] text-background sm:text-7xl lg:text-8xl">
            GO BEYOND
            <br />
            YOGA.
          </h1>
          <p className="mentor-hero-line mt-8 max-w-xl text-lg leading-relaxed text-background/75">
            A twelve-month private apprenticeship. One teacher, dedicated attention, and a
            practice rebuilt around the person you're becoming — not a syllabus.
          </p>
          <div className="mentor-hero-line mt-10 flex flex-wrap items-center gap-4">
            <Button asChild className="h-14 rounded-full bg-ember px-8 text-base font-semibold text-primary-foreground hover:bg-ember/90">
              <a href="#apply">
                Book a call with Veer <ArrowDown aria-hidden="true" />
              </a>
            </Button>
            <span className="text-sm text-background/70">Limited private roster</span>
          </div>
        </div>
      </section>

      <section className="mentor-pillars mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-ember uppercase">What you get</p>
          <h2 className="mt-4 font-display text-4xl font-semibold text-foreground md:text-5xl">
            Dedicated attention, for a full year
          </h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, body }) => (
            <article
              key={title}
              className="mentor-pillar rounded-3xl border border-border/60 bg-card p-8 shadow-[0_24px_65px_-45px_oklch(0.28_0.03_260/0.5)]"
            >
              <span className="grid size-11 place-items-center rounded-2xl bg-ember/12 text-ember">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-6 text-xl font-semibold text-card-foreground">{title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24 md:py-28">
        <div className="grid gap-10 rounded-[2.5rem] bg-foreground p-10 text-background md:grid-cols-[1fr_auto] md:items-center md:p-14">
          <div>
            <h2 className="font-display text-4xl font-semibold md:text-5xl">Begin with a conversation</h2>
            <p className="mt-4 max-w-xl leading-relaxed text-background/70">
              Your discovery call is a chance to share your journey, explore whether the mentorship
              is the right fit and hear the details directly from Veer.
            </p>
          </div>
          <Button asChild className="h-14 rounded-full bg-ember px-8 text-base font-semibold text-primary-foreground hover:bg-ember/90">
            <a href="#apply">Start with a call</a>
          </Button>
        </div>
      </section>

      <section id="apply" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-24 md:pb-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-ember uppercase">Apply</p>
          <h2 className="mt-4 font-display text-4xl font-semibold text-foreground md:text-5xl">
            Book your discovery call
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Pick a time that suits you. You'll receive a private meeting room and a calendar invite
            the moment you confirm.
          </p>
        </div>
        <div className="mt-12">
          <MentorshipScheduler />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-28">
        <h2 className="font-display text-3xl font-semibold text-foreground">Questions</h2>
        <dl className="mt-8 space-y-6">
          {FAQ.map((item) => (
            <div key={item.q} className="rounded-2xl border border-border/60 bg-card p-6">
              <dt className="text-lg font-semibold text-card-foreground">{item.q}</dt>
              <dd className="mt-2 leading-relaxed text-muted-foreground">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
