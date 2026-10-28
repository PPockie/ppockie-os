# DESIGN.md — PPockie OS

เว็บ portfolio ที่ออกแบบเป็น "ระบบปฏิบัติการ" (THEME OS): หน้าจอเดียวเต็ม viewport ไม่มี page scroll มี dock เป็นตัวสลับหน้า และเนื้อหาเปิดเป็นหน้าต่างบน desktop

เอกสารนี้แยกส่วนที่ **ทำแล้ว** (อ้างอิงจากโค้ด) ออกจากส่วนที่ **วางแผน** (ยังไม่มีในโค้ด) ไว้ชัดเจน

---

## 1. แนวคิด

| หลักการ | ความหมาย |
|---|---|
| Desktop-first | ออกแบบสำหรับ desktop/tablet เท่านั้น จอมือถือ (`max-sm`) แสดงข้อความแจ้งเตือนแทน |
| One screen | `body` และ `main` เป็น `100dvw × 100dvh` และ `overflow: hidden` ทุกอย่างอยู่ในกรอบเดียว |
| Playful, tactile | ใช้ขอบหนา เงานุ่ม และ animation ตอบสนองต่อเมาส์ (magnify, stretch) |
| Content from DB | ข้อมูล contact, project, achievement, blog ดึงจาก Supabase ไม่ hardcode |
| Bilingual | en / th ทุกส่วนของ UI และเนื้อหา |

---

## 2. Theme

ธีมกำหนดผ่าน `data-theme` บน `<html>` โดย `next-themes` ([theme-provider.tsx](src/components/theme/theme-provider.tsx))

- ค่า: `light` (default), `dark`, และ `system` (ถูก resolve เป็น light/dark ก่อนเขียน attribute)
- เก็บค่าใน localStorage key `theme` ([storage.ts](src/constants/storage.ts))
- Tailwind dark variant: `@custom-variant dark` ผูกกับ `[data-theme="dark"]` ไม่ใช้ media query
- `disableTransitionOnChange` เปิดไว้ ป้องกัน flash ตอนสลับธีม

### Color tokens ([globals.css](src/app/globals.css))

| Token | Light | Dark | ใช้กับ |
|---|---|---|---|
| `--background` | `#f9f9f9` | `#232323` | พื้นหลังหน้า |
| `--foreground` | `#171717` | `#ededed` | ตัวอักษรหลัก |
| `--decoration-dot` | `#171717` | `#ededed` | จุด halftone มุมจอ |

Tailwind ใช้ผ่าน `bg-background` / `text-foreground` (map ใน `@theme inline`)

### สีคงที่ (ไม่เปลี่ยนตามธีม)

| สี | ค่า | ใช้กับ |
|---|---|---|
| Frame | `#1b1b1b` | เส้นขอบ `main` หนา 8px |
| Dock border / logo | `gray-900` | กรอบและพื้นโลโก้ใน dock |
| Dock item | `gray-200` | พื้นไอคอนใน dock |
| Divider | `neutral-800` | เส้นคั่นกลุ่มใน dock |
| Intro cover | `#171717` | ม่านปิดตอนเปิดเว็บ |
| Ring band | `neutral-900` / ตัวอักษร `neutral-50` | แถบข้อความวนรอบตัวละคร |

> สีแบรนด์ของไอคอน เช่น Facebook `#1877f2` ตั้งผ่าน `className` ของแต่ละ item ใน [navbar.tsx](src/constants/navbar.tsx)

---

## 3. Typography

ฟอนต์ตั้งใน [libs/font](src/libs/font/index.ts) และเลือกตาม locale ผ่าน CSS variable `--font-display` / `--font-body` ที่ `<html>`

| บทบาท | en | th |
|---|---|---|
| Display (`h1`, `h2`) | Grapixoso Cubica | Noto Sans Thai |
| Body | Lexend | Noto Sans Thai |
| Fallback | Noto Sans Thai → sans-serif | sans-serif |

- มีฟอนต์เพิ่มพร้อมใช้: Grapixoso (ปกติ, Condensada), Righteous
- ตัวอักษรไทยเป็น fallback เสมอ ข้อความที่ปนสองภาษาจึงไม่ตกเป็นฟอนต์ระบบ
- ขนาดที่ใช้ตอนนี้: ring text `text-6xl font-bold`, label ใน dock `text-sm`

---

## 4. Layout

### Frame
- `main` เต็มจอ มีขอบ `8px solid #1b1b1b` และ `border-radius: 0.5rem` ทำให้ดูเหมือนหน้าจอเครื่อง
- ไม่มี scroll ที่ระดับหน้า หากเนื้อหายาว ให้ scroll ภายในหน้าต่างเท่านั้น

### Corner decoration
ลวดลายจุด halftone ที่มุมซ้ายบนและขวาล่าง สร้างด้วย `main::before` / `main::after` (mask จาก radial-gradient สองชั้น)

| Variable | ค่า | หน้าที่ |
|---|---|---|
| `--decoration-size` | `22rem` | ขนาดของกรอบสี่เหลี่ยมที่วาดลาย |
| `--decoration-gap` | `0.85rem` | ระยะห่างจุดแต่ละจุด |

ลายอยู่ที่ `z-index: 0` และ `pointer-events: none` ไม่บังการคลิก

### Z-index ที่ใช้อยู่

| ชั้น | z | องค์ประกอบ |
|---|---|---|
| Decoration | 0 | จุด halftone |
| Ring (หลังตัวละคร) | 10 / 15 | แถบวงแหวนครึ่งหลัง และข้อความด้านหลัง |
| ตัวละคร | 30 | `Charactor.png` |
| Ring (หน้าตัวละคร) | 40 / 45 | แถบวงแหวนครึ่งหน้า และข้อความด้านหน้า |
| โลโก้ | 50 | `logo-face` |
| Intro overlay | 46 | ม่านปิดตอน intro |
| Intro logo | 51 | โลโก้ที่ zoom ตอนเปิดเว็บ |
| Dock | 99 | navbar |

---

## 5. Dock (Navbar) — ทำแล้ว

ไฟล์: [navbar.tsx](src/components/ui/navbar.tsx), [constants/navbar.tsx](src/constants/navbar.tsx)

**ตำแหน่ง** ผู้ใช้เลือกได้ 3 แบบ เก็บใน localStorage key `nav_position`

| `position` | ตำแหน่ง | แนวการวาง |
|---|---|---|
| `default` | ซ้าย กึ่งกลางแนวตั้ง (`left-10`) | แนวตั้ง |
| `top` | บน กึ่งกลางแนวนอน (`top-10`) | แนวนอน |
| `bottom` | ล่าง กึ่งกลางแนวนอน (`bottom-5`) | แนวนอน |

**หน้าตา**
- กรอบ `border-4 border-gray-900`, `rounded-3xl`, เงา `shadow-xl shadow-gray-800/35`, พื้น `--color-background` + `backdrop-blur-sm`
- โลโก้อยู่บนสุดของ dock พื้นดำ `rounded-xl`
- ไอคอนแต่ละอันเป็นสี่เหลี่ยมจัตุรัส `rounded-xl` พื้น `gray-200` ขนาดไอคอน 28px
- รายการแบ่งกลุ่มตาม `category` มีเส้นคั่น `rounded-full` ระหว่างกลุ่ม
- ถ้า item ไม่มีไอคอน จะแสดงชื่อเป็นตัวอักษร (`text-sm`, hover ขีดเส้นใต้)

**Interaction:** เอฟเฟกต์ magnify ขยายไอคอนที่เมาส์เข้าใกล้ (`scale: 1.35`, `radius: 90px`) ตามแนวแกนของ dock

**รายการปัจจุบัน** Blog (profile) | Projects, Contact (contact)

---

## 6. Welcome screen — ทำแล้ว

ไฟล์: [welcome.tsx](src/components/ui/welcome.tsx)

- ตัวละคร (`Charactor.png`) อยู่กึ่งกลางล่าง มี glow สีขาว (`drop-shadow-[0_0px_72px] drop-shadow-white`)
- **Ring marquee:** แถบวงรีเอียง `-14°` (`radiusX 460`, `radiusY 120`, หนา 68px) วนรอบตัวละคร ครึ่งหลังอยู่หลัง ครึ่งหน้าอยู่หน้าตัวละคร ให้เกิดมิติ ข้อความวน: `I'M · PPOCKIE · WEB DEVELOPER · UI DESIGN` (แก้ได้ที่ [constants/welcome.ts](src/constants/welcome.ts)) รอบละ 24 วินาที ข้อความด้านหลังย่อเหลือ 65%
- มือถือ: แสดงกล่องแจ้งว่าเว็บออกแบบสำหรับ desktop/tablet

---

## 7. Intro sequence — ทำแล้ว

ไฟล์: [intro.tsx](src/components/ui/intro.tsx) ใช้ GSAP timeline

| ลำดับ | เหตุการณ์ |
|---|---|
| 1 | ม่านดำ `#171717` คลุมจอ โลโก้วงกลมเลื่อนขึ้นมา (0.9 วิ) |
| 2 | โลโก้ zoom ขยาย 12 เท่า (1.1 วิ, `power4.in`) แล้วม่านจางหาย |
| 3 | ตัวละครเลื่อนขึ้น ring และข้อความค่อย ๆ ปรากฏ |
| 4 | Dock เลื่อนเข้าจากขอบตามตำแหน่งที่ผู้ใช้เลือก |

กติกา
- ผู้ใช้ที่เปิด `prefers-reduced-motion: reduce` จะข้าม intro ทั้งหมด
- โลโก้และ dock ถูกซ่อนด้วย CSS ตั้งแต่ก่อน hydrate (`html:not([data-intro-done])`) ไม่ให้เห็นกะพริบ
- เมื่อจบ ระบบตั้ง `data-intro-done` และล้าง inline style ที่ GSAP ใส่ไว้

---

## 8. Motion

เครื่องมืออยู่ใน [hooks/animation](src/hooks/animation/index.ts) เรียกผ่าน `useAnimation(ref, effect, options)`

| Effect | หน้าที่ |
|---|---|
| `magnify` | ขยายรายการตามระยะเมาส์ (dock) |
| `ringMarquee` | วงแหวนข้อความหมุนรอบตัวละคร |
| `stretchText` | ยืดตัวอักษรตามเมาส์ สลับชุด face (ตอนนี้ปิดใช้ชั่วคราวใน welcome) |

กติกา: ทุก animation ต้องเคารพ `prefers-reduced-motion` ใช้ GSAP ผ่าน `useGSAP` เพื่อให้ cleanup อัตโนมัติ

---

## 9. i18n

- Locale: `en` (default), `th` ตั้งใน [i18n/routing.ts](src/i18n/routing.ts)
- `localePrefix: 'as-needed'` → อังกฤษ `/about` ไทย `/th/about`
- ข้อความ UI อยู่ใน [messages/en.json](messages/en.json) และ [messages/th.json](messages/th.json)
- เนื้อหาจาก DB ใช้คอลัมน์ `_en` / `_th` ถ้าไม่มีฉบับไทยให้ fallback เป็นอังกฤษ ([queries.ts](src/libs/supabase/queries.ts))

---

## 10. วางแผน (ยังไม่ทำ)

> ส่วนนี้เป็นทิศทาง ไม่ใช่ spec ที่ตกลงแล้ว ปรับได้เมื่อเริ่มทำ

### Window system
เมื่อกด Projects / Blog / Contact ใน dock ให้เปิดเป็นหน้าต่างลอยบน desktop แทนการเปลี่ยนหน้า

- Title bar พร้อมปุ่มปิด และชื่อหน้าต่าง
- ใช้กรอบสไตล์เดียวกับ dock (`border-4`, `rounded-3xl`, เงานุ่ม)
- เนื้อหา scroll ภายในหน้าต่าง
- เปิดด้วย GSAP (scale + fade) เคารพ `prefers-reduced-motion`
- ควรคง URL ไว้ (route หรือ query) เพื่อแชร์ลิงก์ตรงไปยัง project/โพสต์ได้

### Content views
| หน้าต่าง | ข้อมูล | รูปแบบ |
|---|---|---|
| Projects | `projects` | grid ของการ์ด (ปก, ชื่อ, tech stack), `is_featured` ขึ้นก่อน |
| Achievements | `achievements` | แยก tab ตาม `kind` (certificate / trophy) |
| Blog | `posts` | รายการ + หน้าอ่าน render markdown, กรองตาม `tags` |
| Contact | `contacts` | รายการลิงก์พร้อมไอคอนตาม `icon` |

### อื่น ๆ
- ปุ่มสลับธีม light/dark และ locale en/th (ใน dock หรือ menu bar)
- ปุ่มเลือกตำแหน่ง dock (ตอนนี้อ่านจาก localStorage เท่านั้น ยังไม่มี UI)
- Dock item ให้ใช้ข้อมูลจาก `contacts` แทน hardcode
- Empty / loading / error state ของแต่ละหน้าต่าง (ใช้ cache ของ Next.js ถ้า DB ช้า)

---

## 11. Accessibility

- `prefers-reduced-motion` ต้องข้าม animation ทั้งหมด (intro ทำแล้ว)
- องค์ประกอบตกแต่ง (ring, overlay, intro logo, เส้นคั่นใน dock) ใช้ `aria-hidden`
- รูปที่มีความหมายต้องมี `alt` (ตัวละคร, โลโก้ทำแล้ว)
- Dock item ที่เป็นแค่ไอคอนต้องมี accessible name (`aria-label`) และโฟกัสด้วยคีย์บอร์ดได้ — **ยังไม่ทำ** ตอนนี้ `<li>` ยังคลิกอย่างเดียว
- คอนทราสต์: ตัวอักษร `--foreground` บน `--background` ผ่านทั้งสองธีม ส่วนข้อความบน ring (`neutral-50` บน `neutral-900`) ผ่านเช่นกัน

---

## 12. โครงสร้างไฟล์ที่เกี่ยวกับดีไซน์

```
src/
├─ app/
│  ├─ globals.css            tokens, frame, decoration
│  └─ [locale]/layout.tsx    fonts, providers
├─ components/
│  ├─ ui/                    navbar, welcome, intro, logo
│  ├─ nav/nav-provider.tsx   ตำแหน่ง dock
│  └─ theme/theme-provider.tsx
├─ constants/                navbar, welcome, storage
├─ hooks/animation/          magnify, ring-marquee, stretch-text
└─ libs/font/                ฟอนต์และการเลือกตาม locale
```
