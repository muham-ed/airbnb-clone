# 🏡 Airbnb Clone — Production-Ready Full-Stack Platform

[![Backend Build](https://img.shields.io/badge/Backend-Node.js%20%7C%20TypeScript%20%7C%20Express-blue)](https://github.com/muham-ed/airbnb-clone)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20%7C%20Prisma%20ORM-green)](https://github.com/muham-ed/airbnb-clone)
[![Cache](https://img.shields.io/badge/Cache-Redis-red)](https://github.com/muham-ed/airbnb-clone)
[![Mobile](https://img.shields.io/badge/Mobile-Flutter%20%7C%20Dart-cyan)](https://github.com/muham-ed/airbnb-clone)
[![Admin Dashboard](https://img.shields.io/badge/Admin-React%20%7C%20Vite%20%7C%20Tailwind-purple)](https://github.com/muham-ed/airbnb-clone)

منصة متكاملة ومحاكاة لـ **Airbnb** مبنية بمعايير هندسية متقدمة ونمط معمارية **Modular Monolith** مخصصة للعروض التنافسية والإنتاج الفعلي.

---

## 📐 هيكل وتنزيل المشروع الكامل (Project Folder Tree)

```text
airbnb-clone/
├── README.md                           # ملف التوثيق الشامل والرئيسي للمشروع
├── .gitignore                          # إعدادات تجاهل ملفات Git
│
├── infrastructure/                     # إعدادات البنية التحتية والبيئة الحاوية
│   └── docker-compose.yml              # تشغيل PostgreSQL و Redis محلياً
│
├── backend/                            # خادم التطبيق الرئيسي (Node.js / Express / TypeScript)
│   ├── README.md                       # توثيق خاص بالخادم
│   ├── package.json                    # حزم واعتمدات Node.js
│   ├── tsconfig.json                   # إعدادات مترجم TypeScript
│   ├── Dockerfile                      # حاوية تشغيل الـ Backend
│   ├── prisma/
│   │   ├── schema.prisma               # مخطط قاعدة البيانات والنماذج (35+ Entities & Enums)
│   │   ├── seed.ts                     # سكربت تغذية البيانات النموذجية للـ Demo
│   │   └── migrations/                 # ترحيلات SQL والـ Exclusion Constraints
│   └── src/
│       ├── server.ts                   # نقطة انطلاق السيرفر والاستماع للمنافذ
│       ├── app.ts                      # إعداد مسارات Express و Middlewares والـ Rate Limiters
│       ├── modules/                    # الوحدات المستقلة (Modular Monolith Architecture)
│       │   ├── auth/                   # وحدة المصادقة وإدارة الجلسات بـ Redis
│       │   │   ├── auth.controller.ts
│       │   │   ├── auth.routes.ts
│       │   │   ├── auth.schema.ts
│       │   │   ├── auth.service.ts
│       │   │   └── refresh-token.service.ts
│       │   ├── users/                  # وحدة الملف الشخصي والتحكم بـ Admin (Ban/Unban)
│       │   │   ├── users.controller.ts
│       │   │   ├── users.routes.ts
│       │   │   ├── users.schema.ts
│       │   │   └── users.service.ts
│       │   ├── listings/               # وحدة العقارات والبحث الجغرافي بالـ Lat/Lng
│       │   │   ├── listings.controller.ts
│       │   │   ├── listings.routes.ts
│       │   │   ├── listings.schema.ts
│       │   │   └── listings.service.ts
│       │   ├── bookings/               # وحدة الحجوزات والتعامل مع منع التداخل
│       │   │   ├── bookings.controller.ts
│       │   │   ├── bookings.routes.ts
│       │   │   ├── bookings.schema.ts
│       │   │   └── bookings.service.ts
│       │   ├── payments/               # وحدة المدفوعات مع Stripe Checkout و Webhooks
│       │   │   ├── payments.controller.ts
│       │   │   ├── payments.routes.ts
│       │   │   └── payments.service.ts
│       │   ├── reviews/                # وحدة التقييمات والمراجعات
│       │   │   ├── reviews.controller.ts
│       │   │   ├── reviews.routes.ts
│       │   │   ├── reviews.schema.ts
│       │   │   └── reviews.service.ts
│       │   ├── wishlists/              # وحدة المفضلات وقوائم العقارات المخصصة
│       │   │   ├── wishlists.controller.ts
│       │   │   ├── wishlists.routes.ts
│       │   │   ├── wishlists.schema.ts
│       │   │   └── wishlists.service.ts
│       │   └── upload/                 # وحدة رفع الصور مع Multer و Cloudinary
│       │       ├── upload.controller.ts
│       │       └── upload.routes.ts
│       └── shared/                     # المكونات المتبادلة والوسائط
│           ├── config/
│           │   ├── database.ts         # الاتصال بـ Prisma Client
│           │   └── cloudinary.ts       # إعدادات رفع الملفات لـ Cloudinary
│           ├── middleware/
│           │   ├── auth.middleware.ts  # التحقق من توكن JWT والأدوار (protect / restrictTo)
│           │   ├── error.middleware.ts # معالج الأخطاء المركزي (Global Error Handler)
│           │   └── validate.middleware.ts # وسيط التحقق من المدخلات عبر Zod
│           └── utils/
│               └── app-error.ts        # فئة استثناء الأخطاء المخصصة
│
├── mobile/                             # تطبيق الجوال الذكي (Flutter / Dart)
│   ├── pubspec.yaml                    # حزم واعتمدات Flutter
│   └── lib/
│       ├── main.dart                   # نقطة انطلاق التطبيق وإعداد المزودات
│       ├── core/
│       │   ├── config/
│       │   │   └── api_config.dart     # إعدادات روابط الـ API والـ Base URL
│       │   └── services/
│       │       └── api_service.dart    # محرك طلبات HTTP وإرسال Authorization Header
│       ├── models/
│       │   ├── user_model.dart         # نموذج بيانات المستخدم
│       │   ├── listing_model.dart      # نموذج بيانات العقارات
│       │   └── booking_model.dart      # نموذج بيانات الحجوزات
│       ├── providers/                  # إدارة الحالة بـ Provider
│       │   ├── auth_provider.dart      # إدارة الجلسة والدخول والخروج
│       │   ├── listing_provider.dart   # إدارة العقارات والبحث والفلترة
│       │   └── booking_provider.dart   # إدارة وتحديث الحجوزات
│       └── screens/                    # الشاشات الواجهات
│           ├── splash_screen.dart      # شاشة التحقق الآلي البداية
│           ├── main_navigation_screen.dart # شاشة التنقل بالشريط السفلي
│           ├── auth/                   # شاشات التسجيل والدخول
│           │   ├── login_screen.dart
│           │   └── register_screen.dart
│           ├── home/                   # شاشة الاستكشاف والبحث الرئيسية
│           │   └── home_screen.dart
│           ├── listings/               # شاشة تفاصيل العقارات للحجز
│           │   └── listing_detail_screen.dart
│           ├── bookings/               # شاشة عرض حجوزات الضيف
│           │   └── my_bookings_screen.dart
│           ├── wishlists/              # شاشة المفضلات
│           │   └── wishlists_screen.dart
│           └── profile/                # شاشة الملف الشخصي والتعديل
│               ├── profile_screen.dart
│               └── edit_profile_screen.dart
│
└── admin-dashboard/                    # لوحة تحكم الإدارة (React 18 / Vite / Tailwind)
    ├── package.json                    # اعتمادات React و Tailwind و Lucide Icons
    ├── vite.config.js                  # إعدادات بناء Vite
    ├── tailwind.config.js              # إعدادات الألوان والمظهر
    ├── index.html                      # الصفحة الرئيسية للوحة
    └── src/
        ├── main.jsx                    # نقطة الانطلاق والربط بـ Router
        ├── App.jsx                     # إعداد المسارات المحمية
        ├── index.css                   # تنسيقات Tailwind
        ├── context/
        │   └── AuthContext.jsx         # سياق إدارة جلسة الأدمن
        ├── services/
        │   └── api.js                  # إعدادات معالج Axios للطلبات
        ├── components/                 # المكونات الهيكلية
        │   ├── Navbar.jsx              # الشريط العلوي للإدارة
        │   └── Sidebar.jsx             # الشريط الجانبي للتنقل
        └── pages/                      # صفحات التحكم
            ├── Login.jsx               # دخول الأدمن
            ├── Dashboard.jsx           # شاشة الإحصائيات والمؤشرات
            ├── Users.jsx               # إدارة المستخدمين والحظر (Ban/Unban)
            ├── Listings.jsx            # مراجعة وقبول/تعليق العقارات (Approve/Reject)
            └── Bookings.jsx            # كشف الحجوزات والعمليات
```

---

## 🛠️ التقنيات والميزات الهندسية المميزة

### 1. منع التداخل الحسابي في الحجوزات (Double Booking Prevention)
* تم استخدام **PostgreSQL Exclusion Constraints** لتطبيق حماية هندسية على مستوى محرك قاعدة البيانات لمنع تداخل الحجوزات لنفس العقار برمز SQL المخصص:
  ```sql
  ALTER TABLE "Booking" ADD CONSTRAINT "no_overlapping_bookings"
  EXCLUDE USING gist (
    "listingId" WITH =,
    tstzrange("startDate", "endDate", '[)') WITH &&
  ) WHERE (status IN ('pending', 'confirmed'));
  ```
* معالجة العمليات عبر **Prisma Transactions** بدرجة عزوف `Serializable`.

### 2. البحث الجغرافي بالأبعاد والنطاق (Geospatial Haversine Query)
* حساب المسافات الجغرافية المباشرة بالكيلومتر بين نقطة الضيف والعقارات المتاحة باستخدام معادلة **Haversine**:
  ```sql
  SELECT *, (6371 * acos(cos(radians($lat)) * cos(radians(latitude)) * cos(radians(longitude) - radians($lng)) + sin(radians($lat)) * sin(radians(latitude)))) AS distance
  FROM "Listing"
  HAVING distance <= $radius
  ORDER BY distance ASC;
  ```

### 3. نظام أمان وجلسات آمن (Security Architecture)
* **Refresh Tokens** مخزنة وموثقة في **Redis** لسرعة التحقق والتأمين ضد الاختراق.
* **Rate Limiting** بـ `express-rate-limit` لحماية السيرفر من هجمات الـ Brute Force والـ DDoS.
* حماية الـ HTTP Headers بواسطة `Helmet`.

---

## 🚀 كيفية التشغيل والربط الكامل (Quick Start)

### الخطوة 1: تشغيل البنية التحتية والـ Backend
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

### الخطوة 2: تشغيل تطبيق الهاتف (Flutter)
```bash
cd mobile
flutter pub get
flutter run
```

### الخطوة 3: تشغيل لوحة تحكم الأدمن (React)
```bash
cd admin-dashboard
npm install
npm run dev
```

---

## 🔑 بيانات الاعتماد للتجربة والتقديم (Demo Credentials)

| الرتبة (Role) | البريد الإلكتروني | كلمة المرور |
| :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `password123` |
| **Host** | `host@example.com` | `password123` |
| **Guest** | `guest@example.com` | `password123` |

---

## 🧪 اختبار البناء والتوافق (Build Status)
تم التأكد واجتياز اختبار البناء الصارم لكافة ملفات الـ TypeScript بنجاح:
```bash
cd backend
npm run build
```
*(ملاحظة: نتيجة البناء: `Found 0 errors`).*
