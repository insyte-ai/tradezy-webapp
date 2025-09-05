'use client';

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  ShoppingBagIcon,
  CubeIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon,
  ChevronRightIcon,
  PlusCircleIcon,
  TruckIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const SellerOverview: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    pendingOrders: 0,
    monthlyRevenue: 0,
    totalViews: 0
  });

  useEffect(() => {
    // Fetch dashboard data
    // This would be replaced with actual API calls
    setStats({
      totalProducts: 45,
      pendingOrders: 8,
      monthlyRevenue: 128500,
      totalViews: 3420
    });

    setRecentActivity([
      {
        id: 1,
        type: 'order',
        title: 'New order received',
        description: 'Order #54321 from RetailPlus Inc.',
        icon: ShoppingBagIcon,
        iconBg: 'bg-green-50',
        iconColor: 'text-green-600',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
      {
        id: 2,
        type: 'rfq',
        title: 'New RFQ received',
        description: 'Bulk order inquiry for Premium Cotton Shirts',
        icon: ChatBubbleLeftRightIcon,
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-600',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      },
      {
        id: 3,
        type: 'product',
        title: 'Low inventory alert',
        description: 'Organic Cotton T-Shirt - Only 5 units left',
        icon: CubeIcon,
        iconBg: 'bg-yellow-50',
        iconColor: 'text-yellow-600',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      }
    ]);
  }, []);

  const quickActions = [
    {
      title: 'Add Product',
      description: 'List a new product for sale',
      icon: PlusCircleIcon,
      href: '/seller/products/new',
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'View Orders',
      description: 'Manage pending and recent orders',
      icon: ShoppingBagIcon,
      href: '/seller/orders',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Update Inventory',
      description: 'Manage product stock levels',
      icon: CubeIcon,
      href: '/seller/inventory',
      color: 'bg-purple-50 text-purple-600'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDistanceToNow = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-8 py-6">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Welcome back{user?.firstName ? `, ${user.firstName}` : ''}
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Here's your business overview and latest updates
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Total Products</p>
                  <p className="text-2xl font-semibold text-neutral-900">{stats.totalProducts}</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                    +12% from last month
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <CubeIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Pending Orders</p>
                  <p className="text-2xl font-semibold text-neutral-900">{stats.pendingOrders}</p>
                  <p className="text-xs text-orange-600 mt-1">Requires action</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <ShoppingBagIcon className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Monthly Revenue</p>
                  <p className="text-2xl font-semibold text-neutral-900">{formatCurrency(stats.monthlyRevenue)}</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                    +23% from last month
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Product Views</p>
                  <p className="text-2xl font-semibold text-neutral-900">{stats.totalViews.toLocaleString()}</p>
                  <p className="text-xs text-neutral-500 mt-1">This month</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <EyeIcon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Performance Chart Placeholder */}
          <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-neutral-900">Sales Performance</h2>
              <Link to="/seller/analytics" className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
                View detailed analytics <ChevronRightIcon className="h-3 w-3 ml-1" />
              </Link>
            </div>
            <div className="h-64 bg-neutral-50 rounded flex items-center justify-center">
              <div className="text-center">
                <ChartBarIcon className="h-12 w-12 text-neutral-400 mx-auto mb-2" />
                <p className="text-sm text-neutral-500">Sales chart will appear here</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-neutral-900 mb-4">Quick actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action) => (
                <Link
                  key={action.title}
                  to={action.href}
                  className="relative rounded-lg border border-neutral-200 bg-white p-6 hover:border-neutral-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 p-2 rounded-lg ${action.color}`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-neutral-900">{action.title}</h3>
                      <p className="mt-1 text-sm text-neutral-500">{action.description}</p>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 text-neutral-400 flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-lg font-medium text-neutral-900 mb-4">Recent activity</h2>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((item) => (
                  <div
                    key={item.id}
                    className="block w-full text-left rounded-lg border border-neutral-200 bg-white p-6 hover:border-neutral-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 p-2 rounded-lg ${item.iconBg}`}>
                        <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-neutral-900">{item.title}</h3>
                          <div className="flex items-center text-xs text-neutral-500">
                            <ClockIcon className="h-3.5 w-3.5 mr-1" />
                            {formatDistanceToNow(item.timestamp)}
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-neutral-600">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-neutral-50 rounded-lg">
                <ClockIcon className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-sm text-neutral-500">No recent activity</p>
              </div>
            )}
          </div>

          {/* Getting Started (for new sellers) */}
          {stats.totalProducts === 0 && (
            <div className="mt-8 bg-gradient-to-r from-primary-50 to-orange-50 rounded-lg p-8 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <PlusCircleIcon className="h-12 w-12 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                    Start selling on TradeZy
                  </h2>
                  <p className="text-neutral-600 mb-4">
                    List your products and reach thousands of wholesale buyers. 
                    Our platform makes it easy to manage inventory, process orders, and grow your business.
                  </p>
                  <Link
                    to="/seller/products/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                  >
                    <PlusCircleIcon className="h-5 w-5 mr-2" />
                    Add Your First Product
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerOverview;