# Admin Dashboard Setup Guide

This guide explains how to set up admin access so you can review and approve project uploads.

## Quick Summary

The admin dashboard lets one (or more) user(s) review project submissions from architects and either **approve** them (they go live on the site) or **reject** them (they don't appear).

## How to Enable Admin for Your Account

### Step 1: Sign Up / Log In
1. Create an account on the website with your email
2. Or log in with an existing account

### Step 2: Enable Admin Access in Supabase

1. Go to [https://supabase.com](https://supabase.com)
2. Log in and select your project
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New Query"**
5. Copy and paste this code (replace the email with yours):

```sql
UPDATE profiles
SET is_admin = true
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'your-email@example.com'
);
```

6. Click **"Run"** button

**Example:** If your email is `admin@mysite.com`, the code would be:
```sql
UPDATE profiles
SET is_admin = true
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'admin@mysite.com'
);
```

### Step 3: Access the Admin Dashboard

1. **Refresh** your browser or log out and back in
2. Click on your **profile avatar** (top right corner)
3. You should now see **"Admin Dashboard"** option
4. Click it to open the admin dashboard

## Admin Dashboard Features

Once you're in the admin dashboard at `/admin`, you can:

### View Pending Projects
- See all project submissions waiting for approval
- View project count and statistics
- Access the pending projects list

### Review Project Details
Click "Pending Projects" to:
- View each project submission
- See all uploaded images in a gallery
- Read project description, location, category, style, etc.
- See who submitted the project

### Approve Projects
When a project looks good:
- Click the **"Approve"** button
- Project becomes published and appears on the website
- Submitter is notified

### Reject Projects
If a project doesn't meet standards:
- Click the **"Reject"** button
- Provide optional feedback
- Project remains unpublished

## Admin Features Checklist

- ✅ Dashboard with statistics (pending, approved, rejected counts)
- ✅ Pending projects list view
- ✅ Project detail view with all submitted images
- ✅ Image gallery for reviewing all project photos
- ✅ Approve button to publish projects
- ✅ Reject button to decline projects
- ✅ User information (who submitted the project)

## Managing Multiple Admins

To make another user an admin, use the same SQL command with their email:

```sql
UPDATE profiles
SET is_admin = true
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'another-admin@example.com'
);
```

To remove admin access:

```sql
UPDATE profiles
SET is_admin = false
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'user-email@example.com'
);
```

## Project Submission Workflow

1. **User submits** a project via `/submit-project` page
2. **Images uploaded** to Supabase storage
3. **Project stored** in pending state
4. **Admin reviews** in dashboard
5. **Admin approves** → project goes live on `/projects` page
6. **Admin rejects** → project stays pending/hidden

## Troubleshooting

**"Admin Dashboard" option doesn't appear:**
- Make sure you ran the SQL update query
- Make sure the email in the query matches your login email exactly
- Refresh the browser page
- Log out and log back in

**Can't access the admin area:**
- Verify `is_admin = true` is set in the database
- Check your user email matches the one in the query
- Try incognito/private browser mode to test

**Images not showing in project reviews:**
- Make sure `project-images` storage bucket is created and public
- See STORAGE_SETUP_GUIDE.md for bucket setup

## Next Steps

1. ✅ Complete the "How to Enable Admin for Your Account" steps above
2. ✅ Refresh or log back in
3. ✅ Click on your profile to find "Admin Dashboard"
4. ✅ Start reviewing pending projects

## Support

If you need help:
- Check the STORAGE_SETUP_GUIDE.md for image bucket issues
- Review the project submission page `/submit-project` to understand what users are uploading
- Check the database schema documentation for more details
