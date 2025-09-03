import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';

interface DashboardLayoutProps {
  role: 'admin' | 'seller' | 'buyer';
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    dispatch(logout());
  };

  const getMenuItems = () => {
    switch (role) {
      case 'admin':
        return [
          { path: '/admin', label: 'Dashboard', icon: '📊' },
          { path: '/admin/users', label: 'Users', icon: '👥' },
          { path: '/admin/products', label: 'Products', icon: '📦' },
          { path: '/admin/orders', label: 'Orders', icon: '📋' },
          { path: '/admin/categories', label: 'Categories', icon: '🏷️' },
          { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
        ];
      case 'seller':
        return [
          { path: '/seller', label: 'Dashboard', icon: '📊' },
          { path: '/seller/products', label: 'Products', icon: '📦' },
          { path: '/seller/orders', label: 'Orders', icon: '📋' },
          { path: '/seller/inventory', label: 'Inventory', icon: '📦' },
          { path: '/seller/storefront', label: 'Storefront', icon: '🏪' },
          { path: '/seller/rfqs', label: 'RFQs', icon: '💬' },
          { path: '/seller/analytics', label: 'Analytics', icon: '📈' },
          { path: '/seller/settings', label: 'Settings', icon: '⚙️' },
        ];
      case 'buyer':
        return [
          { path: '/buyer', label: 'Dashboard', icon: '📊' },
          { path: '/buyer/orders', label: 'Orders', icon: '📋' },
          { path: '/buyer/rfqs', label: 'RFQs', icon: '💬' },
          { path: '/buyer/favorites', label: 'Favorites', icon: '❤️' },
          { path: '/buyer/suppliers', label: 'Suppliers', icon: '🏭' },
          { path: '/buyer/settings', label: 'Settings', icon: '⚙️' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300`}>
        <div className="p-4">
          <Link to="/" className="flex items-center space-x-2">
            <h1 className={`text-2xl font-bold text-primary-600 ${!sidebarOpen && 'hidden'}`}>
              TradeZy
            </h1>
          </Link>
        </div>

        <nav className="mt-8">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 hover:bg-primary-50 transition-colors ${
                location.pathname === item.path ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600' : 'text-secondary-700'
              }`}
            >
              <span className="text-xl mr-3">{item.icon}</span>
              <span className={`${!sidebarOpen && 'hidden'}`}>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full btn btn-outline mb-2"
          >
            {sidebarOpen ? '←' : '→'}
          </button>
          <button
            onClick={handleLogout}
            className={`w-full btn btn-secondary ${!sidebarOpen && 'hidden'}`}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm h-16 flex items-center px-6">
          <div className="flex justify-between items-center w-full">
            <h2 className="text-xl font-semibold text-secondary-900 capitalize">
              {role} Dashboard
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-secondary-600">
                Welcome, {user?.firstName} {user?.lastName}
              </span>
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-600 font-semibold">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;