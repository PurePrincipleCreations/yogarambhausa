import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CalendarCheck, ChevronLeft, ChevronRight, Video } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import veerPortrait from "@/assets/facilitator-veer.jpg";
import { formatDayKey, formatLocalTime, slotsForDay } from "@/lib/mentorship";
import { getBookedSlots } from "@/lib/mentorship.functions";
import { SESSION_TYPES, bookStudentSession, getMySessions } from "@/lib/mentoring.functions";

export const Route = createFileRoute("/_authenticated/mentoring")({
  head: () => ({
    meta: [
      { title: "1-on-1 Mentoring with Veer — Yogarambha Academy" },
      { name: "description", content: "Book your movement assessment and weekly check-ins with Veer." },
      { property: "og:title", content: "1-on-1 Mentoring with Veer — Yogarambha Academy" },
      { property: "og:description", content: "Book your movement assessment and weekly check-ins with Veer." },
    ],
  }),
  component: MentoringPage,
});

const STEPS = [
  { n: "01", title: "Movement Assessment", meta: "45 min", body: "Veer watches how you move, breathe and hinge, and finds what's holding you back." },
  { n: "02", title: "Custom Programme", meta: "Built for you", body: "A practice plan shaped around your body, schedule and goals — not a template." },
  { n: "03", title: "Weekly Check-in", meta: "30 min", body: "Short, focused calls to refine form, adjust the plan and keep you accountable." },
];

type SessionType = keyof typeof SESSION_TYPES;
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function MentoringPage() {
  const qc = useQueryClient();
  const bookedFn = useServerFn(getBookedSlots);
  const mineFn = useServerFn(getMySessions);
  const bookFn = useServerFn(bookStudentSession);
  const { data: booked = [] } = useQuery({ queryKey: ["booked-slots"], queryFn: () => bookedFn() });
  const { data: mine = [] } = useQuery({ queryKey: ["my-sessions"], queryFn: () => mineFn() });

  const [type, setType] = useState<SessionType>("assessment");
  const [monthOffset, setMonthOffset] = useState(0);
  const [day, setDay] = useState<Date | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmed, setConfirmed] = useState<{ starts_at: string; meeting_url: string | null } | null>(null);

  const today = useMemo(() => {
    const n = new Date();
    return new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate()));
  }, []);
  const monthStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + monthOffset, 1));
  const daysInMonth = new Date(Date.UTC(monthStart.getUTCFullYear(), monthStart.getUTCMonth() + 1, 0)).getUTCDate();
  const leading = (monthStart.getUTCDay() + 6) % 7; // Monday-first grid
  const maxDate = new Date(today.getTime() + 60 * 86_400_000);

  const bookedSet = new Set(booked);
  const slots = day ? slotsForDay(day).filter((s) => new Date(s.startsAt).getTime() > Date.now() + 3_600_000) : [];

  const book = async () => {
    if (!slot) return;
    setBusy(true);
    try {
      const row = await bookFn({
        data: { sessionType: type, startsAt: slot, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, notes },
      });
      setConfirmed(row);
      void qc.invalidateQueries({ queryKey: ["booked-slots"] });
      void qc.invalidateQueries({ queryKey: ["my-sessions"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not book this time");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted px-5 pt-32 pb-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <section className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-ember uppercase">Exclusive · Veer only</p>
              <h1 className="mt-3 text-4xl font-bold text-foreground sm:text-6xl">1-on-1 Mentoring</h1>
              <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
                Private sessions with Veer — the most direct path to moving better, with a teacher who knows your body.
              </p>
            </div>
            <img src={veerPortrait} alt="Veer" className="hidden size-40 rounded-[2rem] object-cover shadow-2xl lg:block" />
          </section>

          <section className="mt-12 grid gap-4 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-3xl bg-card p-7 shadow-lg">
                <span className="text-4xl font-bold text-ember/80">{s.n}</span>
                <h2 className="mt-4 text-xl font-semibold text-card-foreground">{s.title}</h2>
                <p className="mt-1 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">{s.meta}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </section>

          {mine.length > 0 && !confirmed && (
            <section className="mt-10 rounded-3xl bg-card p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-card-foreground">Your upcoming sessions</h2>
              <ul className="mt-3 space-y-2">
                {mine.map((m) => (
                  <li key={m.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-muted p-3.5 text-sm">
                    <span><strong className="text-foreground">{SESSION_TYPES[m.session_type as SessionType]?.label ?? "Call"}</strong> · {formatLocalTime(m.starts_at)}</span>
                    {m.meeting_url && <a href={m.meeting_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-medium text-ember hover:underline"><Video className="size-4" /> Join link</a>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-10 rounded-[2rem] bg-card p-6 shadow-2xl sm:p-10">
            {confirmed ? (
              <div className="mx-auto max-w-xl py-8 text-center">
                <span className="mx-auto grid size-16 place-items-center rounded-full bg-ember text-primary-foreground"><CalendarCheck className="size-7" /></span>
                <h2 className="mt-6 text-3xl font-bold text-foreground">Your session with Veer is confirmed.</h2>
                <p className="mt-3 text-muted-foreground">{formatLocalTime(confirmed.starts_at)}</p>
                <p className="mt-6 rounded-2xl border border-ember/30 bg-ember/5 p-4 text-sm font-medium text-foreground">
                  Please film a side-profile of your hinge prior to the call.
                </p>
                {confirmed.meeting_url && (
                  <Button asChild className="mt-6 rounded-full bg-ember text-primary-foreground hover:bg-ember/90">
                    <a href={confirmed.meeting_url} target="_blank" rel="noopener noreferrer"><Video /> Save your call link</a>
                  </Button>
                )}
                <div>
                  <Button variant="link" className="mt-3 text-muted-foreground" onClick={() => { setConfirmed(null); setSlot(null); setDay(null); setNotes(""); }}>
                    Book another session
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
                <div>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(SESSION_TYPES) as SessionType[]).map((t) => (
                      <button key={t} type="button" onClick={() => setType(t)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${type === t ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                        {SESSION_TYPES[t].label} · {SESSION_TYPES[t].minutes} min
                      </button>
                    ))}
                  </div>

                  <div className="mt-8 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-card-foreground">
                      {monthStart.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" })}
                    </h2>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" aria-label="Previous month" disabled={monthOffset === 0} onClick={() => setMonthOffset((m) => m - 1)} className="rounded-full"><ChevronLeft /></Button>
                      <Button variant="ghost" size="icon" aria-label="Next month" disabled={monthOffset >= 2} onClick={() => setMonthOffset((m) => m + 1)} className="rounded-full"><ChevronRight /></Button>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-7 gap-1.5 text-center">
                    {WEEKDAYS.map((w) => <span key={w} className="pb-2 text-[0.68rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">{w}</span>)}
                    {Array.from({ length: leading }).map((_, i) => <span key={`b${i}`} />)}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const d = new Date(Date.UTC(monthStart.getUTCFullYear(), monthStart.getUTCMonth(), i + 1));
                      const disabled = d.getUTCDay() === 0 || d <= today || d > maxDate;
                      const selected = day && formatDayKey(day) === formatDayKey(d);
                      return (
                        <button key={i} type="button" disabled={disabled} onClick={() => { setDay(d); setSlot(null); }}
                          className={`aspect-square rounded-2xl text-sm font-medium transition-all ${selected ? "bg-ember text-primary-foreground shadow-lg" : disabled ? "cursor-not-allowed text-muted-foreground/40" : "bg-muted text-foreground hover:bg-ember/15"}`}>
                          {i + 1}
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">Sundays are Veer's rest day.</p>
                </div>

                <div className="flex flex-col">
                  <h2 className="text-xl font-semibold text-card-foreground">
                    {day ? day.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" }) : "Choose a date"}
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">Times shown in your local time.</p>
                  <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {day && slots.length === 0 && <p className="col-span-full text-sm text-muted-foreground">No times left on this day.</p>}
                    {slots.map((s) => {
                      const taken = bookedSet.has(new Date(s.startsAt).toISOString());
                      const label = new Date(s.startsAt).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
                      return (
                        <button key={s.startsAt} type="button" disabled={taken} onClick={() => setSlot(s.startsAt)}
                          className={`rounded-xl border px-3 py-3 text-sm font-medium transition-all ${slot === s.startsAt ? "border-ember bg-ember text-primary-foreground" : taken ? "cursor-not-allowed border-border/50 text-muted-foreground/40 line-through" : "border-border text-foreground hover:border-ember"}`}>
                          {label}
                        </button>
                      );
                    })}
                  </div>
                  {slot && (
                    <div className="mt-6 space-y-3">
                      <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={1200} rows={3}
                        placeholder="Anything Veer should know before the call? (optional)" className="rounded-2xl bg-muted/60" />
                      <Button onClick={() => void book()} disabled={busy} className="h-12 w-full rounded-full bg-ember text-primary-foreground hover:bg-ember/90">
                        {busy ? "Booking…" : `Confirm ${SESSION_TYPES[type].label}`}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
