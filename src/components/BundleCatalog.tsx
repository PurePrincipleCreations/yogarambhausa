import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, LockKeyhole } from "lucide-react";
import { courses, type Course } from "@/data/courses";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

gsap.registerPlugin(ScrollTrigger);

const filters = ["All", "Yoga", "Movement Mechanics", "Flow"];

function CourseCard({ course }: { course: Course }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const openAuthModal = useAuthStore((state) => state.openAuthModal);

  return (
    <article className="course-card group flex min-h-[31rem] flex-col overflow-hidden rounded-3xl border border-border/60 bg-card shadow-[0_24px_65px_-35px_oklch(0.28_0.03_260/0.42)] transition-[box-shadow,transform] duration-500 hover:-translate-y-1 hover:shadow-[0_32px_80px_-34px_oklch(0.28_0.03_260/0.52)]">
      <div className="relative aspect-[3/2] overflow-hidden">
        <img
          src={course.thumbnail}
          alt={`${course.title} course`}
          loading="lazy"
          width={1200}
          height={800}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/45 via-transparent to-transparent" />
        <span className="absolute left-5 top-5 rounded-full bg-background/75 px-3.5 py-2 text-[0.68rem] font-semibold tracking-[0.12em] text-foreground uppercase shadow-sm backdrop-blur-md">
          {course.category}
        </span>
        {!isAuthenticated && (
          <span className="absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-full border border-background/50 bg-background/70 px-4 py-2 text-xs font-semibold text-foreground shadow-lg backdrop-blur-md">
            <LockKeyhole className="size-3.5" aria-hidden="true" /> Premium
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-2xl font-semibold text-card-foreground">{course.title}</h3>
        <p className="mt-3 line-clamp-2 leading-relaxed text-muted-foreground">
          {course.description}
        </p>
        <div className="mt-auto flex items-end justify-between gap-4 pt-7">
          {isAuthenticated ? (
            <span>
              <span className="block text-[0.65rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                Full program
              </span>
              <span className="mt-1 block text-2xl font-semibold text-foreground">${course.price}</span>
            </span>
          ) : (
            <span className="max-w-[8rem] text-xs leading-relaxed text-muted-foreground">
              Sign in to view pricing
            </span>
          )}
          {isAuthenticated ? (
            <Button asChild variant="outline" className="h-11 rounded-full px-5">
              <Link to="/courses/$slug" params={{ slug: course.slug }}>
                View Curriculum <ArrowUpRight aria-hidden="true" />
              </Link>
            </Button>
          ) : (
            <Button type="button" onClick={openAuthModal} className="h-11 rounded-full bg-ember px-5 text-primary-foreground transition-all duration-300 hover:bg-ember/90">
              <LockKeyhole aria-hidden="true" /> Sign in to Unlock
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

export function BundleCatalog() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 72%", once: true },
      });

      timeline
        .from(".catalog-filter", {
          scale: 0.8,
          opacity: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: "back.out(1.8)",
        })
        .from(
          ".course-card",
          { y: 40, opacity: 0, duration: 0.8, stagger: 0.11, ease: "power3.out" },
          "-=0.15",
        );
    }, root);

    return () => context.revert();
  }, []);

  return (
    <section id="programs" ref={root} className="w-full bg-muted/65 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-ember uppercase">Practice Library</p>
          <h2 className="mt-4 text-4xl font-bold text-foreground md:text-6xl">EXPLORE OUR PROGRAMS</h2>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2.5" aria-label="Program filters">
          {filters.map((filter, index) => (
            <Button
              key={filter}
              type="button"
              variant={index === 0 ? "default" : "secondary"}
              className={index === 0 ? "catalog-filter rounded-full bg-foreground px-5 text-background hover:bg-foreground/90" : "catalog-filter rounded-full bg-card px-5 text-foreground shadow-sm hover:bg-accent"}
            >
              {filter}
            </Button>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => <CourseCard key={course.id} course={course} />)}
        </div>
      </div>
    </section>
  );
}