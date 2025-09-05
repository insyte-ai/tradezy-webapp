import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Brand from '../models/Brand';
import Product from '../models/Product';
import slugify from 'slugify';

const brandController = {
  // Get all brands
  async getBrands(req: Request, res: Response) {
    try {
      const {
        page = 1,
        limit = 20,
        featured,
        verified,
        category,
        search
      } = req.query;

      const query: any = {};

      if (featured === 'true') {
        query.featured = true;
      }

      if (verified === 'true') {
        query.verified = true;
      }

      if (category) {
        // Find category and filter brands
        const categoryDoc = await mongoose.model('Category').findOne({ slug: category });
        if (categoryDoc) {
          query.categories = categoryDoc._id;
        }
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      const skip = (Number(page) - 1) * Number(limit);

      const brands = await Brand.find(query)
        .populate('categories', 'name slug')
        .sort({ featured: -1, 'metrics.totalProducts': -1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await Brand.countDocuments(query);

      res.json({
        brands,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
          limit: Number(limit)
        }
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get brand by slug
  async getBrandBySlug(req: Request, res: Response): Promise<Response> {
    try {
      const { slug } = req.params;

      const brand = await Brand.findOne({ slug })
        .populate('categories', 'name slug icon');

      if (!brand) {
        return res.status(404).json({ message: 'Brand not found' });
      }

      // Get top products for this brand
      const topProducts = await Product.find({ 
        brand: brand.name,
        isActive: true 
      })
        .select('name slug images basePrice ratings category')
        .populate('category', 'name slug')
        .sort({ 'ratings.average': -1 })
        .limit(12);

      // Get stores carrying this brand
      const stores = await mongoose.model('Store').find({
        'businessInfo.brands': brand.name,
        isActive: true
      })
        .select('name slug logo ratings metrics location isPremium')
        .sort({ isPremium: -1, 'ratings.average': -1 })
        .limit(8);

      return res.json({
        brand,
        topProducts,
        stores,
        statistics: {
          totalProducts: await Product.countDocuments({ brand: brand.name, isActive: true }),
          totalStores: await mongoose.model('Store').countDocuments({ 
            'businessInfo.brands': brand.name,
            isActive: true 
          })
        }
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },

  // Get featured brands
  async getFeaturedBrands(_req: Request, res: Response) {
    try {
      const brands = await Brand.find({ featured: true })
        .select('name slug logo description metrics')
        .sort({ 'metrics.totalProducts': -1 })
        .limit(8);

      res.json(brands);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create new brand (admin only)
  async createBrand(req: Request, res: Response) {
    try {
      const brandData = {
        ...req.body,
        slug: slugify(req.body.name, { lower: true, strict: true })
      };

      const brand = new Brand(brandData);
      await brand.save();

      res.status(201).json(brand);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  // Update brand (admin only)
  async updateBrand(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      
      if (req.body.name) {
        req.body.slug = slugify(req.body.name, { lower: true, strict: true });
      }

      const brand = await Brand.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!brand) {
        return res.status(404).json({ message: 'Brand not found' });
      }

      return res.json(brand);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
};

export default brandController;