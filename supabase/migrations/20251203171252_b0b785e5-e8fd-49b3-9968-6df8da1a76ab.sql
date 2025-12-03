-- Create storage bucket for tube return images
INSERT INTO storage.buckets (id, name, public)
VALUES ('tube-returns', 'tube-returns', true);

-- Allow authenticated users to upload to the bucket
CREATE POLICY "Users can upload tube return images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'tube-returns' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to view their own images
CREATE POLICY "Users can view their own tube return images"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'tube-returns' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public read access to tube return images (for display)
CREATE POLICY "Public read access for tube returns"
ON storage.objects
FOR SELECT
USING (bucket_id = 'tube-returns');