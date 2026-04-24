# Storage Bucket RLS Policies Setup Guide

The "Image upload failed" and "Avatar upload failed" errors are caused by missing **Row Level Security (RLS) policies** on your storage buckets. 

## What are RLS Policies?

RLS (Row Level Security) policies control who can upload, view, and delete files in your storage buckets. Without them, authenticated users can't upload files.

## Setup Instructions

### Option 1: Using the SQL Script (Recommended)

1. **Go to your Supabase Dashboard**
   - https://app.supabase.com

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy the entire content from `/scripts/008_setup_storage_policies.sql`**
   - Open that file in your project
   - Copy all the SQL code

4. **Paste into the SQL Editor**
   - Paste the code into the query box
   - Click "Run"

5. **Done!** 
   - The RLS policies are now applied to your storage buckets
   - Avatar and project image uploads will now work

### Option 2: Manual Setup via Supabase Dashboard UI

If you prefer to set up policies manually through the UI:

#### For profile-avatars bucket:

1. Go to Storage → Buckets
2. Click on **profile-avatars**
3. Click "Policies" tab
4. Click "New Policy" and select:
   - **UPLOAD**: "Let anyone upload" → Name it "Authenticated users can upload their own avatar"
   - **SELECT**: "Let anyone read" → Name it "Public access to profile avatars"  
   - **DELETE**: "Let individual users delete their own files" → Name it "Users can delete their own avatars"
   - **UPDATE**: "Let individual users update their own files" → Name it "Users can update their own avatars"

#### For project-images bucket:

1. Go to Storage → Buckets
2. Click on **project-images**
3. Click "Policies" tab
4. Click "New Policy" and select:
   - **UPLOAD**: "Let anyone upload" → Name it "Authenticated users can upload project images"
   - **SELECT**: "Let anyone read" → Name it "Public access to project images"
   - **DELETE**: "Let individual users delete their own files" → Name it "Users can delete their own project images"
   - **UPDATE**: "Let individual users update their own files" → Name it "Users can update their project images"

## Testing

After setting up the policies:

1. **Refresh your browser** or log out and back in
2. **Try uploading an avatar**
   - Go to `/profile`
   - Click "Change Avatar"
   - Select an image and save
   - Your avatar should now upload and stay!

3. **Try uploading a project**
   - Go to `/submit-project`
   - Upload project images
   - Submit the project
   - Check `/admin` to approve it (if you're an admin)
   - Once approved, see it on `/projects`

## Troubleshooting

**Still getting "Bucket not found" error?**
- Make sure the bucket names are EXACTLY:
  - `profile-avatars` (not `profile_avatars` or `profile-avatar`)
  - `project-images` (not `project_images` or `projectimages`)

**Still getting "RLS policy" error?**
- Make sure you ran the SQL script or set up all 4 policies per bucket
- Check that the policies are marked as "ENABLED" in the Supabase UI

**Avatar uploads work but images don't show?**
- Go to Storage → Bucket Settings
- Make sure both buckets have **Public** access enabled
- Toggle the public/private setting if needed

## How It Works

These policies allow:
- ✅ Authenticated (logged-in) users to upload images
- ✅ Anyone to view the images (they're public)
- ✅ Users to manage (update/delete) their own images
- ❌ Unauthenticated users cannot upload (only view)

This keeps your storage secure while allowing your users to upload their content!
