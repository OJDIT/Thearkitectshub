# Supabase Storage Setup Guide

This guide will help you set up the required storage buckets for image uploads on TheArkitecktsHub.

## Required Buckets

You need to create **two storage buckets** in Supabase:

1. **profile-avatars** - For user profile pictures
2. **project-images** - For project submission images

## How to Create Storage Buckets in Supabase

### Step 1: Go to Supabase Dashboard
1. Visit [https://supabase.com](https://supabase.com)
2. Log in to your account
3. Select your project

### Step 2: Create the First Bucket (profile-avatars)

1. Click **"Storage"** in the left sidebar
2. Click **"New bucket"** button
3. Enter bucket name: `profile-avatars`
4. **Uncheck** "Make it private" (leave it public)
5. Click **"Create bucket"**

### Step 3: Create the Second Bucket (project-images)

1. Click **"New bucket"** again
2. Enter bucket name: `project-images`
3. **Uncheck** "Make it private" (leave it public)
4. Click **"Create bucket"**

### Step 4: Configure Bucket Permissions

For each bucket:

1. Click the bucket name to open it
2. Click the **"Policies"** tab
3. Click **"New policy"** button
4. Choose **"For public access"**
5. Set policy as:
   - **What role should be applied:** Public
   - **For queries matching:** All
   - Click **"Create policy"**

## Testing the Setup

Once buckets are created and configured:

1. Go to your website profile page: `/profile`
2. Upload an avatar image
3. You should see the image upload successfully

If you see "Bucket not found" error:
- Make sure bucket names are **exactly** `profile-avatars` and `project-images` (lowercase, with hyphen)
- Make sure buckets are set to **public** (not private)
- Try refreshing your browser page

## Troubleshooting

**"Bucket not found" error:**
- Verify bucket exists in Supabase Storage dashboard
- Check spelling: `profile-avatars` and `project-images`
- Ensure buckets are public (policies set correctly)

**Images don't appear after upload:**
- Check that the public URL policy is configured
- Try accessing the image URL directly from the Storage dashboard

**Still having issues?**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Log out and log back in
3. Try uploading a small image (< 1MB)
4. Check browser console for detailed error messages (F12)

## File Organization in Buckets

### profile-avatars bucket structure:
```
profile-avatars/
  ├── {user-id}-{timestamp}
  ├── {user-id}-{timestamp}
  └── ...
```

### project-images bucket structure:
```
project-images/
  ├── {timestamp}-{random}-{filename}
  ├── {timestamp}-{random}-{filename}
  └── ...
```

## Important Notes

- Buckets MUST be public for images to display on the website
- File names are auto-generated to prevent conflicts
- Maximum file size should be configured in Supabase settings
- Images are served via Supabase's CDN for fast loading

## Next Steps

After buckets are set up:

1. Test avatar upload on profile page (`/profile`)
2. Test project image upload on project submission page (`/submit-project`)
3. Submit a test project to verify full workflow
4. Access admin dashboard to review submissions (`/admin`)
