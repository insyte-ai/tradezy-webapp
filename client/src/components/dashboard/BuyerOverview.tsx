'use client';

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  ShoppingBagIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  ClockIcon,
  ChevronRightIcon,
  PlusCircleIcon,
  TruckIcon,
  CurrencyDollarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const BuyerOverview: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [stats, setStats] = useState({
    activeOrders: 0,
    pendingRfqs: 0,
    savedSuppliers: 0,
    monthlySpending: 0
  });

  useEffect(() => {
    // Fetch dashboard data
    // This would be replaced with actual API calls
    setStats({
      activeOrders: 5,
      pendingRfqs: 3,
      savedSuppliers: 12,
      monthlySpending: 45000
    });

    setRecentActivity([
      {
        id: 1,
        type: 'order',
        title: 'Order #12345 shipped',
        description: 'Your order from ABC Wholesale has been shipped',
        icon: TruckIcon,
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-600',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: 2,
        type: 'rfq',
        title: 'RFQ response received',
        description: 'XYZ Supplier responded to your bulk order request',
        icon: ChatBubbleLeftRightIcon,
        iconBg: 'bg-green-50',
        iconColor: 'text-green-600',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },
      {
        id: 3,
        type: 'price',
        title: 'Price drop alert',
        description: 'Premium Cotton T-Shirts are now 15% off',
        icon: CurrencyDollarIcon,
        iconBg: 'bg-yellow-50',
        iconColor: 'text-yellow-600',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      }
    ]);
  }, []);

  const quickActions = [
    {
      title: 'Browse Products',
      description: 'Discover new wholesale products',
      icon: ShoppingBagIcon,
      href: '/products',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Create RFQ',
      description: 'Request quotes for bulk orders',
      icon: DocumentTextIcon,
      href: '/buyer/rfqs/new',
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'View Suppliers',
      description: 'Manage your supplier network',
      icon: BuildingOfficeIcon,
      href: '/buyer/suppliers',
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
          Here's what's happening with your wholesale business
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
                  <p className="text-sm text-neutral-600 mb-1">Active Orders</p>
                  <p className="text-2xl font-semibold text-neutral-900">{stats.activeOrders}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <ShoppingBagIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <Link to="/buyer/orders" className="mt-3 text-sm text-primary-600 hover:text-primary-700 flex items-center">
                View all <ChevronRightIcon className="h-3 w-3 ml-1" />
              </Link>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Pending RFQs</p>
                  <p className="text-2xl font-semibold text-neutral-900">{stats.pendingRfqs}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <Link to="/buyer/rfqs" className="mt-3 text-sm text-primary-600 hover:text-primary-700 flex items-center">
                View all <ChevronRightIcon className="h-3 w-3 ml-1" />
              </Link>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Saved Suppliers</p>
                  <p className="text-2xl font-semibold text-neutral-900">{stats.savedSuppliers}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <HeartIcon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <Link to="/buyer/suppliers" className="mt-3 text-sm text-primary-600 hover:text-primary-700 flex items-center">
                View all <ChevronRightIcon className="h-3 w-3 ml-1" />
              </Link>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Monthly Spending</p>
                  <p className="text-2xl font-semibold text-neutral-900">{formatCurrency(stats.monthlySpending)}</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <ChartBarIcon className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <Link to="/buyer/analytics" className="mt-3 text-sm text-primary-600 hover:text-primary-700 flex items-center">
                View report <ChevronRightIcon className="h-3 w-3 ml-1" />
              </Link>
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
                <p className="text-xs text-neutral-400 mt-1">
                  Start browsing products or create an RFQ to get started
                </p>
              </div>
            )}
          </div>

          {/* Getting Started (for new users) */}
          {stats.activeOrders === 0 && stats.savedSuppliers === 0 && (
            <div className="mt-8 bg-gradient-to-r from-primary-50 to-orange-50 rounded-lg p-8 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <PlusCircleIcon className="h-12 w-12 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                    Start sourcing wholesale products
                  </h2>
                  <p className="text-neutral-600 mb-4">
                    TradeZy connects you with verified wholesale suppliers. Browse products, 
                    request quotes, and manage orders all in one place.
                  </p>
                  <div className="flex space-x-3">
                    <Link
                      to="/products"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                    >
                      Browse Products
                    </Link>
                    <Link
                      to="/buyer/rfqs/new"
                      className="inline-flex items-center px-4 py-2 border border-primary-600 text-sm font-medium rounded-md text-primary-600 bg-white hover:bg-neutral-50"
                    >
                      Create RFQ
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerOverview;