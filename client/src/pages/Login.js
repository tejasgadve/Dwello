/**
 * Login Page
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      toast.success(`Welcome back, ${data.user.name}!`);
      const redirect = data.user.role === 'admin' ? '/admin' : data.user.role === 'owner' ? '/dashboard' : from;
      navigate(redirect, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary-50 to-white">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl">🏠</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500 mt-2 text-sm">Login to find your perfect student home</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email Address</label>
              <input type="email" required placeholder="you@example.com"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Password</label>
              <input type="password" required placeholder="••••••••"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input" />
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? '🔄 Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-4 p-3 bg-gray-50 rounded-xl text-xs text-gray-500">
            <p className="font-medium text-gray-700 mb-1">Demo Credentials:</p>
            <p>🎓 Student: rahul@example.com / password123</p>
            <p>🏠 Owner: suresh@example.com / password123</p>
            <p>⚙️ Admin: admin@Dwello.com / admin123</p>
          </div>

          <p className="text-center text-sm text-gray-500 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-medium hover:underline">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
