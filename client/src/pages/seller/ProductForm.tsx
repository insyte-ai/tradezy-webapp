'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeftIcon,
  PhotoIcon,
  VideoCameraIcon,
  PlusIcon,
  TrashIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  TruckIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  CubeIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  productType: string;
  brand?: string;
  images: string[];
  videos?: string[];
  hasVariants: boolean;
  variants: ProductVariant[];
  basePrice: {
    wholesale: number;
    retail: number;
    minQuantity: number;
    currency: string;
  };
  bulkPricing: BulkPrice[];
  specifications: { [key: string]: string };
  features: string[];
  tags: string[];
  status: 'draft' | 'active' | 'inactive';
  visibility: 'public' | 'private' | 'approved_buyers';
  shipping: {
    weight?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
    packagedWeight?: number;
    packagedDimensions?: {
      length: number;
      width: number;
      height: number;
    };
    shippingClass?: string;
    freeShipping?: boolean;
    estimatedDays?: number;
  };
  inventory: {
    trackInventory: boolean;
    quantity?: number;
    lowStockAlert?: number;
  };
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  customization?: {
    enabled: boolean;
    instructions?: string;
    characterLimit?: number;
    required?: boolean;
  };
  madeIn?: string;
  tariffCode?: string;
  gtin?: string;
  sku: string;
}

interface ProductVariant {
  id: string;
  sku: string;
  options: { [key: string]: string };
  price: number;
  inventory?: number;
  images?: string[];
}

interface BulkPrice {
  minQuantity: number;
  price: number;
}

interface Category {
  _id: string;
  name: string;
  subcategories?: Category[];
}

const ProductForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    category: '',
    productType: '',
    images: [],
    hasVariants: false,
    variants: [],
    basePrice: {
      wholesale: 0,
      retail: 0,
      minQuantity: 1,
      currency: 'USD'
    },
    bulkPricing: [],
    specifications: {},
    features: [],
    tags: [],
    status: 'draft',
    visibility: 'public',
    shipping: {
      freeShipping: false
    },
    inventory: {
      trackInventory: true
    },
    seo: {},
    sku: ''
  });

  const [currentSection, setCurrentSection] = useState('basic');
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState(false);
  const [variantOptions, setVariantOptions] = useState<{ name: string; values: string[] }[]>([]);

  useEffect(() => {
    fetchCategories();
    if (isEditMode) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      // The API returns { success: true, data: categories }
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/seller/products/${id}`);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (files: FileList) => {
    setUploadingImages(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        const response = await api.post('/upload/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data.url;
      });

      const urls = await Promise.all(uploadPromises);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...urls]
      }));
      toast.success('Images uploaded successfully');
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleVideoUpload = async (files: FileList) => {
    setUploadingVideos(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('video', file);
        const response = await api.post('/upload/video', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data.url;
      });

      const urls = await Promise.all(uploadPromises);
      setFormData(prev => ({
        ...prev,
        videos: [...(prev.videos || []), ...urls]
      }));
      toast.success('Videos uploaded successfully');
    } catch (error) {
      console.error('Error uploading videos:', error);
      toast.error('Failed to upload videos');
    } finally {
      setUploadingVideos(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveVideo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos?.filter((_, i) => i !== index) || []
    }));
  };

  const addVariantOption = () => {
    setVariantOptions(prev => [...prev, { name: '', values: [] }]);
  };

  const removeVariantOption = (index: number) => {
    setVariantOptions(prev => prev.filter((_, i) => i !== index));
  };

  const addBulkPrice = () => {
    setFormData(prev => ({
      ...prev,
      bulkPricing: [...prev.bulkPricing, { minQuantity: 0, price: 0 }]
    }));
  };

  const removeBulkPrice = (index: number) => {
    setFormData(prev => ({
      ...prev,
      bulkPricing: prev.bulkPricing.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      errors.name = 'Product name is required';
    }
    if (!formData.description.trim()) {
      errors.description = 'Product description is required';
    }
    if (!formData.category) {
      errors.category = 'Category is required';
    }
    if (formData.images.length === 0) {
      errors.images = 'At least one image is required';
    }
    if (!formData.basePrice.wholesale || formData.basePrice.wholesale <= 0) {
      errors.wholesale = 'Wholesale price is required';
    }
    if (!formData.sku) {
      errors.sku = 'SKU is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (status: 'draft' | 'active' = 'draft') => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const dataToSubmit = { ...formData, status };
      
      if (isEditMode) {
        await api.put(`/seller/products/${id}`, dataToSubmit);
        toast.success('Product updated successfully');
      } else {
        await api.post('/seller/products', dataToSubmit);
        toast.success('Product created successfully');
      }
      
      navigate('/seller/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { id: 'basic', label: 'Basic Information', icon: InformationCircleIcon },
    { id: 'media', label: 'Images & Videos', icon: PhotoIcon },
    { id: 'variants', label: 'Product Options', icon: CubeIcon },
    { id: 'pricing', label: 'Pricing & Inventory', icon: CurrencyDollarIcon },
    { id: 'shipping', label: 'Shipping', icon: TruckIcon },
    { id: 'details', label: 'Product Details', icon: DocumentTextIcon },
    { id: 'seo', label: 'SEO', icon: GlobeAltIcon }
  ];

  return (
    <div className="flex flex-col h-full bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/seller/products')}
              className="mr-4 p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 text-neutral-600" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900">
                {isEditMode ? 'Edit Product' : 'Add New Product'}
              </h1>
              <p className="mt-1 text-sm text-neutral-600">
                Fill in the details below to {isEditMode ? 'update' : 'create'} your product listing
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleSubmit('draft')}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50"
            >
              Save as Draft
            </button>
            <button
              onClick={() => handleSubmit('active')}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  {isEditMode ? 'Update Product' : 'Publish Product'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-neutral-200 p-4 sticky top-4">
                <h3 className="text-sm font-medium text-neutral-900 mb-4">Sections</h3>
                <nav className="space-y-1">
                  {sections.map(section => (
                    <button
                      key={section.id}
                      onClick={() => setCurrentSection(section.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        currentSection === section.id
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <section.icon className="h-4 w-4 mr-3" />
                      {section.label}
                      {validationErrors[section.id] && (
                        <ExclamationTriangleIcon className="h-4 w-4 ml-auto text-red-500" />
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Form Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              {currentSection === 'basic' && (
                <div className="bg-white rounded-lg border border-neutral-200 p-6">
                  <h2 className="text-lg font-medium text-neutral-900 mb-6">Basic Information</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Premium Organic Cotton T-Shirt"
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        maxLength={60}
                      />
                      <p className="mt-1 text-sm text-neutral-500">
                        {formData.name.length}/60 characters
                      </p>
                      {validationErrors.name && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe your product's materials, features, and what makes it special..."
                        rows={6}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        maxLength={3000}
                      />
                      <p className="mt-1 text-sm text-neutral-500">
                        {formData.description.length}/3000 characters
                      </p>
                      {validationErrors.description && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Category *
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">Select category</option>
                          {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                          ))}
                        </select>
                        {validationErrors.category && (
                          <p className="mt-1 text-sm text-red-600">{validationErrors.category}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Product Type *
                        </label>
                        <input
                          type="text"
                          value={formData.productType}
                          onChange={(e) => setFormData(prev => ({ ...prev, productType: e.target.value }))}
                          placeholder="e.g., T-Shirt, Coffee Mug, etc."
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Brand
                        </label>
                        <input
                          type="text"
                          value={formData.brand || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                          placeholder="Your brand name"
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          SKU *
                        </label>
                        <input
                          type="text"
                          value={formData.sku}
                          onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                          placeholder="e.g., ABC-123"
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        {validationErrors.sku && (
                          <p className="mt-1 text-sm text-red-600">{validationErrors.sku}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Images & Videos */}
              {currentSection === 'media' && (
                <div className="bg-white rounded-lg border border-neutral-200 p-6">
                  <h2 className="text-lg font-medium text-neutral-900 mb-6">Images & Videos</h2>
                  
                  <div className="space-y-6">
                    {/* Images */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Product Images *
                      </label>
                      <p className="text-sm text-neutral-500 mb-4">
                        Add up to 10 images. First image will be the main product image.
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Product ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                            {index === 0 && (
                              <span className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-60 text-white text-xs rounded">
                                Main
                              </span>
                            )}
                          </div>
                        ))}
                        
                        {formData.images.length < 10 && (
                          <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                              className="hidden"
                            />
                            {uploadingImages ? (
                              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent" />
                            ) : (
                              <>
                                <PhotoIcon className="h-8 w-8 text-neutral-400" />
                                <span className="mt-2 text-sm text-neutral-600">Add Image</span>
                              </>
                            )}
                          </label>
                        )}
                      </div>
                      
                      {validationErrors.images && (
                        <p className="mt-2 text-sm text-red-600">{validationErrors.images}</p>
                      )}
                    </div>

                    {/* Videos */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Product Videos
                      </label>
                      <p className="text-sm text-neutral-500 mb-4">
                        Add up to 3 videos to showcase your product (max 2GB each)
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {formData.videos?.map((video, index) => (
                          <div key={index} className="relative group">
                            <video
                              src={video}
                              className="w-full h-32 object-cover rounded-lg"
                              controls
                            />
                            <button
                              onClick={() => handleRemoveVideo(index)}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        
                        {(!formData.videos || formData.videos.length < 3) && (
                          <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                            <input
                              type="file"
                              multiple
                              accept="video/*"
                              onChange={(e) => e.target.files && handleVideoUpload(e.target.files)}
                              className="hidden"
                            />
                            {uploadingVideos ? (
                              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent" />
                            ) : (
                              <>
                                <VideoCameraIcon className="h-8 w-8 text-neutral-400" />
                                <span className="mt-2 text-sm text-neutral-600">Add Video</span>
                              </>
                            )}
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Product Variants */}
              {currentSection === 'variants' && (
                <div className="bg-white rounded-lg border border-neutral-200 p-6">
                  <h2 className="text-lg font-medium text-neutral-900 mb-6">Product Options</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={!formData.hasVariants}
                          onChange={() => setFormData(prev => ({ ...prev, hasVariants: false }))}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-neutral-700">This product doesn't have options</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={formData.hasVariants}
                          onChange={() => setFormData(prev => ({ ...prev, hasVariants: true }))}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-neutral-700">This product has options</span>
                      </label>
                    </div>

                    {formData.hasVariants && (
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-neutral-900">Option Types</h3>
                            <button
                              onClick={addVariantOption}
                              className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                            >
                              <PlusIcon className="h-4 w-4 mr-1" />
                              Add Option
                            </button>
                          </div>
                          
                          {variantOptions.map((option, index) => (
                            <div key={index} className="flex items-start space-x-4 mb-4">
                              <input
                                type="text"
                                value={option.name}
                                onChange={(e) => {
                                  const newOptions = [...variantOptions];
                                  newOptions[index].name = e.target.value;
                                  setVariantOptions(newOptions);
                                }}
                                placeholder="Option name (e.g., Size, Color)"
                                className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                              <input
                                type="text"
                                value={option.values.join(', ')}
                                onChange={(e) => {
                                  const newOptions = [...variantOptions];
                                  newOptions[index].values = e.target.value.split(',').map(v => v.trim());
                                  setVariantOptions(newOptions);
                                }}
                                placeholder="Values (comma separated)"
                                className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                              <button
                                onClick={() => removeVariantOption(index)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Pricing & Inventory */}
              {currentSection === 'pricing' && (
                <div className="bg-white rounded-lg border border-neutral-200 p-6">
                  <h2 className="text-lg font-medium text-neutral-900 mb-6">Pricing & Inventory</h2>
                  
                  <div className="space-y-6">
                    {/* Selling Method */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Selling Method
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-start">
                          <input
                            type="radio"
                            name="sellingMethod"
                            className="h-4 w-4 mt-1 text-primary-600 focus:ring-primary-500"
                          />
                          <div className="ml-3">
                            <span className="text-sm font-medium text-neutral-900">By the item</span>
                            <p className="text-sm text-neutral-500">Retailers purchase the product individually</p>
                          </div>
                        </label>
                        <label className="flex items-start">
                          <input
                            type="radio"
                            name="sellingMethod"
                            className="h-4 w-4 mt-1 text-primary-600 focus:ring-primary-500"
                          />
                          <div className="ml-3">
                            <span className="text-sm font-medium text-neutral-900">By the case</span>
                            <p className="text-sm text-neutral-500">Retailers purchase as a case with multiple items</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div>
                      <h3 className="text-sm font-medium text-neutral-900 mb-4">Pricing</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Wholesale Price *
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                            <input
                              type="number"
                              value={formData.basePrice.wholesale}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                basePrice: { ...prev.basePrice, wholesale: parseFloat(e.target.value) || 0 }
                              }))}
                              className="w-full pl-8 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                              min="0"
                              step="0.01"
                            />
                          </div>
                          {validationErrors.wholesale && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.wholesale}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Retail Price
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                            <input
                              type="number"
                              value={formData.basePrice.retail}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                basePrice: { ...prev.basePrice, retail: parseFloat(e.target.value) || 0 }
                              }))}
                              className="w-full pl-8 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Min Order Quantity
                          </label>
                          <input
                            type="number"
                            value={formData.basePrice.minQuantity}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              basePrice: { ...prev.basePrice, minQuantity: parseInt(e.target.value) || 1 }
                            }))}
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            min="1"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bulk Pricing */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-neutral-900">Bulk Pricing</h3>
                        <button
                          onClick={addBulkPrice}
                          className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                        >
                          <PlusIcon className="h-4 w-4 mr-1" />
                          Add Tier
                        </button>
                      </div>
                      
                      {formData.bulkPricing.map((tier, index) => (
                        <div key={index} className="flex items-center space-x-4 mb-3">
                          <div className="flex-1">
                            <input
                              type="number"
                              value={tier.minQuantity}
                              onChange={(e) => {
                                const newPricing = [...formData.bulkPricing];
                                newPricing[index].minQuantity = parseInt(e.target.value) || 0;
                                setFormData(prev => ({ ...prev, bulkPricing: newPricing }));
                              }}
                              placeholder="Min quantity"
                              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                              min="1"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                              <input
                                type="number"
                                value={tier.price}
                                onChange={(e) => {
                                  const newPricing = [...formData.bulkPricing];
                                  newPricing[index].price = parseFloat(e.target.value) || 0;
                                  setFormData(prev => ({ ...prev, bulkPricing: newPricing }));
                                }}
                                placeholder="Price per item"
                                className="w-full pl-8 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                min="0"
                                step="0.01"
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => removeBulkPrice(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Inventory */}
                    <div>
                      <h3 className="text-sm font-medium text-neutral-900 mb-4">Inventory</h3>
                      <div className="space-y-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.inventory.trackInventory}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              inventory: { ...prev.inventory, trackInventory: e.target.checked }
                            }))}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 rounded"
                          />
                          <span className="ml-2 text-sm text-neutral-700">Track inventory for this product</span>
                        </label>
                        
                        {formData.inventory.trackInventory && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                            <div>
                              <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Available Quantity
                              </label>
                              <input
                                type="number"
                                value={formData.inventory.quantity || ''}
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  inventory: { ...prev.inventory, quantity: parseInt(e.target.value) || 0 }
                                }))}
                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                min="0"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Low Stock Alert
                              </label>
                              <input
                                type="number"
                                value={formData.inventory.lowStockAlert || ''}
                                onChange={(e) => setFormData(prev => ({
                                  ...prev,
                                  inventory: { ...prev.inventory, lowStockAlert: parseInt(e.target.value) || 0 }
                                }))}
                                placeholder="Alert when stock falls below"
                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                min="0"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preview Card */}
              <div className="bg-white rounded-lg border border-neutral-200 p-6">
                <h3 className="text-sm font-medium text-neutral-900 mb-4">Preview</h3>
                <div className="flex items-start space-x-4">
                  {formData.images[0] ? (
                    <img
                      src={formData.images[0]}
                      alt="Product preview"
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-neutral-100 rounded-lg flex items-center justify-center">
                      <PhotoIcon className="h-8 w-8 text-neutral-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-neutral-900">
                      {formData.name || 'Product Name'}
                    </h4>
                    <p className="mt-1 text-sm text-neutral-600 line-clamp-2">
                      {formData.description || 'Product description will appear here...'}
                    </p>
                    {formData.basePrice.wholesale > 0 && (
                      <p className="mt-2 text-lg font-semibold text-neutral-900">
                        ${formData.basePrice.wholesale.toFixed(2)}
                        <span className="text-sm font-normal text-neutral-500 ml-1">
                          / min {formData.basePrice.minQuantity}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;