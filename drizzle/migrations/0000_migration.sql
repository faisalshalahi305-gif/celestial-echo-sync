CREATE TABLE public.lesson (
  id text PRIMARY KEY DEFAULT 'main',
  html text,
  history jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.lesson TO anon, authenticated;
GRANT ALL ON public.lesson TO service_role;
ALTER TABLE public.lesson ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone reads" ON public.lesson FOR SELECT USING (true);
CREATE POLICY "anyone inserts main" ON public.lesson FOR INSERT WITH CHECK (id = 'main');
CREATE POLICY "anyone updates main" ON public.lesson FOR UPDATE USING (id = 'main') WITH CHECK (id = 'main');
INSERT INTO public.lesson (id) VALUES ('main');
ALTER PUBLICATION supabase_realtime ADD TABLE public.lesson;