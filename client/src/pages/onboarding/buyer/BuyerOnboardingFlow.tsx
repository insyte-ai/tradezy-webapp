import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import OnboardingLayout from '../shared/OnboardingLayout';
import ProgressIndicator from '../shared/ProgressIndicator';
import BusinessInfoStep from './BusinessInfoStep';
import ContactInfoStep from './ContactInfoStep';
import CompanyVerificationStep from './CompanyVerificationStep';
import toast from 'react-hot-toast';
import axios from 'axios';

interface OnboardingData {
  businessName: string;
  website: string;
  city: string;
  contactName: string;
  contactPhone: string;
  contactJobTitle: string;
  tradeLicenseNumber: string;
  vatTrnNumber: string;
}

const BuyerOnboardingFlow: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    businessName: '',
    website: '',
    city: '',
    contactName: '',
    contactPhone: '',
    contactJobTitle: '',
    tradeLicenseNumber: '',
    vatTrnNumber: '',
  });

  const steps = ['Business Info', 'Contact Details', 'Verification'];

  useEffect(() => {
    // Load saved progress from localStorage
    const savedData = localStorage.getItem('buyerOnboarding');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setOnboardingData(parsed.data);
      setCurrentStep(parsed.step);
    }
  }, []);

  useEffect(() => {
    // Save progress to localStorage
    localStorage.setItem('buyerOnboarding', JSON.stringify({
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

  const handleUpdateData = (data: Partial<OnboardingData>) => {
    setOnboardingData({ ...onboardingData, ...data });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/onboarding/buyer', {
        ...onboardingData,
        onboardingCompleted: true,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      // Clear saved progress
      localStorage.removeItem('buyerOnboarding');
      
      toast.success('Onboarding completed! Your account is under review.');
      navigate('/buyer/dashboard');
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
          <BusinessInfoStep
            data={onboardingData}
            onUpdate={handleUpdateData}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <ContactInfoStep
            data={onboardingData}
            onUpdate={handleUpdateData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
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
      title="Complete Your Business Profile"
      subtitle="Help us verify your business to get started"
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

export default BuyerOnboardingFlow;