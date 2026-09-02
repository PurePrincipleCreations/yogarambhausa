import { createFileRoute } from "@tanstack/react-router";
import { AuthProvider } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";

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
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <AuthProvider>
      <main className="min-h-screen bg-canvas font-sans antialiased">
        <Navbar />
        <Hero />
      </main>
    </AuthProvider>
  );
}
