import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CalendarDays, Clock3, LockKeyhole, MapPin, Radio, Video } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

const sessions = [
  { id: "flow-assessment", startsAt: "2026-09-12T02:30:00Z", title: "Primal Flow Live Assessment", instructor: "Veer", streamUrl: "https://www.youtube.com/live" },
  { id: "anatomy-qa", startsAt: "2026-09-16T14:00:00Z", title: "Anatomy Q&A", instructor: "Claire", streamUrl: "https://zoom.us" },
  { id: "guided-meditation", startsAt: "2026-09-21T01:30:00Z", title: "Live Guided Meditation", instructor: "Karam", streamUrl: "https://www.youtube.com/live" },
];

function formatSession(date: Date, useAshramTime: boolean) {
  const timeZone = useAshramTime ? "Asia/Kolkata" : undefined;
  return {
    month: new Intl.DateTimeFormat("en-US", { month: "short", timeZone }).format(date),
    day: new Intl.DateTimeFormat("en-US", { day: "2-digit", timeZone }).format(date),
    weekday: new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone }).format(date),
    time: new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone, timeZoneName: "short" }).format(date),
  };
}

export function LiveTTCPage() {
  const root = useRef<HTMLElement>(null);
  const [useAshramTime, setUseAshramTime] = useState(false);
  const [naggarTime, setNaggarTime] = useState("");
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const openAuthModal = useAuthStore((state) => state.openAuthModal);

  useEffect(() => {
    const update = () => setNaggarTime(new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit", second: "2-digit" }).format(new Date()));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useLayoutEffect(() => {
    if (!root.current) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".live-session-card", { y: 30, opacity: 0, duration: 0.75, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: ".live-schedule", start: "top 75%", once: true } });
    }, root);
    return () => media.revert();
  }, []);

  return (
    <main ref={root} className="min-h-screen overflow-x-hidden bg-muted font-sans">
      <Navbar />
      <section className="bg-muted px-6 pb-20 pt-40 sm:pt-44">
        <div className="mx-auto grid max-w-6xl items-end gap-12 lg:grid-cols-[1fr_auto]">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.22em] text-ember uppercase">Kasratshala Broadcasts</p>
            <h1 className="mt-5 text-5xl font-bold leading-[0.95] text-foreground sm:text-7xl lg:text-8xl">LIVE FROM THE HIMALAYAS</h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">Join our live Teacher Training Courses and interactive sessions broadcasted directly from Naggar, India. Real-time guidance, wherever you are.</p>
          </div>
          <div className="w-full rounded-[2rem] border border-background/70 bg-background/65 p-6 shadow-xl backdrop-blur-xl sm:w-80">
            <div className="flex items-center gap-3 text-sm font-semibold text-foreground"><span className="relative flex size-3"><span className="absolute inline-flex size-full animate-ping rounded-full bg-destructive opacity-60" /><span className="relative inline-flex size-3 rounded-full bg-destructive" /></span>ON AIR · NAGGAR</div>
            <div className="mt-7 flex items-end justify-between gap-5"><div><p className="text-xs text-muted-foreground">Ashram local time</p><p className="mt-1 font-mono text-3xl font-semibold text-foreground">{naggarTime || "--:--:--"}</p></div><Radio className="size-7 text-ember" aria-hidden="true" /></div>
          </div>
        </div>
      </section>

      <section className="live-schedule bg-background px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-xs font-semibold tracking-[0.18em] text-ember uppercase">Upcoming broadcasts</p><h2 className="mt-3 text-4xl font-bold text-foreground sm:text-5xl">Practice together, live.</h2></div>
            <div className="inline-flex w-fit rounded-full bg-muted p-1" aria-label="Schedule timezone">
              <Button type="button" variant="ghost" onClick={() => setUseAshramTime(false)} className={`rounded-full px-4 transition-all duration-300 ${!useAshramTime ? "bg-background text-foreground shadow-sm hover:bg-background" : "text-muted-foreground"}`}>Your Local Time</Button>
              <Button type="button" variant="ghost" onClick={() => setUseAshramTime(true)} className={`rounded-full px-4 transition-all duration-300 ${useAshramTime ? "bg-background text-foreground shadow-sm hover:bg-background" : "text-muted-foreground"}`}>Ashram Time (IST)</Button>
            </div>
          </div>

          <div className="mt-12 space-y-4">
            {sessions.map((session) => {
              const formatted = formatSession(new Date(session.startsAt), useAshramTime);
              return (
                <article key={session.id} className="live-session-card grid gap-6 rounded-3xl border border-border/60 bg-card p-6 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:grid-cols-[7rem_1fr_auto] sm:items-center">
                  <div className="flex items-center gap-4 border-b border-border pb-5 sm:block sm:border-b-0 sm:border-r sm:pb-0">
                    <div className="text-center"><p className="text-xs font-semibold tracking-[0.16em] text-ember uppercase">{formatted.month}</p><p className="text-4xl font-bold text-foreground">{formatted.day}</p></div>
                    <p className="text-xs text-muted-foreground sm:mt-2 sm:text-center">{formatted.weekday}</p>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1.5"><Clock3 className="size-3.5" aria-hidden="true" />{formatted.time}</span><span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5" aria-hidden="true" />Kasratshala, Naggar</span></div>
                    <h3 className="mt-3 text-xl font-semibold text-card-foreground sm:text-2xl">{session.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Led by {session.instructor}</p>
                  </div>
                  {isAuthenticated ? (
                    <Button asChild className="h-11 rounded-full bg-ember px-5 text-primary-foreground transition-all duration-300 hover:bg-ember/90"><a href={session.streamUrl} target="_blank" rel="noreferrer"><Video aria-hidden="true" />Join Live Stream</a></Button>
                  ) : (
                    <Button type="button" variant="secondary" onClick={openAuthModal} className="h-11 rounded-full px-5 text-secondary-foreground transition-all duration-300"><LockKeyhole aria-hidden="true" />Sign in to Join</Button>
                  )}
                </article>
              );
            })}
          </div>
          <div className="mt-10 flex items-center gap-2 text-sm text-muted-foreground"><CalendarDays className="size-4 text-ember" aria-hidden="true" />Schedule updates are shown automatically in your selected timezone.</div>
        </div>
      </section>
    </main>
  );
}