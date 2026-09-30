ALTER TABLE public.mentorship_bookings ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.mentorship_bookings ADD COLUMN session_type text NOT NULL DEFAULT 'discovery';
CREATE INDEX mentorship_bookings_user_idx ON public.mentorship_bookings(user_id);