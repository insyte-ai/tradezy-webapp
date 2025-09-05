'use client';

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  UserGroupIcon,
  CubeIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const AdminOverview: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
    activeDisputes: 0
  });

  useEffect(() => {
    // Fetch dashboard data
    // This would be replaced with actual API calls
    setStats({
      totalUsers: 1234,
      totalProducts: 5678,
      totalOrders: 892,
      totalRevenue: 2456000,
      pendingApprovals: 12,
      activeDisputes: 3
    });

    setRecentActivity([
      {
        id: 1,
        type: 'user',
        title: 'New seller registration',
        description: 'ABC Trading Co. has registered as a seller',
        icon: UserGroupIcon,
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-600',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        status: 'pending'
      },
      {
        id: 2,
        type: 'dispute',
        title: 'Order dispute filed',
        description: 'Dispute for Order #78901 - Quality issues',
        icon: ExclamationTriangleIcon,
        iconBg: 'bg-red-50',
        iconColor: 'text-red-600',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'active'
      },
      {
        id: 3,
        type: 'approval',
        title: 'Product approved',
        description: 'Premium Cotton Collection has been approved',
        icon: CheckCircleIcon,
        iconBg: 'bg-green-50',
        iconColor: 'text-green-600',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        status: 'completed'
      }
    ]);
  }, []);

  const quickActions = [
    {
      title: 'Pending Approvals',
      description: 'Review pending seller applications',
      icon: ExclamationTriangleIcon,
      href: '/admin/approvals',
      color: 'bg-orange-50 text-orange-600',
      badge: stats.pendingApprovals
    },
    {
      title: 'User Management',
      description: 'Manage buyers and sellers',
      icon: UserGroupIcon,
      href: '/admin/users',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Reports',
      description: 'View system analytics',
      icon: DocumentTextIcon,
      href: '/admin/reports',
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
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          System overview and management tools
        </p>
      </div>

      {/* Alert Banner for Urgent Items */}
      {stats.pendingApprovals > 0 && (
        <div className="bg-orange-50 border-b border-orange-200 px-8 py-3">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-orange-600 mr-2" />
            <p className="text-sm text-orange-800">
              You have <span className="font-semibold">{stats.pendingApprovals} pending approvals</span> requiring review.
            </p>
            <Link to="/admin/approvals" className="ml-4 text-sm font-medium text-orange-600 hover:text-orange-700">
              Review now →
            </Link>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Total Users</p>
                  <p className="text-2xl font-semibold text-neutral-900">{stats.totalUsers.toLocaleString()}</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                    +8% from last month
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <UserGroupIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Active Products</p>
                  <p className="text-2xl font-semibold text-neutral-900">{stats.totalProducts.toLocaleString()}</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                    +12% from last month
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <CubeIcon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Total Orders</p>
                  <p className="text-2xl font-semibold text-neutral-900">{stats.totalOrders.toLocaleString()}</p>
                  <p className="text-xs text-red-600 mt-1 flex items-center">
                    <ArrowTrendingDownIcon className="h-3 w-3 mr-1" />
                    -3% from last month
                  </p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <ShoppingBagIcon className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Platform Revenue</p>
                  <p className="text-2xl font-semibold text-neutral-900">{formatCurrency(stats.totalRevenue)}</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                    +18% from last month
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-neutral-900">System Health</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                All Systems Operational
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-neutral-600">API Response Time</span>
                <span className="text-sm font-medium text-green-600">45ms</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-neutral-600">Database Load</span>
                <span className="text-sm font-medium text-green-600">23%</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-neutral-600">Server Uptime</span>
                <span className="text-sm font-medium text-green-600">99.9%</span>
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
                      <div className="flex items-center">
                        <h3 className="text-sm font-medium text-neutral-900">{action.title}</h3>
                        {action.badge && action.badge > 0 && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {action.badge}
                          </span>
                        )}
                      </div>
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
                          <div className="flex items-center">
                            <h3 className="text-sm font-medium text-neutral-900">{item.title}</h3>
                            {item.status === 'pending' && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                Pending
                              </span>
                            )}
                            {item.status === 'active' && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                Active
                              </span>
                            )}
                          </div>
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
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;