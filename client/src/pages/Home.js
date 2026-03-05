/**
 * Home Page - Fully Responsive
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import PropertyCard from '../components/property/PropertyCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CITIES = ['New Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Pune', 'Hyderabad', 'Kolkata'];
const COLLEGES = ['IIT Delhi', 'Delhi University', 'Mumbai University', 'IIT Bombay', 'Anna University', 'BITS Pilani'];

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/properties/featured')
      .then(({ data }) => setFeaturedProperties(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/properties?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="animate-fade-in">

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-6 left-6 sm:top-10 sm:left-10 w-40 sm:w-64 h-40 sm:h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 w-52 sm:w-80 h-52 sm:h-80 rounded-full bg-accent-400 blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center">
          <span className="inline-block bg-white/20 backdrop-blur-sm text-xs font-medium px-3 py-1.5 rounded-full mb-4 border border-white/30">
            🎓 India's #1 Student Housing Platform
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Find Your Perfect{' '}
            <span className="text-accent-400">PG or Flat</span>{' '}
            Near College
          </h1>
          <p className="text-sm sm:text-lg text-white/80 mb-8 max-w-xl mx-auto px-2">
            Search verified accommodations near your college. Safe, affordable, and student-friendly.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto px-2 sm:px-0">
            <div className="flex flex-col sm:flex-row gap-2 bg-white rounded-2xl p-2 shadow-2xl">
              <input
                type="text"
                placeholder="Search by college, city, or locality..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 text-gray-800 bg-transparent outline-none text-sm rounded-xl"
              />
              <button type="submit" className="bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors text-sm">
                🔍 Search
              </button>
            </div>
          </form>

          {/* Stats */}
          <div className="flex items-center justify-center gap-4 sm:gap-8 mt-8 text-white/70 flex-wrap">
            {[['2000+','Properties'],['50+','Cities'],['10k+','Students']].map(([v,l],i) => (
              <React.Fragment key={l}>
                {i > 0 && <div className="w-px h-8 bg-white/20 hidden sm:block" />}
                <div className="text-center px-2">
                  <div className="text-xl sm:text-2xl font-bold text-white">{v}</div>
                  <div className="text-xs sm:text-sm">{l}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by City */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Browse by City</h2>
        <div className="flex gap-2 sm:gap-3 flex-wrap">
          {CITIES.map((city) => (
            <button key={city} onClick={() => navigate(`/properties?city=${encodeURIComponent(city)}`)}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white rounded-xl border border-gray-200 text-xs sm:text-sm font-medium text-gray-700 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50 transition-colors shadow-sm">
              📍 {city}
            </button>
          ))}
        </div>
      </section>

      {/* Browse by College */}
      <section className="bg-primary-50 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Browse by College</h2>
          <div className="flex gap-2 sm:gap-3 flex-wrap">
            {COLLEGES.map((college) => (
              <button key={college} onClick={() => navigate(`/properties?college=${encodeURIComponent(college)}`)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white rounded-xl border border-primary-200 text-xs sm:text-sm font-medium text-primary-700 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-colors shadow-sm">
                🎓 {college}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-gray-800">⭐ Featured Properties</h2>
          <button onClick={() => navigate('/properties')} className="text-xs sm:text-sm text-primary-600 hover:underline font-medium">View All →</button>
        </div>
        {loading ? <LoadingSpinner fullScreen={false} /> : featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {featuredProperties.map((p) => <PropertyCard key={p._id} property={p} />)}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">🏠</p>
            <p className="text-sm">No featured properties yet. <button onClick={() => navigate('/properties')} className="text-primary-600 hover:underline">Browse all</button></p>
          </div>
        )}
      </section>

      {/* How it Works */}
      <section className="bg-gray-900 text-white py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2">How Dwello Works</h2>
          <p className="text-gray-400 text-sm sm:text-base mb-8 sm:mb-12">Find your perfect student accommodation in 3 simple steps</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
            {[
              { icon: '🔍', step: '01', title: 'Search', desc: 'Search PGs and flats by college, city, budget, and amenities.' },
              { icon: '🏠', step: '02', title: 'Explore', desc: 'View photos, amenities, owner contact, and location on map.' },
              { icon: '📞', step: '03', title: 'Connect', desc: 'Contact the owner directly and move in hassle-free.' },
            ].map(({ icon, step, title, desc }) => (
              <div key={step} className="bg-white/5 rounded-2xl p-5 sm:p-6 border border-white/10 flex sm:block items-start gap-4 text-left sm:text-center">
                <div>
                  <div className="text-3xl sm:text-4xl mb-1 sm:mb-3">{icon}</div>
                  <div className="text-primary-400 text-xs font-bold">STEP {step}</div>
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base sm:text-lg mb-1">{title}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2">Are You a Property Owner?</h2>
          <p className="text-white/80 text-sm sm:text-base mb-6 px-2">List your PG or flat and reach thousands of students near your property.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/register" className="bg-white text-primary-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors text-sm text-center">List Your Property Free</a>
            <a href="/properties" className="border border-white text-white px-6 py-3 rounded-xl font-medium hover:bg-white/10 transition-colors text-sm text-center">Browse Properties</a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
