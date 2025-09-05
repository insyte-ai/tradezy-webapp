import { Request, Response } from 'express';
import Product from '../models/Product';
import Category from '../models/Category';
import Store from '../models/Store';
import logger from '../utils/logger';
import { AuthRequest } from '../middleware/auth';

export const productController = {
  // Get all products with filters
  async getProducts(req: Request, res: Response) {
    try {
      const {
        category,
        subcategory,
        brand,
        minPrice,
        maxPrice,
        minQuantity,
        leadTime,
        seller,
        store,
        search,
        tags,
        inStock,
        freeShipping,
        sort = '-createdAt',
        page = 1,
        limit = 20
      } = req.query;

      // Build query
      const query: any = { status: 'active' };

      // Category filter
      if (category) {
        const categoryDoc = await Category.findOne({ slug: category });
        if (categoryDoc) {
          query.category = categoryDoc._id;
        }
      }

      // Subcategory filter
      if (subcategory) {
        const subcategoryDoc = await Category.findOne({ slug: subcategory });
        if (subcategoryDoc) {
          query.subcategory = subcategoryDoc._id;
        }
      }

      // Brand filter (can be multiple)
      if (brand) {
        const brands = Array.isArray(brand) ? brand : [brand];
        query.brand = { $in: brands };
      }

      // Price range filter
      if (minPrice || maxPrice) {
        query['basePrice.wholesale'] = {};
        if (minPrice) query['basePrice.wholesale'].$gte = Number(minPrice);
        if (maxPrice) query['basePrice.wholesale'].$lte = Number(maxPrice);
      }

      // Minimum quantity filter
      if (minQuantity) {
        query['basePrice.minQuantity'] = { $lte: Number(minQuantity) };
      }

      // Lead time filter
      if (leadTime) {
        const leadTimeDays = parseInt(leadTime as string);
        if (leadTimeDays) {
          query['shipping.estimatedDays'] = { $lte: leadTimeDays };
        }
      }

      // Seller filter
      if (seller) {
        query.seller = seller;
      }

      // Store filter
      if (store) {
        const storeDoc = await Store.findOne({ slug: store });
        if (storeDoc) {
          query.seller = storeDoc.seller;
        }
      }

      // Search filter
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search as string, 'i')] } }
        ];
      }

      // Tags filter
      if (tags) {
        const tagArray = Array.isArray(tags) ? tags : [tags];
        query.tags = { $in: tagArray };
      }

      // In stock filter
      if (inStock === 'true') {
        query['variants.0.inventory.available'] = { $gt: 0 };
      }

      // Free shipping filter
      if (freeShipping === 'true') {
        query['shipping.freeShipping'] = true;
      }

      // Pagination
      const pageNum = Number(page);
      const limitNum = Number(limit);
      const skip = (pageNum - 1) * limitNum;

      // Get total count
      const totalCount = await Product.countDocuments(query);

      // Get products with population
      const products = await Product.find(query)
        .populate('category', 'name slug')
        .populate('subcategory', 'name slug')
        .populate('seller', 'sellerProfile.brandName sellerProfile.storeName')
        .sort(sort as string)
        .skip(skip)
        .limit(limitNum);

      // Check if user is authenticated to show prices
      const showPrices = (req as AuthRequest).user ? true : false;

      // Format response
      const formattedProducts = products.map(product => ({
        _id: product._id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        images: product.images,
        brand: product.brand,
        category: product.category,
        subcategory: product.subcategory,
        seller: product.seller,
        price: showPrices ? {
          wholesale: product.basePrice.wholesale,
          minQuantity: product.basePrice.minQuantity,
          currency: product.basePrice.currency
        } : null,
        shipping: {
          estimatedDays: product.shipping.estimatedDays,
          freeShipping: product.shipping.freeShipping
        },
        ratings: product.ratings,
        tags: product.tags,
        inStock: product.variants.some(v => v.inventory.available > 0)
      }));

      res.json({
        success: true,
        data: {
          products: formattedProducts,
          pagination: {
            total: totalCount,
            page: pageNum,
            pages: Math.ceil(totalCount / limitNum),
            limit: limitNum
          }
        }
      });
    } catch (error) {
      logger.error('Error fetching products:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching products'
      });
    }
  },

  // Get products by category
  async getProductsByCategory(req: Request, res: Response) {
    try {
      const { categorySlug } = req.params;

      // Find category
      const category = await Category.findOne({ slug: categorySlug });
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      // Add category to filters
      req.query.category = categorySlug;

      // Use the main getProducts method with category filter
      return productController.getProducts(req, res);
    } catch (error) {
      logger.error('Error fetching products by category:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching products'
      });
    }
  },

  // Get single product by slug
  async getProductBySlug(req: Request, res: Response): Promise<Response | void> {
    try {
      const { slug } = req.params;

      const product = await Product.findOne({ slug, status: 'active' })
        .populate('category', 'name slug')
        .populate('subcategory', 'name slug')
        .populate('productCategory', 'name slug')
        .populate({
          path: 'seller',
          select: 'sellerProfile company email'
        });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Get store information
      const store = await Store.findOne({ seller: product.seller });

      // Increment view count
      product.views += 1;
      await product.save();

      // Check if user is authenticated to show full details
      const showPrices = (req as AuthRequest).user ? true : false;

      // Format response
      const productData: any = {
        _id: product._id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        images: product.images,
        videos: product.videos,
        brand: product.brand,
        category: product.category,
        subcategory: product.subcategory,
        productCategory: product.productCategory,
        seller: product.seller,
        store: store ? {
          name: store.name,
          slug: store.slug,
          logo: store.logo,
          ratings: store.ratings
        } : null,
        features: product.features,
        specifications: Object.fromEntries(product.specifications || new Map()),
        certifications: product.certifications,
        shipping: product.shipping,
        ratings: product.ratings,
        tags: product.tags,
        seo: product.seo
      };

      // Add price and variant information if authenticated
      if (showPrices) {
        productData.price = {
          wholesale: product.basePrice.wholesale,
          minQuantity: product.basePrice.minQuantity,
          currency: product.basePrice.currency
        };
        productData.variants = product.variants.map(v => ({
          sku: v.sku,
          attributes: Object.fromEntries(v.attributes || new Map()),
          price: v.price,
          inventory: {
            available: v.inventory.available,
            warehouse: v.inventory.warehouse
          },
          images: v.images,
          isActive: v.isActive
        }));
      }

      return res.json({
        success: true,
        data: productData
      });
    } catch (error) {
      logger.error('Error fetching product:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching product'
      });
    }
  },

  // Get filter options for a category
  async getFilterOptions(req: Request, res: Response) {
    try {
      const { category } = req.query;
      let query: any = { status: 'active' };

      if (category) {
        const categoryDoc = await Category.findOne({ slug: category });
        if (categoryDoc) {
          query.category = categoryDoc._id;
        }
      }

      // Get all products in the category to extract filter options
      const products = await Product.find(query)
        .populate('seller', 'sellerProfile.brandName');

      // Extract unique brands
      const brands = [...new Set(products.map(p => p.brand).filter(b => b))];
      
      // Extract price range
      const prices = products.map(p => p.basePrice.wholesale);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      // Extract unique tags
      const allTags = products.reduce((acc: string[], p) => {
        return acc.concat(p.tags || []);
      }, []);
      const uniqueTags = [...new Set(allTags)];

      // Extract lead times
      const leadTimeRanges = [
        { label: '1-3 days', value: '3' },
        { label: '3-7 days', value: '7' },
        { label: '7-14 days', value: '14' },
        { label: '14+ days', value: '30' }
      ];

      // Get stores
      const stores = await Store.find({ 
        seller: { $in: products.map(p => p.seller) },
        isActive: true 
      }).select('name slug');

      res.json({
        success: true,
        data: {
          brands,
          priceRange: { min: minPrice, max: maxPrice },
          tags: uniqueTags,
          leadTimeRanges,
          stores: stores.map(s => ({ name: s.name, slug: s.slug }))
        }
      });
    } catch (error) {
      logger.error('Error fetching filter options:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching filter options'
      });
    }
  }
};