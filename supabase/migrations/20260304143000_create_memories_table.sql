CREATE TABLE IF NOT EXISTS public.memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  date date NOT NULL,
  image_url text NOT NULL,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Memories are publicly readable" ON public.memories;
CREATE POLICY "Memories are publicly readable"
ON public.memories FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Anyone can insert memories" ON public.memories;
CREATE POLICY "Anyone can insert memories"
ON public.memories FOR INSERT
WITH CHECK (true);
