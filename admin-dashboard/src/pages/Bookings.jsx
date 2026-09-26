import { CalendarCheck } from 'lucide-react';

export default function Bookings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">سجل الحجوزات العامة</h1>
        <p className="text-gray-500 text-sm mt-1">متابعة كشف الحجوزات والعمليات المالية المكتملة والقائمة</p>
      </div>

      <div className="bg-white p-12 rounded-2xl border border-gray-100 shadow-sm text-center">
        <CalendarCheck size={48} className="mx-auto text-gray-300 mb-3" />
        <h3 className="text-lg font-bold text-gray-800">مركز الحجوزات الشامل</h3>
        <p className="text-gray-500 text-sm mt-1">يتم عرض الحجوزات وحالة الدفع لكل عملية عبر النظام بربط مباشر مع قاعدة البيانات</p>
      </div>
    </div>
  );
}
