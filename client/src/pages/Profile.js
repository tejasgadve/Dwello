import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', college: user?.college || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/auth/update-profile', form);
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    } finally { setSaving(false); }
  };

  const handlePwChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) return toast.error('Passwords do not match');
    setChangingPw(true);
    try {
      await api.put('/auth/change-password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed!');
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    } finally { setChangingPw(false); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-gray-800 mb-6">👤 My Profile</h1>

      {/* Profile Card */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold text-gray-800 text-lg">{user?.name}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="badge bg-primary-100 text-primary-700 mt-1 capitalize">{user?.role}</span>
          </div>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Full Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Phone</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" />
          </div>
          {user?.role === 'student' && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">College</label>
              <input type="text" value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} className="input" />
            </div>
          )}
          <button type="submit" disabled={saving} className="btn-primary py-2.5 disabled:opacity-60">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="card p-6">
        <h3 className="font-semibold text-gray-800 mb-4">🔑 Change Password</h3>
        <form onSubmit={handlePwChange} className="space-y-4">
          <input type="password" placeholder="Current Password" required value={pwForm.currentPassword}
            onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} className="input text-sm" />
          <input type="password" placeholder="New Password (min 6 chars)" required minLength={6} value={pwForm.newPassword}
            onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} className="input text-sm" />
          <input type="password" placeholder="Confirm New Password" required value={pwForm.confirm}
            onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })} className="input text-sm" />
          <button type="submit" disabled={changingPw} className="btn-primary py-2.5 text-sm disabled:opacity-60">
            {changingPw ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
