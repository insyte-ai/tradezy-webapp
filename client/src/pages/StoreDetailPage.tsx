import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchStoreBySlug, clearCurrentStore } from '../store/slices/storeSlice';
import { fetchProductsByCategory } from '../store/slices/productSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProductCard from '../components/products/ProductCard';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  CubeIcon,
  ClockIcon,
  TruckIcon,
  ShieldCheckIcon,
  StarIcon,
  CheckBadgeIcon,
  GlobeAltIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const StoreDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState<'products' | 'about' | 'policies'>('products');
  const [productsViewMode, setProductsViewMode] = useState<'grid' | 'list'>('grid');
  
  const { currentStore: store, loading, error } = useSelector(
    (state: RootState) => state.stores
  );
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (slug) {
      dispatch(fetchStoreBySlug(slug));
    }
    
    return () => {
      dispatch(clearCurrentStore());
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

  if (error || !store) {
    return (
      <div className="container-custom py-12 text-center">
        <p className="text-neutral-600 mb-4">{error || 'Store not found'}</p>
        <Link to="/stores" className="text-primary-600 hover:text-primary-700">
          Back to Stores
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Store Header/Banner */}
      <div className="relative">
        <div className="h-64 bg-gradient-to-br from-primary-500 to-primary-700">
          {store.store.banner && (
            <img 
              src={store.store.banner} 
              alt={store.store.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        {/* Store Info Overlay */}
        <div className="container-custom">
          <div className="bg-white rounded-lg shadow-lg -mt-20 relative z-10 p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Logo */}
              <div className="w-24 h-24 bg-white rounded-lg shadow-md p-2 flex-shrink-0">
                {store.store.logo ? (
                  <img 
                    src={store.store.logo} 
                    alt={store.store.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-200 rounded flex items-center justify-center">
                    <BuildingOfficeIcon className="h-12 w-12 text-neutral-400" />
                  </div>
                )}
              </div>
              
              {/* Store Details */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl font-bold text-neutral-900">{store.store.name}</h1>
                      {store.store.isPremium && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                          <CheckBadgeIcon className="h-4 w-4 mr-1" />
                          Premium Supplier
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        {renderStars(store.store.ratings.average)}
                        <span className="text-sm text-neutral-600 ml-1">
                          {store.store.ratings.average} ({store.store.ratings.count} reviews)
                        </span>
                      </div>
                    </div>
                    
                    {store.store.description && (
                      <p className="text-neutral-600 mb-4">{store.store.description}</p>
                    )}
                    
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-neutral-200">
                      <div>
                        <p className="text-sm text-neutral-500">Products</p>
                        <p className="text-lg font-semibold text-neutral-900">{store.statistics.totalProducts}</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500">Response Time</p>
                        <p className="text-lg font-semibold text-neutral-900">{store.store.metrics.responseTime}</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500">Fulfillment Rate</p>
                        <p className="text-lg font-semibold text-neutral-900">{store.store.metrics.fulfillmentRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500">Min. Order</p>
                        <p className="text-lg font-semibold text-neutral-900">
                          AED {store.store.businessInfo?.minimumOrder || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
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
              Products
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
            <button
              onClick={() => setActiveTab('policies')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'policies'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Policies
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
                  All Products ({store.statistics.totalProducts})
                </h2>
                <div className="flex items-center gap-4">
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

              {/* Top Products */}
              {store.topProducts && store.topProducts.length > 0 ? (
                <div className={productsViewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                  : "space-y-4"
                }>
                  {store.topProducts.map((product) => (
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
                  <p className="text-neutral-600">No products available</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <EnvelopeIcon className="h-5 w-5 text-neutral-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-neutral-500">Email</p>
                      <p className="text-neutral-900">{store.store.contact.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <PhoneIcon className="h-5 w-5 text-neutral-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-neutral-500">Phone</p>
                      <p className="text-neutral-900">{store.store.contact.phoneNumber}</p>
                    </div>
                  </div>
                  
                  {store.store.contact.address && (
                    <div className="flex items-start gap-3">
                      <MapPinIcon className="h-5 w-5 text-neutral-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-neutral-500">Address</p>
                        <p className="text-neutral-900">
                          {store.store.contact.address.street}<br />
                          {store.store.contact.address.city}, {store.store.contact.address.state}<br />
                          {store.store.contact.address.country} {store.store.contact.address.zipCode}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Business Information */}
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Business Information</h3>
                <div className="space-y-3">
                  {store.store.businessInfo?.employeeCount && (
                    <div>
                      <p className="text-sm text-neutral-500">Company Size</p>
                      <p className="text-neutral-900">{store.store.businessInfo.employeeCount} employees</p>
                    </div>
                  )}
                  
                  {store.store.businessInfo?.leadTime && (
                    <div>
                      <p className="text-sm text-neutral-500">Lead Time</p>
                      <p className="text-neutral-900">{store.store.businessInfo.leadTime}</p>
                    </div>
                  )}
                  
                  {store.store.businessInfo?.paymentTerms && (
                    <div>
                      <p className="text-sm text-neutral-500 mb-2">Payment Terms</p>
                      <div className="flex flex-wrap gap-2">
                        {store.store.businessInfo.paymentTerms.map((term, index) => (
                          <span key={index} className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded">
                            {term}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {store.store.businessInfo?.capabilities && (
                    <div>
                      <p className="text-sm text-neutral-500 mb-2">Capabilities</p>
                      <div className="flex flex-wrap gap-2">
                        {store.store.businessInfo.capabilities.map((cap, index) => (
                          <span key={index} className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded">
                            {cap}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Certifications */}
              {store.store.businessInfo?.certifications && store.store.businessInfo.certifications.length > 0 && (
                <div className="bg-white rounded-lg p-6 md:col-span-2">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Certifications</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {store.store.businessInfo.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                        <ShieldCheckIcon className="h-8 w-8 text-primary-600" />
                        <div>
                          <p className="font-medium text-neutral-900">{cert.name}</p>
                          <p className="text-sm text-neutral-500">by {cert.issuedBy}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Media */}
              {store.store.socialMedia && Object.keys(store.store.socialMedia).length > 0 && (
                <div className="bg-white rounded-lg p-6 md:col-span-2">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Connect With Us</h3>
                  <div className="flex gap-4">
                    {Object.entries(store.store.socialMedia).map(([platform, url]) => (
                      url && (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors"
                        >
                          <GlobeAltIcon className="h-5 w-5" />
                          <span className="capitalize">{platform}</span>
                        </a>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'policies' && (
            <div className="space-y-6">
              {store.store.policies?.return && (
                <div className="bg-white rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Return Policy</h3>
                  <p className="text-neutral-700">{store.store.policies.return}</p>
                </div>
              )}
              
              {store.store.policies?.shipping && (
                <div className="bg-white rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Shipping Policy</h3>
                  <p className="text-neutral-700">{store.store.policies.shipping}</p>
                </div>
              )}
              
              {store.store.policies?.warranty && (
                <div className="bg-white rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Warranty Policy</h3>
                  <p className="text-neutral-700">{store.store.policies.warranty}</p>
                </div>
              )}
              
              {store.store.businessInfo?.shippingTerms && (
                <div className="bg-white rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Shipping Terms</h3>
                  <div className="flex flex-wrap gap-3">
                    {store.store.businessInfo.shippingTerms.map((term, index) => (
                      <div key={index} className="flex items-center gap-2 px-3 py-2 bg-neutral-50 rounded-lg">
                        <TruckIcon className="h-5 w-5 text-neutral-500" />
                        <span className="text-neutral-700">{term}</span>
                      </div>
                    ))}
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

export default StoreDetailPage;