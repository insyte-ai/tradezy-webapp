import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import { ShoppingBagIcon, UserIcon, Bars3Icon, MagnifyingGlassIcon, GlobeAmericasIcon } from '@heroicons/react/24/outline';
import CategoryMenu from '../components/CategoryMenu';
import MobileCategoryMenu from '../components/MobileCategoryMenu';

const MainLayout: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { totalItems } = useSelector((state: RootState) => state.cart);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [mobileCategoryMenuOpen, setMobileCategoryMenuOpen] = React.useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Banner */}
      <div className="bg-neutral-50 py-2 text-center text-xs border-b border-neutral-200">
        <p className="text-neutral-600">
          Shop wholesale online from over 100,000 brands. 
          <Link to="/auth/signup" className="ml-2 underline font-medium text-neutral-900">Sign up</Link>
        </p>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="container-custom">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="text-2xl font-light tracking-widest text-neutral-900 uppercase">
              TradeZy
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <input
                  type="search"
                  placeholder="Search wholesale products or brands"
                  className="w-full pl-4 pr-10 py-2.5 border border-neutral-300 rounded-full text-sm focus:outline-none focus:border-neutral-500 bg-neutral-50"
                />
                <MagnifyingGlassIcon className="absolute right-3 top-3 h-5 w-5 text-neutral-400" />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              <button className="hidden lg:flex items-center text-sm text-neutral-600 hover:text-neutral-900">
                <GlobeAmericasIcon className="h-4 w-4 mr-1" />
                EN-US
              </button>
              
              {isAuthenticated ? (
                <>
                  <Link to="/blog" className="hidden md:block text-sm text-neutral-600 hover:text-neutral-900">
                    Blog
                  </Link>
                  <Link to="/brands" className="hidden md:block text-sm text-neutral-600 hover:text-neutral-900">
                    Sell on TradeZy
                  </Link>
                  <Link 
                    to={`/${user?.role}`} 
                    className="hidden md:flex items-center text-sm text-neutral-600 hover:text-neutral-900"
                  >
                    <UserIcon className="h-5 w-5 mr-1" />
                    Dashboard
                  </Link>
                  <Link to="/cart" className="relative p-2">
                    <ShoppingBagIcon className="h-6 w-6 text-neutral-700" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-neutral-900 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="hidden md:block text-sm text-neutral-600 hover:text-neutral-900"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/blog" className="hidden md:block text-sm text-neutral-600 hover:text-neutral-900">
                    Blog
                  </Link>
                  <Link to="/brands" className="hidden md:block text-sm text-neutral-600 hover:text-neutral-900">
                    Sell on TradeZy
                  </Link>
                  <Link to="/auth/login" className="text-sm text-neutral-600 hover:text-neutral-900">
                    Sign in
                  </Link>
                  <Link to="/auth/signup" className="btn btn-dark text-sm py-2 px-4">
                    Join free
                  </Link>
                </>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2"
              >
                <Bars3Icon className="h-6 w-6 text-neutral-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Navigation Bar */}
        <div className="hidden lg:block border-t border-neutral-200">
          <div className="container-custom">
            <CategoryMenu />
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-neutral-200">
            <div className="container-custom py-4 space-y-3">
              <div className="md:hidden">
                <input
                  type="search"
                  placeholder="Search products, brands..."
                  className="w-full px-4 py-2 border border-neutral-200 rounded-full text-sm"
                />
              </div>
              <button
                onClick={() => {
                  setMobileCategoryMenuOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-neutral-700 hover:text-neutral-900 font-medium"
              >
                Browse Categories
              </button>
              <Link 
                to="/products" 
                className="block py-2 text-neutral-700 hover:text-neutral-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                All Products
              </Link>
              <Link 
                to="/featured" 
                className="block py-2 text-neutral-700 hover:text-neutral-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                Featured
              </Link>
              <Link 
                to="/new" 
                className="block py-2 text-neutral-700 hover:text-neutral-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                New Arrivals
              </Link>
              <Link 
                to="/brands" 
                className="block py-2 text-neutral-700 hover:text-neutral-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                Brands
              </Link>
              {isAuthenticated && (
                <>
                  <Link 
                    to={`/${user?.role}`} 
                    className="block py-2 text-neutral-700 hover:text-neutral-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-neutral-700 hover:text-neutral-900"
                  >
                    Sign out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 mt-20">
        <div className="container-custom py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-lg font-normal text-neutral-900 mb-4">TradeZy</h3>
              <p className="text-sm text-neutral-600">
                The wholesale marketplace for independent retailers.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-neutral-900 mb-4">Shop</h4>
              <ul className="space-y-2">
                <li><Link to="/products" className="text-sm text-neutral-600 hover:text-neutral-900">All Products</Link></li>
                <li><Link to="/categories" className="text-sm text-neutral-600 hover:text-neutral-900">Categories</Link></li>
                <li><Link to="/brands" className="text-sm text-neutral-600 hover:text-neutral-900">Brands</Link></li>
                <li><Link to="/new" className="text-sm text-neutral-600 hover:text-neutral-900">New Arrivals</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-neutral-900 mb-4">Sell</h4>
              <ul className="space-y-2">
                <li><Link to="/brands" className="text-sm text-neutral-600 hover:text-neutral-900">Start Selling</Link></li>
                <li><Link to="/seller-guide" className="text-sm text-neutral-600 hover:text-neutral-900">Seller Guide</Link></li>
                <li><Link to="/pricing" className="text-sm text-neutral-600 hover:text-neutral-900">Pricing</Link></li>
                <li><Link to="/success-stories" className="text-sm text-neutral-600 hover:text-neutral-900">Success Stories</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-neutral-900 mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-sm text-neutral-600 hover:text-neutral-900">About Us</Link></li>
                <li><Link to="/careers" className="text-sm text-neutral-600 hover:text-neutral-900">Careers</Link></li>
                <li><Link to="/press" className="text-sm text-neutral-600 hover:text-neutral-900">Press</Link></li>
                <li><Link to="/contact" className="text-sm text-neutral-600 hover:text-neutral-900">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-neutral-900 mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link to="/help" className="text-sm text-neutral-600 hover:text-neutral-900">Help Center</Link></li>
                <li><Link to="/shipping" className="text-sm text-neutral-600 hover:text-neutral-900">Shipping Info</Link></li>
                <li><Link to="/returns" className="text-sm text-neutral-600 hover:text-neutral-900">Returns</Link></li>
                <li><Link to="/terms" className="text-sm text-neutral-600 hover:text-neutral-900">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-neutral-200">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-neutral-600">
                © 2024 TradeZy. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link to="/privacy" className="text-sm text-neutral-600 hover:text-neutral-900">Privacy Policy</Link>
                <Link to="/terms" className="text-sm text-neutral-600 hover:text-neutral-900">Terms of Use</Link>
                <Link to="/cookies" className="text-sm text-neutral-600 hover:text-neutral-900">Cookie Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Category Menu */}
      <MobileCategoryMenu 
        isOpen={mobileCategoryMenuOpen} 
        onClose={() => setMobileCategoryMenuOpen(false)} 
      />
    </div>
  );
};

export default MainLayout;