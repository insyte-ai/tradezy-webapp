import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchBrandBySlug, clearCurrentBrand } from '../store/slices/brandSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProductCard from '../components/products/ProductCard';
import { 
  GlobeAltIcon,
  CheckBadgeIcon,
  CalendarIcon,
  ShieldCheckIcon,
  CubeIcon,
  BuildingStorefrontIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const BrandDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState<'products' | 'stores' | 'about'>('products');
  const [productsViewMode, setProductsViewMode] = useState<'grid' | 'list'>('grid');
  
  const { currentBrand: brandData, loading, error } = useSelector(
    (state: RootState) => state.brands
  );
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (slug) {
      dispatch(fetchBrandBySlug(slug));
    }
    
    return () => {
      dispatch(clearCurrentBrand());
    };
  }, [dispatch, slug]);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <StarSolidIcon key={i} className="h-5 w-5 text-yellow-400" />
        ) : (
          <StarIcon key={i} className="h-5 w-5 text-neutral-300" />
        )
      );
    }
    return stars;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !brandData) {
    return (
      <div className="container-custom py-12 text-center">
        <p className="text-neutral-600 mb-4">{error || 'Brand not found'}</p>
        <Link to="/brands" className="text-primary-600 hover:text-primary-700">
          Back to Brands
        </Link>
      </div>
    );
  }

  const { brand, topProducts, stores, statistics } = brandData;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Brand Header */}
      <div className="bg-white border-b">
        <div className="container-custom py-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Logo */}
            <div className="w-32 h-32 bg-white rounded-lg shadow-md p-4 flex-shrink-0">
              {brand.logo ? (
                <img 
                  src={brand.logo} 
                  alt={brand.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-neutral-200 rounded flex items-center justify-center">
                  <CubeIcon className="h-12 w-12 text-neutral-400" />
                </div>
              )}
            </div>
            
            {/* Brand Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-neutral-900">{brand.name}</h1>
                {brand.verified && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    <CheckBadgeIcon className="h-4 w-4 mr-1" />
                    Verified Brand
                  </span>
                )}
                {brand.featured && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                    Featured
                  </span>
                )}
              </div>
              
              {brand.description && (
                <p className="text-neutral-600 mb-4">{brand.description}</p>
              )}
              
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-neutral-50 rounded-lg p-3">
                  <p className="text-sm text-neutral-500">Products</p>
                  <p className="text-xl font-semibold text-neutral-900">{statistics.totalProducts}</p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-3">
                  <p className="text-sm text-neutral-500">Stores</p>
                  <p className="text-xl font-semibold text-neutral-900">{statistics.totalStores}</p>
                </div>
                {brand.metrics?.averageRating && (
                  <div className="bg-neutral-50 rounded-lg p-3">
                    <p className="text-sm text-neutral-500">Rating</p>
                    <div className="flex items-center gap-1">
                      <StarSolidIcon className="h-5 w-5 text-yellow-400" />
                      <p className="text-xl font-semibold text-neutral-900">{brand.metrics.averageRating}</p>
                    </div>
                  </div>
                )}
                {brand.establishedYear && (
                  <div className="bg-neutral-50 rounded-lg p-3">
                    <p className="text-sm text-neutral-500">Established</p>
                    <p className="text-xl font-semibold text-neutral-900">{brand.establishedYear}</p>
                  </div>
                )}
              </div>
              
              {/* Quick Links */}
              <div className="flex gap-3 mt-4">
                {brand.website && (
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <GlobeAltIcon className="h-5 w-5" />
                    Visit Website
                  </a>
                )}
                {brand.socialMedia?.instagram && (
                  <a
                    href={brand.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors"
                  >
                    Instagram
                  </a>
                )}
                {brand.socialMedia?.linkedin && (
                  <a
                    href={brand.socialMedia.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors"
                  >
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container-custom mt-8">
        <div className="border-b border-neutral-200">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab('products')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'products'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Products ({statistics.totalProducts})
            </button>
            <button
              onClick={() => setActiveTab('stores')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'stores'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Authorized Stores ({statistics.totalStores})
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'about'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              About
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="py-8">
          {activeTab === 'products' && (
            <div>
              {/* Products Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-neutral-900">
                  Products by {brand.name}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setProductsViewMode('grid')}
                    className={`p-2 rounded ${productsViewMode === 'grid' ? 'bg-neutral-100' : ''}`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setProductsViewMode('list')}
                    className={`p-2 rounded ${productsViewMode === 'list' ? 'bg-neutral-100' : ''}`}
                  >
                    List
                  </button>
                </div>
              </div>

              {/* Products Grid */}
              {topProducts && topProducts.length > 0 ? (
                <div className={productsViewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                  : "space-y-4"
                }>
                  {topProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      viewMode={productsViewMode}
                      showPrice={isAuthenticated}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg">
                  <CubeIcon className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                  <p className="text-neutral-600">No products available for this brand</p>
                </div>
              )}
              
              {topProducts && topProducts.length >= 12 && (
                <div className="text-center mt-8">
                  <Link
                    to={`/products?brand=${brand.name}`}
                    className="btn btn-primary"
                  >
                    View All Products
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'stores' && (
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-6">
                Authorized Stores
              </h2>
              
              {stores && stores.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stores.map((store) => (
                    <Link
                      key={store._id}
                      to={`/stores/${store.slug}`}
                      className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-neutral-100 rounded-lg flex-shrink-0">
                          {store.logo ? (
                            <img 
                              src={store.logo} 
                              alt={store.name}
                              className="w-full h-full object-contain rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BuildingStorefrontIcon className="h-8 w-8 text-neutral-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-neutral-900 mb-1">{store.name}</h3>
                          {store.isPremium && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-700 mb-2">
                              Premium
                            </span>
                          )}
                          {store.ratings && (
                            <div className="flex items-center gap-1">
                              {renderStars(store.ratings.average)}
                              <span className="text-xs text-neutral-500 ml-1">
                                ({store.ratings.count})
                              </span>
                            </div>
                          )}
                          {store.location?.city && (
                            <p className="text-sm text-neutral-500 mt-1">
                              {store.location.city}, {store.location.country}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg">
                  <BuildingStorefrontIcon className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                  <p className="text-neutral-600">No authorized stores for this brand yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Brand Information */}
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Brand Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-neutral-500">Country of Origin</p>
                    <p className="text-neutral-900">{brand.country}</p>
                  </div>
                  
                  {brand.establishedYear && (
                    <div>
                      <p className="text-sm text-neutral-500">Established</p>
                      <p className="text-neutral-900">{brand.establishedYear}</p>
                    </div>
                  )}
                  
                  {brand.categories && brand.categories.length > 0 && (
                    <div>
                      <p className="text-sm text-neutral-500 mb-2">Categories</p>
                      <div className="flex flex-wrap gap-2">
                        {brand.categories.map((category) => (
                          <Link
                            key={category._id}
                            to={`/categories/${category.slug}`}
                            className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm hover:bg-neutral-200"
                          >
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Certifications */}
              {brand.certifications && brand.certifications.length > 0 && (
                <div className="bg-white rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Certifications</h3>
                  <div className="space-y-3">
                    {brand.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <ShieldCheckIcon className="h-6 w-6 text-primary-600" />
                        <span className="text-neutral-900">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact */}
              {(brand.website || brand.socialMedia) && (
                <div className="bg-white rounded-lg p-6 md:col-span-2">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Connect</h3>
                  <div className="flex flex-wrap gap-3">
                    {brand.website && (
                      <a
                        href={brand.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors"
                      >
                        <GlobeAltIcon className="h-5 w-5" />
                        Website
                      </a>
                    )}
                    {brand.socialMedia?.facebook && (
                      <a
                        href={brand.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors"
                      >
                        Facebook
                      </a>
                    )}
                    {brand.socialMedia?.instagram && (
                      <a
                        href={brand.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors"
                      >
                        Instagram
                      </a>
                    )}
                    {brand.socialMedia?.twitter && (
                      <a
                        href={brand.socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors"
                      >
                        Twitter
                      </a>
                    )}
                    {brand.socialMedia?.linkedin && (
                      <a
                        href={brand.socialMedia.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors"
                      >
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandDetailPage;