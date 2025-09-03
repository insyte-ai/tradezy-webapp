import { Schema, model, Document, Types } from 'mongoose';
import slugify from 'slugify';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  parent?: Types.ObjectId;
  level: number;
  image?: string;
  icon?: string;
  isActive: boolean;
  displayOrder: number;
  metadata?: {
    keywords?: string[];
    seoTitle?: string;
    seoDescription?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>({
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
    maxlength: 500
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  level: {
    type: Number,
    default: 1,
    min: 1,
    max: 3
  },
  image: String,
  icon: String,
  isActive: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  metadata: {
    keywords: [String],
    seoTitle: String,
    seoDescription: String
  }
}, {
  timestamps: true
});

categorySchema.pre('save', async function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
    
    if (this.parent) {
      const parentCategory = await Category.findById(this.parent);
      if (parentCategory) {
        this.level = parentCategory.level + 1;
      }
    }
  }
  next();
});

categorySchema.index({ parent: 1 });
categorySchema.index({ level: 1, isActive: 1 });

const Category = model<ICategory>('Category', categorySchema);

export default Category;