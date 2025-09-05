import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchBrands } from '../store/slices/brandSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  MagnifyingGlassIcon, 
  ArrowRightIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  TruckIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  SparklesIcon,
  FunnelIcon,
  CheckBadgeIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const BrandsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { brands, loading, error } = useSelector((state: RootState) => state.brands);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterFeatured, setFilterFeatured] = useState(false);
  const [filterVerified, setFilterVerified] = useState(false);

  useEffect(() => {
    dispatch(fetchBrands({
      featured: filterFeatured || undefined,
      verified: filterVerified || undefined,
      search: searchTerm || undefined
    }));
  }, [dispatch, filterFeatured, filterVerified, searchTerm]);

  const benefits = [
    {
      icon: CurrencyDollarIcon,
      title: 'No listing fees',
      description: 'List unlimited products for free',
    },
    {
      icon: UserGroupIcon,
      title: '50,000+ retailers',
      description: 'Access to verified buyers nationwide',
    },
    {
      icon: TruckIcon,
      title: 'Integrated logistics',
      description: 'Simplified shipping and fulfillment',
    },
    {
      icon: ChartBarIcon,
      title: 'Analytics dashboard',
      description: 'Track sales and customer insights',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure payments',
      description: 'Protected transactions with Net terms',
    },
    {
      icon: BuildingStorefrontIcon,
      title: 'Brand storefront',
      description: 'Customizable brand presence',
    },
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <StarSolidIcon key={i} className="h-4 w-4 text-yellow-400" />
        ) : (
          <StarIcon key={i} className="h-4 w-4 text-neutral-300" />
        )
      );
    }
    return stars;
  };

  if (loading && brands.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container-custom py-12 text-center">
        <p className="text-neutral-600 mb-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section for Sellers */}
      <section className="bg-gradient-to-b from-neutral-50 to-white border-b">
        <div className="container-custom py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 mb-4">
                <SparklesIcon className="w-4 h-4 mr-1" />
                Start selling today
              </div>
              <h1 className="text-4xl lg:text-5xl font-light text-neutral-900 mb-4">
                Grow your wholesale business with TradeZy
              </h1>
              <p className="text-xl text-neutral-600 mb-8">
                Join thousands of brands reaching independent retailers across the UAE. 
                Scale your B2B sales with powerful tools and zero upfront costs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/seller/signup"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  Start Selling
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
                <a
                  href="#learn-more"
                  className="inline-flex items-center justify-center px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors font-medium"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-neutral-900">50K+</div>
                    <div className="text-sm text-neutral-600 mt-1">Active Retailers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-neutral-900">$2M+</div>
                    <div className="text-sm text-neutral-600 mt-1">Monthly GMV</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-neutral-900">{brands.length}+</div>
                    <div className="text-sm text-neutral-600 mt-1">Brands</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-neutral-900">4.8</div>
                    <div className="text-sm text-neutral-600 mt-1">Avg Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="learn-more" className="py-16 bg-neutral-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-neutral-900 mb-4">
              Why sell on TradeZy?
            </h2>
            <p className="text-lg text-neutral-600">
              Everything you need to grow your wholesale business
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <benefit.icon className="h-10 w-10 text-primary-600 mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">{benefit.title}</h3>
                <p className="text-neutral-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Directory Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="mb-8">
            <h2 className="text-3xl font-light text-neutral-900 mb-2">Browse Brands</h2>
            <p className="text-neutral-600">Discover verified wholesale brands on TradeZy</p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="search"
                  placeholder="Search brands..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <MagnifyingGlassIcon className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400" />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 font-medium"
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filters
              </button>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setFilterFeatured(!filterFeatured)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filterFeatured
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  Featured Brands
                </button>
                <button
                  onClick={() => setFilterVerified(!filterVerified)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filterVerified
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  Verified Only
                </button>
              </div>
            )}
          </div>

          {/* Brands Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map(brand => (
              <Link
                key={brand._id}
                to={`/brands/${brand.slug}`}
                className="bg-white rounded-xl border border-neutral-200 hover:shadow-lg transition-all overflow-hidden group"
              >
                <div className="p-6">
                  {/* Brand Header */}
                  <div className="flex items-start justify-between mb-4">
                    {brand.logo ? (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="w-16 h-16 rounded-lg object-cover border border-neutral-100"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-neutral-100 flex items-center justify-center">
                        <BuildingStorefrontIcon className="h-8 w-8 text-neutral-400" />
                      </div>
                    )}
                    <div className="flex gap-2">
                      {brand.featured && (
                        <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                          Featured
                        </span>
                      )}
                      {brand.verified && (
                        <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                          <CheckBadgeIcon className="h-3 w-3 mr-1" />
                          Verified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Brand Info */}
                  <h3 className="font-medium text-neutral-900 text-lg mb-1 group-hover:text-primary-600 transition-colors">
                    {brand.name}
                  </h3>
                  <p className="text-sm text-neutral-500 mb-2">{brand.country}</p>
                  {brand.description && (
                    <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                      {brand.description}
                    </p>
                  )}

                  {/* Brand Stats */}
                  {brand.metrics && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="text-neutral-500">
                          <span className="font-medium text-neutral-900">{brand.metrics.totalProducts || 0}</span> products
                        </span>
                        <span className="text-neutral-500">
                          <span className="font-medium text-neutral-900">{brand.metrics.totalStores || 0}</span> stores
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  {brand.metrics?.averageRating && (
                    <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {renderStars(brand.metrics.averageRating)}
                        <span className="text-sm text-neutral-600 ml-1">{brand.metrics.averageRating}</span>
                      </div>
                      {brand.establishedYear && (
                        <span className="text-xs text-neutral-500">Since {brand.establishedYear}</span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {brands.length === 0 && !loading && (
            <div className="text-center py-12 bg-neutral-50 rounded-xl">
              <BuildingStorefrontIcon className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
              <p className="text-neutral-600 mb-4">No brands found matching your criteria</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterFeatured(false);
                  setFilterVerified(false);
                }}
                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-neutral-900 text-white py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-light mb-4">
            Ready to grow your wholesale business?
          </h2>
          <p className="text-lg text-neutral-300 mb-8 max-w-2xl mx-auto">
            Join TradeZy today and start reaching thousands of verified retailers. 
            No upfront costs, no hidden fees.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/seller/signup"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors font-medium"
            >
              Get Started Free
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border border-neutral-600 text-white rounded-lg hover:bg-neutral-800 transition-colors font-medium"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BrandsPage;