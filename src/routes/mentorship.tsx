import { createFileRoute } from "@tanstack/react-router";
import { MentorshipPage } from "@/components/MentorshipPage";

export const Route = createFileRoute("/mentorship")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Mentorship with Veer — Go Beyond Yoga | Yogarambha" },
      {
        name: "description",
        content:
          "A 12-month private mentorship with Veer: dedicated 1:1 attention, monthly video labs and direct access all year. Book a discovery call.",
      },
      { property: "og:title", content: "Go Beyond Yoga — 12-Month Mentorship with Veer" },
      {
        property: "og:description",
        content:
          "One teacher, one student, twelve months. Private mentorship in yoga, strength, breath and philosophy at Yogarambha.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MentorshipPage,
});
