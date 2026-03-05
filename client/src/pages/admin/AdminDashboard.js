/**
 * Admin Dashboard - Fully Responsive
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(({ data: d }) => setData(d.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="font-display text-xl sm:text-2xl font-bold text-gray-800 mb-5 sm:mb-6">⚙️ Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[
          { label: 'Total Users', value: data?.stats?.totalUsers, icon: '👥', color: 'bg-blue-50 text-blue-700' },
          { label: 'Students', value: data?.stats?.totalStudents, icon: '🎓', color: 'bg-green-50 text-green-700' },
          { label: 'Owners', value: data?.stats?.totalOwners, icon: '🏠', color: 'bg-purple-50 text-purple-700' },
          { label: 'Properties', value: data?.stats?.totalProperties, icon: '🏘️', color: 'bg-orange-50 text-orange-700' },
          { label: 'Pending', value: data?.stats?.pendingListings, icon: '⏳', color: 'bg-red-50 text-red-700' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className={`card p-3 sm:p-4 text-center ${color}`}>
            <div className="text-xl sm:text-2xl mb-1">{icon}</div>
            <div className="text-xl sm:text-2xl font-bold">{value ?? 0}</div>
            <div className="text-xs opacity-80">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

        {/* Quick Actions */}
        <div className="card p-4 sm:p-6">
          <h3 className="font-semibold text-gray-800 text-sm sm:text-base mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Link to="/admin/users" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-xs sm:text-sm text-gray-700">
              <span className="text-xl">👥</span>
              <div>
                <p className="font-medium">Manage Users</p>
                <p className="text-gray-400 text-xs">Activate or deactivate accounts</p>
              </div>
              <span className="ml-auto text-gray-300">›</span>
            </Link>
            <Link to="/admin/properties" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-xs sm:text-sm text-gray-700">
              <span className="text-xl">🏘️</span>
              <div>
                <p className="font-medium">Manage Properties</p>
                <p className="text-gray-400 text-xs">Approve or remove listings</p>
              </div>
              <span className="ml-auto text-gray-300">›</span>
            </Link>
          </div>
        </div>

        {/* Recent Users */}
        <div className="card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Recent Users</h3>
            <Link to="/admin/users" className="text-xs text-primary-600 hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {data?.recentUsers?.map((u) => (
              <div key={u._id} className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0">
                  {u.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">{u.name}</p>
                  <p className="text-xs text-gray-500 truncate">{u.email}</p>
                </div>
                <span className={`badge text-xs capitalize flex-shrink-0 ${
                  u.role === 'admin' ? 'bg-red-100 text-red-700' :
                  u.role === 'owner' ? 'bg-purple-100 text-purple-700' :
                  'bg-green-100 text-green-700'
                }`}>{u.role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Listings */}
        <div className="card p-4 sm:p-6 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Recent Listings</h3>
            <Link to="/admin/properties" className="text-xs text-primary-600 hover:underline">View All</Link>
          </div>
          {/* Mobile: card list */}
          <div className="sm:hidden space-y-3">
            {data?.recentListings?.map((p) => (
              <div key={p._id} className="flex items-start gap-3 p-2 bg-gray-50 rounded-xl">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-700 truncate">{p.title}</p>
                  <p className="text-xs text-gray-500">{p.owner?.name} · ₹{p.price?.toLocaleString()}</p>
                </div>
                <span className={`badge text-xs flex-shrink-0 ${p.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {p.isApproved ? 'Approved' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
          {/* Desktop: table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                  <th className="pb-2 pr-4">Title</th>
                  <th className="pb-2 pr-4">Owner</th>
                  <th className="pb-2 pr-4">Price</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {data?.recentListings?.map((p) => (
                  <tr key={p._id} className="border-b border-gray-50">
                    <td className="py-2 pr-4 max-w-xs truncate font-medium text-gray-700 text-xs">{p.title}</td>
                    <td className="py-2 pr-4 text-gray-500 text-xs">{p.owner?.name}</td>
                    <td className="py-2 pr-4 text-gray-700 text-xs">₹{p.price?.toLocaleString()}</td>
                    <td className="py-2">
                      <span className={`badge text-xs ${p.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {p.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
