INSERT INTO storage.buckets (id, name, public)
VALUES ('memory-images', 'memory-images', true);

CREATE POLICY "Memory images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'memory-images');

CREATE POLICY "Anyone can upload memory images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'memory-images');

CREATE POLICY "Anyone can delete memory images"
ON storage.objects FOR DELETE
USING (bucket_id = 'memory-images');