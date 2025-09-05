import mongoose, { Document, Schema } from 'mongoose';

export interface IBrand extends Document {
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  website?: string;
  country: string;
  categories: mongoose.Types.ObjectId[];
  featured: boolean;
  verified: boolean;
  establishedYear?: number;
  certifications?: string[];
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  metrics?: {
    totalProducts: number;
    totalStores: number;
    averageRating: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const BrandSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  logo: String,
  description: String,
  website: String,
  country: {
    type: String,
    required: true,
    default: 'UAE'
  },
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }],
  featured: {
    type: Boolean,
    default: false
  },
  verified: {
    type: Boolean,
    default: false
  },
  establishedYear: Number,
  certifications: [String],
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String
  },
  metrics: {
    totalProducts: {
      type: Number,
      default: 0
    },
    totalStores: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    }
  }
}, {
  timestamps: true
});

// Index for slug
BrandSchema.index({ slug: 1 });
BrandSchema.index({ featured: 1 });

export default mongoose.model<IBrand>('Brand', BrandSchema);