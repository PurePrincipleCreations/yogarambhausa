import { useLayoutEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Footprints, MapPin, Moon, Sunrise, Utensils } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/retreat-himalaya-hero.jpg";
import movementImage from "@/assets/retreat-movement.jpg";
import natureImage from "@/assets/retreat-nature.jpg";
import communityImage from "@/assets/retreat-community.jpg";

gsap.registerPlugin(ScrollTrigger);

const itinerary = [
  { time: "06:00 AM", title: "Pranayama & Stillness Flow", detail: "Begin before the valley wakes, moving from breath into quiet, attentive practice.", icon: Sunrise },
  { time: "09:00 AM", title: "Organic Yogic Breakfast", detail: "Seasonal Himachali produce, warm grains and tea shared around the communal table.", icon: Utensils },
  { time: "11:00 AM", title: "Primal Movement Mechanics", detail: "Study strength, locomotion and martial movement in the clear mountain air.", icon: Footprints },
  { time: "04:00 PM", title: "Exploration & Hiking", detail: "Walk cedar trails, visit old Naggar and let the landscape become part of practice.", icon: MapPin },
  { time: "08:00 PM", title: "Fire, Philosophy & Rest", detail: "Close with conversation, reflection and a deep return to silence.", icon: Moon },
];

export function HimalayanRetreatsPage() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!root.current) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.to(".retreat-hero-image", {
        yPercent: 14,
        ease: "none",
        scrollTrigger: { trigger: ".retreat-hero", start: "top top", end: "bottom top", scrub: true },
      });

      gsap.utils.toArray<HTMLElement>(".retreat-float-image").forEach((image, index) => {
        gsap.fromTo(image, { y: 70 + index * 25 }, {
          y: -30 - index * 18,
          ease: "none",
          scrollTrigger: { trigger: image, start: "top bottom", end: "bottom top", scrub: true },
        });
      });

      gsap.fromTo(".timeline-progress", { scaleY: 0 }, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: ".retreat-timeline", start: "top 65%", end: "bottom 65%", scrub: true },
      });

      gsap.utils.toArray<HTMLElement>(".timeline-row").forEach((row, index) => {
        const card = row.querySelector(".timeline-card");
        const node = row.querySelector(".timeline-node");
        gsap.from(node, { scale: 0, duration: 0.45, ease: "back.out(2)", scrollTrigger: { trigger: row, start: "top 68%" } });
        gsap.from(card, { x: index % 2 === 0 ? -30 : 30, opacity: 0, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: row, start: "top 70%" } });
      });
    }, root);
    return () => media.revert();
  }, []);

  return (
    <main ref={root} className="overflow-hidden bg-background font-sans">
      <Navbar />
      <section className="retreat-hero relative h-screen min-h-[42rem] overflow-hidden rounded-b-[4rem]">
        <img src={heroImage} alt="Sunrise over the Himalayan ranges near Kullu" width={1920} height={1088} className="retreat-hero-image absolute -inset-y-[15%] h-[130%] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/15 to-transparent" />
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-end px-6 pb-20 text-center md:pb-24">
          <p className="text-xs font-semibold tracking-[0.22em] text-ember-soft uppercase">Naggar · Kullu Valley</p>
          <h1 className="mt-5 max-w-5xl font-serif text-6xl font-medium leading-[0.9] text-primary-foreground sm:text-7xl lg:text-9xl">HIMALAYAN IMMERSION</h1>
          <p className="mt-6 max-w-xl text-base text-primary-foreground/80 sm:text-lg">An exclusive retreat in Naggar, Kullu. Disconnect to reconnect.</p>
          <Button asChild size="lg" className="mt-8 h-12 rounded-full bg-ember px-7 text-primary-foreground shadow-xl hover:bg-ember/90">
            <a href="mailto:retreats@yogarambha.com?subject=Himalayan%20Immersion%20Application">Apply for the Next Retreat <ArrowRight aria-hidden="true" /></a>
          </Button>
        </div>
      </section>

      <section className="bg-background py-28 md:py-36">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <p className="text-xs font-semibold tracking-[0.2em] text-ember uppercase">The experience</p>
              <h2 className="mt-5 font-serif text-5xl font-medium leading-[0.95] text-foreground md:text-7xl">Practice shaped by the mountain.</h2>
              <p className="mt-7 max-w-md text-lg leading-relaxed text-muted-foreground">A week where traditional yoga, martial arts and stillness flow meet wild Himalayan nature. Each day creates space to move with discipline, eat with the seasons and rediscover an unhurried rhythm.</p>
              <div className="mt-9 flex items-center gap-3 text-sm font-semibold text-foreground"><MapPin className="size-4 text-ember" aria-hidden="true" /> Naggar, Himachal Pradesh</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 lg:col-span-7 lg:gap-7">
            <figure className="retreat-float-image col-span-1 mt-20 overflow-hidden rounded-[3rem] shadow-xl">
              <img src={movementImage} alt="Retreat practitioners exploring grounded movement" loading="lazy" width={1200} height={1504} className="h-full min-h-[28rem] w-full object-cover" />
            </figure>
            <figure className="retreat-float-image col-span-1 overflow-hidden rounded-[3rem] shadow-xl">
              <img src={natureImage} alt="A quiet cedar forest trail near Naggar" loading="lazy" width={1200} height={1600} className="h-full min-h-[31rem] w-full object-cover" />
            </figure>
            <figure className="retreat-float-image col-span-2 mx-4 overflow-hidden rounded-[3rem] shadow-xl md:mx-12">
              <img src={communityImage} alt="Retreat community sharing a mountain breakfast" loading="lazy" width={1408} height={1056} className="aspect-[4/3] w-full object-cover" />
            </figure>
          </div>
        </div>
      </section>

      <section className="bg-muted py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold tracking-[0.2em] text-ember uppercase">A daily rhythm</p>
            <h2 className="mt-4 font-serif text-5xl font-medium text-foreground md:text-7xl">A Day in the Himalayas</h2>
          </div>

          <div className="retreat-timeline relative mt-20">
            <div className="absolute bottom-0 left-5 top-0 w-px bg-border md:left-1/2" aria-hidden="true">
              <div className="timeline-progress h-full w-full origin-top bg-ember" />
            </div>
            <ol className="space-y-12 md:space-y-16">
              {itinerary.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={item.time} className="timeline-row relative grid grid-cols-[2.5rem_1fr] gap-5 md:grid-cols-[1fr_5rem_1fr] md:gap-8">
                    <article className={`timeline-card rounded-3xl border border-card/70 bg-card/70 p-6 shadow-lg backdrop-blur-sm md:p-7 ${index % 2 === 0 ? "md:col-start-1 md:text-right" : "md:col-start-3"}`}>
                      <time className="text-xs font-semibold tracking-[0.15em] text-ember uppercase">{item.time}</time>
                      <h3 className="mt-2 text-xl font-bold text-card-foreground">{item.title}</h3>
                      <p className="mt-3 leading-relaxed text-muted-foreground">{item.detail}</p>
                    </article>
                    <span className="timeline-node absolute left-0 top-5 z-10 grid size-10 place-items-center rounded-full border-4 border-muted bg-ember text-primary-foreground shadow-lg md:left-1/2 md:-translate-x-1/2">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-background p-5 sm:p-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center rounded-[3rem] bg-ink px-6 py-20 text-center sm:px-12 md:py-28">
          <p className="text-xs font-semibold tracking-[0.2em] text-ember-soft uppercase">2027 residency</p>
          <h2 className="mt-5 max-w-4xl font-serif text-5xl font-medium leading-tight text-primary-foreground md:text-7xl">Limited to 15 Practitioners.</h2>
          <p className="mt-5 max-w-2xl text-lg text-primary-foreground/70">Secure your space for the upcoming year.</p>
          <Button asChild size="lg" className="mt-9 h-12 rounded-full bg-ember px-7 text-primary-foreground hover:bg-ember/90">
            <a href="mailto:retreats@yogarambha.com?subject=Himalayan%20Immersion%20Consultation">Book Consultation Call <ArrowRight aria-hidden="true" /></a>
          </Button>
          <Link to="/" className="mt-8 text-sm font-medium text-primary-foreground/60 transition-colors hover:text-primary-foreground">Return to Yogarambha</Link>
        </div>
      </section>
    </main>
  );
}