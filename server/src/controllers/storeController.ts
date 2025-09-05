import { Request, Response } from 'express';
import Store from '../models/Store';
import Product from '../models/Product';
import logger from '../utils/logger';

export const storeController = {
  // Get all stores
  async getAllStores(req: Request, res: Response) {
    try {
      const {
        category,
        featured,
        verified,
        isPremium,
        search,
        sort = '-createdAt',
        page = 1,
        limit = 20
      } = req.query;

      // Build query
      const query: any = { isActive: true };

      // Category filter
      if (category) {
        query.categories = category;
      }

      // Featured filter
      if (featured === 'true') {
        query.featured = true;
      }

      // Verified filter
      if (verified === 'true') {
        query.verified = true;
      }

      // Premium filter
      if (isPremium === 'true') {
        query.isPremium = true;
      }

      // Search filter
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      // Pagination
      const pageNum = Number(page);
      const limitNum = Number(limit);
      const skip = (pageNum - 1) * limitNum;

      // Get total count
      const totalCount = await Store.countDocuments(query);

      // Get stores
      const stores = await Store.find(query)
        .populate('seller', 'sellerProfile.brandName email')
        .populate('categories', 'name slug')
        .sort(sort as string)
        .skip(skip)
        .limit(limitNum);

      res.json({
        success: true,
        data: {
          stores,
          pagination: {
            total: totalCount,
            page: pageNum,
            pages: Math.ceil(totalCount / limitNum),
            limit: limitNum
          }
        }
      });
    } catch (error) {
      logger.error('Error fetching stores:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching stores'
      });
    }
  },

  // Get store by slug
  async getStoreBySlug(req: Request, res: Response): Promise<Response | void> {
    try {
      const { slug } = req.params;

      const store = await Store.findOne({ slug, isActive: true })
        .populate('seller', 'sellerProfile company email')
        .populate('categories', 'name slug')
        .populate('featured.products')
        .populate('featured.collections.products');

      if (!store) {
        return res.status(404).json({
          success: false,
          message: 'Store not found'
        });
      }

      // Get store statistics
      const productCount = await Product.countDocuments({ 
        seller: store.seller,
        status: 'active'
      });

      // Get top products
      const topProducts = await Product.find({ 
        seller: store.seller,
        status: 'active'
      })
      .sort({ 'ratings.average': -1, 'ratings.count': -1 })
      .limit(6)
      .select('name slug images basePrice ratings');

      return res.json({
        success: true,
        data: {
          store,
          statistics: {
            ...store.metrics,
            totalProducts: productCount
          },
          topProducts
        }
      });
    } catch (error) {
      logger.error('Error fetching store:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching store'
      });
    }
  },

  // Get store products
  async getStoreProducts(req: Request, res: Response) {
    try {
      const { slug } = req.params;

      // Find store
      const store = await Store.findOne({ slug, isActive: true });
      if (!store) {
        return res.status(404).json({
          success: false,
          message: 'Store not found'
        });
      }

      // Add seller filter to query
      req.query.seller = store.seller.toString();

      // Import and use product controller's getProducts method
      const { productController } = require('./productController');
      return productController.getProducts(req, res);
    } catch (error) {
      logger.error('Error fetching store products:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching store products'
      });
    }
  },

  // Get featured stores (for homepage)
  async getFeaturedStores(_req: Request, res: Response) {
    try {
      const stores = await Store.find({ 
        isActive: true,
        featured: true
      })
      .populate('categories', 'name slug')
      .sort({ 'ratings.average': -1 })
      .limit(6);

      res.json({
        success: true,
        data: stores
      });
    } catch (error) {
      logger.error('Error fetching featured stores:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching featured stores'
      });
    }
  }
};