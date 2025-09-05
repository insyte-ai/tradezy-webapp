'use client';

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowUpTrayIcon,
  EllipsisVerticalIcon,
  ChevronDownIcon,
  PhotoIcon,
  CubeIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/20/solid';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  basePrice: {
    wholesale: number;
    minQuantity: number;
    currency: string;
  };
  status: 'draft' | 'active' | 'inactive' | 'outOfStock';
  inventory?: number;
  views: number;
  category: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

const statusColors = {
  active: 'bg-green-50 text-green-700 ring-green-600/20',
  draft: 'bg-gray-50 text-gray-700 ring-gray-600/20',
  inactive: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
  outOfStock: 'bg-red-50 text-red-700 ring-red-600/20'
};

const SellerProducts: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setShowBulkActions(selectedProducts.length > 0);
  }, [selectedProducts]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/seller/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map(p => p._id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.delete(`/seller/products/${productId}`);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) return;

    try {
      await Promise.all(selectedProducts.map(id => api.delete(`/seller/products/${id}`)));
      toast.success('Products deleted successfully');
      setSelectedProducts([]);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting products:', error);
      toast.error('Failed to delete products');
    }
  };

  const handleDuplicateProduct = async (productId: string) => {
    try {
      await api.post(`/seller/products/${productId}/duplicate`);
      toast.success('Product duplicated successfully');
      fetchProducts();
    } catch (error) {
      console.error('Error duplicating product:', error);
      toast.error('Failed to duplicate product');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Products</h1>
            <p className="mt-1 text-sm text-neutral-600">
              Manage your product catalog and inventory
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 flex items-center">
              <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
              Import
            </button>
            <Link
              to="/seller/products/new"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border-b border-neutral-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="inactive">Inactive</option>
              <option value="outOfStock">Out of Stock</option>
            </select>
            <button className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 flex items-center">
              <FunnelIcon className="h-4 w-4 mr-2" />
              More Filters
            </button>
          </div>
          <div className="text-sm text-neutral-600">
            {filteredProducts.length} products
          </div>
        </div>

        {/* Bulk Actions */}
        {showBulkActions && (
          <div className="mt-4 flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
            <span className="text-sm text-neutral-700">
              {selectedProducts.length} selected
            </span>
            <div className="h-4 w-px bg-neutral-300" />
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
            >
              Delete
            </button>
            <button className="px-3 py-1 text-sm text-neutral-700 hover:bg-white rounded">
              Change Status
            </button>
            <button className="px-3 py-1 text-sm text-neutral-700 hover:bg-white rounded">
              Export
            </button>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-full">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-sm text-neutral-600">Loading products...</p>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <CubeIcon className="h-12 w-12 text-neutral-400 mx-auto" />
                <h3 className="mt-2 text-sm font-medium text-neutral-900">No products found</h3>
                <p className="mt-1 text-sm text-neutral-600">
                  {searchTerm || selectedStatus !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Get started by adding your first product'}
                </p>
                {!searchTerm && selectedStatus === 'all' && (
                  <Link
                    to="/seller/products/new"
                    className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Product
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === filteredProducts.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Inventory
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => handleSelectProduct(product._id)}
                        className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-16 w-16 flex-shrink-0">
                          {product.images[0] ? (
                            <img
                              className="h-16 w-16 rounded-lg object-cover"
                              src={product.images[0]}
                              alt={product.name}
                            />
                          ) : (
                            <div className="h-16 w-16 rounded-lg bg-neutral-100 flex items-center justify-center">
                              <PhotoIcon className="h-8 w-8 text-neutral-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-neutral-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-neutral-500">
                            {product.category?.name || 'Uncategorized'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${statusColors[product.status]}`}>
                        {product.status === 'outOfStock' ? 'Out of Stock' : product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-900">
                      {product.inventory !== undefined ? (
                        <span className={product.inventory < 10 ? 'text-red-600' : ''}>
                          {product.inventory} units
                        </span>
                      ) : (
                        <span className="text-neutral-500">Not tracked</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-900">
                      ${product.basePrice.wholesale.toFixed(2)}
                      <span className="text-neutral-500 text-xs ml-1">
                        / min {product.basePrice.minQuantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-900">
                      <div className="flex items-center">
                        <EyeIcon className="h-4 w-4 mr-1 text-neutral-400" />
                        {product.views}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/seller/products/${product._id}/edit`}
                          className="text-neutral-600 hover:text-neutral-900"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDuplicateProduct(product._id)}
                          className="text-neutral-600 hover:text-neutral-900"
                        >
                          <DocumentDuplicateIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerProducts;