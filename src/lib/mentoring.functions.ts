import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const SESSION_TYPES = {
  assessment: { label: "Movement Assessment", minutes: 45 },
  checkin: { label: "Weekly Check-in", minutes: 30 },
} as const;

export const bookStudentSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        sessionType: z.enum(["assessment", "checkin"]),
        startsAt: z.string().datetime(),
        timezone: z.string().max(80).default("Asia/Kolkata"),
        notes: z.string().trim().max(1200).optional().default(""),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const start = new Date(data.startsAt);
    if (start.getTime() < Date.now()) throw new Error("Please choose an upcoming time.");
    const istDay = new Date(start.getTime() + 330 * 60_000).getUTCDay();
    if (istDay === 0) throw new Error("Veer does not take sessions on Sundays.");
    const minutes = SESSION_TYPES[data.sessionType].minutes;
    const end = new Date(start.getTime() + minutes * 60_000);

    const { data: profile } = await context.supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", context.userId)
      .maybeSingle();

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const meetingUrl = `https://meet.jit.si/yogarambha-veer-${start.getTime().toString(36)}`;
    const { data: row, error } = await supabaseAdmin
      .from("mentorship_bookings")
      .insert({
        user_id: context.userId,
        session_type: data.sessionType,
        full_name: profile?.full_name ?? "Student",
        email: profile?.email ?? "",
        goals: data.notes || null,
        timezone: data.timezone,
        starts_at: start.toISOString(),
        ends_at: end.toISOString(),
        meeting_url: meetingUrl,
      })
      .select("id, starts_at, ends_at, meeting_url")
      .single();
    if (error) {
      if (error.code === "23505") throw new Error("That time was just taken. Please pick another.");
      throw new Error(error.message);
    }
    return row;
  });

export const getMySessions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("mentorship_bookings")
      .select("id, session_type, starts_at, meeting_url")
      .eq("user_id", context.userId)
      .gte("starts_at", new Date().toISOString())
      .order("starts_at");
    return data ?? [];
  });
