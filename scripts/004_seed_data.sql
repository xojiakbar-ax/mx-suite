-- Seed Data for Education Center Management System
-- Note: This is sample data for demonstration. In production, users will sign up through the app.

-- Insert sample teachers
INSERT INTO public.teachers (name, phone, subject, hourly_rate, monthly_salary, student_count, group_count, rating, status)
VALUES
  ('Anvar Karimov', '+998901112233', 'Ingliz tili', 50000, 5000000, 45, 3, 4.8, 'active'),
  ('Dilnoza Rahimova', '+998902223344', 'Matematika', 45000, 4500000, 32, 2, 4.6, 'active'),
  ('Bekzod Aliyev', '+998903334455', 'Dasturlash', 60000, 6000000, 28, 2, 4.9, 'active'),
  ('Malika Tosheva', '+998904445566', 'Rus tili', 40000, 4000000, 38, 3, 4.5, 'active'),
  ('Jasur Yusupov', '+998905556677', 'Fizika', 45000, 4500000, 25, 2, 4.7, 'active')
ON CONFLICT DO NOTHING;

-- Insert sample groups
INSERT INTO public.groups (name, subject, schedule, room, student_count, max_students, status)
SELECT 
  'Ingliz tili - Boshlang''ich',
  'Ingliz tili',
  'Du-Chor-Jum 14:00-15:30',
  '101-xona',
  15,
  20,
  'active'
WHERE NOT EXISTS (SELECT 1 FROM public.groups WHERE name = 'Ingliz tili - Boshlang''ich');

INSERT INTO public.groups (name, subject, schedule, room, student_count, max_students, status)
SELECT 
  'Matematika - 9-sinf',
  'Matematika',
  'Se-Pay-Shan 16:00-17:30',
  '202-xona',
  12,
  15,
  'active'
WHERE NOT EXISTS (SELECT 1 FROM public.groups WHERE name = 'Matematika - 9-sinf');

INSERT INTO public.groups (name, subject, schedule, room, student_count, max_students, status)
SELECT 
  'Python dasturlash',
  'Dasturlash',
  'Du-Chor-Jum 18:00-20:00',
  'Kompyuter xonasi',
  8,
  12,
  'active'
WHERE NOT EXISTS (SELECT 1 FROM public.groups WHERE name = 'Python dasturlash');

-- Insert sample students
INSERT INTO public.students (name, phone, parent_phone, address, subject, monthly_fee, balance, status)
VALUES
  ('Aziz Rahimov', '+998901001001', '+998901001002', 'Toshkent, Yunusobod', 'Ingliz tili', 500000, 0, 'active'),
  ('Nilufar Karimova', '+998901001003', '+998901001004', 'Toshkent, Chilonzor', 'Matematika', 450000, 100000, 'active'),
  ('Sardor Aliyev', '+998901001005', '+998901001006', 'Toshkent, Mirzo Ulug''bek', 'Dasturlash', 600000, -200000, 'active'),
  ('Madina Tosheva', '+998901001007', '+998901001008', 'Toshkent, Sergeli', 'Ingliz tili', 500000, 500000, 'active'),
  ('Jasurbek Yusupov', '+998901001009', '+998901001010', 'Toshkent, Yakkasaroy', 'Fizika', 450000, 0, 'active')
ON CONFLICT DO NOTHING;

-- Insert sample leads
INSERT INTO public.leads (name, phone, source, interest, status, notes)
VALUES
  ('Kamola Saidova', '+998901112200', 'Instagram', 'Ingliz tili', 'new', 'Boshlang''ich kurs haqida so''radi'),
  ('Bobur Tursunov', '+998902223300', 'Telegram', 'Dasturlash', 'contacted', 'Python kursiga qiziqadi'),
  ('Gulnora Rahimova', '+998903334400', 'Do''st orqali', 'Matematika', 'scheduled', 'Sinov darsiga keladi'),
  ('Akmal Karimov', '+998904445500', 'Web sayt', 'Ingliz tili', 'new', 'IELTS tayyorgarlik'),
  ('Zarina Aliyeva', '+998905556600', 'Instagram', 'Rus tili', 'contacted', 'Intensiv kurs kerak')
ON CONFLICT DO NOTHING;
