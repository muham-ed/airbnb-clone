# Airbnb Clone Backend - Modular Monolith

## 🚀 التقنيات المستخدمة
- **Node.js** (Express)
- **TypeScript**
- **Prisma** (PostgreSQL)
- **Redis** (Caching & Refresh Tokens)
- **Docker** (Infrastructure)
- **Cloudinary** (Image Uploads)

## 🛠️ كيفية التشغيل
1. تأكد من تشغيل Docker Desktop.
2. ادخل لمجلد `infrastructure` وشغل: `docker-compose up -d`.
3. ادخل لمجلد `backend` ونفذ:
   - `npm install`
   - `npx prisma migrate dev`
   - `npm run dev`

## 🔒 الأمان
- استخدام `Helmet` لحماية رؤوس HTTP.
- تشفير كلمات المرور باستخدام `bcryptjs`.
- نظام JWT مع `Refresh Tokens` مخزنة في Redis.
