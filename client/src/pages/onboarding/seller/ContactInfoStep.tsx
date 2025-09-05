import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface ContactInfoStepProps {
  data: {
    contactName: string;
    contactPhone: string;
    contactJobTitle: string;
  };
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const ContactInfoStep: React.FC<ContactInfoStepProps> = ({ data, onUpdate, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    contactName: data.contactName || '',
    contactPhone: data.contactPhone || '',
    contactJobTitle: data.contactJobTitle || '',
  });

  const [errors, setErrors] = useState<any>({});

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!formData.contactName.trim()) {
      newErrors.contactName = 'Contact name is required';
    }
    
    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = 'Phone number is required';
    } else if (!isValidPhone(formData.contactPhone)) {
      newErrors.contactPhone = 'Please enter a valid phone number';
    }
    
    if (!formData.contactJobTitle.trim()) {
      newErrors.contactJobTitle = 'Job title is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidPhone = (phone: string) => {
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
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
    if (field === 'contactPhone') {
      if (!value.startsWith('+')) {
        value = formatPhone(value);
      }
    }
    
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const jobTitles = [
    'Owner',
    'Founder',
    'CEO',
    'President',
    'Vice President',
    'Director',
    'Sales Manager',
    'Business Development Manager',
    'Marketing Manager',
    'Operations Manager',
    'Account Manager',
    'Other',
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
          Primary Contact Name *
        </label>
        <input
          type="text"
          id="contactName"
          value={formData.contactName}
          onChange={(e) => handleChange('contactName', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.contactName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Full name"
        />
        {errors.contactName && (
          <p className="mt-1 text-sm text-red-600">{errors.contactName}</p>
        )}
      </div>

      <div>
        <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">
          Business Phone Number *
        </label>
        <input
          type="tel"
          id="contactPhone"
          value={formData.contactPhone}
          onChange={(e) => handleChange('contactPhone', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.contactPhone ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="(555) 123-4567"
        />
        {errors.contactPhone && (
          <p className="mt-1 text-sm text-red-600">{errors.contactPhone}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">We'll use this for important account notifications</p>
      </div>

      <div>
        <label htmlFor="contactJobTitle" className="block text-sm font-medium text-gray-700 mb-2">
          Your Role *
        </label>
        <select
          id="contactJobTitle"
          value={formData.contactJobTitle}
          onChange={(e) => handleChange('contactJobTitle', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            errors.contactJobTitle ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select your role</option>
          {jobTitles.map((title) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))}
        </select>
        {errors.contactJobTitle && (
          <p className="mt-1 text-sm text-red-600">{errors.contactJobTitle}</p>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Why we need contact information:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Account verification and security</li>
              <li>Order and payment notifications</li>
              <li>Direct support when you need it</li>
              <li>Important platform updates</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
        >
          Back
        </button>
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

export default ContactInfoStep;