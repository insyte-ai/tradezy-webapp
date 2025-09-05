import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export enum UserRole {
  ADMIN = 'admin',
  SELLER = 'seller',
  BUYER = 'buyer'
}

export enum UserStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended'
}

export interface IBuyerProfile {
  businessName: string;
  website?: string;
  city: string;
  contactName: string;
  contactPhone: string;
  contactJobTitle: string;
  tradeLicenseNumber: string;
  vatTrnNumber: string;
}

export interface ISellerProfile {
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

export interface IUser extends Document {
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  onboardingCompleted: boolean;
  onboardingStep?: number;
  buyerProfile?: IBuyerProfile;
  sellerProfile?: ISellerProfile;
  company?: {
    name?: string;
    registrationNumber?: string;
    taxId?: string;
    tradeLicenseNumber?: string;
    website?: string;
    description?: string;
    logo?: string;
    industry?: string;
    size?: string;
    yearEstablished?: number;
    monthlyVolume?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      postalCode?: string;
    };
  };
  verificationDocuments?: Array<{
    type: string;
    url: string;
    uploadedAt: Date;
  }>;
  emailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  refreshTokens: string[];
  lastLogin?: Date;
  seller?: {
    categories?: string[];
    currencies?: string[];
    warehouseLocations?: string[];
    shippingMethods?: string[];
    bankAccount?: {
      bankName?: string;
      accountName?: string;
      accountNumber?: string;
      iban?: string;
      swiftCode?: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    required: true
  },
  status: {
    type: String,
    enum: Object.values(UserStatus),
    default: UserStatus.PENDING
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  onboardingCompleted: {
    type: Boolean,
    default: false
  },
  onboardingStep: {
    type: Number,
    default: 0
  },
  buyerProfile: {
    businessName: String,
    website: String,
    city: String,
    contactName: String,
    contactPhone: String,
    contactJobTitle: String,
    tradeLicenseNumber: String,
    vatTrnNumber: String
  },
  sellerProfile: {
    brandName: String,
    storeName: String,
    primaryCategory: String,
    businessName: String,
    logo: String,
    website: String,
    address: {
      city: String,
      state: String,
      country: String
    },
    baseCurrency: String,
    contactName: String,
    contactPhone: String,
    contactJobTitle: String,
    tradeLicenseNumber: String,
    vatTrnNumber: String
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  company: {
    name: {
      type: String,
      required: false  // Will be required during onboarding, not at signup
    },
    registrationNumber: String,
    taxId: String,
    website: String,
    description: String,
    logo: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String
    },
    industry: String,
    size: String,
    yearEstablished: Number,
    tradeLicenseNumber: String,
    monthlyVolume: String
  },
  verificationDocuments: [{
    type: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  refreshTokens: [String],
  lastLogin: Date,
  seller: {
    categories: [String],
    currencies: [String],
    warehouseLocations: [String],
    shippingMethods: [String],
    bankAccount: {
      bankName: String,
      accountName: String,
      accountNumber: String,
      iban: String,
      swiftCode: String
    }
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.index({ role: 1, status: 1 });
userSchema.index({ 'company.name': 1 });

const User = model<IUser>('User', userSchema);

export default User;