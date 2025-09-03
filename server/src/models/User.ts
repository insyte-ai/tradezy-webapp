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

export interface IUser extends Document {
  email: string;
  password: string;
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
    address: {
      street: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
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
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  company: {
    name: {
      type: String,
      required: function() {
        return this.role !== UserRole.ADMIN;
      }
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
      zipCode: String
    }
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
  lastLogin: Date
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