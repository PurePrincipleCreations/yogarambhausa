import { createFileRoute } from "@tanstack/react-router";
import { LiveTTCPage } from "@/components/LiveTTCPage";

export const Route = createFileRoute("/live-ttc")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Live Yoga Teacher Training — Yogarambha" },
      { name: "description", content: "Join live yoga teacher training, assessments and guided sessions broadcast from Naggar in the Himalayas." },
      { property: "og:title", content: "Live TTC from the Himalayas — Yogarambha" },
      { property: "og:description", content: "Upcoming live yoga teacher training sessions from Kasratshala in Naggar, with times shown in your timezone." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LiveTTCPage,
});