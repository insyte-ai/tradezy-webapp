'use client';

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import {
  HomeIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  BellIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  CubeIcon,
  TruckIcon,
  HeartIcon,
  BuildingStorefrontIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { UserRole } from '../../types/user';

interface DashboardSidebarProps {
  role: 'admin' | 'seller' | 'buyer';
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ role }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dashboardSidebarCollapsed');
      return saved !== null ? saved === 'true' : false;
    }
    return false;
  });

  // Define navigation items based on role
  const getNavigation = () => {
    switch (role) {
      case 'admin':
        return [
          { name: 'Dashboard', href: '/admin', icon: HomeIcon },
          { name: 'Users', href: '/admin/users', icon: UserGroupIcon },
          { name: 'Products', href: '/admin/products', icon: CubeIcon },
          { name: 'Orders', href: '/admin/orders', icon: ShoppingBagIcon },
          { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
          { name: 'Reports', href: '/admin/reports', icon: DocumentTextIcon },
          { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
        ];
      case 'seller':
        return [
          { name: 'Dashboard', href: '/seller', icon: HomeIcon },
          { name: 'Products', href: '/seller/products', icon: CubeIcon },
          { name: 'Orders', href: '/seller/orders', icon: ShoppingBagIcon },
          { name: 'Inventory', href: '/seller/inventory', icon: TruckIcon },
          { name: 'Storefront', href: '/seller/storefront', icon: BuildingStorefrontIcon },
          { name: 'RFQs', href: '/seller/rfqs', icon: ChatBubbleLeftRightIcon },
          { name: 'Analytics', href: '/seller/analytics', icon: ChartBarIcon },
          { name: 'Settings', href: '/seller/settings', icon: Cog6ToothIcon },
        ];
      case 'buyer':
        return [
          { name: 'Dashboard', href: '/buyer', icon: HomeIcon },
          { name: 'Orders', href: '/buyer/orders', icon: ShoppingBagIcon },
          { name: 'RFQs', href: '/buyer/rfqs', icon: ChatBubbleLeftRightIcon },
          { name: 'Favorites', href: '/buyer/favorites', icon: HeartIcon },
          { name: 'Suppliers', href: '/buyer/suppliers', icon: BuildingOfficeIcon },
          { name: 'Analytics', href: '/buyer/analytics', icon: ChartBarIcon },
          { name: 'Settings', href: '/buyer/settings', icon: Cog6ToothIcon },
        ];
      default:
        return [];
    }
  };

  const navigation = getNavigation();

  // Save sidebar collapsed state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboardSidebarCollapsed', isCollapsed.toString());
    }
  }, [isCollapsed]);

  const handleLogout = async () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-neutral-200 flex flex-col transition-all duration-300`}>
      {/* Logo/Header */}
      <div className="p-4 border-b border-neutral-200">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <Link to="/" className={`flex items-center space-x-2 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 bg-primary-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            {!isCollapsed && <span className="font-semibold text-neutral-900">TradeZy</span>}
          </Link>
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded hover:bg-neutral-100 transition-colors"
            >
              <ChevronLeftIcon className="w-4 h-4 text-neutral-600" />
            </button>
          )}
        </div>
        {isCollapsed && (
          <div className="flex justify-center mt-2">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded hover:bg-neutral-100 transition-colors"
            >
              <ChevronRightIcon className="w-4 h-4 text-neutral-600" />
            </button>
          </div>
        )}
      </div>

      {/* Role Badge */}
      {user?.role === UserRole.ADMIN && (
        <div className="px-3 pt-3">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''} px-3 py-1.5 text-sm font-medium bg-red-50 text-red-700 rounded-md`}>
            <ShieldCheckIcon className="h-4 w-4 mr-1.5" />
            {!isCollapsed && 'Admin'}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 pt-4 pb-3 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href !== `/${role}` && location.pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              to={item.href}
              title={isCollapsed ? item.name : undefined}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <item.icon className={`${isCollapsed ? 'w-5 h-5' : 'w-5 h-5 mr-3'} flex-shrink-0`} />
              {!isCollapsed && item.name}
            </Link>
          );
        })}
      </nav>

      {/* Notifications */}
      <div className="px-3 pb-3">
        <button
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : ''} px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 rounded-lg transition-colors`}
        >
          <BellIcon className={`${isCollapsed ? 'w-5 h-5' : 'w-5 h-5 mr-3'} flex-shrink-0`} />
          {!isCollapsed && (
            <>
              <span className="flex-1 text-left">Notifications</span>
              <span className="ml-2 bg-primary-500 text-white text-xs rounded-full px-2 py-0.5">3</span>
            </>
          )}
        </button>
      </div>

      {/* User Section */}
      <div className="border-t border-neutral-200 p-3">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-between'}`}>
          {!isCollapsed && user && (
            <div className="flex items-center min-w-0">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                {user.firstName?.[0] || user.email[0].toUpperCase()}
              </div>
              <div className="ml-2 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">
                  {user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : user.firstName || user.email.split('@')[0]}
                </p>
                <p className="text-xs text-neutral-500 truncate capitalize">
                  {user.role}
                </p>
              </div>
            </div>
          )}
          <div className={`flex ${isCollapsed ? 'flex-col space-y-2' : 'space-x-1'}`}>
            <button
              onClick={() => navigate(`/${role}/settings`)}
              className="p-1.5 rounded hover:bg-neutral-100 transition-colors"
              title="Settings"
            >
              <Cog6ToothIcon className="w-5 h-5 text-neutral-600" />
            </button>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded hover:bg-neutral-100 transition-colors"
              title="Logout"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 text-neutral-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;