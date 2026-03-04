DROP POLICY IF EXISTS "Anyone can delete memories" ON public.memories;
CREATE POLICY "Anyone can delete memories"
ON public.memories FOR DELETE
USING (true);

DROP POLICY IF EXISTS "Anyone can delete memory images in memories folder" ON storage.objects;
CREATE POLICY "Anyone can delete memory images in memories folder"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'memory-images'
  AND (storage.foldername(name))[1] = 'memories'
);
