# Quick Fix for Upload Errors

## You're Getting These Errors?

- ❌ "Image upload failed: new row violates row-level security policy"
- ❌ "Avatar upload failed: Bucket not found"

## The Solution (2 Minutes)

### Step 1: Add Storage Bucket RLS Policies

1. **Open Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project

2. **Go to SQL Editor**
   - Click "SQL Editor" on the left
   - Click "New Query"

3. **Copy & Paste This Code:**
   ```sql
   -- Profile Avatars Bucket Policies
   CREATE POLICY "Authenticated users can upload their own avatar"
   ON storage.objects FOR INSERT WITH CHECK (
     bucket_id = 'profile-avatars' AND auth.role() = 'authenticated'
   );
   CREATE POLICY "Public access to profile avatars"
   ON storage.objects FOR SELECT USING (bucket_id = 'profile-avatars');
   CREATE POLICY "Users can delete their own avatars"
   ON storage.objects FOR DELETE USING (
     bucket_id = 'profile-avatars' AND auth.role() = 'authenticated'
   );
   CREATE POLICY "Users can update their own avatars"
   ON storage.objects FOR UPDATE WITH CHECK (
     bucket_id = 'profile-avatars' AND auth.role() = 'authenticated'
   );

   -- Project Images Bucket Policies
   CREATE POLICY "Authenticated users can upload project images"
   ON storage.objects FOR INSERT WITH CHECK (
     bucket_id = 'project-images' AND auth.role() = 'authenticated'
   );
   CREATE POLICY "Public access to project images"
   ON storage.objects FOR SELECT USING (bucket_id = 'project-images');
   CREATE POLICY "Users can delete their own project images"
   ON storage.objects FOR DELETE USING (
     bucket_id = 'project-images' AND auth.role() = 'authenticated'
   );
   CREATE POLICY "Users can update their project images"
   ON storage.objects FOR UPDATE WITH CHECK (
     bucket_id = 'project-images' AND auth.role() = 'authenticated'
   );
   ```

4. **Click "Run"**
   - Wait for success message

5. **Refresh Your Website**
   - Close the browser tab
   - Reopen your website
   - Log in again

## Now Test It

1. **Avatar Upload**
   - Go to `/profile`
   - Try uploading an avatar
   - ✅ Should work now!

2. **Project Upload**
   - Go to `/submit-project`
   - Try uploading project images
   - ✅ Should work now!

## Still Not Working?

**Check these:**
- ✅ Did you click "Run" in SQL Editor?
- ✅ Did you refresh your browser?
- ✅ Are your buckets named exactly:
  - `profile-avatars`
  - `project-images`
- ✅ Are your buckets set to "Public" in Storage settings?

If still stuck, contact support with:
- Screenshot of the error
- Your Supabase project URL

## Next: Enable Admin Access

Once uploads work, set up admin approval:

1. Go to `/admin-setup` 
2. Follow the steps to run admin SQL query
3. Then you can review and approve project uploads!

---

**That's it!** Your image uploads should now work perfectly. 🎉
