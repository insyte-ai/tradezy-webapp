import { Schema, model, Document, Types } from 'mongoose';
import slugify from 'slugify';

export interface IProductVariant {
  sku: string;
  attributes: Map<string, string>;
  price: {
    wholesale: number;
    minQuantity: number;
    bulkPricing?: Array<{
      minQuantity: number;
      price: number;
    }>;
  };
  inventory: {
    available: number;
    reserved: number;
    warehouse?: string;
  };
  images?: string[];
  isActive: boolean;
}

export interface IProduct extends Document {
  seller: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  category: Types.ObjectId;
  subcategory?: Types.ObjectId;
  productCategory?: Types.ObjectId;
  brand?: string;
  images: string[];
  videos?: string[];
  variants: IProductVariant[];
  basePrice: {
    wholesale: number;
    minQuantity: number;
    currency: string;
  };
  specifications?: Map<string, any>;
  features?: string[];
  tags?: string[];
  status: 'draft' | 'active' | 'inactive' | 'outOfStock';
  visibility: 'public' | 'private' | 'approved_buyers';
  certifications?: Array<{
    name: string;
    issuedBy: string;
    documentUrl?: string;
    validUntil?: Date;
  }>;
  shipping: {
    weight?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
    shippingClass?: string;
    freeShipping?: boolean;
    estimatedDays?: number;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  ratings: {
    average: number;
    count: number;
  };
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const productVariantSchema = new Schema<IProductVariant>({
  sku: {
    type: String,
    required: true,
    unique: true
  },
  attributes: {
    type: Map,
    of: String
  },
  price: {
    wholesale: {
      type: Number,
      required: true,
      min: 0
    },
    minQuantity: {
      type: Number,
      default: 1,
      min: 1
    },
    bulkPricing: [{
      minQuantity: Number,
      price: Number
    }]
  },
  inventory: {
    available: {
      type: Number,
      default: 0,
      min: 0
    },
    reserved: {
      type: Number,
      default: 0,
      min: 0
    },
    warehouse: String
  },
  images: [String],
  isActive: {
    type: Boolean,
    default: true
  }
});

const productSchema = new Schema<IProduct>({
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
    required: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subcategory: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  productCategory: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  brand: String,
  images: {
    type: [String],
    required: true,
    validate: {
      validator: function(v: string[]) {
        return v.length > 0;
      },
      message: 'At least one image is required'
    }
  },
  videos: [String],
  variants: [productVariantSchema],
  basePrice: {
    wholesale: {
      type: Number,
      required: true,
      min: 0
    },
    minQuantity: {
      type: Number,
      default: 1,
      min: 1
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  specifications: {
    type: Map,
    of: Schema.Types.Mixed
  },
  features: [String],
  tags: [String],
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'outOfStock'],
    default: 'draft'
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'approved_buyers'],
    default: 'public'
  },
  certifications: [{
    name: String,
    issuedBy: String,
    documentUrl: String,
    validUntil: Date
  }],
  shipping: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    shippingClass: String,
    freeShipping: {
      type: Boolean,
      default: false
    },
    estimatedDays: Number
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
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
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

productSchema.index({ seller: 1, status: 1 });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ 'basePrice.wholesale': 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

const Product = model<IProduct>('Product', productSchema);

export default Product;