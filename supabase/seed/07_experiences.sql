insert into public.experiences (
  company_en, company_th, location_en, location_th,
  position_en, position_th, team_en, team_th,
  started_on, ended_on, tech_stack, bullets_en, bullets_th, sort_order
)
values
(
  'Datadorf Co., Ltd.', 'บริษัท ดาต้าดอร์ฟ จำกัด',
  'Khon Kaen, Thailand', 'ขอนแก่น ประเทศไทย',
  'Junior Frontend Developer', 'Junior Frontend Developer',
  'Webapp & Mobile Team', 'ทีม Webapp และ Mobile',
  '2024-11-01', null,
  array['Next.js','TypeScript','React Native','Tailwind CSS','Fastify','Drizzle ORM','PostgreSQL'],
  array[
    $$Built the frontend of a hospital escort and bedside-care platform across three connected products - an operations back office, a caregiver dispatch app, and a customer mobile app - covering booking, job assignment, and live tracking$$,
    $$Shipped the caregiver and customer mobile apps in React Native from Figma handoff to release, delivering 20 screens now used by 50+ drivers and caregivers serving 200+ patients per month$$,
    $$Building an internal delivery-planning tool where AI agents turn a client requirement into a module and task breakdown with man-day estimates, push them to Notion for per-role assignment, and roll CRs, issues, and man-days into project cost and KPI reporting$$,
    $$Developed the company's flagship MarTech product, sold to merchants by subscription, which turns Facebook and LINE comments into orders with auto-generated shipping labels and merges both channels into one inbox with order tracking$$,
    $$Built a shop-floor tracking app for a confectionery manufacturer covering order intake, production stages, and dispatch, giving 6 staff real-time status across 3 production lines$$
  ],
  array[
    $$พัฒนาส่วนหน้าของแพลตฟอร์มบริการพาผู้ป่วยไปโรงพยาบาลและเฝ้าไข้ ครอบคลุมสามผลิตภัณฑ์ที่เชื่อมต่อกัน ได้แก่ ระบบหลังบ้านสำหรับปฏิบัติการ แอปจ่ายงานผู้ดูแล และแอปมือถือสำหรับลูกค้า ตั้งแต่การจอง การมอบหมายงาน ไปจนถึงการติดตามสถานะแบบเรียลไทม์$$,
    $$ส่งมอบแอปมือถือสำหรับผู้ดูแลและลูกค้าด้วย React Native ตั้งแต่รับงานออกแบบจาก Figma จนถึงปล่อยใช้งานจริง รวม 20 หน้าจอ ปัจจุบันมีคนขับและผู้ดูแลใช้งานกว่า 50 คน ให้บริการผู้ป่วยมากกว่า 200 รายต่อเดือน$$,
    $$กำลังพัฒนาเครื่องมือวางแผนงานภายในองค์กร ที่ให้ AI agent แปลงความต้องการของลูกค้าเป็นโมดูลและงานย่อยพร้อมประมาณการเป็น man-day ส่งเข้า Notion เพื่อมอบหมายตามบทบาท แล้วสรุป CR ปัญหา และ man-day ออกมาเป็นรายงานต้นทุนและ KPI ของโครงการ$$,
    $$พัฒนาผลิตภัณฑ์ MarTech เรือธงของบริษัทที่ขายให้ร้านค้าแบบสมัครสมาชิก ซึ่งเปลี่ยนคอมเมนต์จาก Facebook และ LINE ให้เป็นออร์เดอร์พร้อมสร้างใบปะหน้าพัสดุอัตโนมัติ และรวมทั้งสองช่องทางไว้ในกล่องข้อความเดียวพร้อมการติดตามออร์เดอร์$$,
    $$พัฒนาแอปติดตามงานหน้าไลน์ผลิตให้โรงงานขนม ครอบคลุมการรับออร์เดอร์ ขั้นตอนการผลิต และการจัดส่ง ทำให้พนักงาน 6 คนเห็นสถานะแบบเรียลไทม์ครบทั้ง 3 สายการผลิต$$
  ],
  1
),
(
  'Esarndotcom Co., Ltd.', 'บริษัท อีสานดอทคอม จำกัด',
  'Khon Kaen, Thailand', 'ขอนแก่น ประเทศไทย',
  'UX/UI Design Intern', 'นักศึกษาฝึกงานด้าน UX/UI Design',
  null, null,
  '2024-01-01', '2024-04-01',
  array['Figma','WordPress','Power BI','DAX','HTML','CSS'],
  array[
    $$Designed a three-page Power BI decision dashboard for a cassava processing business: a company-wide summary with growth rates, per-customer purchase timelines for sales follow-up, and intake volume by province and district as a heat map$$,
    $$Modelled the dashboard measures in DAX and produced its UI and image assets in Figma, replacing hand-built Excel charts as the basis for purchasing decisions by the procurement team and its head of sales$$
  ],
  array[
    $$ออกแบบแดชบอร์ดช่วยตัดสินใจบน Power BI จำนวนสามหน้าให้ธุรกิจแปรรูปมันสำปะหลัง ประกอบด้วยหน้าสรุปภาพรวมบริษัทพร้อมอัตราการเติบโต ไทม์ไลน์การซื้อรายลูกค้าสำหรับทีมขายติดตามงาน และปริมาณรับซื้อรายจังหวัดและอำเภอในรูปแบบ heat map$$,
    $$สร้างตัวชี้วัดของแดชบอร์ดด้วย DAX และทำ UI พร้อมภาพประกอบใน Figma มาแทนกราฟที่ทำมือใน Excel จนกลายเป็นข้อมูลตั้งต้นในการตัดสินใจจัดซื้อของทีมจัดซื้อและหัวหน้าฝ่ายขาย$$
  ],
  2
);
