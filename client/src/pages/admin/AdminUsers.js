import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (roleFilter) params.append('role', roleFilter);
      const { data } = await api.get(`/admin/users?${params}`);
      setUsers(data.data);
    } catch { toast.error('Error loading users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggle = async (id) => {
    try {
      const { data } = await api.patch(`/admin/users/${id}/toggle`);
      setUsers(users.map((u) => u._id === id ? { ...u, isActive: data.data.isActive } : u));
      toast.success(data.message);
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-gray-800 mb-6">👥 Manage Users</h1>

      <div className="flex gap-3 mb-6">
        <input type="text" placeholder="Search by name or email..." value={search}
          onChange={(e) => setSearch(e.target.value)} className="input text-sm max-w-xs" />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="input text-sm w-32">
          <option value="">All Roles</option>
          <option value="student">Student</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={fetchUsers} className="btn-primary text-sm py-2 px-4">Search</button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">College</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge text-xs capitalize ${u.role === 'admin' ? 'bg-red-100 text-red-700' : u.role === 'owner' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{u.college || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`badge text-xs ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {u.role !== 'admin' && (
                      <button onClick={() => handleToggle(u._id)}
                        className={`text-xs px-3 py-1 rounded-lg transition-colors ${u.isActive ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}>
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">No users found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
