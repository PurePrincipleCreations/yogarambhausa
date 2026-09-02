import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import gsap from "gsap";
import { Check, CheckCircle2, ChevronLeft, SkipBack, SkipForward } from "lucide-react";
import { courses } from "@/data/courses";
import { Button } from "@/components/ui/button";

export function CoursePlayerPage({ slug }: { slug: string }) {
  const root = useRef<HTMLElement>(null);
  const course = useMemo(() => courses.find((item) => item.slug === slug), [slug]);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(() => new Set());

  useLayoutEffect(() => {
    if (!root.current || !course) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      timeline
        .from(".player-stage", { scale: 0.95, opacity: 0, duration: 1 })
        .from(".player-playlist", { x: 100, opacity: 0, duration: 0.8 }, "-=0.65")
        .from(".playlist-item", { y: 20, opacity: 0, duration: 0.45, stagger: 0.05 }, "-=0.45");
    }, root);
    return () => media.revert();
  }, [course]);

  if (!course) {
    return (
      <main className="grid min-h-screen place-items-center bg-muted px-6 text-center">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-ember uppercase">Course unavailable</p>
          <h1 className="mt-4 text-4xl font-bold text-foreground">This practice could not be found.</h1>
          <Button asChild className="mt-8 rounded-full bg-ember text-primary-foreground hover:bg-ember/90">
            <Link to="/">Return to programs</Link>
          </Button>
        </div>
      </main>
    );
  }

  const activeVideo = course.videos[activeVideoIndex];
  if (!activeVideo) {
    return null;
  }
  const isComplete = completed.has(activeVideo.id);
  const isLastLesson = activeVideoIndex === course.videos.length - 1;

  const toggleComplete = () => {
    setCompleted((current) => {
      const next = new Set(current);
      if (next.has(activeVideo.id)) next.delete(activeVideo.id);
      else next.add(activeVideo.id);
      return next;
    });
  };

  return (
    <main ref={root} className="min-h-screen bg-muted pt-28 font-sans lg:h-screen lg:overflow-hidden">
      <div className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-[100rem] grid-cols-1 gap-8 px-5 pb-8 sm:px-8 lg:grid-cols-12">
        <section className="player-stage flex min-w-0 flex-col lg:col-span-8 xl:col-span-9">
          <Link
            to="/"
            className="mb-5 inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="size-4" aria-hidden="true" /> All programs
          </Link>

          <div className="aspect-video w-full overflow-hidden rounded-[2rem] bg-card shadow-2xl">
            <iframe
              key={activeVideo.id}
              src={`${activeVideo.videoUrl}?rel=0&modestbranding=1`}
              title={`${course.title}: ${activeVideo.title}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="size-full border-0"
            />
          </div>

          <div className="flex flex-col gap-6 py-7 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-[0.16em] text-ember uppercase">{course.title}</p>
              <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">{activeVideo.title}</h1>
              <p className="mt-2 text-sm text-muted-foreground">Lesson {activeVideoIndex + 1} · {activeVideo.duration}</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="icon"
                title="Previous lesson"
                aria-label="Previous lesson"
                disabled={activeVideoIndex === 0}
                onClick={() => setActiveVideoIndex((index) => Math.max(0, index - 1))}
                className="size-11 rounded-full"
              >
                <SkipBack aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={toggleComplete}
                className="h-11 rounded-full px-5"
              >
                {isComplete ? <Check aria-hidden="true" /> : <CheckCircle2 aria-hidden="true" />}
                {isComplete ? "Completed" : "Mark as Complete"}
              </Button>
              <Button
                type="button"
                disabled={isLastLesson}
                onClick={() => setActiveVideoIndex((index) => Math.min(course.videos.length - 1, index + 1))}
                className="h-11 rounded-full bg-ember px-5 text-primary-foreground hover:bg-ember/90"
              >
                {isLastLesson ? "Course Complete" : "Next Lesson"} <SkipForward aria-hidden="true" />
              </Button>
            </div>
          </div>
        </section>

        <aside className="player-playlist min-h-[34rem] overflow-hidden rounded-3xl border border-border/70 bg-card/80 p-4 shadow-lg backdrop-blur-xl sm:p-6 lg:col-span-4 lg:h-full xl:col-span-3">
          <div className="flex h-full flex-col">
            <header className="shrink-0 border-b border-border/70 bg-card/80 pb-5 backdrop-blur-xl">
              <p className="text-xs font-semibold tracking-[0.16em] text-ember uppercase">Your practice</p>
              <div className="mt-2 flex items-end justify-between gap-4">
                <h2 className="text-2xl font-bold text-card-foreground">Course Modules</h2>
                <span className="text-xs font-medium text-muted-foreground">{completed.size}/{course.videos.length}</span>
              </div>
              <progress
                aria-label={`${completed.size} of ${course.videos.length} lessons completed`}
                value={completed.size}
                max={course.videos.length}
                className="course-progress mt-4 h-1.5 w-full overflow-hidden rounded-full"
              />
            </header>

            <ol className="hide-scrollbar mt-4 flex-1 space-y-2 overflow-y-auto pr-1">
              {course.videos.map((video, index) => {
                const active = index === activeVideoIndex;
                const done = completed.has(video.id);
                return (
                  <li key={video.id} className="playlist-item">
                    <button
                      type="button"
                      onClick={() => setActiveVideoIndex(index)}
                      aria-current={active ? "true" : undefined}
                      className={`group flex w-full items-center gap-3 rounded-2xl p-3.5 text-left transition-all duration-300 hover:scale-[1.02] ${active ? "bg-ember/10 text-ember" : "bg-transparent text-foreground hover:bg-muted"}`}
                    >
                      <span className={`grid size-9 shrink-0 place-items-center rounded-full text-xs font-semibold ${active ? "bg-ember text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        {done ? <Check className="size-4" aria-hidden="true" /> : String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={`block truncate text-sm ${active ? "font-bold" : "font-medium"}`}>{video.title}</span>
                        <span className="mt-1 block text-xs text-muted-foreground">{video.duration}</span>
                      </span>
                      {active && (
                        <span className="equalizer flex h-4 items-end gap-0.5" aria-label="Now playing">
                          <i /><i /><i />
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </aside>
      </div>
    </main>
  );
}