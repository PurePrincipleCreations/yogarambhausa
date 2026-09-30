import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { courses } from "@/data/courses";

type Ctx = { supabase: any; userId: string };

async function assertRole(ctx: Ctx, roles: Array<"manager" | "admin">) {
  const { data } = await ctx.supabase.from("user_roles").select("role").eq("user_id", ctx.userId);
  const mine = (data ?? []).map((r: { role: string }) => r.role);
  if (!roles.some((r) => mine.includes(r))) throw new Error("Forbidden");
  return mine as string[];
}

export const getMyRoles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);
    return (data ?? []).map((r) => r.role);
  });

export const listStudents = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertRole(context, ["manager", "admin"]);
    const sb = context.supabase;
    const [{ data: profiles }, { data: roles }, { data: enrollments }, { data: progress }] = await Promise.all([
      sb.from("profiles").select("id, full_name, email, created_at").order("created_at", { ascending: false }),
      sb.from("user_roles").select("user_id, role"),
      sb.from("enrollments").select("user_id, course_slug"),
      sb.from("video_progress").select("user_id, lesson_id, is_completed").eq("is_completed", true),
    ]);
    const staff = new Set((roles ?? []).filter((r) => r.role !== "student").map((r) => r.user_id));
    return (profiles ?? [])
      .filter((p) => !staff.has(p.id))
      .map((p) => {
        const slugs = (enrollments ?? []).filter((e) => e.user_id === p.id).map((e) => e.course_slug);
        const lessonIds = new Set(
          courses.filter((c) => slugs.includes(c.slug)).flatMap((c) => c.videos.map((v) => v.id)),
        );
        const done = (progress ?? []).filter((v) => v.user_id === p.id && lessonIds.has(v.lesson_id)).length;
        return {
          id: p.id,
          name: p.full_name ?? "—",
          email: p.email ?? "—",
          slugs,
          progress: lessonIds.size ? Math.round((done / lessonIds.size) * 100) : 0,
        };
      });
  });

export const setAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({ userId: z.string().uuid(), slug: z.string().min(1).max(100), grant: z.boolean() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertRole(context, ["manager", "admin"]);
    if (!courses.some((c) => c.slug === data.slug)) throw new Error("Unknown program");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.grant) {
      const { error } = await supabaseAdmin
        .from("enrollments")
        .upsert({ user_id: data.userId, course_slug: data.slug, source: "manual" }, { onConflict: "user_id,course_slug" });
      if (error) throw error;
    } else {
      const { error } = await supabaseAdmin
        .from("enrollments")
        .delete()
        .eq("user_id", data.userId)
        .eq("course_slug", data.slug);
      if (error) throw error;
    }
    return { ok: true };
  });

export const getAdminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertRole(context, ["admin"]);
    if (!process.env["STRIPE_SECRET_KEY"]) return { connected: false, revenue: 0, sales: 0 };
    const { getStripe } = await import("./stripe.server");
    const stripe = getStripe();
    let revenue = 0;
    let sales = 0;
    for await (const s of stripe.checkout.sessions.list({ limit: 100, status: "complete" })) {
      if (s.payment_status === "paid") {
        revenue += (s.amount_total ?? 0) / 100;
        sales += 1;
      }
      if (sales >= 1000) break;
    }
    return { connected: true, revenue, sales };
  });

export const inviteManager = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({ email: z.string().trim().email().max(255), name: z.string().trim().min(1).max(100) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertRole(context, ["admin"]);
    const { ensureAccount } = await import("./stripe.server");
    const origin = new URL(getRequest().url).origin;
    const account = await ensureAccount(data.email.toLowerCase(), data.name, origin);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: account.userId, role: "manager" }, { onConflict: "user_id,role" });
    return { isNew: account.isNew, setPasswordLink: account.setPasswordLink };
  });
