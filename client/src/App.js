/**
 * Dwello App - Main Router
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import About from './pages/About';

// Layout
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';

// Owner Dashboard
import OwnerDashboard from './pages/dashboard/OwnerDashboard';
import AddProperty from './pages/dashboard/AddProperty';
import EditProperty from './pages/dashboard/EditProperty';

// Admin Dashboard
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProperties from './pages/admin/AdminProperties';

// Protected Route Component
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

const AppRoutes = () => {
  const { loading } = useAuth();
  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
        
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
          <Route path="/about" element={<About />} />

          {/* Student Routes */}
          <Route path="/favorites" element={
            <ProtectedRoute roles={['student', 'admin']}>
              <Favorites />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          {/* Owner Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute roles={['owner', 'admin']}>
              <OwnerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/add-property" element={
            <ProtectedRoute roles={['owner', 'admin']}>
              <AddProperty />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/edit/:id" element={
            <ProtectedRoute roles={['owner', 'admin']}>
              <EditProperty />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute roles={['admin']}>
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="/admin/properties" element={
            <ProtectedRoute roles={['admin']}>
              <AdminProperties />
            </ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={
            <div className="flex items-center justify-center min-h-[60vh] text-center">
              <div>
                <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-6">Page not found</p>
                <a href="/" className="btn-primary">Go Home</a>
              </div>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { borderRadius: '12px', fontFamily: 'DM Sans, sans-serif' },
          success: { iconTheme: { primary: '#a82de3', secondary: 'white' } },
        }}
      />
      <AppRoutes />
    </Router>
  </AuthProvider>
);

export default App;
