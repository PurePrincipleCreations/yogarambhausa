import { createFileRoute } from "@tanstack/react-router";
import { courses } from "@/data/courses";

export const Route = createFileRoute("/api/public/stripe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["STRIPE_WEBHOOK_SECRET"];
        const signature = request.headers.get("stripe-signature");
        if (!secret || !signature) return new Response("Not configured", { status: 400 });

        const { getStripe, ensureAccount } = await import("@/lib/stripe.server");
        const stripe = getStripe();
        const body = await request.text();
        let event;
        try {
          event = await stripe.webhooks.constructEventAsync(body, signature, secret);
        } catch {
          return new Response("Invalid signature", { status: 401 });
        }

        if (event.type === "checkout.session.completed") {
          const session = event.data.object;
          const email = session.customer_details?.email ?? session.customer_email;
          const slug = session.metadata?.course_slug;
          if (!email || !slug || !courses.some((c) => c.slug === slug)) {
            return new Response("Missing data", { status: 200 });
          }
          const origin = new URL(request.url).origin;
          const account = await ensureAccount(email.toLowerCase(), session.customer_details?.name ?? null, origin);

          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          await supabaseAdmin
            .from("enrollments")
            .upsert(
              { user_id: account.userId, course_slug: slug, source: "stripe", stripe_session_id: session.id },
              { onConflict: "user_id,course_slug" },
            );

          // Emails are sent once an email domain is configured.
          console.info("[stripe-webhook] enrollment created", {
            slug,
            newAccount: account.isNew,
          });
        }
        return new Response("ok");
      },
    },
  },
});
