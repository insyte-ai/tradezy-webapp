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
    // Basic phone validation - can be made more sophisticated
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const formatPhone = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX for US numbers
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
      // Only format if it looks like a US number (no + prefix)
      if (!value.startsWith('+')) {
        value = formatPhone(value);
      }
    }
    
    setFormData({ ...formData, [field]: value });
    // Clear error for this field when user types
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const jobTitles = [
    'Owner',
    'CEO',
    'President',
    'Vice President',
    'Director',
    'Manager',
    'Purchasing Manager',
    'Procurement Officer',
    'Buyer',
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
          Phone Number *
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
        <p className="mt-1 text-xs text-gray-500">Include country code for international numbers</p>
      </div>

      <div>
        <label htmlFor="contactJobTitle" className="block text-sm font-medium text-gray-700 mb-2">
          Job Title / Role *
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

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex">
          <svg className="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div className="text-sm text-green-800">
            <p className="font-medium">Your information is secure</p>
            <p className="text-xs mt-1">We'll only use this to contact you about your account and orders.</p>
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