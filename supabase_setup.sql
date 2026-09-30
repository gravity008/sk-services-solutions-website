-- ============================================================
-- SK SERVICES & SOLUTIONS LTD - SUPABASE DATABASE SETUP
-- ============================================================
-- Run this complete SQL script in your Supabase Project:
-- Supabase Dashboard -> SQL Editor -> New Query -> Paste & Run
-- ============================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE TABLE: leads
-- Stores public enquiries and contact form submissions
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    service_interested TEXT,
    message TEXT,
    status TEXT DEFAULT 'new', -- 'new' | 'contacted'
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CREATE TABLE: services
-- Stores dynamic services for the homepage and services page
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT DEFAULT 'Shield',
    image_url TEXT,
    "order" INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. CREATE TABLE: testimonials
-- Stores client reviews and customer feedback
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    quote TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    role TEXT DEFAULT 'Client',
    image_url TEXT DEFAULT '/images/Team-4.jpg',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- LEADS POLICIES:
-- 1. Anonymous and authenticated visitors can submit enquiries (INSERT)
-- 2. Authenticated users (logged-in Admin) can view, update, delete
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Public can insert leads" ON public.leads;
CREATE POLICY "Public can insert leads"
ON public.leads
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view leads" ON public.leads;
CREATE POLICY "Admins can view leads"
ON public.leads
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Admins can update leads" ON public.leads;
CREATE POLICY "Admins can update leads"
ON public.leads
FOR UPDATE
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Admins can delete leads" ON public.leads;
CREATE POLICY "Admins can delete leads"
ON public.leads
FOR DELETE
TO authenticated
USING (true);

-- ------------------------------------------------------------
-- SERVICES POLICIES:
-- 1. Public can view active services
-- 2. Authenticated admin can view, create, edit, delete services
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view active services" ON public.services;
CREATE POLICY "Public can view active services"
ON public.services
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Admins can insert services" ON public.services;
CREATE POLICY "Admins can insert services"
ON public.services
FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update services" ON public.services;
CREATE POLICY "Admins can update services"
ON public.services
FOR UPDATE
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Admins can delete services" ON public.services;
CREATE POLICY "Admins can delete services"
ON public.services
FOR DELETE
TO authenticated
USING (true);

-- ------------------------------------------------------------
-- TESTIMONIALS POLICIES:
-- 1. Public can read testimonials
-- 2. Authenticated admin can view, create, edit, delete
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view testimonials" ON public.testimonials;
CREATE POLICY "Public can view testimonials"
ON public.testimonials
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Admins can insert testimonials" ON public.testimonials;
CREATE POLICY "Admins can insert testimonials"
ON public.testimonials
FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update testimonials" ON public.testimonials;
CREATE POLICY "Admins can update testimonials"
ON public.testimonials
FOR UPDATE
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Admins can delete testimonials" ON public.testimonials;
CREATE POLICY "Admins can delete testimonials"
ON public.testimonials
FOR DELETE
TO authenticated
USING (true);

-- ============================================================
-- SEED DATA (Default Services & Testimonials)
-- ============================================================

INSERT INTO public.services (id, title, description, icon, image_url, "order", is_active)
VALUES
('security-guards', 'Security Guards', 'Professional, SIA-licensed security guards providing reliable on-site protection and peace of mind.', 'Shield', '/images/Security-Guards.webp', 1, true),
('gatehouse-security', 'Gatehouse Security', 'Dedicated gatehouse officers controlling site access, monitoring visitors, and ensuring secure entry points.', 'Building2', '/images/Gatehouse-Security.webp', 2, true),
('security-dog-services', 'Security Dog Services', 'Professional NASDU-certified security dogs and handlers providing reliable protection for all environments.', 'Dog', '/images/Security-Dog-Services.webp', 3, true),
('construction-site-security-dogs', 'Construction Site Security Dogs', 'Trained guard dogs deterring theft, vandalism, and trespassing on construction projects of every size.', 'HardHat', '/images/Construction-Site-Security-Dogs.webp', 4, true),
('k9-security-services', 'K9 Security Services', 'Specialist K9 teams delivering tailored security solutions for businesses, properties, and private clients.', 'Award', '/images/K9-Security-Services.webp', 5, true),
('vacant-property-security-dogs', 'Vacant Property Security Dogs', 'Proactive dog patrols safeguarding empty or disused buildings from trespassers, squatters, and damage.', 'Home', '/images/Vacant-Property-Security-Dogs.webp', 6, true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  image_url = EXCLUDED.image_url,
  "order" = EXCLUDED."order",
  is_active = EXCLUDED.is_active;

INSERT INTO public.testimonials (name, quote, rating, role, image_url)
VALUES
('Teresia Dua', 'Professional company, great advice and really competitive prices. SK Services & Solutions Ltd looked after my property of 6 acres which has a large amount of storage on it, when there was a gathering of travellers in the area. Great job, thank you.', 5, 'Property Owner', '/images/Team-4.jpg'),
('Thomas Edwards', 'Brilliant company, we have been using them for a while now and we have had no issues at all. Everyone has been very professional and always work to very high standards. Would definitely recommend to other companies who are looking for a professional security provider.', 5, 'Commercial Director', '/images/Testimonial-4.jpg'),
('Anne Frankline', 'Always prepared to adapt to the requirements at the time, time keeping was spot on and always friendly and approachable. Will definitely use again and would highly recommend.', 5, 'Site Manager', '/images/Testimonial-3-1.jpg'),
('Frankline', 'I currently sub work from SK Services & Solutions Ltd, and I can honestly say I’ve not suffered any issues with them yet. Pay is always on time, if not early, any issues are sorted immediately, the boss is a really nice, genuine guy, who has worked the profession himself for many years so knows the score.', 5, 'Security Contractor', '/images/Testimonial-1.jpg')
ON CONFLICT DO NOTHING;
