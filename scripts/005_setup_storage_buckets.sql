-- Create storage buckets for project and profile images
-- This script sets up the necessary buckets and RLS policies

-- Create project-images bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-images', 'project-images', false)
ON CONFLICT (id) DO NOTHING;

-- Create profile-avatars bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-avatars', 'profile-avatars', false)
ON CONFLICT (id) DO NOTHING;

-- RLS Policy for project-images: Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload project images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project-images'
);

-- RLS Policy for project-images: Allow anyone to view
CREATE POLICY "Anyone can view project images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'project-images');

-- RLS Policy for profile-avatars: Allow authenticated users to upload their own avatars
CREATE POLICY "Authenticated users can upload their own avatars"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS Policy for profile-avatars: Allow users to update their own avatars
CREATE POLICY "Users can update their own avatars"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'profile-avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS Policy for profile-avatars: Allow users to delete their own avatars
CREATE POLICY "Users can delete their own avatars"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS Policy for profile-avatars: Allow anyone to view avatars
CREATE POLICY "Anyone can view profile avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-avatars');
