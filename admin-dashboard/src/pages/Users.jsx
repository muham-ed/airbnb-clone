import { useState, useEffect } from 'react';
import api from '../services/api';
import { UserCheck, UserX, Shield, Ban } from 'lucide-react';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data.data.users || []);
    } catch (err) {
      console.error(err);
      // Fallback to /users/me
      try {
        const meRes = await api.get('/users/me');
        setUsers([meRes.data.data.user]);
      } catch (e) {
        console.error(e);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBan = async (userId) => {
    try {
      await api.patch(`/users/${userId}/ban`);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isBanned: !u.isBanned } : u))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'حدث خطأ أثناء تعديل حالة الحساب');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">إدارة المستخدمين</h1>
        <p className="text-gray-500 text-sm mt-1">عرض وتجميد وإدارة حسابات المستخدمين والمضيفين</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">جاري التحميل...</div>
        ) : (
          <table className="w-full text-right">
            <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">المستخدم</th>
                <th className="px-6 py-4">البريد الإلكتروني</th>
                <th className="px-6 py-4">الرتبة / الدور</th>
                <th className="px-6 py-4">الحالة</th>
                <th className="px-6 py-4">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                      {u.name?.[0] || 'U'}
                    </div>
                    {u.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600">
                      <Shield size={12} />
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {u.isBanned ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600">
                        <UserX size={12} />
                        محظور
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600">
                        <UserCheck size={12} />
                        نشط
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleBan(u.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        u.isBanned
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      <Ban size={14} />
                      {u.isBanned ? 'إلغاء الحظر' : 'حظر الحساب'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
