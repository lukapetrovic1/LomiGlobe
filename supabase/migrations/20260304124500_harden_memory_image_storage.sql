DROP POLICY IF EXISTS "Anyone can delete memory images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload memory images" ON storage.objects;

CREATE POLICY "Anyone can upload memory images to memories folder"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'memory-images'
  AND (storage.foldername(name))[1] = 'memories'
);
