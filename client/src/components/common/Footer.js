import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-gray-900 text-gray-400 pt-10 sm:pt-12 pb-6 mt-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mb-8">
        {/* Brand */}
        <div className="col-span-2 sm:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm sm:text-base">🏠</span>
            </div>
            <span className="font-display text-lg sm:text-xl font-bold text-white">Dwello</span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed max-w-xs">
            Find the perfect PG or flat near your college. Safe, affordable, and student-friendly accommodations across India.
          </p>
          {/* Social icons placeholder */}
          <div className="flex gap-3 mt-4">
            {['📘','🐦','📸','▶️'].map((icon,i) => (
              <button key={i} className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-sm transition-colors">
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-3 text-xs sm:text-sm uppercase tracking-wide">Quick Links</h4>
          <ul className="space-y-2 text-xs sm:text-sm">
            <li><Link to="/properties" className="hover:text-primary-400 transition-colors">Browse Properties</Link></li>
            <li><Link to="/register" className="hover:text-primary-400 transition-colors">Register</Link></li>
            <li><Link to="/login" className="hover:text-primary-400 transition-colors">Login</Link></li>
            <li><Link to="/dashboard" className="hover:text-primary-400 transition-colors">List Property</Link></li>
            <li><Link to="/about" className="hover:text-primary-400 transition-colors">About Us</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-3 text-xs sm:text-sm uppercase tracking-wide">Contact</h4>
          <ul className="space-y-2 text-xs sm:text-sm">
            <li className="flex items-center gap-1.5">📧 <span>hello@Dwello.in</span></li>
            <li className="flex items-center gap-1.5">📞 <span>+91 98765 43210</span></li>
            <li className="flex items-center gap-1.5">📍 <span>New Delhi, India</span></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="pt-5 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
        <p>© {new Date().getFullYear()} Dwello. All rights reserved.</p>
        <p>Made with ❤️ for students across India 🇮🇳</p>
      </div>
    </div>
  </footer>
);

export default Footer;
