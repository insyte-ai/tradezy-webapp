import { Schema, model, Document, Types } from 'mongoose';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export interface IOrderItem {
  product: Types.ObjectId;
  variant?: string;
  quantity: number;
  price: number;
  subtotal: number;
  discount?: number;
  tax?: number;
  total: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  buyer: Types.ObjectId;
  seller: Types.ObjectId;
  items: IOrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  paymentDetails?: {
    transactionId?: string;
    paymentIntentId?: string;
    receiptUrl?: string;
  };
  pricing: {
    subtotal: number;
    discount: number;
    tax: number;
    shipping: number;
    total: number;
    currency: string;
  };
  shippingAddress: {
    firstName: string;
    lastName: string;
    company?: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    phoneNumber: string;
  };
  billingAddress?: {
    firstName: string;
    lastName: string;
    company?: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  shipping: {
    method?: string;
    carrier?: string;
    trackingNumber?: string;
    estimatedDelivery?: Date;
    actualDelivery?: Date;
  };
  notes?: string;
  internalNotes?: string;
  invoiceUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  variant: String,
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  subtotal: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  }
});

const orderSchema = new Schema<IOrder>({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: {
    type: [orderItemSchema],
    required: true,
    validate: {
      validator: function(v: IOrderItem[]) {
        return v.length > 0;
      },
      message: 'Order must contain at least one item'
    }
  },
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING
  },
  paymentStatus: {
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING
  },
  paymentMethod: String,
  paymentDetails: {
    transactionId: String,
    paymentIntentId: String,
    receiptUrl: String
  },
  pricing: {
    subtotal: {
      type: Number,
      required: true
    },
    discount: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    shipping: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  shippingAddress: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    company: String,
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    }
  },
  billingAddress: {
    firstName: String,
    lastName: String,
    company: String,
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  shipping: {
    method: String,
    carrier: String,
    trackingNumber: String,
    estimatedDelivery: Date,
    actualDelivery: Date
  },
  notes: String,
  internalNotes: String,
  invoiceUrl: String
}, {
  timestamps: true
});

orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await Order.countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
  }
  next();
});

orderSchema.index({ orderNumber: 1 });
orderSchema.index({ buyer: 1, createdAt: -1 });
orderSchema.index({ seller: 1, createdAt: -1 });
orderSchema.index({ status: 1, paymentStatus: 1 });

const Order = model<IOrder>('Order', orderSchema);

export default Order;