import { useMemo, useState, type FormEvent } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CalendarCheck, CalendarPlus, Check, Clock, Loader2, Video } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createBooking, getBookedSlots } from "@/lib/mentorship.functions";
import {
  CALL_LENGTH_MINUTES,
  formatDayLabel,
  formatLocalTime,
  slotsForDay,
  upcomingDays,
} from "@/lib/mentorship";

type Confirmation = {
  startsAt: string;
  meetingUrl: string;
  ics: string;
};

export function MentorshipScheduler() {
  const days = useMemo(() => upcomingDays(12), []);
  const [dayIndex, setDayIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  const fetchBooked = useServerFn(getBookedSlots);
  const book = useServerFn(createBooking);

  const booked = useQuery({
    queryKey: ["mentorship-booked-slots"],
    queryFn: () => fetchBooked(),
    staleTime: 30_000,
  });

  const bookedSet = useMemo(() => new Set(booked.data ?? []), [booked.data]);
  const activeDay = days[dayIndex] ?? days[0]!;
  const slots = useMemo(() => slotsForDay(activeDay), [activeDay]);

  const mutation = useMutation({
    mutationFn: (payload: {
      fullName: string;
      email: string;
      phone: string;
      goals: string;
      startsAt: string;
      timezone: string;
    }) => book({ data: payload }),
    onSuccess: (result) => {
      setConfirmation({
        startsAt: result.startsAt,
        meetingUrl: result.meetingUrl,
        ics: result.ics,
      });
      toast.success("Your call with Veer is confirmed.");
      void booked.refetch();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected) {
      toast.error("Pick a time slot first.");
      return;
    }
    const form = new FormData(event.currentTarget);
    mutation.mutate({
      fullName: String(form.get("fullName") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      goals: String(form.get("goals") ?? ""),
      startsAt: selected,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata",
    });
  };

  const downloadIcs = () => {
    if (!confirmation) return;
    const blob = new Blob([confirmation.ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "yogarambha-mentorship-call.ics";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (confirmation) {
    return (
      <div className="rounded-[2rem] border border-border/60 bg-card p-8 text-center shadow-[0_30px_80px_-45px_oklch(0.28_0.03_260/0.6)] sm:p-12">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-ember/12 text-ember">
          <CalendarCheck className="size-7" aria-hidden="true" />
        </span>
        <h3 className="mt-6 font-display text-3xl font-semibold text-foreground">
          You're on Veer's calendar
        </h3>
        <p className="mt-3 text-muted-foreground">{formatLocalTime(confirmation.startsAt)}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {CALL_LENGTH_MINUTES} minutes · shown in your local time
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={downloadIcs} className="h-12 rounded-full bg-ember px-6 text-primary-foreground hover:bg-ember/90">
            <CalendarPlus aria-hidden="true" /> Add to calendar
          </Button>
          <Button asChild variant="outline" className="h-12 rounded-full px-6">
            <a href={confirmation.meetingUrl} target="_blank" rel="noreferrer">
              <Video aria-hidden="true" /> Open meeting room
            </a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 rounded-[2rem] border border-border/60 bg-card p-6 shadow-[0_30px_80px_-45px_oklch(0.28_0.03_260/0.6)] sm:p-10 lg:grid-cols-[1.05fr_1fr]">
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] text-ember uppercase">Step 1</p>
        <h3 className="mt-3 font-display text-2xl font-semibold text-foreground">
          Choose a discovery call
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          A {CALL_LENGTH_MINUTES}-minute conversation with Veer before you commit. Times are shown
          in Naggar ashram time (IST).
        </p>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {days.map((day, index) => (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => {
                setDayIndex(index);
                setSelected(null);
              }}
              className={`shrink-0 rounded-2xl border px-4 py-3 text-left text-sm transition-colors ${
                index === dayIndex
                  ? "border-ember bg-ember/10 text-foreground"
                  : "border-border/60 bg-background text-muted-foreground hover:border-ember/40"
              }`}
            >
              <span className="block font-semibold">{formatDayLabel(day)}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {slots.map((slot) => {
            const isTaken = bookedSet.has(slot.startsAt);
            const isActive = selected === slot.startsAt;
            return (
              <button
                key={slot.startsAt}
                type="button"
                disabled={isTaken}
                onClick={() => setSelected(slot.startsAt)}
                className={`flex items-center justify-center gap-2 rounded-full border px-4 py-3 text-sm font-medium transition-all ${
                  isTaken
                    ? "cursor-not-allowed border-border/50 bg-muted text-muted-foreground/60 line-through"
                    : isActive
                      ? "border-ember bg-ember text-primary-foreground"
                      : "border-border/60 bg-background text-foreground hover:border-ember/50"
                }`}
              >
                {isActive ? <Check className="size-4" aria-hidden="true" /> : <Clock className="size-4" aria-hidden="true" />}
                {slot.labelIst}
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-4 rounded-[1.6rem] bg-muted/60 p-6">
        <p className="text-xs font-semibold tracking-[0.2em] text-ember uppercase">Step 2</p>
        <div className="grid gap-2">
          <Label htmlFor="mentorship-name">Full name</Label>
          <Input id="mentorship-name" name="fullName" required placeholder="Your name" className="h-12 rounded-xl bg-background" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="mentorship-email">Email</Label>
          <Input id="mentorship-email" name="email" type="email" required placeholder="you@email.com" className="h-12 rounded-xl bg-background" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="mentorship-phone">Phone (optional)</Label>
          <Input id="mentorship-phone" name="phone" placeholder="+91" className="h-12 rounded-xl bg-background" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="mentorship-goals">What do you want to go beyond?</Label>
          <Textarea id="mentorship-goals" name="goals" rows={3} placeholder="Tell Veer where your practice is today." className="rounded-xl bg-background" />
        </div>
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="mt-2 h-12 rounded-full bg-ember text-primary-foreground hover:bg-ember/90"
        >
          {mutation.isPending ? <Loader2 className="animate-spin" aria-hidden="true" /> : <CalendarCheck aria-hidden="true" />}
          Confirm my call
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          You'll get the meeting link and a calendar invite instantly.
        </p>
      </form>
    </div>
  );
}
