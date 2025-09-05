import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface BusinessInfoStepProps {
  data: {
    businessName: string;
    website: string;
    city: string;
  };
  onUpdate: (data: any) => void;
  onNext: () => void;
}

const BusinessInfoStep: React.FC<BusinessInfoStepProps> = ({ data, onUpdate, onNext }) => {
  const [formData, setFormData] = useState({
    businessName: data.businessName || '',
    website: data.website || '',
    city: data.city || '',
  });

  const [errors, setErrors] = useState<any>({});

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Please enter a valid website URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      // Add protocol if missing
      const urlToTest = url.startsWith('http') ? url : `https://${url}`;
      new URL(urlToTest);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Add protocol to website if missing
      const websiteWithProtocol = formData.website && !formData.website.startsWith('http') 
        ? `https://${formData.website}` 
        : formData.website;
      
      onUpdate({
        ...formData,
        website: websiteWithProtocol,
      });
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
          Business Name *
        </label>
        <input
          type="text"
          id="businessName"
          value={formData.businessName}
          onChange={(e) => handleChange('businessName', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.businessName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter your company name"
        />
        {errors.businessName && (
          <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>
        )}
      </div>

      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
          Company Website
        </label>
        <input
          type="text"
          id="website"
          value={formData.website}
          onChange={(e) => handleChange('website', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.website ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="www.example.com"
        />
        {errors.website && (
          <p className="mt-1 text-sm text-red-600">{errors.website}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">Optional - helps us verify your business</p>
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
          City *
        </label>
        <input
          type="text"
          id="city"
          value={formData.city}
          onChange={(e) => handleChange('city', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.city ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter your business city"
        />
        {errors.city && (
          <p className="mt-1 text-sm text-red-600">{errors.city}</p>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Why we need this information:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>To verify your business is legitimate</li>
              <li>To connect you with relevant suppliers</li>
              <li>To ensure compliance with local regulations</li>
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

export default BusinessInfoStep;