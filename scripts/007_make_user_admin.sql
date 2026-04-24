-- Make a user an admin by their email
-- INSTRUCTIONS:
-- 1. Replace 'admin@example.com' with the actual admin email address
-- 2. Copy and paste this entire query into Supabase SQL Editor
-- 3. Click "Run" to execute
-- 4. The user with that email will now have admin access

UPDATE profiles
SET is_admin = true
WHERE id IN (
  SELECT id
  FROM auth.users
  WHERE email = 'admin@example.com'
);

-- Verify the update worked:
SELECT email, is_admin
FROM auth.users
JOIN profiles ON auth.users.id = profiles.id
WHERE email = 'admin@example.com';
