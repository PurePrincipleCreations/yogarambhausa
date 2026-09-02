import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

const documents = {
  terms: { title: "Terms", description: "Terms governing access to Yogarambha programs, live sessions and retreat experiences." },
  privacy: { title: "Privacy Policy", description: "How Yogarambha handles account, communication and participation information." },
  "liability-waiver": { title: "Liability Waiver", description: "Important participation guidance for yoga, movement, training and retreat activities." },
};

export const Route = createFileRoute("/legal/$document")({
  beforeLoad: ({ params }) => {
    if (!(params.document in documents)) throw notFound();
  },
  head: ({ params }) => {
    const document = documents[params.document as keyof typeof documents];
    return { meta: [
      { title: `${document?.title ?? "Legal"} — Yogarambha` },
      { name: "description", content: document?.description ?? "Yogarambha legal information." },
      { property: "og:title", content: `${document?.title ?? "Legal"} — Yogarambha` },
      { property: "og:description", content: document?.description ?? "Yogarambha legal information." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ] };
  },
  component: LegalPage,
});

function LegalPage() {
  const { document } = Route.useParams();
  const content = documents[document as keyof typeof documents];
  if (!content) return null;
  return <main className="min-h-[70vh] bg-background px-6 py-24"><article className="mx-auto max-w-3xl"><Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"><ChevronLeft className="size-4" aria-hidden="true" />Back to Yogarambha</Link><p className="mt-16 text-xs font-semibold tracking-[0.18em] text-ember uppercase">Yogarambha Academy</p><h1 className="mt-4 text-5xl font-bold text-foreground">{content.title}</h1><p className="mt-8 text-lg leading-relaxed text-muted-foreground">{content.description}</p><div className="mt-10 space-y-5 border-t border-border pt-10 text-sm leading-7 text-muted-foreground"><p>This document is provided as a clear summary for this demonstration experience. Final terms will be supplied before enrollment or participation.</p><p>By joining a live or recorded practice, participants agree to work within their own capacity and seek appropriate professional guidance when needed.</p></div></article></main>;
}