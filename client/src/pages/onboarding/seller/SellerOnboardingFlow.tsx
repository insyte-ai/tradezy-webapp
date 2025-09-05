import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import OnboardingLayout from '../shared/OnboardingLayout';
import ProgressIndicator from '../shared/ProgressIndicator';
import BrandInfoStep from './BrandInfoStep';
import BusinessDetailsStep from './BusinessDetailsStep';
import ContactInfoStep from './ContactInfoStep';
import CompanyVerificationStep from './CompanyVerificationStep';
import toast from 'react-hot-toast';
import axios from 'axios';

interface SellerOnboardingData {
  // Brand Info
  brandName: string;
  storeName: string;
  primaryCategory: string;
  // Business Details
  businessName: string;
  logo?: string;
  website: string;
  city: string;
  state: string;
  country: string;
  baseCurrency: string;
  // Contact Info
  contactName: string;
  contactPhone: string;
  contactJobTitle: string;
  // Verification
  tradeLicenseNumber: string;
  vatTrnNumber: string;
}

const SellerOnboardingFlow: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [onboardingData, setOnboardingData] = useState<SellerOnboardingData>({
    brandName: '',
    storeName: '',
    primaryCategory: '',
    businessName: '',
    logo: '',
    website: '',
    city: '',
    state: '',
    country: '',
    baseCurrency: 'USD',
    contactName: '',
    contactPhone: '',
    contactJobTitle: '',
    tradeLicenseNumber: '',
    vatTrnNumber: '',
  });

  const steps = ['Brand Info', 'Business Details', 'Contact', 'Verification'];

  useEffect(() => {
    // Load saved progress from localStorage
    const savedData = localStorage.getItem('sellerOnboarding');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setOnboardingData(parsed.data);
      setCurrentStep(parsed.step);
    }
  }, []);

  useEffect(() => {
    // Save progress to localStorage
    localStorage.setItem('sellerOnboarding', JSON.stringify({
      data: onboardingData,
      step: currentStep,
    }));
  }, [onboardingData, currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleUpdateData = (data: Partial<SellerOnboardingData>) => {
    setOnboardingData({ ...onboardingData, ...data });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/onboarding/seller', {
        sellerProfile: {
          brandName: onboardingData.brandName,
          storeName: onboardingData.storeName,
          primaryCategory: onboardingData.primaryCategory,
          businessName: onboardingData.businessName,
          logo: onboardingData.logo,
          website: onboardingData.website,
          address: {
            city: onboardingData.city,
            state: onboardingData.state,
            country: onboardingData.country,
          },
          baseCurrency: onboardingData.baseCurrency,
          contactName: onboardingData.contactName,
          contactPhone: onboardingData.contactPhone,
          contactJobTitle: onboardingData.contactJobTitle,
          tradeLicenseNumber: onboardingData.tradeLicenseNumber,
          vatTrnNumber: onboardingData.vatTrnNumber,
        },
        onboardingCompleted: true,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      // Clear saved progress
      localStorage.removeItem('sellerOnboarding');
      
      toast.success('Onboarding completed! Your application is under review.');
      navigate('/seller/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to complete onboarding');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BrandInfoStep
            data={onboardingData}
            onUpdate={handleUpdateData}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <BusinessDetailsStep
            data={onboardingData}
            onUpdate={handleUpdateData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <ContactInfoStep
            data={onboardingData}
            onUpdate={handleUpdateData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <CompanyVerificationStep
            data={onboardingData}
            onUpdate={handleUpdateData}
            onSubmit={handleSubmit}
            onBack={handleBack}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <OnboardingLayout 
      title="Set Up Your Seller Account"
      subtitle="Tell us about your brand and business"
    >
      <ProgressIndicator
        currentStep={currentStep}
        totalSteps={steps.length}
        steps={steps}
      />
      {renderStep()}
    </OnboardingLayout>
  );
};

export default SellerOnboardingFlow;