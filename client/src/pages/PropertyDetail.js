/**
 * Property Detail Page - Fully Responsive
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AMENITY_DISPLAY = [
  { key: 'wifi', icon: '📶', label: 'WiFi' },
  { key: 'food', icon: '🍽️', label: 'Food' },
  { key: 'parking', icon: '🚗', label: 'Parking' },
  { key: 'ac', icon: '❄️', label: 'AC' },
  { key: 'laundry', icon: '👕', label: 'Laundry' },
  { key: 'gym', icon: '💪', label: 'Gym' },
  { key: 'security', icon: '🔒', label: 'Security' },
  { key: 'hotWater', icon: '🚿', label: 'Hot Water' },
  { key: 'powerBackup', icon: '⚡', label: 'Power Backup' },
  { key: 'tv', icon: '📺', label: 'TV' },
  { key: 'housekeeping', icon: '🧹', label: 'Housekeeping' },
  { key: 'cctv', icon: '📷', label: 'CCTV' },
];

const GENDER_COLORS = {
  Boys: 'bg-blue-100 text-blue-700',
  Girls: 'bg-pink-100 text-pink-700',
  'Co-ed': 'bg-green-100 text-green-700',
};

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propRes, revRes] = await Promise.all([
          api.get(`/properties/${id}`),
          api.get(`/reviews/${id}`),
        ]);
        setProperty(propRes.data.data);
        setIsSaved(user?.savedProperties?.includes(id));
        setReviews(revRes.data.data);
      } catch {
        toast.error('Property not found');
        navigate('/properties');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate, user]);

  const handleFavorite = async () => {
    if (!user) return toast.error('Login to save favorites');
    try {
      const { data } = await api.post(`/favorites/${id}`);
      setIsSaved(data.isSaved);
      toast.success(data.message);
    } catch { toast.error('Error'); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Login to add review');
    setSubmittingReview(true);
    try {
      const { data } = await api.post(`/reviews/${id}`, review);
      setReviews([data.data, ...reviews]);
      setReview({ rating: 5, comment: '' });
      toast.success('Review added!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    } finally { setSubmittingReview(false); }
  };

  if (loading) return <LoadingSpinner />;
  if (!property) return null;

  const imageUrl = (i) => property.images?.[i]?.url || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 animate-fade-in">

      {/* Breadcrumb */}
      <div className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 flex items-center gap-2">
        <button onClick={() => navigate('/properties')} className="hover:text-primary-600 transition-colors">Properties</button>
        <span>/</span>
        <span className="text-gray-700 truncate max-w-[200px] sm:max-w-xs">{property.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8">

        {/* ── Left: Images + Details ──────────── */}
        <div className="lg:col-span-2 space-y-5 sm:space-y-6">

          {/* Image Gallery */}
          <div className="card overflow-hidden">
            <div className="h-56 sm:h-72 md:h-80 overflow-hidden relative">
              <img
                src={imageUrl(activeImg)}
                alt={property.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = imageUrl(0); }}
              />
              {/* Nav arrows on mobile */}
              {property.images?.length > 1 && (
                <>
                  <button onClick={() => setActiveImg(i => Math.max(0, i - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center text-sm hover:bg-black/60 transition-colors sm:hidden">
                    ‹
                  </button>
                  <button onClick={() => setActiveImg(i => Math.min((property.images?.length || 1) - 1, i + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center text-sm hover:bg-black/60 transition-colors sm:hidden">
                    ›
                  </button>
                </>
              )}
              {/* Image counter */}
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full sm:hidden">
                {activeImg + 1}/{property.images?.length || 1}
              </div>
            </div>
            {/* Thumbnails - hidden on very small screens */}
            {property.images?.length > 1 && (
              <div className="hidden sm:flex gap-2 p-3 overflow-x-auto">
                {property.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${activeImg === i ? 'border-primary-500 scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Property Info */}
          <div className="card p-4 sm:p-6">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2">
                  <span className="badge bg-primary-100 text-primary-700 text-xs">{property.type}</span>
                  <span className={`badge text-xs ${GENDER_COLORS[property.genderPreference]}`}>{property.genderPreference}</span>
                  <span className="badge bg-gray-100 text-gray-700 text-xs">{property.furnishing}</span>
                </div>
                <h1 className="font-display text-lg sm:text-2xl font-bold text-gray-800 leading-tight">{property.title}</h1>
                <p className="text-gray-500 text-xs sm:text-sm mt-1 flex items-start gap-1">
                  📍 <span>{property.address?.street}, {property.address?.city}, {property.address?.state} - {property.address?.pincode}</span>
                </p>
              </div>
              <button onClick={handleFavorite}
                className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-red-300 transition-colors">
                <span className={`text-lg sm:text-xl ${isSaved ? 'text-red-500' : 'text-gray-400'}`}>{isSaved ? '❤️' : '🤍'}</span>
              </button>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1,2,3,4,5].map(s => (
                  <span key={s} className={`text-base sm:text-lg ${s <= Math.round(property.ratings?.average) ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                ))}
              </div>
              <span className="font-semibold text-gray-700 text-sm">{property.ratings?.average?.toFixed(1)}</span>
              <span className="text-xs sm:text-sm text-gray-500">({property.ratings?.count} reviews)</span>
            </div>

            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{property.description}</p>

            {/* Price - visible on mobile only */}
            <div className="lg:hidden mt-4 pt-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
              <div>
                <span className="text-2xl font-bold text-primary-700">₹{property.price?.toLocaleString()}</span>
                <span className="text-xs text-gray-500">/month</span>
                {property.deposit > 0 && <div className="text-xs text-gray-500">Deposit: ₹{property.deposit?.toLocaleString()}</div>}
              </div>
              <div className="flex gap-2">
                {property.owner?.phone && (
                  <a href={`tel:${property.owner.phone}`} className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded-xl text-xs font-medium hover:bg-green-600 transition-colors">
                    📞 Call
                  </a>
                )}
                <a href={`mailto:${property.owner?.email}`} className="flex items-center gap-1 border border-primary-300 text-primary-600 px-4 py-2 rounded-xl text-xs font-medium hover:bg-primary-50 transition-colors">
                  ✉️ Email
                </a>
              </div>
            </div>

            {/* Nearby Colleges */}
            {property.nearbyColleges?.length > 0 && (
              <div className="mt-4">
                <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">🎓 Nearby Colleges</h4>
                <div className="flex gap-2 flex-wrap">
                  {property.nearbyColleges.map((c, i) => (
                    <span key={i} className="badge bg-primary-50 text-primary-700 border border-primary-200 text-xs">
                      {c.name} {c.distance && `· ${c.distance}km`}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Amenities */}
          <div className="card p-4 sm:p-6">
            <h3 className="font-semibold text-gray-800 text-sm sm:text-base mb-3 sm:mb-4">✨ Amenities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
              {AMENITY_DISPLAY.map(({ key, icon, label }) => {
                const has = property.amenities?.[key];
                return (
                  <div key={key} className={`flex items-center gap-2 p-2 sm:p-2.5 rounded-lg text-xs sm:text-sm ${has ? 'text-gray-700 bg-green-50 border border-green-100' : 'text-gray-300 bg-gray-50'}`}>
                    <span>{icon}</span>
                    <span className={has ? '' : 'line-through'}>{label}</span>
                    {has && <span className="ml-auto text-green-500 text-xs">✓</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Map */}
          <div className="card p-4 sm:p-6">
            <h3 className="font-semibold text-gray-800 text-sm sm:text-base mb-3 sm:mb-4">📍 Location</h3>
            <div className="h-36 sm:h-48 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm">
              <div className="text-center">
                <p className="text-3xl mb-2">🗺️</p>
                <p className="text-xs sm:text-sm">{property.address?.city}, {property.address?.state}</p>
                <a href={`https://maps.google.com/?q=${property.location?.coordinates?.[1]},${property.location?.coordinates?.[0]}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-primary-600 text-xs hover:underline mt-1.5 block">
                  View on Google Maps ↗
                </a>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="card p-4 sm:p-6">
            <h3 className="font-semibold text-gray-800 text-sm sm:text-base mb-4">⭐ Reviews ({reviews.length})</h3>

            {user && user.role !== 'owner' && (
              <form onSubmit={handleReviewSubmit} className="mb-5 p-3 sm:p-4 bg-gray-50 rounded-xl">
                <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-3">Write a Review</h4>
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map(star => (
                    <button key={star} type="button" onClick={() => setReview({ ...review, rating: star })}
                      className={`text-xl sm:text-2xl transition-transform hover:scale-110 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</button>
                  ))}
                </div>
                <textarea value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })}
                  placeholder="Share your experience..." rows={3} required minLength={10}
                  className="input text-xs sm:text-sm resize-none" />
                <button type="submit" disabled={submittingReview} className="btn-primary text-xs sm:text-sm mt-3 py-2 disabled:opacity-60">
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}

            {reviews.length === 0 ? (
              <p className="text-gray-400 text-xs sm:text-sm text-center py-6">No reviews yet. Be the first!</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r._id} className="flex gap-3">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0 bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {r.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-medium text-xs sm:text-sm text-gray-800">{r.user?.name}</span>
                        <div className="flex">
                          {[1,2,3,4,5].map(s => (
                            <span key={s} className={`text-sm ${s <= r.rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600">{r.comment}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(r.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right Sidebar (desktop only) ────── */}
        <div className="hidden lg:block space-y-5">
          <div className="card p-5 sticky top-20">
            <div className="text-center mb-5">
              <div className="text-3xl font-bold text-primary-700">₹{property.price?.toLocaleString()}</div>
              <div className="text-xs text-gray-500">per month</div>
              {property.deposit > 0 && <div className="text-xs text-gray-500 mt-1">Deposit: ₹{property.deposit?.toLocaleString()}</div>}
            </div>

            <div className="space-y-1 text-sm mb-5">
              {[['Type', property.type], ['Occupancy', property.occupancy], ['Furnishing', property.furnishing], ['Gender', property.genderPreference]].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">{k}</span>
                  <span className="font-medium text-gray-700">{v}</span>
                </div>
              ))}
            </div>

            {property.owner && (
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {property.owner.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-gray-800 truncate">{property.owner.name}</p>
                    <p className="text-xs text-gray-500">Property Owner</p>
                  </div>
                </div>
                {property.owner.phone && (
                  <a href={`tel:${property.owner.phone}`}
                    className="flex items-center justify-center gap-2 w-full bg-green-500 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-green-600 transition-colors mb-2">
                    📞 Call Owner
                  </a>
                )}
                <a href={`mailto:${property.owner.email}`}
                  className="flex items-center justify-center gap-2 w-full border border-primary-300 text-primary-600 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-50 transition-colors">
                  ✉️ Email Owner
                </a>
              </div>
            )}

            <div className={`mt-4 text-center py-2 rounded-xl text-xs sm:text-sm font-medium ${property.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {property.isAvailable ? '✅ Available Now' : '❌ Not Available'}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PropertyDetail;
