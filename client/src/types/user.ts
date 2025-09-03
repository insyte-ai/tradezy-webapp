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

export interface User {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  firstName: string;
  lastName: string;
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
  createdAt: string;
  updatedAt: string;
}