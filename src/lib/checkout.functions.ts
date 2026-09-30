import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { courses } from "@/data/courses";

export const createCheckout = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({ slug: z.string().min(1).max(100), email: z.string().email().max(255).optional() }).parse(d),
  )
  .handler(async ({ data }) => {
    const course = courses.find((c) => c.slug === data.slug);
    if (!course) throw new Error("Unknown program");
    const { getStripe } = await import("./stripe.server");
    const stripe = getStripe();
    const origin = new URL(getRequest().url).origin;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: data.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(course.price * 100),
            product_data: { name: `${course.title} — Yogarambha` },
          },
        },
      ],
      metadata: { course_slug: course.slug },
      success_url: `${origin}/courses/${course.slug}?purchased=1`,
      cancel_url: `${origin}/#programs`,
    });
    if (!session.url) throw new Error("Could not start checkout");
    return { url: session.url };
  });
