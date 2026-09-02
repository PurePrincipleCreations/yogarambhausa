import { createFileRoute } from "@tanstack/react-router";
import { HimalayanRetreatsPage } from "@/components/HimalayanRetreatsPage";

export const Route = createFileRoute("/retreats")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Himalayan Retreat in Naggar — Yogarambha" },
      { name: "description", content: "Join an intimate Yogarambha retreat in Naggar, Kullu blending yoga, movement, stillness and Himalayan nature." },
      { property: "og:title", content: "Himalayan Immersion — Yogarambha" },
      { property: "og:description", content: "An exclusive movement and yoga retreat in Naggar, Kullu. Disconnect to reconnect." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HimalayanRetreatsPage,
});