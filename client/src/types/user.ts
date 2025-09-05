export enum UserRole {
  ADMIN = 'admin',
  SELLER = 'seller',
  BUYER = 'buyer',
}

export enum UserStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended',
}

export interface BuyerProfile {
  businessName: string;
  website?: string;
  city: string;
  contactName: string;
  contactPhone: string;
  contactJobTitle: string;
  tradeLicenseNumber: string;
  vatTrnNumber: string;
}

export interface SellerProfile {
  brandName: string;
  storeName: string;
  primaryCategory: string;
  businessName: string;
  logo?: string;
  website?: string;
  address: {
    city: string;
    state: string;
    country: string;
  };
  baseCurrency: string;
  contactName: string;
  contactPhone: string;
  contactJobTitle: string;
  tradeLicenseNumber: string;
  vatTrnNumber: string;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  company?: {
    name: string;
    registrationNumber?: string;
    taxId?: string;
    website?: string;
    description?: string;
    logo?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
    };
  };
  emailVerified: boolean;
  onboardingCompleted: boolean;
  onboardingStep?: number;
  buyerProfile?: BuyerProfile;
  sellerProfile?: SellerProfile;
  createdAt: string;
  updatedAt: string;
}