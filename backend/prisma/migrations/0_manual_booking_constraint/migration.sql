-- إضافة ملحق btree_gist لدعم قيود الاستبعاد
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- منع الحجز المزدوج (Overlap) على مستوى قاعدة البيانات
ALTER TABLE "Booking"
ADD CONSTRAINT no_overlapping_bookings
EXCLUDE USING gist (
  "listingId" WITH =,
  tstzrange("startDate", "endDate", '[)') WITH &&
) WHERE (status IN ('pending', 'confirmed'));
