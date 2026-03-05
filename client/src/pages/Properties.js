/**
 * Properties Listing Page - Fully Responsive
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import PropertyCard from '../components/property/PropertyCard';
import SearchFilters from '../components/property/SearchFilters';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Properties = () => {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    college: searchParams.get('college') || '',
    city: searchParams.get('city') || '',
    search: searchParams.get('search') || '',
    minPrice: '', maxPrice: '', gender: '', type: '', amenities: '', sort: '',
  });
  const [page, setPage] = useState(1);

  const fetchProperties = useCallback(async (currentPage = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
      params.append('page', currentPage);
      params.append('limit', 12);
      const { data } = await api.get(`/properties?${params}`);
      setProperties(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchProperties(page); }, [page]);

  const handleSearch = () => { setPage(1); fetchProperties(1); };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-gray-800">Find PG & Flats</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{pagination.total} properties found</p>
        </div>
        {/* Mobile filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <span>🔽</span>
          <span>{showFilters ? 'Hide' : 'Filters'}</span>
        </button>
      </div>

      <div className="flex gap-5 lg:gap-6 items-start">

        {/* Sidebar Filters */}
        <aside className={`
          ${showFilters ? 'block' : 'hidden'} lg:block
          w-full lg:w-72 xl:w-80 flex-shrink-0
          fixed lg:static inset-0 lg:inset-auto z-40 lg:z-auto
          bg-white lg:bg-transparent
          overflow-y-auto lg:overflow-visible
          p-4 lg:p-0
          lg:top-20
        `}>
          {/* Mobile filter header */}
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <h2 className="font-semibold text-gray-800">Filters</h2>
            <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">✕</button>
          </div>
          <div className="lg:sticky lg:top-20">
            <SearchFilters filters={filters} onChange={setFilters} onSearch={() => { handleSearch(); setShowFilters(false); }} />
          </div>
        </aside>

        {/* Mobile filter backdrop */}
        {showFilters && (
          <div className="lg:hidden fixed inset-0 bg-black/40 z-30" onClick={() => setShowFilters(false)} />
        )}

        {/* Property Grid */}
        <main className="flex-1 min-w-0">
          {loading ? (
            <LoadingSpinner />
          ) : properties.length === 0 ? (
            <div className="text-center py-16 sm:py-20">
              <p className="text-4xl sm:text-5xl mb-4">🏚️</p>
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">No properties found</h3>
              <p className="text-gray-500 text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {properties.map((p) => <PropertyCard key={p._id} property={p} />)}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-8 flex-wrap">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 sm:px-4 py-2 rounded-xl border text-xs sm:text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors"
                  >
                    ← Prev
                  </button>
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                        page === p ? 'bg-primary-600 text-white' : 'border hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                    disabled={page === pagination.pages}
                    className="px-3 sm:px-4 py-2 rounded-xl border text-xs sm:text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Properties;
