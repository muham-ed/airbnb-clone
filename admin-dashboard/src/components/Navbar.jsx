import { useAuth } from '../context/AuthContext';
import { Bell, Shield } from 'lucide-react';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Shield className="text-primary" size={24} />
        <span className="font-bold text-gray-800 text-lg">نظام الإدارة المركزية</span>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-gray-500 hover:text-gray-700">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 border-r pr-6 border-gray-200">
          <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-700">
            {user?.name?.[0] || 'A'}
          </div>
          <div>
            <p className="font-bold text-sm text-gray-800">{user?.name || 'الأدمن'}</p>
            <p className="text-xs text-gray-500">{user?.role || 'ADMIN'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
