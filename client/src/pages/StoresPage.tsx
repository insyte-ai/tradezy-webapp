import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import storeService, { Store } from '../services/storeService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { StarIcon } from '@heroicons/react/24/solid';
import { MapPinIcon, CubeIcon } from '@heroicons/react/24/outline';

const StoresPage: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    sort: '-ratings.average'
  });

  useEffect(() => {
    fetchStores();
  }, [filters]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await storeService.getStores(filters);
      setStores(response.stores);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderRating = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <StarIcon 
          key={i} 
          className={`h-4 w-4 ${i <= rating ? 'text-yellow-400' : 'text-neutral-200'}`}
        />
      );
    }
    return stars;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="mb-8">
        <nav className="text-sm breadcrumb mb-4">
          <Link to="/" className="text-neutral-500 hover:text-neutral-700">Home</Link>
          <span className="mx-2 text-neutral-400">/</span>
          <span className="text-neutral-900">Stores</span>
        </nav>
        
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Wholesale Stores
        </h1>
        <p className="text-neutral-600">
          Discover trusted suppliers and manufacturers for your business
        </p>
      </div>

      {/* Filters Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <input
            type="search"
            placeholder="Search stores..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="px-4 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-neutral-400 w-64"
          />
        </div>
        
        <select
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
          className="px-4 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-neutral-400"
        >
          <option value="-ratings.average">Highest Rated</option>
          <option value="-metrics.totalProducts">Most Products</option>
          <option value="-createdAt">Newest First</option>
          <option value="name">Name (A-Z)</option>
        </select>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <Link
            key={store._id}
            to={`/stores/${store.slug}`}
            className="bg-white border border-neutral-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Store Banner */}
            <div className="h-32 bg-gradient-to-br from-primary-50 to-primary-100 relative">
              {store.banner ? (
                <img 
                  src={store.banner} 
                  alt={store.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-primary-600">
                    <CubeIcon className="h-12 w-12" />
                  </div>
                </div>
              )}
              
              {/* Logo */}
              {store.logo && (
                <div className="absolute bottom-4 left-4 w-16 h-16 bg-white rounded-lg shadow-lg p-2">
                  <img 
                    src={store.logo} 
                    alt={store.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>

            {/* Store Info */}
            <div className="p-4">
              <h3 className="font-semibold text-lg text-neutral-900 mb-1">
                {store.name}
              </h3>
              
              {store.description && (
                <p className="text-sm text-neutral-600 line-clamp-2 mb-3">
                  {store.description}
                </p>
              )}

              <div className="flex items-center gap-1 mb-3">
                {renderRating(store.ratings.average)}
                <span className="text-xs text-neutral-500 ml-1">
                  ({store.ratings.count})
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-neutral-600">
                  <CubeIcon className="h-4 w-4 mr-1" />
                  {store.metrics.totalProducts} Products
                </div>
                
                {store.contact?.address && (
                  <div className="flex items-center text-neutral-600">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {store.contact.address.city}
                  </div>
                )}
              </div>

              {store.isPremium && (
                <div className="mt-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                    Premium Supplier
                  </span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {stores.length === 0 && (
        <div className="text-center py-12">
          <p className="text-neutral-600">No stores found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default StoresPage;