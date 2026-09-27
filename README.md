# 🏡 Airbnb Clone — Full-Stack Modular Monolith Application

تطبيق متكامل محاكي لنظام **Airbnb** مصمم بهيكلية معمارية حديثة لمنافسات ومسابقات البرمجيات. يتكون المشروع من ثلاث طبقات رئيسية: **Backend API (Node.js/TypeScript)**، **تطبيق الهواتف الذكية (Flutter)**، و**لوحة تحكم الإدارة (React/Vite)**.

---

## 🌟 الهيكلية والمعمارية (Architecture)

* **Backend (`/backend`)**:
  * **التقنيات**: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, Redis, Docker, Stripe, Cloudinary, Multer, Zod.
  * **النمط**: Modular Monolith Architecture.
  * **الأمان**: JWT Access/Refresh Tokens في Redis، تشفير كلمات المرور بـ bcryptjs، حماية Headers بـ Helmet، حماية ضد SQL Injection و IDOR.
  * **المميزات المعقدة**:
    * البحث الجغرافي بالأبعاد `Lat/Lng` ودرجة النطاق `Radius` (صيغة Haversine).
    * منع تداخل الحجوزات بنفس التواريخ باستخدام **PostgreSQL Exclusion Constraints** و **Serializable Isolation Transactions**.
    * المعالجة الآمنة للمدفوعات بـ Stripe Checkout + Webhook Idempotency.

* **Mobile App (`/mobile`)**:
  * **التقنيات**: Flutter, Dart, Provider State Management, Material 3, Cairo Font.
  * **الشاشات**: استكشاف العقارات والبحث الجغرافي، تفاصيل العقار، إدارة الحجوزات، المفضلات، الملف الشخصي وتعديل البيانات.

* **Admin Dashboard (`/admin-dashboard`)**:
  * **التقنيات**: React 18, Vite, Tailwind CSS, Lucide Icons, Axios.
  * **اللوحة**: مؤشرات الأداء والإيرادات، إدارة وتجميد حسابات المستخدمين (Ban/Unban)، مراجعة وقبول العقارات (Approve/Reject Listing)، وسجل الحجوزات.

---

## 🚀 كيفية التشغيل المباشر (Quick Start for Judges)

### 1. تشغيل البنية التحتية والـ Backend
```bash
# 1. تشغيل قاعدة البيانات و Redis
cd infrastructure
docker-compose up -d

# 2. تشغيل السيرفر وتغذية البيانات
cd ../backend
npm install
npx prisma migrate dev
npm run prisma:seed
npm run dev
```

### 2. تشغيل تطبيق الهاتف (Flutter)
```bash
cd mobile
flutter pub get
flutter run
```

### 3. تشغيل لوحة تحكم الأدمن (React)
```bash
cd admin-dashboard
npm install
npm run dev
```

---

## 🔑 بيانات الاعتماد النموذجية (Demo / Seed Credentials)

| الرتبة (Role) | البريد الإلكتروني (Email) | كلمة المرور (Password) |
| :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `password123` |
| **Host** | `host@example.com` | `password123` |
| **Guest** | `guest@example.com` | `password123` |

---

## 🛡️ اختبار البناء والنوع (Build Check)
تم اختبار واجتياز البناء لكافة الطبقات بنجاح:
```bash
cd backend && npm run build
```
