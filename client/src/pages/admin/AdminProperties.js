import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = search ? `?search=${encodeURIComponent(search)}` : '';
      const { data } = await api.get(`/admin/properties${params}`);
      setProperties(data.data);
    } catch { toast.error('Error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProperties(); }, []);

  const handleApprove = async (id) => {
    try {
      await api.patch(`/admin/properties/${id}/approve`);
      setProperties(properties.map((p) => p._id === id ? { ...p, isApproved: !p.isApproved } : p));
      toast.success('Updated');
    } catch { toast.error('Error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property?')) return;
    try {
      await api.delete(`/admin/properties/${id}`);
      setProperties(properties.filter((p) => p._id !== id));
      toast.success('Deleted');
    } catch { toast.error('Error'); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-gray-800 mb-6">🏘️ Manage Properties</h1>

      <div className="flex gap-3 mb-6">
        <input type="text" placeholder="Search properties..." value={search}
          onChange={(e) => setSearch(e.target.value)} className="input text-sm max-w-xs" />
        <button onClick={fetchProperties} className="btn-primary text-sm py-2 px-4">Search</button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="space-y-3">
          {properties.map((p) => (
            <div key={p._id} className="card p-4 flex gap-4 items-start">
              <img
                src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=100'}
                alt={p.title}
                className="w-20 h-16 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <Link to={`/properties/${p._id}`} className="font-semibold text-gray-800 hover:text-primary-600 text-sm">{p.title}</Link>
                    <p className="text-xs text-gray-500 mt-0.5">Owner: {p.owner?.name} ({p.owner?.email}) | ₹{p.price?.toLocaleString()}/mo | {p.type}</p>
                    <div className="flex gap-2 mt-1.5">
                      <span className={`badge text-xs ${p.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {p.isApproved ? '✅ Approved' : '⏳ Pending'}
                      </span>
                      <span className={`badge text-xs ${p.isAvailable ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                        {p.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => handleApprove(p._id)}
                      className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${p.isApproved ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}>
                      {p.isApproved ? 'Unapprove' : 'Approve'}
                    </button>
                    <button onClick={() => handleDelete(p._id)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {properties.length === 0 && <div className="text-center py-10 text-gray-400 text-sm">No properties found</div>}
        </div>
      )}
    </div>
  );
};

export default AdminProperties;
