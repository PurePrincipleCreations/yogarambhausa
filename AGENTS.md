<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- Auth: real Lovable Cloud email/password sessions mirrored into `useAuthStore` via `initAuthListener` in __root; roles live in `user_roles` and access in `enrollments` — never trust client role state for server actions (server fns re-check roles).
- Payments: Stripe BYOK (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`); webhook at `/api/public/stripe-webhook` creates accounts + enrollments — keeps guest checkout working without sign-in.
