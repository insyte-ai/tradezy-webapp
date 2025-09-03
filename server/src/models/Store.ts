import { Schema, model, Document, Types } from 'mongoose';
import slugify from 'slugify';

export interface IStore extends Document {
  seller: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  banner?: string;
  categories: Types.ObjectId[];
  featured: {
    products?: Types.ObjectId[];
    collections?: Array<{
      name: string;
      products: Types.ObjectId[];
    }>;
  };
  contact: {
    email: string;
    phoneNumber: string;
    address?: {
      street: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
    };
  };
  businessInfo: {
    established?: Date;
    employeeCount?: string;
    annualRevenue?: string;
    certifications?: Array<{
      name: string;
      issuedBy: string;
      validUntil?: Date;
    }>;
    capabilities?: string[];
    minimumOrder?: number;
    leadTime?: string;
    paymentTerms?: string[];
    shippingTerms?: string[];
  };
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  policies?: {
    return?: string;
    shipping?: string;
    warranty?: string;
    privacy?: string;
  };
  ratings: {
    average: number;
    count: number;
  };
  metrics: {
    totalProducts: number;
    totalOrders: number;
    responseTime: string;
    fulfillmentRate: number;
  };
  isActive: boolean;
  isPremium: boolean;
  customization?: {
    primaryColor?: string;
    secondaryColor?: string;
    font?: string;
    customCss?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const storeSchema = new Schema<IStore>({
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    maxlength: 2000
  },
  logo: String,
  banner: String,
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }],
  featured: {
    products: [{
      type: Schema.Types.ObjectId,
      ref: 'Product'
    }],
    collections: [{
      name: String,
      products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
      }]
    }]
  },
  contact: {
    email: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    }
  },
  businessInfo: {
    established: Date,
    employeeCount: String,
    annualRevenue: String,
    certifications: [{
      name: String,
      issuedBy: String,
      validUntil: Date
    }],
    capabilities: [String],
    minimumOrder: Number,
    leadTime: String,
    paymentTerms: [String],
    shippingTerms: [String]
  },
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String,
    youtube: String
  },
  policies: {
    return: String,
    shipping: String,
    warranty: String,
    privacy: String
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  metrics: {
    totalProducts: {
      type: Number,
      default: 0
    },
    totalOrders: {
      type: Number,
      default: 0
    },
    responseTime: {
      type: String,
      default: 'Within 24 hours'
    },
    fulfillmentRate: {
      type: Number,
      default: 100,
      min: 0,
      max: 100
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  customization: {
    primaryColor: String,
    secondaryColor: String,
    font: String,
    customCss: String
  }
}, {
  timestamps: true
});

storeSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

storeSchema.index({ isActive: 1, isPremium: -1 });
storeSchema.index({ 'ratings.average': -1 });

const Store = model<IStore>('Store', storeSchema);

export default Store;