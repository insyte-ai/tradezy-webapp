import { Response } from 'express';
import User, { UserStatus } from '../models/User';
import { AuthRequest } from '../middleware/auth';
import logger from '../utils/logger';
import emailService from '../services/emailService';

export const updateBuyerOnboarding = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { step, data } = req.body;

    logger.info('Buyer onboarding update', { userId, step });

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (user.role !== 'buyer') {
      res.status(403).json({ error: 'This endpoint is for buyers only' });
      return;
    }

    // Update fields based on step
    switch (step) {
      case 1: // Business Information
        if (!user.company) user.company = {};
        user.company.name = data.businessName;
        user.company.website = data.website;
        user.company.industry = data.industry;
        user.company.size = data.companySize;
        user.company.yearEstablished = data.yearEstablished;
        user.company.description = data.description;
        break;

      case 2: // Contact Details
        user.firstName = data.contactFirstName;
        user.lastName = data.contactLastName;
        user.phoneNumber = data.contactPhone;
        if (!user.company) user.company = {};
        user.company.address = {
          street: data.address,
          city: data.city,
          state: data.emirate,
          country: data.country || 'UAE',
          postalCode: data.postalCode,
        };
        break;

      case 3: // Verification
        if (!user.company) user.company = {};
        user.company.tradeLicenseNumber = data.tradeLicenseNumber;
        user.company.taxId = data.vatTrn;
        // Note: Document uploads would be handled separately
        break;
    }

    // Update onboarding progress
    user.onboardingStep = step;
    if (step === 3) {
      user.onboardingCompleted = true;
      user.status = UserStatus.PENDING; // Pending admin approval
      
      logger.info('Buyer onboarding completed, pending approval', { userId });
    }

    await user.save();

    res.json({
      message: 'Onboarding updated successfully',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        status: user.status,
        onboardingStep: user.onboardingStep,
        onboardingCompleted: user.onboardingCompleted,
      },
    });
  } catch (error: any) {
    logger.error('Buyer onboarding update error', {
      userId: req.user?.userId,
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: 'Failed to update onboarding' });
  }
};

export const updateSellerOnboarding = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { step, data } = req.body;

    logger.info('Seller onboarding update', { userId, step });

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (user.role !== 'seller') {
      res.status(403).json({ error: 'This endpoint is for sellers only' });
      return;
    }

    // Update fields based on step
    switch (step) {
      case 1: // Brand Information
        if (!user.company) user.company = {};
        user.company.name = data.brandName;
        user.company.website = data.website;
        user.company.description = data.description;
        user.company.logo = data.logoUrl;
        if (!user.seller) user.seller = {};
        user.seller.categories = data.categories;
        user.seller.currencies = data.currencies;
        break;

      case 2: // Business Details
        if (!user.company) user.company = {};
        user.company.yearEstablished = data.yearEstablished;
        user.company.size = data.employeeCount;
        user.company.monthlyVolume = data.monthlyVolume;
        if (!user.seller) user.seller = {};
        user.seller.warehouseLocations = data.warehouseLocations;
        user.seller.shippingMethods = data.shippingMethods;
        break;

      case 3: // Contact Information
        user.firstName = data.contactFirstName;
        user.lastName = data.contactLastName;
        user.phoneNumber = data.contactPhone;
        if (!user.company) user.company = {};
        user.company.address = {
          street: data.address,
          city: data.city,
          state: data.emirate,
          country: data.country || 'UAE',
          postalCode: data.postalCode,
        };
        break;

      case 4: // Verification
        if (!user.company) user.company = {};
        user.company.tradeLicenseNumber = data.tradeLicenseNumber;
        user.company.taxId = data.vatTrn;
        if (!user.seller) user.seller = {};
        user.seller.bankAccount = {
          bankName: data.bankName,
          accountName: data.accountName,
          accountNumber: data.accountNumber,
          iban: data.iban,
          swiftCode: data.swiftCode,
        };
        break;
    }

    // Update onboarding progress
    user.onboardingStep = step;
    if (step === 4) {
      user.onboardingCompleted = true;
      user.status = UserStatus.APPROVED; // Auto-approve sellers for now
      
      logger.info('Seller onboarding completed', { userId });
      
      // Send welcome email
      try {
        await emailService.sendWelcomeEmail(
          user.email,
          `${user.firstName} ${user.lastName}`,
          'seller'
        );
      } catch (emailError: any) {
        logger.error('Failed to send welcome email', {
          userId,
          error: emailError.message,
        });
      }
    }

    await user.save();

    res.json({
      message: 'Onboarding updated successfully',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        status: user.status,
        onboardingStep: user.onboardingStep,
        onboardingCompleted: user.onboardingCompleted,
      },
    });
  } catch (error: any) {
    logger.error('Seller onboarding update error', {
      userId: req.user?.userId,
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: 'Failed to update onboarding' });
  }
};

export const getOnboardingStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const user = await User.findById(userId).select(
      'email role status onboardingStep onboardingCompleted firstName lastName company'
    );

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        status: user.status,
        onboardingStep: user.onboardingStep,
        onboardingCompleted: user.onboardingCompleted,
        firstName: user.firstName,
        lastName: user.lastName,
        company: user.company,
      },
    });
  } catch (error: any) {
    logger.error('Get onboarding status error', {
      userId: req.user?.userId,
      error: error.message,
    });
    res.status(500).json({ error: 'Failed to get onboarding status' });
  }
};

export const completeOnboarding = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Verify all required fields are present
    if (!user.firstName || !user.lastName || !user.company?.name) {
      res.status(400).json({ 
        error: 'Incomplete profile. Please complete all required fields.' 
      });
      return;
    }

    user.onboardingCompleted = true;
    
    // Set appropriate status based on role
    if (user.role === 'buyer') {
      user.status = UserStatus.PENDING; // Buyers need approval
    } else if (user.role === 'seller') {
      user.status = UserStatus.APPROVED; // Auto-approve sellers for now
      
      // Send welcome email to sellers
      try {
        await emailService.sendWelcomeEmail(
          user.email,
          `${user.firstName} ${user.lastName}`,
          'seller'
        );
      } catch (emailError: any) {
        logger.error('Failed to send welcome email', {
          userId,
          error: emailError.message,
        });
      }
    }

    await user.save();

    logger.info('Onboarding completed', { 
      userId, 
      role: user.role, 
      status: user.status 
    });

    res.json({
      message: 'Onboarding completed successfully',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        status: user.status,
        onboardingCompleted: true,
      },
    });
  } catch (error: any) {
    logger.error('Complete onboarding error', {
      userId: req.user?.userId,
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: 'Failed to complete onboarding' });
  }
};