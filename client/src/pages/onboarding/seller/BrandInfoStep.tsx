import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface BrandInfoStepProps {
  data: {
    brandName: string;
    storeName: string;
    primaryCategory: string;
  };
  onUpdate: (data: any) => void;
  onNext: () => void;
}

const categories = [
  'Home & Living',
  'Electronics',
  'Fashion & Apparel',
  'Health & Beauty',
  'Food & Beverage',
  'Office Supplies',
  'Sports & Outdoors',
  'Toys & Games',
  'Pet Supplies',
  'Arts & Crafts',
  'Jewelry & Accessories',
  'Baby & Kids',
  'Automotive',
  'Books & Media',
  'Industrial & Scientific',
];

const BrandInfoStep: React.FC<BrandInfoStepProps> = ({ data, onUpdate, onNext }) => {
  const [formData, setFormData] = useState({
    brandName: data.brandName || '',
    storeName: data.storeName || '',
    primaryCategory: data.primaryCategory || '',
  });

  const [errors, setErrors] = useState<any>({});

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!formData.brandName.trim()) {
      newErrors.brandName = 'Brand name is required';
    } else if (formData.brandName.length < 2) {
      newErrors.brandName = 'Brand name must be at least 2 characters';
    }
    
    if (!formData.storeName.trim()) {
      newErrors.storeName = 'Store name is required';
    } else if (formData.storeName.length < 3) {
      newErrors.storeName = 'Store name must be at least 3 characters';
    }
    
    if (!formData.primaryCategory) {
      newErrors.primaryCategory = 'Please select a primary category';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onUpdate(formData);
      onNext();
    } else {
      toast.error('Please fix the errors before continuing');
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field when user types
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const generateStoreName = () => {
    if (formData.brandName && !formData.storeName) {
      const suggested = formData.brandName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      setFormData({ ...formData, storeName: suggested });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 mb-2">
          Brand Name *
        </label>
        <input
          type="text"
          id="brandName"
          value={formData.brandName}
          onChange={(e) => handleChange('brandName', e.target.value)}
          onBlur={generateStoreName}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.brandName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Your brand name"
        />
        {errors.brandName && (
          <p className="mt-1 text-sm text-red-600">{errors.brandName}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">This is how your brand will appear to buyers</p>
      </div>

      <div>
        <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-2">
          Store URL Name *
        </label>
        <div className="flex items-center">
          <span className="inline-flex items-center px-3 py-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
            tradezy.com/
          </span>
          <input
            type="text"
            id="storeName"
            value={formData.storeName}
            onChange={(e) => handleChange('storeName', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
            className={`flex-1 px-4 py-3 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.storeName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="your-store-name"
          />
        </div>
        {errors.storeName && (
          <p className="mt-1 text-sm text-red-600">{errors.storeName}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">Choose a unique URL for your storefront (letters, numbers, and hyphens only)</p>
      </div>

      <div>
        <label htmlFor="primaryCategory" className="block text-sm font-medium text-gray-700 mb-2">
          Primary Category *
        </label>
        <select
          id="primaryCategory"
          value={formData.primaryCategory}
          onChange={(e) => handleChange('primaryCategory', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.primaryCategory ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select your primary category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.primaryCategory && (
          <p className="mt-1 text-sm text-red-600">{errors.primaryCategory}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">Select the category that best describes your products</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Building your brand on TradeZy</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Your brand name will be displayed on all your products</li>
              <li>Store URL will be your unique storefront address</li>
              <li>You can add more categories after completing onboarding</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 font-medium"
        >
          Continue
        </button>
      </div>
    </form>
  );
};

export default BrandInfoStep;