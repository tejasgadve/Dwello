import React, { useState, useEffect } from 'react';
import api from '../services/api';
import PropertyCard from '../components/property/PropertyCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const { data } = await api.get('/favorites');
      setFavorites(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchFavorites(); }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-gray-800 mb-6">❤️ Saved Properties</h1>
      {loading ? <LoadingSpinner /> : favorites.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🏚️</p>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No saved properties yet</h3>
          <p className="text-gray-500 text-sm mb-6">Save properties by clicking the heart icon</p>
          <a href="/properties" className="btn-primary text-sm">Browse Properties</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {favorites.map((p) => <PropertyCard key={p._id} property={p} onFavoriteToggle={fetchFavorites} />)}
        </div>
      )}
    </div>
  );
};

export default Favorites;
