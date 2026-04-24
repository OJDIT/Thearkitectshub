-- Add is_admin and pending_projects table
ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;

-- Create pending_projects table for user submissions awaiting admin approval
CREATE TABLE IF NOT EXISTS pending_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  category TEXT,
  style TEXT,
  cover_image_url TEXT,
  image_urls TEXT[] DEFAULT '{}',
  year_completed INTEGER,
  area_sqm NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending' -- pending, approved, rejected
);

-- Enable RLS on pending_projects
ALTER TABLE pending_projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pending_projects
CREATE POLICY "Users can view their own submissions" ON pending_projects
  FOR SELECT USING (auth.uid() = user_id OR (SELECT is_admin FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert their own projects" ON pending_projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending projects" ON pending_projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pending projects" ON pending_projects
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all pending projects" ON pending_projects
  FOR SELECT USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = true);

CREATE POLICY "Admins can update project status" ON pending_projects
  FOR UPDATE USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()) = true);
