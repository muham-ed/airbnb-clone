import { useState, useEffect } from 'react';
import api from '../services/api';
import { Home, MapPin, DollarSign } from 'lucide-react';

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await api.get('/listings');
        setListings(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">إدارة العقارات</h1>
        <p className="text-gray-500 text-sm mt-1">مراجعة وقبول أو تعليق العقارات المنشورة في المنصة</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500 bg-white rounded-2xl">جاري التحميل...</div>
      ) : listings.length === 0 ? (
        <div className="p-8 text-center text-gray-500 bg-white rounded-2xl">لا توجد عقارات متاحة للعرض حالياً</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
              <div>
                <div className="h-48 bg-gray-200 relative">
                  {item.images?.[0] ? (
                    <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <Home size={40} />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{item.title}</h3>
                  <div className="flex items-center gap-1 text-gray-500 text-xs mt-2">
                    <MapPin size={14} />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-primary text-base mt-3">
                    <DollarSign size={16} />
                    <span>{item.price} / ليلة</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
