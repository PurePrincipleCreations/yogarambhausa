import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { GatheringPromoCard } from "@/components/GatheringPromoCard";
import { supabase } from "@/integrations/supabase/client";
import { courses } from "@/data/courses";
import { useAuthStore, isStaff } from "@/stores/useAuthStore";
import { formatStamp } from "@/components/player/VideoStage";

export const Route = createFileRoute("/_authenticated/my-courses")({
  head: () => ({
    meta: [
      { title: "My Courses — Yogarambha Academy" },
      { name: "description", content: "Your practice at a glance: bundle progress, where you left off, and your programs." },
      { property: "og:title", content: "My Courses — Yogarambha Academy" },
      { property: "og:description", content: "Your practice at a glance: bundle progress, where you left off, and your programs." },
    ],
  }),
  component: MyCourses,
});

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

function Ring({ pct }: { pct: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative size-36 shrink-0">
      <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden="true">
        <circle cx="60" cy="60" r={r} fill="none" strokeWidth="9" className="stroke-muted" />
        <circle cx="60" cy="60" r={r} fill="none" strokeWidth="9" strokeLinecap="round" strokeDasharray={c}
          strokeDashoffset={c * (1 - pct / 100)} className="stroke-ember transition-[stroke-dashoffset] duration-1000" />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="text-3xl font-bold text-foreground">{pct}%</p>
          <p className="text-[0.62rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">Complete</p>
        </div>
      </div>
    </div>
  );
}

function MyCourses() {
  const user = useAuthStore((s) => s.user);
  const roles = useAuthStore((s) => s.roles);
  const enrolled = useAuthStore((s) => s.enrolledSlugs);
  const [hello, setHello] = useState("Welcome");
  useEffect(() => setHello(greeting()), []);

  const mine = isStaff(roles) ? courses : courses.filter((c) => enrolled.includes(c.slug));
  const { data: rows = [] } = useQuery({
    queryKey: ["all-progress", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("video_progress")
        .select("lesson_id, watched_seconds, total_seconds, is_completed, updated_at")
        .order("updated_at", { ascending: false });
      return data ?? [];
    },
  });

  const done = new Set(rows.filter((r) => r.is_completed).map((r) => r.lesson_id));
  const totalLessons = mine.reduce((n, c) => n + c.videos.length, 0);
  const doneInMine = mine.reduce((n, c) => n + c.videos.filter((v) => done.has(v.id)).length, 0);
  const pct = totalLessons ? Math.round((doneInMine / totalLessons) * 100) : 0;

  const resumeRow = rows.find((r) => !r.is_completed && r.watched_seconds > 0);
  const resume = resumeRow
    ? courses.flatMap((c) => c.videos.map((v) => ({ course: c, video: v }))).find((x) => x.video.id === resumeRow.lesson_id)
    : undefined;
  const firstName = (user?.name ?? "").split(" ")[0] || "friend";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted px-5 pt-32 pb-20 sm:px-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <section className="flex flex-col gap-8 rounded-[2rem] bg-card p-8 shadow-lg sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-ember uppercase">Your practice</p>
              <h1 className="mt-3 text-4xl font-bold text-foreground sm:text-5xl">{hello}, {firstName}</h1>
              <p className="mt-3 text-muted-foreground">
                {totalLessons ? `${doneInMine} of ${totalLessons} lessons completed across your bundles.` : "You don't have any bundles yet."}
              </p>
            </div>
            <Ring pct={pct} />
          </section>

          {resume && resumeRow && (
            <Link
              to="/courses/$slug"
              params={{ slug: resume.course.slug }}
              search={{ lesson: resume.video.id }}
              className="group flex items-center gap-6 overflow-hidden rounded-[2rem] bg-ink p-6 text-background shadow-2xl transition-transform hover:scale-[1.01] sm:p-8"
            >
              <span className="grid size-16 shrink-0 place-items-center rounded-full bg-ember text-primary-foreground transition-transform group-hover:scale-110">
                <Play className="ml-1 size-7 fill-current" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold tracking-[0.18em] text-ember uppercase">Continue learning · {resume.course.title}</p>
                <p className="mt-2 truncate text-2xl font-bold">Resume: {resume.video.title}</p>
                <p className="mt-1 text-sm text-background/70">
                  Pick up at {formatStamp(resumeRow.watched_seconds)}
                  {resumeRow.total_seconds > 0 && ` of ${formatStamp(resumeRow.total_seconds)}`}
                </p>
              </div>
            </Link>
          )}

          <section>
            <h2 className="text-2xl font-bold text-foreground">Your bundles</h2>
            {mine.length === 0 ? (
              <div className="mt-4 rounded-3xl bg-card p-8 text-center text-muted-foreground">
                Nothing here yet. <Link to="/" hash="programs" className="font-semibold text-ember hover:underline">Browse programs</Link>
              </div>
            ) : (
              <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {mine.map((c) => {
                  const n = c.videos.filter((v) => done.has(v.id)).length;
                  return (
                    <Link key={c.id} to="/courses/$slug" params={{ slug: c.slug }} className="group overflow-hidden rounded-3xl bg-card shadow-lg transition-transform hover:-translate-y-1">
                      <img src={c.thumbnail} alt="" className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="p-5">
                        <p className="text-lg font-semibold text-card-foreground">{c.title}</p>
                        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full bg-ember" style={{ width: `${(n / c.videos.length) * 100}%` }} />
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">{n}/{c.videos.length} lessons watched</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          <GatheringPromoCard className="sm:p-10" />
        </div>
      </main>
    </>
  );
}
