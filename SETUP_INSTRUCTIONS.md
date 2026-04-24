# TheArkitecktsHub - Complete Setup Instructions

Welcome! This document provides all the steps needed to get your architecture platform fully operational.

## Overview

TheArkitecktsHub has three main components that need setup:

1. **Supabase Integration** ✅ (Already done)
2. **Storage Buckets** (Image uploads)
3. **Admin Access** (Project approval workflow)

## Part 1: Storage Buckets & RLS Policies Setup (REQUIRED)

Your website needs two storage buckets with proper RLS policies to handle image uploads.

### Step 1A: Create Storage Buckets

**See: `/STORAGE_SETUP_GUIDE.md`** for complete instructions.

**Quick Steps:**
1. Open Supabase dashboard → Storage
2. Create `profile-avatars` bucket (set to Public)
3. Create `project-images` bucket (set to Public)

### Step 1B: Set Up RLS Policies (CRITICAL!)

**⚠️ IMPORTANT:** Without RLS policies, uploads will fail with "Bucket not found" or "RLS policy" errors.

**See: `/STORAGE_POLICIES_SETUP.md`** for complete instructions.

**Quick Steps - Option A (Recommended - Using SQL):**
1. Go to Supabase → SQL Editor
2. Create a new query
3. Copy ALL code from `/scripts/008_setup_storage_policies.sql`
4. Paste into SQL Editor
5. Click "Run"

**Quick Steps - Option B (Manual UI):**
1. For each bucket (profile-avatars and project-images):
   - Go to Storage → Click bucket name
   - Click "Policies" tab
   - Add 4 policies: UPLOAD, SELECT, DELETE, UPDATE
   - See `/STORAGE_POLICIES_SETUP.md` for exact policy names

This is **required** for:
- ✅ Avatar uploads on `/profile` page
- ✅ Project image uploads on `/submit-project` page

---

## Part 2: Admin Access Setup

You want one email address to have admin privileges for reviewing and approving project uploads.

### How to Set Up

**See: `/ADMIN_SETUP_GUIDE.md`** for complete step-by-step instructions.

**Quick Steps:**
1. Sign in to your website
2. Go to Supabase SQL Editor
3. Run this query (replace email):
   ```sql
   UPDATE profiles SET is_admin = true 
   WHERE id IN (SELECT id FROM auth.users WHERE email = 'your-email@example.com');
   ```
4. Refresh or log back in
5. Click your profile avatar
6. Click "Admin Dashboard"

---

## Testing the Complete Workflow

Once storage and admin are set up, test the full workflow:

### Step 1: Test Avatar Upload
1. Go to `/profile`
2. Upload an avatar image
3. Verify it displays

### Step 2: Test Project Upload
1. Go to `/submit-project`
2. Upload 1-5 project images
3. Fill in project details
4. Submit

### Step 3: Review in Admin
1. Go to `/admin`
2. You should see pending projects
3. Click to view project and images
4. Approve or reject

### Step 4: Verify Published Project
1. Go to `/projects`
2. Approved projects should appear here

---

## Website User Flows

### For Architects (Users)
1. Sign up at `/auth/sign-up`
2. Edit profile at `/profile` - upload avatar
3. Submit projects at `/submit-project` - upload images
4. Projects go to admin for review
5. Once approved, projects appear on public site

### For Admin
1. Sign in with admin email
2. Go to `/admin` dashboard
3. Review pending projects with images
4. Approve projects → they go live
5. Reject projects → stay hidden

---

## File Structure for Reference

```
/scripts
  ├── 001_create_schema.sql (database tables)
  ├── 002_seed_data.sql (sample data)
  ├── 003_profile_trigger.sql (auto-create profiles)
  ├── 004_add_admin_role.sql (admin column)
  ├── 005_setup_storage_buckets.sql (storage setup)
  ├── 006_add_images_to_pending_projects.sql (images column)
  └── 007_make_user_admin.sql (make admin - use this!)

/app
  ├── /auth (login/signup)
  ├── /profile (user profile)
  ├── /submit-project (upload projects)
  ├── /admin (admin dashboard)
  ├── /projects (view published projects)
  ├── /architects (architect profiles)
  ├── /blog (articles)
  └── /resources (design resources)

/components
  ├── profile-form.tsx (avatar + bio edit)
  ├── project-upload-form.tsx (upload projects)
  ├── /admin/pending-project-row.tsx (admin view)
  └── user-menu.tsx (profile dropdown)
```

---

## Troubleshooting

### Avatar Upload Shows "Bucket not found"
→ See STORAGE_SETUP_GUIDE.md - buckets not created yet

### Admin Dashboard Not Accessible
→ See ADMIN_SETUP_GUIDE.md - admin not enabled yet

### Images Don't Display After Upload
→ Check buckets are PUBLIC (not private)
→ Check bucket names are exactly right (lowercase, hyphen)

### Can't Access Admin After Setup
→ Clear browser cache (Ctrl+Shift+Delete)
→ Log out and back in
→ Check email in SQL query matches exactly

---

## Environment Variables

All environment variables are already configured. No action needed.

Required vars (auto-configured):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## Key Features Enabled

Once setup is complete:

✅ User authentication (sign up, login, logout)
✅ Profile management (avatar, bio, details)
✅ Project uploads (with multiple images)
✅ Admin dashboard (project approval/rejection)
✅ Public project gallery (approved projects only)
✅ Architect directory
✅ Blog system
✅ Design resources
✅ Bookmarking system

---

## Next Steps Checklist

- [ ] Read `/STORAGE_SETUP_GUIDE.md` and create buckets
- [ ] Read `/ADMIN_SETUP_GUIDE.md` and enable admin
- [ ] Test avatar upload on `/profile`
- [ ] Test project upload on `/submit-project`
- [ ] Review in admin dashboard at `/admin`
- [ ] Approve a test project
- [ ] Verify it appears on `/projects`
- [ ] Invite other users to submit projects

---

## Questions?

Check the relevant setup guide:
- **Image upload issues:** → `STORAGE_SETUP_GUIDE.md`
- **Admin access issues:** → `ADMIN_SETUP_GUIDE.md`
- **Feature questions:** → Browse the `/app` folder structure

Good luck with your architecture platform! 🏗️
