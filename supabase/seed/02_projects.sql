insert into public.projects (
  slug, title_en, title_th, summary_en, summary_th,
  description_en, description_th, tech_stack,
  started_on, is_featured, sort_order, is_published
)
values
(
  'university-activity-management-system',
  'University Activity Management System',
  'ระบบจัดการกิจกรรมนักศึกษา',
  'Activity-management system for a university faculty with four roles, QR check-in and hour tracking. Built solo, end to end.',
  'ระบบจัดการกิจกรรมสำหรับคณะในมหาวิทยาลัย รองรับสี่บทบาท เช็กอินด้วย QR และติดตามชั่วโมงกิจกรรม พัฒนาเพียงคนเดียวตั้งแต่ต้นจนจบ',
  $en$**Role:** Freelance Full-Stack Developer

- Delivered an activity-management system for a university faculty covering four roles - admin, activity lead, lecturer, and student - with approval-gated sign-up and either email OTP or password login depending on the role
- Built QR check-in and photo-evidence check-out for multi-day activities, with per-activity claimable hours, lecturer approval of each attendance session, and advisor views tracking the accumulated hours of assigned students
- Owned the system end to end as the sole developer, from database schema and API design through to CI/CD and deployment on a self-managed Ubuntu VPS$en$,
  $th$**บทบาท:** Freelance Full-Stack Developer

- ส่งมอบระบบจัดการกิจกรรมให้คณะหนึ่งในมหาวิทยาลัย รองรับสี่บทบาท ได้แก่ ผู้ดูแลระบบ ผู้จัดกิจกรรม อาจารย์ และนักศึกษา พร้อมการสมัครเข้าร่วมที่ต้องผ่านการอนุมัติ และเข้าสู่ระบบด้วย OTP ทางอีเมลหรือรหัสผ่านตามบทบาท
- พัฒนาการเช็กอินด้วย QR และเช็กเอาต์ด้วยรูปถ่ายยืนยันสำหรับกิจกรรมหลายวัน กำหนดชั่วโมงที่เก็บได้ต่อกิจกรรม ให้อาจารย์อนุมัติการเข้าร่วมแต่ละรอบ และมีหน้าสำหรับอาจารย์ที่ปรึกษาติดตามชั่วโมงสะสมของนักศึกษาในความดูแล
- ดูแลระบบทั้งหมดเพียงคนเดียว ตั้งแต่ออกแบบโครงสร้างฐานข้อมูลและ API ไปจนถึงวาง CI/CD และดีพลอยบน Ubuntu VPS ที่ดูแลเอง$th$,
  array['React','TypeScript','Express.js','Prisma','PostgreSQL','Redis','Directus'],
  '2026-01-01', true, 1, true
),
(
  'gamified-carbon-footprint-learning-app',
  'Gamified Carbon Footprint Learning App',
  'แอปเรียนรู้คาร์บอนฟุตพรินต์แบบเกม',
  'Mobile UI for a carbon-footprint learning app for university students, built around a mission, coin and reward loop.',
  'UI บนมือถือของแอปเรียนรู้คาร์บอนฟุตพรินต์สำหรับนักศึกษา วางโครงรอบวงจรภารกิจ เหรียญ และของรางวัล',
  $en$**Role:** Freelance UI/UX Designer

- Designed the mobile UI for a carbon-footprint learning app aimed at university students, built around a mission-to-coin-to-reward loop that keeps learners returning after each lesson$en$,
  $th$**บทบาท:** Freelance UI/UX Designer

- ออกแบบ UI บนมือถือให้แอปเรียนรู้เรื่องคาร์บอนฟุตพรินต์สำหรับนักศึกษามหาวิทยาลัย โดยวางโครงรอบวงจรภารกิจ เหรียญ และของรางวัล เพื่อดึงให้ผู้เรียนกลับมาต่อเนื่องหลังจบแต่ละบทเรียน$th$,
  '{}',
  '2025-01-01', false, 2, true
)
on conflict (slug) do update set
  title_en       = excluded.title_en,
  title_th       = excluded.title_th,
  summary_en     = excluded.summary_en,
  summary_th     = excluded.summary_th,
  description_en = excluded.description_en,
  description_th = excluded.description_th,
  tech_stack     = excluded.tech_stack,
  started_on     = excluded.started_on,
  is_featured    = excluded.is_featured,
  sort_order     = excluded.sort_order,
  is_published   = excluded.is_published;
