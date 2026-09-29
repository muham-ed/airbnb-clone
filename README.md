# 🏡 Airbnb Clone — Production-Ready Full-Stack Platform & Smart Booking OS

[![Backend Build](https://img.shields.io/badge/Backend-Node.js%20%7C%20TypeScript%20%7C%20Express-blue)](https://github.com/muham-ed/airbnb-clone)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20%7C%20Prisma%20ORM-green)](https://github.com/muham-ed/airbnb-clone)
[![Cache](https://img.shields.io/badge/Cache-Redis-red)](https://github.com/muham-ed/airbnb-clone)
[![Mobile](https://img.shields.io/badge/Mobile-Flutter%20%7C%20Dart-cyan)](https://github.com/muham-ed/airbnb-clone)
[![Admin Dashboard](https://img.shields.io/badge/Admin-React%2018%20%7C%20Vite%20%7C%20Tailwind-purple)](https://github.com/muham-ed/airbnb-clone)
[![Tests](https://img.shields.io/badge/Tests-Vitest%20%7C%20Passed-brightgreen)](https://github.com/muham-ed/airbnb-clone)

منصة متكاملة ومحاكاة لموقع وتطبيق **Airbnb** مصممة بمعايير هندسية متقدمة (Modular Monolith) ومخصصة للعروض التنافسية والإنتاج الفعلي.

---

## 🌟 أبرز المميزات ونقاط الإبهار الهندسي (Key Features & Highlights)

### 1. 🛡️ الوقاية التامة من الحجز المزدوج (Database-Level Overbooking Prevention)
تم استخدام **PostgreSQL Exclusion Constraints** لتطبيق حماية هندسية صارمة على مستوى محرك قاعدة البيانات نفسه لمنع تداخل التواريخ لنفس العقار حتى في حالات الضغط المرتفع والطلبات المتزامنة:
```sql
ALTER TABLE "Booking" ADD CONSTRAINT "no_overlapping_bookings"
EXCLUDE USING gist (
  "listingId" WITH =,
  tstzrange("startDate", "endDate", '[)') WITH &&
) WHERE (status IN ('pending', 'confirmed'));
```

### 2. 📱 تطبيق جوال متكامل بـ Flutter (Mobile App - Guest & Host Modes)
- **وضع الضيف (Guest Mode):** تصفح العقارات، البحث الجغرافي اللحظي، اختيار تواريخ الإقامة تفاعلياً (`Interactive DateRangePicker`)، حساب التكلفة تلقائياً، والتواصل المباشر مع المضيف (`Contact Host`).
- **الفاتورة الذكية (Smart Receipts & PDF):** إصدار فاتورة حجز رسمية مزودة بكود **QR Code** تفاعلي للتحقق عند الوصول مع خيار تحميل الفاتورة بـ PDF.
- **وضع المضيف (Host Mode):** إضافة عقار جديد مباشرة من التطبيق (`Add Listing`) وتحديد السعر والمرافق والسعة وإدارة العقارات المعروضة (`My Listings`).
- **أداء فائق للإنتاج:** بناء نسخة **`app-release.apk`** مضغوطة فائقة السرعة والانسيابية مع السماح بتصوير الشاشة والفيديو أثناء التقديم.

### 3. 📊 لوحة تحكم الإدارة (React 18 Admin Dashboard)
- رؤية حية ومؤشرات إحصائية للحجوزات والأرباح والمستخدمين.
- إدارة المستخدمين وحظر/فك حظر الحسابات المخالفة (`Ban / Unban`).
- مراجعة واعتماد العقارات الجديدة قبل نشرها.

### 4. 📍 محرك بحث جغرافي دقيق (Haversine Distance Query)
حساب المسافات الجغرافية المباشرة بالكيلومتر بناءً على الإحداثيات (`Latitude / Longitude`) والنطاق المطلوب.

---

## 📐 هيكل وتنزيل المشروع الكامل (Project Folder Tree)

```text
airbnb-clone/
├── README.md                           # ملف التوثيق الشامل والرئيسي للمشروع
├── docs/
│   └── API.md                          # توثيق الـ RESTful APIs ومخطط المسارات
├── infrastructure/                     # إعدادات الحاويات والبيئة
│   └── docker-compose.yml              # تشغيل PostgreSQL و Redis محلياً
│
├── backend/                            # خادم التطبيق (Node.js / Express / TypeScript)
│   ├── prisma/
│   │   ├── schema.prisma               # مخطط قاعدة البيانات والنماذج
│   │   ├── seed.ts                     # سكربت تغذية البيانات الغنية للـ Demo
│   │   └── migrations/                 # ترحيلات SQL والـ Exclusion Constraints
│   └── src/
│       ├── server.ts                   # نقطة انطلاق السيرفر
│       ├── app.ts                      # إعداد مسارات Express و CORS والـ Rate Limiters
│       ├── modules/                    # الوحدات المستقلة (Modular Monolith)
│       │   ├── auth/                   # المصادقة بـ JWT و Refresh Token
│       │   ├── users/                  # إدارة الملف الشخصي وصلاحيات الأدمن
│       │   ├── listings/               # العقارات والبحث الجغرافي
│       │   ├── bookings/               # الحجوزات والوقاية من التداخل
│       │   │   └── __tests__/          # اختبارات الوحدة بـ Vitest
│       │   ├── payments/               # المدفوعات و Stripe Checkout Webhooks
│       │   ├── reviews/                # التقييمات والمراجعات
│       │   └── wishlists/              # قوائم المفضلات
│       └── shared/                     # المكونات المشتركة
│
├── mobile/                             # تطبيق الجوال (Flutter / Dart)
│   ├── pubspec.yaml                    # الحزم وأيقونة التطبيق الرسمية
│   ├── build/app/outputs/flutter-apk/
│   │   └── app-release.apk             # النسخة النهائية المحدثة الجاهزة للتثبيت
│   └── lib/
│       ├── main.dart
│       ├── models/                     # نماذج البيانات (Listing, Booking, User)
│       ├── providers/                  # إدارة الحالة بـ Provider
│       └── screens/                    # الشاشات
│           ├── splash_screen.dart      # شاشة البداية الاحترافية
│           ├── home/home_screen.dart   # شاشة البحث والاستكشاف
│           ├── listings/               # تفاصيل العقار وإضافة عقار جديد
│           ├── bookings/               # حجوزات الضيف وإصدار الفواتير
│           └── profile/                # الملف الشخصي وإدارة عقارات المضيف
│
└── admin-dashboard/                    # لوحة تحكم الإدارة (React 18 / Vite / Tailwind)
    ├── vite.config.js                  # إعدادات بناء Vite والربط
    └── src/
        ├── pages/                      # صفحات Dashboard, Users, Listings, Bookings
        └── components/                 # شريط التنقل والمكونات
```

---

## ⚡ كيفية التشغيل والربط السريع (Quick Start)

### 1️⃣ تشغيل السيرفر وقاعدة البيانات (Backend):
```bash
cd backend
npm install
npx prisma migrate deploy
npm run prisma:seed
npm run dev
```
*السيرفر يعمل على: `http://localhost:5000`*

### 2️⃣ تشغيل لوحة تحكم الأدمن (Admin Dashboard):
```bash
cd admin-dashboard
npm install
npm run dev
```
*اللوحة تعمل على: `http://localhost:3000`*

### 3️⃣ تشغيل تطبيق الموبايل / الويب (Flutter):
```bash
cd mobile
flutter pub get
flutter run -d chrome
```
*أو تثبيت النسخة المباشرة على هاتفك الأندرويد من:*  
`mobile/build/app/outputs/flutter-apk/app-release.apk`

---

## 🔑 بيانات الاعتماد للتجربة والعرض (Demo Credentials)

| الرتبة (Role) | البريد الإلكتروني | كلمة المرور |
| :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `password123` |
| **Host** | `host@example.com` | `password123` |
| **Guest** | `guest@example.com` | `password123` |

---

## 🧪 تشغيل الاختبارات الآلية (Testing)
اختبار وحدة الحجوزات والتحقق من منع التداخل الحسابي:
```bash
cd backend
npm test
```

---

🔗 **رابط المستودع على GitHub:** [https://github.com/muham-ed/airbnb-clone](https://github.com/muham-ed/airbnb-clone)
