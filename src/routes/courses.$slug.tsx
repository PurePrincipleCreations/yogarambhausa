import { createFileRoute } from "@tanstack/react-router";
import { CoursePlayerPage } from "@/components/CoursePlayerPage";

export const Route = createFileRoute("/courses/$slug")({
  ssr: false,
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replaceAll("-", " ")} Course — Yogarambha` },
      { name: "description", content: "Continue your premium Yogarambha video practice with a focused lesson player and guided course playlist." },
      { property: "og:title", content: "Course Player — Yogarambha" },
      { property: "og:description", content: "A focused learning environment for Yogarambha yoga and movement programs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CourseRoute,
});

function CourseRoute() {
  const { slug } = Route.useParams();
  return <CoursePlayerPage slug={slug} />;
}