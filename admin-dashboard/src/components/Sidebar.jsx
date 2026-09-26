import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Home, CalendarCheck, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { logout } = useAuth();

  const navItems = [
    { name: 'الرئيسية', path: '/', icon: LayoutDashboard },
    { name: 'المستخدمين', path: '/users', icon: Users },
    { name: 'العقارات', path: '/listings', icon: Home },
    { name: 'الحجوزات', path: '/bookings', icon: CalendarCheck },
  ];

  return (
    <div className="w-64 bg-white border-l border-gray-200 min-h-screen flex flex-col justify-between p-4">
      <div>
        <div className="flex items-center gap-3 px-4 py-3 mb-6">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">
            A
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-900">Airbnb Admin</h1>
            <p className="text-xs text-gray-500">لوحة التحكم للإدارة</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm ${
                    isActive
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <button
        onClick={logout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium text-sm w-full"
      >
        <LogOut size={20} />
        <span>تسجيل الخروج</span>
      </button>
    </div>
  );
}
