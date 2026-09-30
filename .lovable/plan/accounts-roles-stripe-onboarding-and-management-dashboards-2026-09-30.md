# Accounts, roles, Stripe onboarding and management dashboards

Your brief was written for a different kind of app setup, so the same features will be built on this site's own foundation. Look and feel stay exactly as they are.

## What you will get

1. **Real accounts** – email + password sign-in and sign-up replace the demo sign-in in the existing modal. Includes "Forgot password" and a reset page. No Google.
2. **Three roles** – Student (default), Manager, Admin. Roles are stored separately and checked on the server, so nobody can promote themselves.
3. **Course access** – each student has a list of bundles they own. Course pages unlock based on that list instead of "signed in = everything".
4. **Student tools** (inside the course player, ready for your content):
   - Lesson progress saved automatically (watched time + "Mark as complete").
   - Timestamped notes per lesson (e.g. "14:22 – keep hips square").
   - A **Community** page: posts tagged Form Check / Question / Win, optional video link, replies; teacher replies are highlighted.
5. **Stripe checkout with your own keys** – "Buy" buttons on bundle cards open Stripe checkout. When payment completes, Stripe notifies the site and:
   - If the email is new: an account is created automatically and access is granted.
   - If the email exists: the bundle is added to that account.
6. **Management dashboard** (`/manage`, Managers and Admins only):
   - Table of students: name, email, bundles, overall progress %.
   - "Manage Access" button to grant or remove bundles by hand.
   - Admins also see revenue and total sales from Stripe, plus "Invite Manager".

## Two things that differ from the brief

- **Welcome emails need an email domain.** The site has none yet, so emails ("Your bundle access is ready", "New bundle added", manager invites) can only go out after you set one up. Everything else works without it.
- **No passwords in emails.** Emailing a plain password is unsafe. New buyers instead get a "Set your password" link that signs them in and asks them to choose one. Same result, safer.

## What I need from you

- Your Stripe secret key (a secure form will open – it never appears in chat).
- After the webhook address is ready, I'll show you where to paste it in Stripe and ask for its signing secret.
- Which bundles cost what (I'll add placeholder prices you can change).

## Technical details

- Lovable Cloud tables: `user_roles` (app_role enum student/manager/admin + `has_role()`), `profiles`, `enrollments` (user_id, course_slug, unique), `video_progress` (unique user_id+lesson_id), `notes`, `community_posts` (tag enum), `community_replies` (is_teacher_reply set server-side from role). GRANTs + RLS on all; managers/admins read all via `has_role`.
- Trigger on signup creates profile + student role.
- Replace zustand mock auth with Supabase session in `useAuthStore`; `useCourseAccess` reads enrollments.
- Stripe via `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET`; checkout server function; webhook at `/api/public/stripe-webhook` verifying signature, using admin client to create user (`auth.admin.createUser`) and recovery link.
- `/manage` under `_authenticated`, role check in server functions; admin revenue from Stripe balance transactions/charges.
- Emails wired through Lovable app emails once a domain is configured; until then sends are skipped.
