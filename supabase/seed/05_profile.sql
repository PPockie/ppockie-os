insert into public.profile (
  slug, full_name_en, full_name_th, headline_en, headline_th, location_en, location_th, bio_en, bio_th
)
values (
  'main',
  'Thanawat Rojchanatimapong',
  'ธนวัฒน์ โรจนธีเมพงศ์',
  'Front Developer',
  'Front Developer',
  'Khon Kaen, Thailand',
  'ขอนแก่น ประเทศไทย',
  'Junior Front-end Developer who loves turning designs into interfaces people enjoy using. Front-end and design are where I''m strongest, but I''m flexible and keep learning whatever a project needs, from back-end to deployment. Building since 2024, and committed to growing into a well-rounded software engineer.',
  'Junior Front-end Developer ที่รักการเปลี่ยนดีไซน์ให้เป็นหน้าจอที่คนอยากใช้ ถนัดที่สุดคือ front-end และงานดีไซน์ แต่ปรับตัวได้ไว พร้อมเรียนรู้สิ่งที่โปรเจกต์ต้องการ ตั้งแต่ back-end จนถึง deploy ลงมือพัฒนามาตั้งแต่ปี 2024 และมุ่งมั่นที่จะเติบโตเป็น Software Engineer ที่เก่งรอบด้าน'
)
on conflict (slug) do update set
  full_name_en = excluded.full_name_en,
  full_name_th = excluded.full_name_th,
  headline_en  = excluded.headline_en,
  headline_th  = excluded.headline_th,
  location_en  = excluded.location_en,
  location_th  = excluded.location_th,
  bio_en       = excluded.bio_en,
  bio_th       = excluded.bio_th;
