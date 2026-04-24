-- Insert sample architects
INSERT INTO public.architects (name, title, bio, location, specialties, years_of_experience, featured) VALUES
('Kunlé Adeyemi', 'Principal Architect', 'Visionary architect renowned for innovative sustainable design solutions that integrate African culture with contemporary architecture. Pioneer in using floating structures and responsive environmental design.', 'Lagos, Nigeria', ARRAY['Residential', 'Sustainable Design', 'Innovation'], 18, true),
('Abimbola Adeboyejo', 'Design Director', 'Creative architect specializing in commercial and cultural spaces that celebrate Nigerian heritage while embracing modern functionality and aesthetic excellence.', 'Abuja, Nigeria', ARRAY['Commercial', 'Cultural', 'Contemporary'], 14, true),
('Olugbenga Majekodunmi', 'Senior Architect', 'Passionate about transforming urban communities through thoughtful public architecture and mixed-use developments that enhance social interaction and quality of life.', 'Lagos, Nigeria', ARRAY['Urban Planning', 'Public Spaces', 'Community Design'], 11, false),
('Toyosi Oladayo', 'Lead Architect', 'Innovative architect focusing on minimalist residential design with emphasis on efficient spatial planning, sustainable materials, and affordable housing solutions for modern Nigeria.', 'Lagos, Nigeria', ARRAY['Residential', 'Minimalist', 'Sustainable'], 9, false);

-- Insert sample projects
INSERT INTO public.projects (architect_id, title, description, location, year_completed, category, style, area_sqm, cover_image_url, image_urls, featured, published) 
SELECT 
  a.id,
  'Makoko Floating School',
  'An iconic floating school designed to serve waterfront communities. This groundbreaking structure demonstrates innovative use of sustainable materials and responsive environmental design, becoming a landmark of contemporary African architecture.',
  'Lagos, Nigeria',
  2023,
  'Residential',
  'Contemporary',
  850.0,
  '/placeholder.svg?height=800&width=1200',
  ARRAY[
    '/placeholder.svg?height=800&width=1200',
    '/placeholder.svg?height=800&width=1200',
    '/placeholder.svg?height=800&width=1200'
  ],
  true,
  true
FROM public.architects a WHERE a.name = 'Kunlé Adeyemi';

INSERT INTO public.projects (architect_id, title, description, location, year_completed, category, style, area_sqm, cover_image_url, image_urls, featured, published) 
SELECT 
  a.id,
  'Lekki Innovation District',
  'A state-of-the-art commercial and innovation hub in Lagos featuring modern office spaces, collaborative work environments, and cutting-edge sustainable design elements that reflect contemporary Nigerian aspirations.',
  'Lekki, Lagos, Nigeria',
  2024,
  'Commercial',
  'Contemporary',
  15000.0,
  '/placeholder.svg?height=800&width=1200',
  ARRAY[
    '/placeholder.svg?height=800&width=1200',
    '/placeholder.svg?height=800&width=1200',
    '/placeholder.svg?height=800&width=1200'
  ],
  true,
  true
FROM public.architects a WHERE a.name = 'Abimbola Adeboyejo';

INSERT INTO public.projects (architect_id, title, description, location, year_completed, category, style, area_sqm, cover_image_url, image_urls, featured, published) 
SELECT 
  a.id,
  'Abuja Cultural Plaza',
  'A vibrant cultural and community space celebrating Nigerian heritage through thoughtful urban design. Features galleries, performance venues, open-air markets, and gathering spaces that foster social interaction and cultural dialogue.',
  'Abuja, Nigeria',
  2023,
  'Cultural',
  'Contemporary',
  25000.0,
  '/placeholder.svg?height=800&width=1200',
  ARRAY[
    '/placeholder.svg?height=800&width=1200',
    '/placeholder.svg?height=800&width=1200',
    '/placeholder.svg?height=800&width=1200'
  ],
  false,
  true
FROM public.architects a WHERE a.name = 'Olugbenga Majekodunmi';

-- Insert sample resources
INSERT INTO public.resources (title, description, resource_type, category, url, tags, featured) VALUES
('Sustainable Design Guide', 'Comprehensive guide to incorporating sustainable practices in architectural design, from material selection to energy efficiency.', 'Guide', 'Sustainability', '#', ARRAY['sustainability', 'green building', 'design'], true),
('AutoCAD Template Library', 'Professional template collection for architectural drawings including floor plans, elevations, and details.', 'Template', 'Software', '#', ARRAY['autocad', 'templates', 'drawings'], false),
('Building Code Checklist', 'Essential checklist for navigating residential building codes and regulations across major US cities.', 'Tool', 'Regulations', '#', ARRAY['building codes', 'regulations', 'compliance'], true),
('Material Library 2024', 'Curated collection of contemporary building materials with specifications, suppliers, and application examples.', 'Article', 'Materials', '#', ARRAY['materials', 'finishes', 'products'], false);
