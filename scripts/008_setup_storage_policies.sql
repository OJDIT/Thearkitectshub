-- Storage Bucket RLS Policies Setup
-- This script sets up Row Level Security (RLS) policies for the storage buckets
-- Required for users to upload and access their profile avatars and project images

-- Profile Avatars Bucket Policies
-- Allow authenticated users to upload their own avatars
CREATE POLICY "Authenticated users can upload their own avatar"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'profile-avatars'
  AND auth.role() = 'authenticated'
);

-- Allow anyone to view public avatar files
CREATE POLICY "Public access to profile avatars"
ON storage.objects
FOR SELECT
USING (bucket_id = 'profile-avatars');

-- Allow users to delete their own avatars
CREATE POLICY "Users can delete their own avatars"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'profile-avatars'
  AND auth.role() = 'authenticated'
);

-- Allow users to update their own avatars
CREATE POLICY "Users can update their own avatars"
ON storage.objects
FOR UPDATE
WITH CHECK (
  bucket_id = 'profile-avatars'
  AND auth.role() = 'authenticated'
);

-- Project Images Bucket Policies
-- Allow authenticated users to upload project images
CREATE POLICY "Authenticated users can upload project images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'project-images'
  AND auth.role() = 'authenticated'
);

-- Allow anyone to view public project images
CREATE POLICY "Public access to project images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'project-images');

-- Allow users to delete project images they uploaded
CREATE POLICY "Users can delete their own project images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'project-images'
  AND auth.role() = 'authenticated'
);

-- Allow users to update project images
CREATE POLICY "Users can update their project images"
ON storage.objects
FOR UPDATE
WITH CHECK (
  bucket_id = 'project-images'
  AND auth.role() = 'authenticated'
);
