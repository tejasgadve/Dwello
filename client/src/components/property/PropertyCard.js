/**
 * PropertyCard - Fully Responsive
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AMENITY_ICONS = {
  wifi: '📶', food: '🍽️', parking: '🚗', ac: '❄️',
  laundry: '👕', gym: '💪', security: '🔒', hotWater: '🚿',
  powerBackup: '⚡', tv: '📺', housekeeping: '🧹', cctv: '📷',
};

const GENDER_COLORS = {
  Boys: 'bg-blue-100 text-blue-700',
  Girls: 'bg-pink-100 text-pink-700',
  'Co-ed': 'bg-green-100 text-green-700',
};

const PropertyCard = ({ property, onFavoriteToggle }) => {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(user?.savedProperties?.includes(property._id));
  const [savingFav, setSavingFav] = useState(false);

  const activeAmenities = Object.entries(property.amenities || {})
    .filter(([, v]) => v).slice(0, 4);

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error('Login to save favorites'); return; }
    setSavingFav(true);
    try {
      const { data } = await api.post(`/favorites/${property._id}`);
      setIsSaved(data.isSaved);
      toast.success(data.message);
      onFavoriteToggle?.();
    } catch { toast.error('Error'); }
    finally { setSavingFav(false); }
  };

  const imageUrl = property.images?.[0]?.url || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400';

  return (
    <Link to={`/properties/${property._id}`} className="card block group overflow-hidden animate-fade-in">
      {/* Image */}
      <div className="relative h-44 sm:h-48 overflow-hidden">
        <img
          src={imageUrl} alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400'; }}
          loading="lazy"
        />
        {/* Favorite */}
        <button onClick={handleFavorite} disabled={savingFav}
          className="absolute top-2.5 right-2.5 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-transform z-10">
          <span className={`text-base sm:text-lg ${isSaved ? 'text-red-500' : 'text-gray-400'}`}>
            {isSaved ? '❤️' : '🤍'}
          </span>
        </button>
        {/* Type badge */}
        <div className="absolute top-2.5 left-2.5">
          <span className="badge bg-primary-600 text-white text-xs px-2 py-0.5">{property.type}</span>
        </div>
        {property.isFeatured && (
          <div className="absolute bottom-2.5 left-2.5">
            <span className="badge bg-yellow-400 text-yellow-900 text-xs">⭐ Featured</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        {/* Gender + Rating row */}
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <span className={`badge text-xs ${GENDER_COLORS[property.genderPreference]}`}>
            {property.genderPreference}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-yellow-400 text-xs sm:text-sm">★</span>
            <span className="text-xs sm:text-sm font-medium text-gray-700">{property.ratings?.average?.toFixed(1) || '0.0'}</span>
            <span className="text-xs text-gray-400 hidden sm:inline">({property.ratings?.count || 0})</span>
          </div>
        </div>

        <h3 className="font-semibold text-gray-800 text-xs sm:text-sm leading-tight line-clamp-2 mb-1 group-hover:text-primary-600 transition-colors">
          {property.title}
        </h3>
        <p className="text-xs text-gray-500 mb-2 sm:mb-3 flex items-center gap-1 truncate">
          📍 {property.address?.city}, {property.address?.state}
        </p>

        {/* Amenity icons */}
        {activeAmenities.length > 0 && (
          <div className="flex gap-1 flex-wrap mb-2 sm:mb-3">
            {activeAmenities.map(([key]) => (
              <span key={key} className="text-sm" title={key}>{AMENITY_ICONS[key]}</span>
            ))}
          </div>
        )}

        {/* Price row */}
        <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-100">
          <div>
            <span className="text-base sm:text-xl font-bold text-primary-700">₹{property.price?.toLocaleString()}</span>
            <span className="text-xs text-gray-500">/mo</span>
          </div>
          <div className="text-xs text-gray-400 hidden sm:block">
            Dep: ₹{property.deposit?.toLocaleString() || 0}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
