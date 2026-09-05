export const MENTORSHIP_PRICE = 200;
export const MENTORSHIP_DURATION_MONTHS = 12;
export const CALL_LENGTH_MINUTES = 30;

/** Discovery-call slots offered every weekday, in IST (UTC+5:30). */
export const SLOT_TIMES_IST = ["07:00", "08:00", "17:00", "18:00", "19:00"] as const;

const IST_OFFSET_MINUTES = 330;

export type Slot = {
  /** ISO start time in UTC */
  startsAt: string;
  /** Label in IST, e.g. "7:00 AM" */
  labelIst: string;
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function formatDayKey(date: Date) {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

/** Next `count` weekdays (starting tomorrow) as UTC-midnight anchored dates. */
export function upcomingDays(count = 14, from = new Date()): Date[] {
  const days: Date[] = [];
  const cursor = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()));
  while (days.length < count) {
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    const weekday = cursor.getUTCDay();
    if (weekday !== 0) days.push(new Date(cursor));
  }
  return days;
}

export function slotsForDay(day: Date): Slot[] {
  return SLOT_TIMES_IST.map((time) => {
    const [hourPart, minutePart] = time.split(":");
    const hour = Number(hourPart);
    const minute = Number(minutePart);
    const utcMinutes = hour * 60 + minute - IST_OFFSET_MINUTES;
    const startsAt = new Date(
      Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), 0, utcMinutes),
    );
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return {
      startsAt: startsAt.toISOString(),
      labelIst: `${displayHour}:${pad(minute)} ${hour < 12 ? "AM" : "PM"}`,
    };
  });
}

export function formatDayLabel(day: Date) {
  return day.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function formatLocalTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function buildIcs(input: {
  uid: string;
  startsAt: string;
  endsAt: string;
  name: string;
  meetingUrl: string;
}) {
  const stamp = (iso: string) => iso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Yogarambha//Mentorship//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${input.uid}`,
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(input.startsAt)}`,
    `DTEND:${stamp(input.endsAt)}`,
    "SUMMARY:Yogarambha Mentorship — Discovery Call with Veer",
    `DESCRIPTION:A 30-minute call with Veer to map your 12-month mentorship. Join here: ${input.meetingUrl}`,
    `LOCATION:${input.meetingUrl}`,
    `ORGANIZER;CN=Veer — Yogarambha:mailto:mentorship@yogarambha.com`,
    `ATTENDEE;CN=${input.name};RSVP=TRUE:mailto:noreply@yogarambha.com`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
