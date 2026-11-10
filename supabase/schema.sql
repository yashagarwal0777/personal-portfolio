-- =============================================================================
-- PORTFOLIO DATABASE SCHEMA & SEED DATA (SUPABASE FREE PLAN)
-- =============================================================================
-- Run this complete script in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- It creates all tables, enables Row Level Security (RLS), sets permissions,
-- and seeds the initial portfolio data for Yash Agrawal.
-- =============================================================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY DEFAULT 'main',
  name TEXT NOT NULL DEFAULT 'Yash Agrawal',
  role TEXT NOT NULL DEFAULT 'Web & Android Developer · Software Engineer',
  location TEXT NOT NULL DEFAULT 'Jaipur, Rajasthan',
  status TEXT NOT NULL DEFAULT 'PLAYER 1 · OPEN TO WORK',
  bio TEXT DEFAULT 'Dedicated and enthusiastic student passionate about technology and software development.',
  email TEXT NOT NULL DEFAULT 'Yash.Agrawal0220@gmail.com',
  phone TEXT NOT NULL DEFAULT '+91 7849875575',
  whatsapp TEXT DEFAULT '917849875575',
  linkedin TEXT DEFAULT 'https://www.linkedin.com/in/yash-agrawal-a41b43246/',
  github TEXT DEFAULT 'https://github.com/yashagarwal0777',
  github_repo TEXT DEFAULT 'https://github.com/yashagarwal0777/Javascript-Practice-sets',
  resume_url TEXT DEFAULT '/assets/Yash-Agrawal-Resume.pdf',
  avatar_url TEXT DEFAULT '',
  about_lede TEXT DEFAULT 'I''m <b>Yash Agrawal</b>, a dedicated and enthusiastic student from Jaipur, Rajasthan. Passionate about technology and software development, I continuously strive to expand my skills and technical knowledge.',
  doing_list JSONB DEFAULT '[
    {"id": "d1", "text": "Develop native mobile applications through a <b>4-month Android App Development internship at Celebal Technologies</b>."},
    {"id": "d2", "text": "Build responsive, accessible user interfaces using <b>HTML5, CSS3, JavaScript, and Bootstrap</b>."},
    {"id": "d3", "text": "Create healthcare platforms like <b>VaidyaConnect</b> integrating telemedicine, patient management, and secure storage."},
    {"id": "d4", "text": "Implement real-time computer vision with <b>Convolutional Neural Networks (CNNs)</b> and Python for facial emotion recognition."},
    {"id": "d5", "text": "Design and query relational databases with <b>SQL & MySQL</b> and architect efficient data structures."},
    {"id": "d6", "text": "Lead large-scale campus tech operations as <b>Head of Technical Team at RHYTHM</b> and served as <b>Lieutenant Sergeant at NCC Camp</b>."}
  ]'::jsonb,
  facts JSONB DEFAULT '[
    {"id": "f1", "k": "Class", "v": "Web & Android Developer / Software Engineer"},
    {"id": "f2", "k": "Base", "v": "Jaipur, Rajasthan, India"},
    {"id": "f3", "k": "University", "v": "JECRC University, Jaipur"},
    {"id": "f4", "k": "Degree", "v": "BCA (Computer Application), 2022-2025"},
    {"id": "f5", "k": "School", "v": "Seedling Modern High School"},
    {"id": "f6", "k": "Internship", "v": "Celebal Technologies (4 Months)"},
    {"id": "f7", "k": "Leadership", "v": "NCC Lieutenant Sergeant · Tech Head"},
    {"id": "f8", "k": "Status", "v": "Open to work"}
  ]'::jsonb,
  hero_stats JSONB DEFAULT '[
    {"id": "s1", "value": "3+", "label": "projects", "bg": "var(--yellow)"},
    {"id": "s2", "value": "4mo", "label": "celebal intern", "bg": "var(--sky)"},
    {"id": "s3", "value": "1st", "label": "fest lead", "bg": "var(--pink)"}
  ]'::jsonb,
  story_title TEXT DEFAULT 'How I got here',
  story TEXT DEFAULT 'My tech journey began with curiosity about how software and applications solve everyday human challenges. After completing secondary and higher secondary schooling at <b>Seedling Modern High School</b> (Commerce with Informatics Practices), I joined <b>JECRC University</b> for my <b>Bachelor’s in Computer Application (BCA)</b>. Along the way, I completed a rigorous <b>4-month Android App Development internship at Celebal Technologies</b>, engineered the <b>VaidyaConnect</b> telemedicine portal, implemented a <b>Real-time Emotion Recognition CNN</b> in Python, earned certifications in cloud computing, Salesforce administration, and web development, and led festival technical crews as <b>Head of Technical Team at RHYTHM</b> alongside representing as <b>Lieutenant Sergeant at NCC Camp</b>.',
  motto TEXT DEFAULT 'Curiosity driven. Code committed. Always solving.',
  motto_note TEXT DEFAULT 'I believe practical engineering, hands-on building, and proactive teamwork are the truest ways to master technology.',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  rank TEXT DEFAULT 'S',
  github_url TEXT DEFAULT '',
  demo_url TEXT DEFAULT '',
  thumbnail_url TEXT DEFAULT '',
  is_featured BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. EXPERIENCES TABLE
CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT DEFAULT '',
  period TEXT NOT NULL,
  state TEXT DEFAULT 'complete',
  bullets TEXT[] DEFAULT '{}',
  loot TEXT DEFAULT '',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. EDUCATION TABLE
CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  degree TEXT NOT NULL,
  school TEXT NOT NULL,
  period TEXT NOT NULL,
  state TEXT DEFAULT 'complete',
  note TEXT DEFAULT '',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SKILLS TABLE
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  proficiency INT DEFAULT 80,
  category TEXT DEFAULT 'Core Loadout',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CERTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  kind TEXT DEFAULT 'Technical Training',
  description TEXT DEFAULT '',
  credential_url TEXT DEFAULT '',
  icon TEXT DEFAULT '★',
  tags TEXT[] DEFAULT '{}',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. HOBBIES TABLE
CREATE TABLE IF NOT EXISTS public.hobbies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT DEFAULT '⚡',
  description TEXT DEFAULT '',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'config',
  admin_username TEXT NOT NULL DEFAULT 'yash',
  admin_email TEXT NOT NULL DEFAULT 'Yash.Agrawal0220@gmail.com',
  is_published BOOLEAN DEFAULT true,
  site_title TEXT DEFAULT 'Yash Agrawal — Web & Android Developer',
  social_links JSONB DEFAULT '{
    "linkedin": "https://www.linkedin.com/in/yash-agrawal-a41b43246/",
    "github": "yashagarwal0777"
  }'::jsonb,
  active_resume_url TEXT DEFAULT '/assets/Yash-Agrawal-Resume.pdf',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hobbies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Drop any conflicting older policies if script is re-run
DROP POLICY IF EXISTS "Public Read Profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin All Profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public Read Projects" ON public.projects;
DROP POLICY IF EXISTS "Admin All Projects" ON public.projects;
DROP POLICY IF EXISTS "Public Read Experiences" ON public.experiences;
DROP POLICY IF EXISTS "Admin All Experiences" ON public.experiences;
DROP POLICY IF EXISTS "Public Read Education" ON public.education;
DROP POLICY IF EXISTS "Admin All Education" ON public.education;
DROP POLICY IF EXISTS "Public Read Skills" ON public.skills;
DROP POLICY IF EXISTS "Admin All Skills" ON public.skills;
DROP POLICY IF EXISTS "Public Read Certifications" ON public.certifications;
DROP POLICY IF EXISTS "Admin All Certifications" ON public.certifications;
DROP POLICY IF EXISTS "Public Read Hobbies" ON public.hobbies;
DROP POLICY IF EXISTS "Admin All Hobbies" ON public.hobbies;
DROP POLICY IF EXISTS "Public Read Site Settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin All Site Settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public Insert Contact Messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admin All Contact Messages" ON public.contact_messages;

-- Content Tables: Public can READ, only authenticated admin can WRITE/UPDATE/DELETE
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Admin All Profiles" ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public Read Projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Admin All Projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public Read Experiences" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Admin All Experiences" ON public.experiences FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public Read Education" ON public.education FOR SELECT USING (true);
CREATE POLICY "Admin All Education" ON public.education FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public Read Skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Admin All Skills" ON public.skills FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public Read Certifications" ON public.certifications FOR SELECT USING (true);
CREATE POLICY "Admin All Certifications" ON public.certifications FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public Read Hobbies" ON public.hobbies FOR SELECT USING (true);
CREATE POLICY "Admin All Hobbies" ON public.hobbies FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public Read Site Settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admin All Site Settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Contact Messages: Anyone can submit a message, but ONLY authenticated admin can view/manage
CREATE POLICY "Public Insert Contact Messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin All Contact Messages" ON public.contact_messages FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =============================================================================
-- STORAGE BUCKET CONFIGURATION (portfolio-assets)
-- =============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies: Public can read, authenticated admin can upload/update/delete
DROP POLICY IF EXISTS "Public Read Assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin Insert Assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update Assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Assets" ON storage.objects;

CREATE POLICY "Public Read Assets" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-assets');
CREATE POLICY "Admin Insert Assets" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio-assets');
CREATE POLICY "Admin Update Assets" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'portfolio-assets');
CREATE POLICY "Admin Delete Assets" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolio-assets');

-- =============================================================================
-- SEED INITIAL DATA (Matches Yash Agrawal's Resume & Verified Content)
-- =============================================================================

-- Seed Profile
INSERT INTO public.profiles (id, name, role, location, status, email, phone, whatsapp, linkedin, github, github_repo, resume_url)
VALUES (
  'main',
  'Yash Agrawal',
  'Web & Android Developer · Software Engineer',
  'Jaipur, Rajasthan',
  'PLAYER 1 · OPEN TO WORK',
  'Yash.Agrawal0220@gmail.com',
  '+91 7849875575',
  '917849875575',
  'https://www.linkedin.com/in/yash-agrawal-a41b43246/',
  'https://github.com/yashagarwal0777',
  'https://github.com/yashagarwal0777/Javascript-Practice-sets',
  '/assets/Yash-Agrawal-Resume.pdf'
) ON CONFLICT (id) DO NOTHING;

-- Seed Site Settings
INSERT INTO public.site_settings (id, admin_username, admin_email, is_published, active_resume_url)
VALUES (
  'config',
  'yash',
  'Yash.Agrawal0220@gmail.com',
  true,
  '/assets/Yash-Agrawal-Resume.pdf'
) ON CONFLICT (id) DO NOTHING;

-- Seed Projects
DELETE FROM public.projects;
INSERT INTO public.projects (title, description, tags, rank, github_url, demo_url, display_order)
VALUES
(
  'Real time Emotion Recognition System',
  'Implemented Convolutional Neural Networks (CNNs) using Python and Machine Learning to analyze human facial features and detect emotions with real-time video processing, enhancing system responsiveness, feature extraction accuracy, and instant visual feedback.',
  ARRAY['Python', 'Machine Learning', 'CNNs', 'Computer Vision', 'Real-time Processing'],
  'S',
  'https://github.com/yashagarwal0777',
  '',
  1
),
(
  'VaidyaConnect Healthcare Platform',
  'Developed a comprehensive healthcare platform integrating patient management, telemedicine consultation workflows, and secure medical data storage using modern web technologies (HTML, CSS, JavaScript). Built to streamline doctor-patient interactions and digital records.',
  ARRAY['HTML5', 'CSS3', 'JavaScript', 'Telemedicine', 'Patient Management', 'Secure Storage'],
  'S',
  'https://github.com/yashagarwal0777',
  '',
  2
),
(
  'JavaScript Practice Sets & Component Hub',
  'An open-source repository featuring algorithmic problem solutions, DOM manipulation exercises, interactive frontend widgets, and coding practice sets hosted on GitHub.',
  ARRAY['JavaScript', 'Data Structures', 'Algorithms', 'Git / GitHub', 'Open Source'],
  'A',
  'https://github.com/yashagarwal0777/Javascript-Practice-sets',
  '',
  3
);

-- Seed Experiences
DELETE FROM public.experiences;
INSERT INTO public.experiences (title, company, location, period, state, bullets, loot, display_order)
VALUES
(
  'Android App Development Intern',
  'Celebal Technologies',
  'Jaipur, Rajasthan',
  '4 Months Internship',
  'internship',
  ARRAY[
    'Completed an intensive 4-month Android App Development internship at Celebal Technologies, working on mobile application architecture and feature development.',
    'Implemented mobile UI components, integrated services and local data persistence, and ensured responsive performance across diverse Android devices.',
    'Collaborated in an enterprise software consulting environment following structured development lifecycles, debugging standards, and team code reviews.'
  ],
  'Android App Development · Celebal Technologies · Mobile Architecture · UI/UX · Enterprise Standards',
  1
),
(
  'Head of Technical Team — RHYTHM',
  'JECRC University Annual Fest',
  'Jaipur',
  'Annual Fest · Leadership',
  'leadership',
  ARRAY[
    'Appointed as Head of Technical Team for RHYTHM, the flagship annual cultural and technical festival of JECRC University.',
    'Directed end-to-end technical setups, digital assets, audio-visual stage technology, lighting tech, and live event management across multiple stages.',
    'Coordinated inter-departmental technical teams and handled rapid real-time troubleshooting during live, high-pressure event schedules.'
  ],
  'Technical Leadership · Live Event Coordination · Audio-Visual Systems · Rapid Troubleshooting',
  2
),
(
  'Web Development Trainee',
  'Internshala Trainings',
  'Online',
  'Certified Training',
  'complete',
  ARRAY[
    'Completed hands-on practical training covering full-stack web development: HTML5, CSS3, JavaScript, Bootstrap, and database connectivity.',
    'Developed clean, responsive user interfaces, implemented client-side form validation routines, and structured dynamic web layouts.'
  ],
  'Web Development · Responsive Design · JavaScript DOM · Bootstrap Framework',
  3
);

-- Seed Education
DELETE FROM public.education;
INSERT INTO public.education (degree, school, period, state, note, display_order)
VALUES
(
  'Bachelor''s in Computer Application (BCA)',
  'JECRC University, JAIPUR',
  '2022 — 2025',
  'complete',
  'Three-year university degree program covering core computer applications, software engineering principles, C, C++, Python, database management systems (SQL), algorithm design, data structures, and web development technologies.',
  1
),
(
  'Higher Secondary Education — Class 12th',
  'Seedling Modern High School, Jaipur',
  '2021 — 2022',
  'complete',
  'Commerce with Informatics Practices (IP). Comprehensive foundation in computer fundamentals, database management, structured programming logic, and business computation.',
  2
),
(
  'Secondary School Education — Class 10th',
  'Seedling Modern High School, Jaipur',
  'CBSE Board',
  'complete',
  'Central Board of Secondary Education (CBSE). Built foundational analytical, mathematical, and logical problem-solving skills.',
  3
);

-- Seed Skills
DELETE FROM public.skills;
INSERT INTO public.skills (name, proficiency, category, display_order)
VALUES
('HTML5 & CSS3', 92, 'Web & Mobile Development', 1),
('JavaScript (ES6+)', 88, 'Web & Mobile Development', 2),
('Android App Development', 86, 'Web & Mobile Development', 3),
('SQL & Database Design', 85, 'Databases & Analytics', 4),
('C & C++ Programming', 84, 'Programming & Logic', 5),
('Python & Machine Learning', 82, 'Programming & Logic', 6),
('Data Structures & Algorithms', 80, 'Programming & Logic', 7),
('Microsoft Excel', 80, 'Databases & Analytics', 8),
('Selenium Testing', 76, 'Testing, Tooling & Cloud', 9);

-- Seed Certifications & Achievements
DELETE FROM public.certifications;
INSERT INTO public.certifications (title, issuer, kind, description, icon, tags, display_order)
VALUES
(
  '4 Months Internship in Android App Development',
  'Celebal Technologies',
  'Enterprise Software Internship',
  'Completed an intensive 4-month technical internship developing Android applications, building modular UI features, and working within enterprise engineering practices.',
  '📱',
  ARRAY['Celebal Technologies', 'Android', 'App Development', '4 Months'],
  1
),
(
  'Techniques Salesforce Admin',
  'Salesforce Ecosystem',
  'Cloud CRM Administration',
  'Techniques and principles of Salesforce CRM administration, user permissions, workflow automation, custom objects, and cloud database management.',
  '⛨',
  ARRAY['Salesforce Admin', 'Cloud CRM', 'Workflows'],
  2
),
(
  'Beginner Cloud Computing Fundamentals',
  'Cloud Architecture & Services',
  'Cloud Foundations',
  'Foundational concepts of cloud computing models (IaaS, PaaS, SaaS), cloud storage, virtualization, scalable infrastructure, and network architecture.',
  '☁',
  ARRAY['Cloud Computing', 'Virtualization', 'SaaS / IaaS'],
  3
),
(
  'Internshala Web Development Training',
  'Internshala Trainings',
  'Certified Training',
  'Hands-on training covering modern HTML5, CSS3, JavaScript, responsive frameworks, Bootstrap, database integration, and client-server communication.',
  '★',
  ARRAY['Web Development', 'Bootstrap', 'JavaScript'],
  4
),
(
  'Lieutenant Sergeant Representation — NCC Camp',
  'National Cadet Corps (NCC)',
  'Leadership & Military Drill',
  'Represented as Lieutenant Sergeant at NCC Camp, demonstrating high-level squad leadership, tactical drills, crisis problem-solving, and disciplined team coordination.',
  '🎖',
  ARRAY['NCC Camp', 'Lieutenant Sergeant', 'Leadership'],
  5
);

-- Seed Hobbies & Co-Curriculars
DELETE FROM public.hobbies;
INSERT INTO public.hobbies (name, icon, description, display_order)
VALUES
('Lieutenant Sergeant at NCC Camp', '🎖', 'Represented as Lieutenant Sergeant at National Cadet Corps (NCC) Camp, instilling rigorous personal discipline, leadership under pressure, and squad team command.', 1),
('Brainstorming & Solution Architecture', '🧠', 'Analyzing software challenges, sketching data flows, exploring architectural alternatives, and turning ideas into clean code.', 2),
('Problem Solving & Critical Thinking', '🔍', 'Deconstructing algorithmic challenges, debugging complex logic, and identifying optimal technological trade-offs.', 3),
('Web & Android Experiments', '💻', 'Prototyping responsive web components, testing mobile app flows, and exploring cutting-edge developer tools.', 4);
