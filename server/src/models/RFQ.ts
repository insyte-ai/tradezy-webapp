import { Schema, model, Document, Types } from 'mongoose';

export enum RFQStatus {
  OPEN = 'open',
  PENDING_REVIEW = 'pending_review',
  QUOTED = 'quoted',
  NEGOTIATING = 'negotiating',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled'
}

export interface IRFQItem {
  product?: Types.ObjectId;
  productName: string;
  description: string;
  specifications?: Map<string, any>;
  quantity: number;
  unit: string;
  targetPrice?: number;
  attachments?: string[];
}

export interface IQuote {
  seller: Types.ObjectId;
  items: Array<{
    itemId: string;
    unitPrice: number;
    totalPrice: number;
    notes?: string;
  }>;
  totalAmount: number;
  validUntil: Date;
  deliveryTerms?: string;
  paymentTerms?: string;
  notes?: string;
  attachments?: string[];
  status: 'pending' | 'accepted' | 'rejected' | 'counter_offered';
  createdAt: Date;
}

export interface IRFQ extends Document {
  rfqNumber: string;
  buyer: Types.ObjectId;
  title: string;
  description?: string;
  category: Types.ObjectId;
  items: IRFQItem[];
  status: RFQStatus;
  targetSellers?: Types.ObjectId[];
  quotes: IQuote[];
  selectedQuote?: Types.ObjectId;
  requirements: {
    deliveryDate?: Date;
    deliveryLocation?: string;
    paymentTerms?: string;
    qualityStandards?: string;
    certifications?: string[];
  };
  attachments?: string[];
  expiresAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const rfqItemSchema = new Schema<IRFQItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  },
  productName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  specifications: {
    type: Map,
    of: Schema.Types.Mixed
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unit: {
    type: String,
    required: true
  },
  targetPrice: Number,
  attachments: [String]
});

const quoteSchema = new Schema<IQuote>({
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    itemId: {
      type: String,
      required: true
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    totalPrice: {
      type: Number,
      required: true
    },
    notes: String
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  validUntil: {
    type: Date,
    required: true
  },
  deliveryTerms: String,
  paymentTerms: String,
  notes: String,
  attachments: [String],
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'counter_offered'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const rfqSchema = new Schema<IRFQ>({
  rfqNumber: {
    type: String,
    required: true,
    unique: true
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  items: {
    type: [rfqItemSchema],
    required: true,
    validate: {
      validator: function(v: IRFQItem[]) {
        return v.length > 0;
      },
      message: 'RFQ must contain at least one item'
    }
  },
  status: {
    type: String,
    enum: Object.values(RFQStatus),
    default: RFQStatus.OPEN
  },
  targetSellers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  quotes: [quoteSchema],
  selectedQuote: {
    type: Schema.Types.ObjectId
  },
  requirements: {
    deliveryDate: Date,
    deliveryLocation: String,
    paymentTerms: String,
    qualityStandards: String,
    certifications: [String]
  },
  attachments: [String],
  expiresAt: Date,
  notes: String
}, {
  timestamps: true
});

rfqSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await RFQ.countDocuments();
    this.rfqNumber = `RFQ-${Date.now()}-${count + 1}`;
  }
  next();
});

rfqSchema.index({ rfqNumber: 1 });
rfqSchema.index({ buyer: 1, status: 1 });
rfqSchema.index({ category: 1, status: 1 });
rfqSchema.index({ createdAt: -1 });
rfqSchema.index({ expiresAt: 1 });

const RFQ = model<IRFQ>('RFQ', rfqSchema);

export default RFQ;