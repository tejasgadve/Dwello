/**
 * SearchFilters - Responsive sidebar filters
 */

import React, { useState } from 'react';

const AMENITY_OPTIONS = [
  { key: 'wifi', label: '📶 WiFi' }, { key: 'food', label: '🍽️ Food' },
  { key: 'parking', label: '🚗 Parking' }, { key: 'ac', label: '❄️ AC' },
  { key: 'laundry', label: '👕 Laundry' }, { key: 'gym', label: '💪 Gym' },
  { key: 'security', label: '🔒 Security' }, { key: 'hotWater', label: '🚿 Hot Water' },
];

const SearchFilters = ({ filters, onChange, onSearch }) => {
  const [showAmenities, setShowAmenities] = useState(false);

  const handleChange = (key, value) => onChange({ ...filters, [key]: value });

  const handleAmenityToggle = (key) => {
    const current = filters.amenities ? filters.amenities.split(',').filter(Boolean) : [];
    const updated = current.includes(key) ? current.filter(a => a !== key) : [...current, key];
    handleChange('amenities', updated.join(','));
  };

  const clearFilters = () => onChange({
    college: '', city: '', minPrice: '', maxPrice: '',
    gender: '', type: '', amenities: '', sort: '', search: ''
  });

  const activeCount = Object.entries(filters).filter(([k, v]) => v && k !== 'search').length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 text-sm sm:text-base flex items-center gap-2">
          🔍 Filters
          {activeCount > 0 && (
            <span className="w-5 h-5 bg-primary-600 text-white rounded-full text-xs flex items-center justify-center">{activeCount}</span>
          )}
        </h3>
        <button onClick={clearFilters} className="text-xs text-primary-600 hover:underline">Clear All</button>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {/* College */}
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">College Name</label>
          <input type="text" placeholder="e.g. IIT Delhi" value={filters.college || ''}
            onChange={(e) => handleChange('college', e.target.value)} className="input text-xs sm:text-sm" />
        </div>

        {/* City */}
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">City</label>
          <input type="text" placeholder="e.g. New Delhi" value={filters.city || ''}
            onChange={(e) => handleChange('city', e.target.value)} className="input text-xs sm:text-sm" />
        </div>

        {/* Budget */}
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Budget (₹/month)</label>
          <div className="flex gap-2">
            <input type="number" placeholder="Min" value={filters.minPrice || ''}
              onChange={(e) => handleChange('minPrice', e.target.value)} className="input text-xs sm:text-sm" />
            <input type="number" placeholder="Max" value={filters.maxPrice || ''}
              onChange={(e) => handleChange('maxPrice', e.target.value)} className="input text-xs sm:text-sm" />
          </div>
        </div>

        {/* Type */}
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Property Type</label>
          <select value={filters.type || ''} onChange={(e) => handleChange('type', e.target.value)} className="input text-xs sm:text-sm">
            <option value="">All Types</option>
            {['PG','Flat','Hostel','Room'].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        {/* Gender */}
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Gender Preference</label>
          <div className="grid grid-cols-4 gap-1">
            {['All','Boys','Girls','Co-ed'].map((g) => (
              <button key={g} onClick={() => handleChange('gender', g === 'All' ? '' : g)}
                className={`text-xs py-1.5 rounded-lg border transition-colors ${
                  (filters.gender === g || (!filters.gender && g === 'All'))
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'border-gray-200 text-gray-600 hover:border-primary-300'
                }`}>
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1 block">Sort By</label>
          <select value={filters.sort || ''} onChange={(e) => handleChange('sort', e.target.value)} className="input text-xs sm:text-sm">
            <option value="">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>

        {/* Amenities */}
        <div>
          <button onClick={() => setShowAmenities(!showAmenities)}
            className="flex items-center justify-between w-full text-xs font-medium text-gray-600 mb-1 py-1">
            <span>Amenities {filters.amenities && `(${filters.amenities.split(',').filter(Boolean).length})`}</span>
            <span className="text-gray-400">{showAmenities ? '▲' : '▼'}</span>
          </button>
          {showAmenities && (
            <div className="grid grid-cols-2 gap-1.5 mt-1">
              {AMENITY_OPTIONS.map(({ key, label }) => {
                const selected = filters.amenities?.split(',').includes(key);
                return (
                  <button key={key} onClick={() => handleAmenityToggle(key)}
                    className={`text-xs py-1.5 px-2 rounded-lg border text-left transition-colors ${
                      selected ? 'bg-primary-100 text-primary-700 border-primary-300' : 'border-gray-200 text-gray-600 hover:border-primary-200'
                    }`}>
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <button onClick={onSearch} className="btn-primary w-full text-xs sm:text-sm py-2.5 sm:py-3">
          Search Properties
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;
