/**
 * Owner Dashboard - Fully Responsive
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const OwnerDashboard = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    try {
      const { data } = await api.get('/properties/my-listings');
      setListings(data.data);
    } catch { toast.error('Error loading listings'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchListings(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property?')) return;
    try {
      await api.delete(`/properties/${id}`);
      setListings(listings.filter(p => p._id !== id));
      toast.success('Property deleted');
    } catch { toast.error('Error'); }
  };

  const handleToggle = async (id, current) => {
    try {
      await api.put(`/properties/${id}`, { isAvailable: !current });
      setListings(listings.map(p => p._id === id ? { ...p, isAvailable: !current } : p));
      toast.success(`Marked as ${!current ? 'available' : 'unavailable'}`);
    } catch { toast.error('Error'); }
  };

  const stats = {
    total: listings.length,
    available: listings.filter(p => p.isAvailable).length,
    views: listings.reduce((s, p) => s + (p.views || 0), 0),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <h1 className="font-display text-xl sm:text-2xl font-bold text-gray-800">🏠 My Listings</h1>
        <Link to="/dashboard/add-property" className="btn-primary text-xs sm:text-sm py-2 px-3 sm:px-4">
          + Add Property
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[
          { label: 'Total', value: stats.total, icon: '🏘️', color: 'text-primary-700' },
          { label: 'Available', value: stats.available, icon: '✅', color: 'text-green-700' },
          { label: 'Views', value: stats.views, icon: '👁️', color: 'text-blue-700' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="card p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl mb-1">{icon}</div>
            <div className={`text-xl sm:text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : listings.length === 0 ? (
        <div className="text-center py-16 sm:py-20 card p-8 sm:p-10">
          <p className="text-4xl sm:text-5xl mb-4">🏚️</p>
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">No properties listed yet</h3>
          <p className="text-gray-500 text-xs sm:text-sm mb-6">Start listing your property to reach thousands of students</p>
          <Link to="/dashboard/add-property" className="btn-primary text-sm">Add Your First Property</Link>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {listings.map((p) => (
            <div key={p._id} className="card p-3 sm:p-5">
              <div className="flex gap-3 sm:gap-4">
                <img
                  src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=200'}
                  alt={p.title}
                  className="w-20 h-16 sm:w-24 sm:h-20 rounded-xl object-cover flex-shrink-0"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 text-xs sm:text-sm truncate mb-0.5">{p.title}</h3>
                  <p className="text-xs text-gray-500 truncate">
                    📍 {p.address?.city} · ₹{p.price?.toLocaleString()}/mo · {p.type}
                  </p>

                  {/* Badges */}
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    <span className={`badge text-xs ${p.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {p.isAvailable ? '✅ Available' : '❌ Unavailable'}
                    </span>
                    <span className="badge bg-gray-100 text-gray-600 text-xs">👁 {p.views || 0}</span>
                    <span className="badge bg-yellow-100 text-yellow-700 text-xs">⭐ {p.ratings?.average?.toFixed(1) || '0.0'}</span>
                  </div>

                  {/* Actions - wraps on mobile */}
                  <div className="flex gap-1.5 sm:gap-2 mt-2.5 flex-wrap">
                    <Link to={`/properties/${p._id}`}
                      className="text-xs px-2.5 sm:px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors">
                      View
                    </Link>
                    <Link to={`/dashboard/edit/${p._id}`}
                      className="text-xs px-2.5 sm:px-3 py-1.5 rounded-lg bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors">
                      Edit
                    </Link>
                    <button onClick={() => handleToggle(p._id, p.isAvailable)}
                      className="text-xs px-2.5 sm:px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                      {p.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                    </button>
                    <button onClick={() => handleDelete(p._id)}
                      className="text-xs px-2.5 sm:px-3 py-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
