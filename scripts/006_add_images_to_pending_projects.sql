-- Add images_urls column to pending_projects table to support multiple images
ALTER TABLE pending_projects 
ADD COLUMN images_urls jsonb DEFAULT '[]'::jsonb;
