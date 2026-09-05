import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Method } from "@/components/Method";
import { Qualifications } from "@/components/Qualifications";
import { Syllabus } from "@/components/Syllabus";
import { Facilitators } from "@/components/Facilitators";
import { BundleCatalog } from "@/components/BundleCatalog";
import { MentorshipTeaser } from "@/components/MentorshipTeaser";


export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Yogarambha Academy | Premium Yoga & Movement Training" },
      {
        name: "description",
        content:
          "Yogarambha Academy teaches yoga, pranayama, movement arts and philosophy through an immersive, research-led curriculum for serious students.",
      },
      { property: "og:title", content: "Yogarambha Academy | Premium Yoga & Movement Training" },
      {
        property: "og:description",
        content:
          "An immersive movement and yoga academy: programs, retreats and philosophy, taught the way this ancient art deserves.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-canvas font-sans antialiased">
      <Navbar />
      <Hero />
      <Method />
      <Qualifications />
      <BundleCatalog />
      <Syllabus />
      <Facilitators />
      <MentorshipTeaser />

    </main>
  );
}
