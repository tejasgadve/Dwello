/**
 * Register Page
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: 'student', phone: '', college: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (form.role === 'student' && !form.college) {
      return toast.error('College name is required for students');
    }
    setLoading(true);
    try {
      const { confirmPassword, ...userData } = form;
      const data = await register(userData);
      toast.success(`Welcome to Dwello, ${data.user.name}!`);
      navigate(data.user.role === 'owner' ? '/dashboard' : '/properties');
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary-50 to-white">
      <div className="w-full max-w-lg animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl">🏠</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-gray-800">Join Dwello</h1>
          <p className="text-gray-500 mt-2 text-sm">Create your free account today</p>
        </div>

        <div className="card p-8">
          {/* Role Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            {['student', 'owner'].map((role) => (
              <button key={role} type="button"
                onClick={() => setForm({ ...form, role })}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  form.role === role ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}>
                {role === 'student' ? '🎓 Student' : '🏠 Property Owner'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">Full Name *</label>
                <input type="text" required placeholder="John Doe"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">Phone Number</label>
                <input type="tel" placeholder="9876543210"
                  value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="input text-sm" />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700 mb-1.5 block">Email Address *</label>
              <input type="email" required placeholder="you@example.com"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input text-sm" />
            </div>

            {form.role === 'student' && (
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">College / University *</label>
                <input type="text" required placeholder="e.g. IIT Delhi"
                  value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })}
                  className="input text-sm" />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">Password *</label>
                <input type="password" required placeholder="Min 6 characters"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">Confirm Password *</label>
                <input type="password" required placeholder="Re-enter password"
                  value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className="input text-sm" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 disabled:opacity-60 disabled:cursor-not-allowed mt-2">
              {loading ? '🔄 Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:underline">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
