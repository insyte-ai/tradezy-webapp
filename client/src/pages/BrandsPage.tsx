import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  FunnelIcon
} from '@heroicons/react/24/outline';

interface Brand {
  id: string;
  name: string;
  logo: string;
  category: string;
  description: string;
  productCount: number;
  minOrder: string;
  isNew?: boolean;
  isFeatured?: boolean;
  rating?: number;
  responseTime?: string;
}

const mockBrands: Brand[] = [
  {
    id: '1',
    name: 'Modern Living Co.',
    logo: 'https://via.placeholder.com/120',
    category: 'Home & Living',
    description: 'Sustainable home goods and furniture for modern spaces',
    productCount: 245,
    minOrder: '$300',
    isFeatured: true,
    rating: 4.8,
    responseTime: '< 24h',
  },
  {
    id: '2',
    name: 'Tech Essentials',
    logo: 'https://via.placeholder.com/120',
    category: 'Electronics',
    description: 'Smart home and office technology solutions',
    productCount: 189,
    minOrder: '$500',
    isNew: true,
    rating: 4.6,
    responseTime: '< 12h',
  },
  {
    id: '3',
    name: 'Green Garden Supply',
    logo: 'https://via.placeholder.com/120',
    category: 'Outdoor & Garden',
    description: 'Eco-friendly gardening and outdoor products',
    productCount: 412,
    minOrder: '$250',
    rating: 4.9,
    responseTime: '< 24h',
  },
  {
    id: '4',
    name: 'Workspace Pro',
    logo: 'https://via.placeholder.com/120',
    category: 'Office Supplies',
    description: 'Premium office furniture and productivity tools',
    productCount: 156,
    minOrder: '$400',
    isFeatured: true,
    rating: 4.7,
    responseTime: '< 48h',
  },
  {
    id: '5',
    name: 'Pet Paradise',
    logo: 'https://via.placeholder.com/120',
    category: 'Pet Supplies',
    description: 'Quality pet supplies and accessories for all pets',
    productCount: 523,
    minOrder: '$200',
    rating: 4.9,
    responseTime: '< 24h',
  },
  {
    id: '6',
    name: 'Wellness First',
    logo: 'https://via.placeholder.com/120',
    category: 'Health & Beauty',
    description: 'Natural health and wellness products',
    productCount: 298,
    minOrder: '$350',
    isNew: true,
    rating: 4.5,
    responseTime: '< 12h',
  },
];

const categories = [
  'All Categories',
  'Home & Living',
  'Electronics',
  'Office Supplies',
  'Outdoor & Garden',
  'Pet Supplies',
  'Health & Beauty',
  'Fashion',
  'Food & Beverage',
];

const BrandsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [showFilters, setShowFilters] = useState(false);

  const filteredBrands = mockBrands.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          brand.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || brand.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section for Sellers */}
      <section className="bg-gradient-to-b from-gray-50 to-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mb-4">
                <SparklesIcon className="w-4 h-4 mr-1" />
                Start selling today
              </div>
              <h1 className="text-4xl lg:text-5xl font-light text-gray-900 mb-4">
                Grow your wholesale business with TradeZy
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of brands reaching independent retailers across the country. 
                Scale your B2B sales with powerful tools and zero upfront costs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/seller/signup"
                  className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Start Selling
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
                <a
                  href="#learn-more"
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">50K+</div>
                    <div className="text-sm text-gray-600 mt-1">Active Retailers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">$2M+</div>
                    <div className="text-sm text-gray-600 mt-1">Monthly GMV</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">1000+</div>
                    <div className="text-sm text-gray-600 mt-1">Brands</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">4.8</div>
                    <div className="text-sm text-gray-600 mt-1">Avg Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="learn-more" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              Why sell on TradeZy?
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to grow your wholesale business
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <benefit.icon className="h-10 w-10 text-black mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Directory Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-light text-gray-900 mb-2">Browse Brands</h2>
            <p className="text-gray-600">Discover verified wholesale brands on TradeZy</p>
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
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <MagnifyingGlassIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filters
              </button>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Brands Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBrands.map(brand => (
              <Link
                key={brand.id}
                to={`/brands/${brand.id}`}
                className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all overflow-hidden group"
              >
                <div className="p-6">
                  {/* Brand Header */}
                  <div className="flex items-start justify-between mb-4">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-16 h-16 rounded-lg object-cover border border-gray-100"
                    />
                    <div className="flex gap-2">
                      {brand.isFeatured && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                          Featured
                        </span>
                      )}
                      {brand.isNew && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                          New
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Brand Info */}
                  <h3 className="font-medium text-gray-900 text-lg mb-1 group-hover:text-black transition-colors">
                    {brand.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">{brand.category}</p>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {brand.description}
                  </p>

                  {/* Brand Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-500">
                        <span className="font-medium text-gray-900">{brand.productCount}</span> products
                      </span>
                      <span className="text-gray-500">
                        Min: <span className="font-medium text-gray-900">{brand.minOrder}</span>
                      </span>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="flex text-yellow-400">
                        {'★'.repeat(Math.floor(brand.rating || 0))}
                        {'☆'.repeat(5 - Math.floor(brand.rating || 0))}
                      </div>
                      <span className="text-sm text-gray-600 ml-1">{brand.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500">Response: {brand.responseTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {filteredBrands.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <BuildingStorefrontIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">No brands found matching your criteria</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All Categories');
                }}
                className="text-black hover:text-gray-700 font-medium text-sm"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-light mb-4">
            Ready to grow your wholesale business?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join TradeZy today and start reaching thousands of verified retailers. 
            No upfront costs, no hidden fees.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/seller/signup"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Get Started Free
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border border-gray-600 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
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