import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, PlusIcon, CheckIcon } from '@heroicons/react/24/outline';

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
}

const mockBrands: Brand[] = [
  {
    id: '1',
    name: 'Modern Living Co.',
    logo: 'https://via.placeholder.com/120',
    category: 'Home Decor',
    description: 'Sustainable home goods and furniture',
    productCount: 245,
    minOrder: '$300',
    isFeatured: true,
  },
  {
    id: '2',
    name: 'Tech Essentials',
    logo: 'https://via.placeholder.com/120',
    category: 'Electronics',
    description: 'Smart home and office technology',
    productCount: 189,
    minOrder: '$500',
    isNew: true,
  },
  {
    id: '3',
    name: 'Green Garden Supply',
    logo: 'https://via.placeholder.com/120',
    category: 'Outdoor',
    description: 'Eco-friendly gardening and outdoor products',
    productCount: 412,
    minOrder: '$250',
  },
  {
    id: '4',
    name: 'Workspace Pro',
    logo: 'https://via.placeholder.com/120',
    category: 'Office',
    description: 'Premium office furniture and supplies',
    productCount: 156,
    minOrder: '$400',
    isFeatured: true,
  },
  {
    id: '5',
    name: 'Pet Paradise',
    logo: 'https://via.placeholder.com/120',
    category: 'Pets',
    description: 'Quality pet supplies and accessories',
    productCount: 523,
    minOrder: '$200',
  },
  {
    id: '6',
    name: 'Wellness First',
    logo: 'https://via.placeholder.com/120',
    category: 'Health',
    description: 'Health and wellness products',
    productCount: 298,
    minOrder: '$350',
    isNew: true,
  },
  {
    id: '7',
    name: 'Smart Living',
    logo: 'https://via.placeholder.com/120',
    category: 'Smart Home',
    description: 'Connected home automation products',
    productCount: 167,
    minOrder: '$450',
  },
  {
    id: '8',
    name: 'Artisan Crafts Co.',
    logo: 'https://via.placeholder.com/120',
    category: 'Home Decor',
    description: 'Handmade decorative items and art',
    productCount: 89,
    minOrder: '$200',
    isFeatured: true,
  },
];

const categories = ['All', 'Home Decor', 'Office', 'Outdoor', 'Electronics', 'Smart Home', 'Pets', 'Health'];

const BrandsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showSellerCTA, setShowSellerCTA] = useState(true);

  const filteredBrands = mockBrands.filter(brand => {
    const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          brand.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || brand.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Seller CTA Banner */}
      {showSellerCTA && (
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12 px-4">
          <div className="container-custom">
            <div className="flex justify-between items-start">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-light mb-3">Grow your wholesale business with TradeZy</h2>
                <p className="text-primary-100 mb-6">
                  Join thousands of brands reaching independent retailers worldwide. 
                  Zero listing fees, built-in payment terms, and powerful analytics.
                </p>
                <div className="flex items-center space-x-6 mb-6">
                  <div className="flex items-center">
                    <CheckIcon className="h-5 w-5 mr-2" />
                    <span className="text-sm">No listing fees</span>
                  </div>
                  <div className="flex items-center">
                    <CheckIcon className="h-5 w-5 mr-2" />
                    <span className="text-sm">60-day payment terms</span>
                  </div>
                  <div className="flex items-center">
                    <CheckIcon className="h-5 w-5 mr-2" />
                    <span className="text-sm">Direct messaging</span>
                  </div>
                </div>
                <Link
                  to="/seller/apply"
                  className="inline-flex items-center px-6 py-3 bg-white text-primary-600 rounded-md hover:bg-neutral-50 transition-colors font-medium text-sm"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Start Selling
                </Link>
              </div>
              <button
                onClick={() => setShowSellerCTA(false)}
                className="text-primary-100 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Brands Directory */}
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-neutral-900 mb-2">Brands</h1>
          <p className="text-neutral-600">Discover and shop from verified wholesale brands</p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1 relative">
            <input
              type="search"
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent text-sm"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap lg:flex-nowrap">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBrands.map(brand => (
            <Link
              key={brand.id}
              to={`/brands/${brand.id}`}
              className="bg-white rounded-lg border border-neutral-200 hover:shadow-lg transition-shadow overflow-hidden group"
            >
              {/* Brand Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  {brand.isFeatured && (
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                      Featured
                    </span>
                  )}
                  {brand.isNew && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                      New
                    </span>
                  )}
                </div>

                <h3 className="font-medium text-neutral-900 mb-1 group-hover:text-primary-600 transition-colors">
                  {brand.name}
                </h3>
                <p className="text-xs text-neutral-500 mb-2">{brand.category}</p>
                <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                  {brand.description}
                </p>

                {/* Brand Stats */}
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>{brand.productCount} products</span>
                  <span>Min: {brand.minOrder}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredBrands.length === 0 && (
          <div className="text-center py-12">
            <p className="text-neutral-600 mb-4">No brands found matching your criteria</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Load More */}
        {filteredBrands.length > 0 && (
          <div className="text-center mt-8">
            <button className="px-6 py-2.5 border border-neutral-300 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
              Load more brands
            </button>
          </div>
        )}
      </div>

      {/* Bottom CTA for Sellers */}
      <div className="bg-white border-t border-neutral-200 py-12 mt-16">
        <div className="container-custom text-center">
          <h2 className="text-2xl font-light text-neutral-900 mb-3">
            Are you a brand or maker?
          </h2>
          <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
            Join TradeZy to reach thousands of independent retailers looking for unique products. 
            Get started in minutes with no upfront costs.
          </p>
          <Link
            to="/seller/apply"
            className="inline-flex items-center px-6 py-3 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 transition-colors font-medium text-sm"
          >
            Apply to sell on TradeZy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BrandsPage;