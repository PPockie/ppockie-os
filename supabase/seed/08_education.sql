insert into public.education (
  institution_en, institution_th, location_en, location_th,
  degree_en, degree_th, started_on, ended_on, gpax,
  bullets_en, bullets_th, sort_order
)
values (
  'Sripatum University, Khon Kaen Campus', 'มหาวิทยาลัยศรีปทุม วิทยาเขตขอนแก่น',
  'Khon Kaen, Thailand', 'ขอนแก่น ประเทศไทย',
  'Bachelor''s Degree - Digital Business Innovation', 'ปริญญาตรี สาขานวัตกรรมธุรกิจดิจิทัล',
  '2022-01-01', '2024-01-01', '3.96 / 4.00',
  array[
    $$Selected for the Northeastern regional round of Thailand's National Software Contest (NSC) 2023 with an educational basketball game that teaches the rules and what each position is responsible for (Unity, C#, Figma)$$
  ],
  array[
    $$ได้รับคัดเลือกเข้าแข่งขันรอบภูมิภาคภาคตะวันออกเฉียงเหนือ การแข่งขันพัฒนาโปรแกรมคอมพิวเตอร์แห่งประเทศไทย (NSC) ปี 2566 ด้วยเกมบาสเกตบอลเพื่อการเรียนรู้ที่สอนกติกาและหน้าที่ของผู้เล่นแต่ละตำแหน่ง (Unity, C#, Figma)$$
  ],
  1
);
