import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { CALL_LENGTH_MINUTES, buildIcs } from "./mentorship";

export const getBookedSlots = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const from = new Date().toISOString();
  const { data, error } = await supabaseAdmin
    .from("mentorship_bookings")
    .select("starts_at")
    .eq("status", "confirmed")
    .gte("starts_at", from);

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => new Date(row.starts_at).toISOString());
});

const bookingSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().default(""),
  goals: z.string().trim().max(1200).optional().default(""),
  startsAt: z.string().datetime(),
  timezone: z.string().max(80).optional().default("Asia/Kolkata"),
});

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => bookingSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const start = new Date(data.startsAt);
    if (Number.isNaN(start.getTime()) || start.getTime() < Date.now()) {
      throw new Error("Please choose an upcoming time slot.");
    }
    const end = new Date(start.getTime() + CALL_LENGTH_MINUTES * 60_000);
    const meetingUrl = `https://meet.jit.si/yogarambha-mentorship-${start.getTime().toString(36)}`;

    const { data: inserted, error } = await supabaseAdmin
      .from("mentorship_bookings")
      .insert({
        full_name: data.fullName,
        email: data.email,
        phone: data.phone || null,
        goals: data.goals || null,
        timezone: data.timezone,
        starts_at: start.toISOString(),
        ends_at: end.toISOString(),
        meeting_url: meetingUrl,
      })
      .select("id, starts_at, ends_at, meeting_url")
      .single();

    if (error) {
      if (error.code === "23505") {
        throw new Error("That time was just taken. Please pick another slot.");
      }
      throw new Error(error.message);
    }

    const ics = buildIcs({
      uid: `${inserted.id}@yogarambha`,
      startsAt: inserted.starts_at,
      endsAt: inserted.ends_at,
      name: data.fullName,
      meetingUrl,
    });

    return {
      id: inserted.id,
      startsAt: inserted.starts_at,
      endsAt: inserted.ends_at,
      meetingUrl,
      ics,
    };
  });
