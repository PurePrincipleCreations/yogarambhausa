import Stripe from "stripe";

export function getStripe() {
  const key = process.env["STRIPE_SECRET_KEY"];
  if (!key) throw new Error("Stripe is not connected yet.");
  return new Stripe(key, { httpClient: Stripe.createFetchHttpClient() });
}

/** Find a user id by email via profiles (admin client). */
export async function findUserIdByEmail(email: string): Promise<string | null> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .ilike("email", email)
    .maybeSingle();
  return data?.id ?? null;
}

/** Create or look up an account and return a set-password link for new users. */
export async function ensureAccount(email: string, fullName: string | null, siteUrl: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const existing = await findUserIdByEmail(email);
  if (existing) return { userId: existing, isNew: false, setPasswordLink: null as string | null };

  const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: fullName ? { full_name: fullName } : {},
  });
  if (error || !created.user) throw error ?? new Error("Could not create account");

  const { data: link } = await supabaseAdmin.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo: `${siteUrl}/reset-password` },
  });
  return {
    userId: created.user.id,
    isNew: true,
    setPasswordLink: link?.properties?.action_link ?? null,
  };
}
