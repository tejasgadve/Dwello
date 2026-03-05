/**
 * Navbar Component - Fully Responsive
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isOwner, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `text-sm font-medium transition-colors px-1 py-0.5 border-b-2 ${
      isActive(path)
        ? 'text-primary-600 border-primary-600'
        : 'text-gray-600 hover:text-primary-600 border-transparent'
    }`;

  return (
    <>
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">

            {/* ── Logo ─────────────────────────────── */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white text-base sm:text-lg">🏠</span>
              </div>
              <span className="font-display text-lg sm:text-xl font-bold text-primary-700">
                Dwello
              </span>
            </Link>

            {/* ── Desktop Nav Links ─────────────────── */}
            <div className="hidden md:flex items-center gap-5 lg:gap-7">
              <Link to="/properties" className={navLinkClass('/properties')}>
                Find PG/Flat
              </Link>
              <Link to="/about" className={navLinkClass('/about')}>
               About Us
              </Link>
              {user && (isOwner || isAdmin) && (
                <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                  My Listings
                </Link>
              )}
              {user && isAdmin && (
                <Link to="/admin" className={navLinkClass('/admin')}>
                  Admin
                </Link>
              )}
              {user && !isOwner && !isAdmin && (
                <Link to="/favorites" className={navLinkClass('/favorites')}>
                  ❤️ Saved
                </Link>
              )}
            </div>

            {/* ── Desktop Auth ──────────────────────── */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-xl px-3 py-2 transition-colors"
                  >
                    <div className="w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                      {user.name?.split(' ')[0]}
                    </span>
                    <span className={`text-gray-400 text-xs transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-slide-up">
                      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                        <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.role} · {user.college || user.email}</p>
                      </div>
                      <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        👤 My Profile
                      </Link>
                      {(isOwner || isAdmin) && (
                        <Link to="/dashboard/add-property" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          ➕ Add Property
                        </Link>
                      )}
                      {!isOwner && !isAdmin && (
                        <Link to="/favorites" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          ❤️ Saved Properties
                        </Link>
                      )}
                      <div className="border-t border-gray-100">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                          🚪 Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50">
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary text-sm py-2 px-4">
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* ── Mobile: right side ────────────────── */}
            <div className="flex md:hidden items-center gap-2">
              {user && (
                <Link to="/profile" className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </Link>
              )}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                <div className="w-5 h-5 flex flex-col justify-center gap-1.5">
                  <span className={`block h-0.5 bg-gray-700 rounded transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                  <span className={`block h-0.5 bg-gray-700 rounded transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                  <span className={`block h-0.5 bg-gray-700 rounded transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </div>
              </button>
            </div>

          </div>
        </div>

        {/* ── Mobile Drawer ─────────────────────────── */}
        <div className={`md:hidden fixed inset-0 z-40 transition-all duration-300 ${menuOpen ? 'visible' : 'invisible'}`}>
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black transition-opacity duration-300 ${menuOpen ? 'opacity-40' : 'opacity-0'}`}
            onClick={() => setMenuOpen(false)}
          />
          {/* Drawer */}
          <div className={`absolute top-14 left-0 right-0 bg-white shadow-2xl transition-transform duration-300 ${menuOpen ? 'translate-y-0' : '-translate-y-full'}`}>

            {/* User info */}
            {user && (
              <div className="px-5 py-4 bg-primary-50 border-b border-primary-100 flex items-center gap-3">
                <div className="w-11 h-11 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize truncate">{user.role} {user.college ? `· ${user.college}` : ''}</p>
                </div>
              </div>
            )}

            {/* Nav links */}
            <div className="px-4 py-3 space-y-1">
              <MobileNavLink to="/" label="🏠 Home" onClick={() => setMenuOpen(false)} active={isActive('/')} />
              <MobileNavLink to="/properties" label="🔍 Find PG / Flat" onClick={() => setMenuOpen(false)} active={isActive('/properties')} />
              <MobileNavLink to="/about" label="ℹ️About Us" onClick={() => setMenuOpen(false)} active={isActive('/about')}/>
              {user && !isOwner && !isAdmin && (
                <MobileNavLink to="/favorites" label="❤️ Saved Properties" onClick={() => setMenuOpen(false)} active={isActive('/favorites')} />
              )}
              {user && (isOwner || isAdmin) && (
                <MobileNavLink to="/dashboard" label="📋 My Listings" onClick={() => setMenuOpen(false)} active={isActive('/dashboard')} />
              )}
              {user && (isOwner || isAdmin) && (
                <MobileNavLink to="/dashboard/add-property" label="➕ Add Property" onClick={() => setMenuOpen(false)} active={isActive('/dashboard/add-property')} />
              )}
              {user && isAdmin && (
                <MobileNavLink to="/admin" label="⚙️ Admin Dashboard" onClick={() => setMenuOpen(false)} active={isActive('/admin')} />
              )}
              {user && (
                <MobileNavLink to="/profile" label="👤 My Profile" onClick={() => setMenuOpen(false)} active={isActive('/profile')} />
              )}
            </div>

            {/* Auth buttons */}
            <div className="px-4 pb-5 pt-2 border-t border-gray-100">
              {user ? (
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 text-red-500 font-medium text-sm hover:bg-red-100 transition-colors"
                >
                  🚪 Logout
                </button>
              ) : (
                <div className="flex gap-3">
                  <Link to="/login" onClick={() => setMenuOpen(false)}
                    className="flex-1 text-center btn-outline text-sm py-3">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)}
                    className="flex-1 text-center btn-primary text-sm py-3">
                    Register
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </nav>
    </>
  );
};

const MobileNavLink = ({ to, label, onClick, active }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
      active ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
    }`}
  >
    {label}
  </Link>
);

export default Navbar;
