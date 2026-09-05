DROP POLICY IF EXISTS "Anyone can see which slots are taken" ON public.mentorship_bookings;
REVOKE SELECT ON public.mentorship_bookings FROM anon;
REVOKE SELECT ON public.mentorship_bookings FROM authenticated;