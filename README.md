# MEK.store - Production Ready System (Next.js + Supabase Auth & Database)

ระบบเว็บขายสคริปต์/ซอฟต์แวร์แบบสมบูรณ์ที่พร้อมนำไปใช้งานจริง มีระบบสมัครสมาชิก ล็อกอิน ฐานข้อมูล และระบบเติมเงิน

## 🛠️ โครงสร้างไฟล์ในโปรเจกต์
```text
mek-store/
├── package.json
├── tailwind.config.js
├── schema.sql              <-- SQL Script สำหรับสร้างตารางใน Supabase
├── .env.example            <-- ตัวอย่างไฟล์ใส่ API Key
├── src/
│   ├── lib/
│   │   └── supabase.ts     <-- ตัวเชื่อมต่อ Supabase Client
│   └── app/
│       ├── login/page.tsx   <-- หน้าเข้าสู่ระบบ
│       ├── register/page.tsx<-- หน้าสมัครสมาชิก
│       ├── api/
│       │   ├── topup/route.ts <-- API เติมเงิน (อัปเดต DB จริง)
│       │   └── buy/route.ts   <-- API สั่งซื้อ (อัปเดต DB จริง)
│       ├── globals.css
│       ├── layout.tsx
│       └── page.tsx         <-- หน้าหลักระบบแบรนด์ MEK.store
└── README.md
```

## 🚀 ขั้นตอนการติดตั้งและเชื่อมต่อฐานข้อมูล

1. **สร้างโปรเจกต์ Supabase ฟรี:**
   - ไปที่เว็บไซต์ [https://supabase.com](https://supabase.com) แล้วสมัครบัญชี
   - กดสร้าง **New Project**

2. **สร้างตารางฐานข้อมูล (Database):**
   - ไปที่เมนู **SQL Editor** ใน Supabase
   - ก๊อปปี้ข้อความทั้งหมดจากไฟล์ `schema.sql` ในโปรเจกต์ ไปวางแล้วกด **Run**

3. **ตั้งค่า API Key:**
   - ไปที่ **Project Settings -> API** ใน Supabase
   - ก๊อปปี้ `URL` และ `anon key`
   - สร้างไฟล์ชื่อ `.env.local` ในโฟลเดอร์โปรเจกต์ แล้วนำค่ามาใส่ตามรูปแบบไฟล์ `.env.example`

4. **ติดตั้งและเปิดใช้งานโปรเจกต์:**
   ```bash
   npm install
   npm run dev
   ```
