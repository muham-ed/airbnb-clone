import { Users, Home, CalendarCheck, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { title: 'إجمالي إيرادات النظام', value: '$12,450', icon: DollarSign, color: 'bg-green-500' },
    { title: 'إجمالي العقارات', value: '48', icon: Home, color: 'bg-blue-500' },
    { title: 'إجمالي الحجوزات', value: '124', icon: CalendarCheck, color: 'bg-purple-500' },
    { title: 'المستخدمين المسجلين', value: '310', icon: Users, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">نظرة عامة على النظام</h1>
        <p className="text-gray-500 text-sm mt-1">مؤشرات الأداء والإحصائيات الحية للمنصة</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className={`${stat.color} text-white p-3.5 rounded-xl`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-xs font-semibold">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">نشاط النظام الأخير</h2>
        <div className="divide-y divide-gray-100">
          <div className="py-3 flex items-center justify-between text-sm">
            <span className="text-gray-700">تم تسجيل حجز جديد #B-1092</span>
            <span className="text-gray-400 text-xs">منذ 5 دقائق</span>
          </div>
          <div className="py-3 flex items-center justify-between text-sm">
            <span className="text-gray-700">قام المضيف "محمد" بإضافة عقار جديد "شقة فاخرة على البحر"</span>
            <span className="text-gray-400 text-xs">منذ 15 دقيقة</span>
          </div>
          <div className="py-3 flex items-center justify-between text-sm">
            <span className="text-gray-700">انضم مستخدم جديد "أحمد علي"</span>
            <span className="text-gray-400 text-xs">منذ ساعة</span>
          </div>
        </div>
      </div>
    </div>
  );
}
