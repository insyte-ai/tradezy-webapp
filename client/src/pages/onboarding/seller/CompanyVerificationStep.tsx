import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { DocumentTextIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface CompanyVerificationStepProps {
  data: {
    tradeLicenseNumber: string;
    vatTrnNumber: string;
  };
  onUpdate: (data: any) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const CompanyVerificationStep: React.FC<CompanyVerificationStepProps> = ({ 
  data, 
  onUpdate, 
  onSubmit, 
  onBack, 
  isSubmitting 
}) => {
  const [formData, setFormData] = useState({
    tradeLicenseNumber: data.tradeLicenseNumber || '',
    vatTrnNumber: data.vatTrnNumber || '',
  });

  const [errors, setErrors] = useState<any>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToSellerTerms, setAgreedToSellerTerms] = useState(false);

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!formData.tradeLicenseNumber.trim()) {
      newErrors.tradeLicenseNumber = 'Trade license number is required';
    }
    
    if (!formData.vatTrnNumber.trim()) {
      newErrors.vatTrnNumber = 'VAT TRN number is required';
    } else if (!isValidVatTrn(formData.vatTrnNumber)) {
      newErrors.vatTrnNumber = 'Please enter a valid 15-digit VAT TRN';
    }
    
    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }
    
    if (!agreedToSellerTerms) {
      newErrors.sellerTerms = 'You must agree to the seller agreement';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidVatTrn = (trn: string) => {
    const trnRegex = /^\d{15}$/;
    return trnRegex.test(trn.replace(/\s/g, ''));
  };

  const formatVatTrn = (value: string) => {
    const digits = value.replace(/\D/g, '');
    
    if (digits.length <= 5) return digits;
    if (digits.length <= 10) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    return `${digits.slice(0, 5)}-${digits.slice(5, 10)}-${digits.slice(10, 15)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onUpdate(formData);
      onSubmit();
    } else {
      toast.error('Please fix the errors before continuing');
    }
  };

  const handleChange = (field: string, value: string) => {
    if (field === 'vatTrnNumber') {
      value = formatVatTrn(value);
    }
    
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex">
          <ShieldCheckIcon className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium">Business Verification Required</p>
            <p className="text-xs mt-1">We verify all sellers to maintain marketplace integrity and protect buyers.</p>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="tradeLicenseNumber" className="block text-sm font-medium text-gray-700 mb-2">
          Trade License Number *
        </label>
        <div className="relative">
          <input
            type="text"
            id="tradeLicenseNumber"
            value={formData.tradeLicenseNumber}
            onChange={(e) => handleChange('tradeLicenseNumber', e.target.value)}
            className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.tradeLicenseNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your trade license number"
          />
          <DocumentTextIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
        </div>
        {errors.tradeLicenseNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.tradeLicenseNumber}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">As shown on your business trade license</p>
      </div>

      <div>
        <label htmlFor="vatTrnNumber" className="block text-sm font-medium text-gray-700 mb-2">
          VAT TRN Number *
        </label>
        <div className="relative">
          <input
            type="text"
            id="vatTrnNumber"
            value={formData.vatTrnNumber}
            onChange={(e) => handleChange('vatTrnNumber', e.target.value)}
            className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.vatTrnNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="XXXXX-XXXXX-XXXXX"
            maxLength={17}
          />
          <DocumentTextIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
        </div>
        {errors.vatTrnNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.vatTrnNumber}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">15-digit VAT Tax Registration Number</p>
      </div>

      <div className="space-y-4 border-t pt-6">
        <div className="flex items-start">
          <input
            type="checkbox"
            id="terms"
            checked={agreedToTerms}
            onChange={(e) => {
              setAgreedToTerms(e.target.checked);
              if (errors.terms) {
                setErrors({ ...errors, terms: '' });
              }
            }}
            className="mt-1 mr-2"
          />
          <label htmlFor="terms" className="text-sm text-gray-700">
            I certify that the information provided is accurate and that I am authorized to create this seller account on behalf of my company. I agree to TradeZy's{' '}
            <a href="/terms" target="_blank" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" target="_blank" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>.
          </label>
        </div>
        {errors.terms && (
          <p className="mt-1 text-sm text-red-600 ml-6">{errors.terms}</p>
        )}

        <div className="flex items-start">
          <input
            type="checkbox"
            id="sellerTerms"
            checked={agreedToSellerTerms}
            onChange={(e) => {
              setAgreedToSellerTerms(e.target.checked);
              if (errors.sellerTerms) {
                setErrors({ ...errors, sellerTerms: '' });
              }
            }}
            className="mt-1 mr-2"
          />
          <label htmlFor="sellerTerms" className="text-sm text-gray-700">
            I agree to the{' '}
            <a href="/seller-agreement" target="_blank" className="text-blue-600 hover:underline">
              Seller Agreement
            </a>
            , including the commission structure and payment terms.
          </label>
        </div>
        {errors.sellerTerms && (
          <p className="mt-1 text-sm text-red-600 ml-6">{errors.sellerTerms}</p>
        )}
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex">
          <svg className="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-green-800">
            <p className="font-medium">What happens next?</p>
            <ul className="list-disc list-inside space-y-1 text-xs mt-1">
              <li>Your application will be reviewed within 24-48 hours</li>
              <li>You'll receive an email once your account is approved</li>
              <li>Once approved, you can start listing products immediately</li>
              <li>Our seller success team will reach out to help you get started</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting Application...
            </span>
          ) : (
            'Submit Application'
          )}
        </button>
      </div>
    </form>
  );
};

export default CompanyVerificationStep;