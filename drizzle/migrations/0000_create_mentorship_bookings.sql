CREATE TABLE public.mentorship_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  goals text,
  timezone text NOT NULL DEFAULT 'Asia/Kolkata',
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  meeting_url text,
  status text NOT NULL DEFAULT 'confirmed',
  email_status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX mentorship_bookings_slot_idx
  ON public.mentorship_bookings (starts_at)
  WHERE status = 'confirmed';

GRANT SELECT ON public.mentorship_bookings TO anon;
GRANT SELECT ON public.mentorship_bookings TO authenticated;
GRANT ALL ON public.mentorship_bookings TO service_role;

ALTER TABLE public.mentorship_bookings ENABLE ROW LEVEL SECURITY;

-- No direct client writes: bookings are created by trusted server code only.
CREATE POLICY "Anyone can see which slots are taken"
  ON public.mentorship_bookings
  FOR SELECT
  TO anon, authenticated
  USING (true);