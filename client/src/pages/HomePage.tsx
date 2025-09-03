import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, SparklesIcon, ShieldCheckIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const HomePage: React.FC = () => {
  const categories = [
    { 
      name: 'Home & Living', 
      count: '2,500+ brands',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
    },
    { 
      name: 'Beauty & Wellness', 
      count: '1,800+ brands',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
    },
    { 
      name: 'Food & Beverage', 
      count: '3,200+ brands',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    },
    { 
      name: 'Fashion & Accessories', 
      count: '4,100+ brands',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=400&fit=crop',
    },
    { 
      name: 'Art & Decor', 
      count: '1,500+ brands',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&h=400&fit=crop',
    },
    { 
      name: 'Office & Tech', 
      count: '900+ brands',
      image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&h=400&fit=crop',
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cream to-white">
        <div className="container-custom py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-normal text-neutral-900 leading-tight mb-6">
                The wholesale marketplace for retailers
              </h1>
              <p className="text-xl text-neutral-600 mb-8">
                Source unique products from independent brands. Join thousands of retailers shopping wholesale online.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth/register?type=buyer" className="btn btn-primary inline-flex items-center justify-center">
                  Start Shopping
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
                <Link to="/auth/register?type=seller" className="btn btn-secondary inline-flex items-center justify-center">
                  Sell on TradeZy
                </Link>
              </div>
              <p className="mt-6 text-sm text-neutral-500">
                Free to join • No subscription fees • 60-day payment terms available
              </p>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img 
                    src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=300&h=400&fit=crop" 
                    alt="Product" 
                    className="rounded-2xl shadow-lg w-full object-cover"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=300&h=300&fit=crop" 
                    alt="Product" 
                    className="rounded-2xl shadow-lg w-full object-cover"
                  />
                </div>
                <div className="space-y-4 pt-8">
                  <img 
                    src="https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=300&h=300&fit=crop" 
                    alt="Product" 
                    className="rounded-2xl shadow-lg w-full object-cover"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300&h=400&fit=crop" 
                    alt="Product" 
                    className="rounded-2xl shadow-lg w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-normal text-neutral-900 mb-4">Shop by category</h2>
            <p className="text-lg text-neutral-600">Discover unique products from independent brands worldwide</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.name} 
                to={`/products?category=${category.name}`}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-medium mb-1">{category.name}</h3>
                  <p className="text-sm opacity-90">{category.count}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/categories" className="btn btn-outline inline-flex items-center">
              View all categories
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-beige">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-normal text-neutral-900 mb-4">Why retailers choose TradeZy</h2>
            <p className="text-lg text-neutral-600">Everything you need to stock your store and grow your business</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <SparklesIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-medium mb-2 text-neutral-900">Unique products</h3>
              <p className="text-neutral-600">
                Discover one-of-a-kind items from independent brands you won't find anywhere else
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <CurrencyDollarIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-medium mb-2 text-neutral-900">Wholesale pricing</h3>
              <p className="text-neutral-600">
                Get up to 50% off retail prices with low minimums and flexible payment terms
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <ShieldCheckIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-medium mb-2 text-neutral-900">Protected orders</h3>
              <p className="text-neutral-600">
                Shop with confidence knowing your orders are protected by our guarantee
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-normal text-neutral-900 mb-2">100K+</div>
              <p className="text-neutral-600">Independent retailers</p>
            </div>
            <div>
              <div className="text-4xl font-normal text-neutral-900 mb-2">50K+</div>
              <p className="text-neutral-600">Unique brands</p>
            </div>
            <div>
              <div className="text-4xl font-normal text-neutral-900 mb-2">$2B+</div>
              <p className="text-neutral-600">GMV annually</p>
            </div>
            <div>
              <div className="text-4xl font-normal text-neutral-900 mb-2">180+</div>
              <p className="text-neutral-600">Countries served</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-neutral-900 text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-normal mb-4">Ready to grow your business?</h2>
          <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
            Join thousands of retailers discovering unique products and building lasting relationships with brands.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/register?type=buyer" className="btn bg-white text-neutral-900 hover:bg-neutral-100 inline-flex items-center justify-center">
              Sign up as buyer
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
            <Link to="/auth/register?type=seller" className="btn border border-white text-white hover:bg-white hover:text-neutral-900 inline-flex items-center justify-center">
              Start selling
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;