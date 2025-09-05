import { Response } from 'express';
import Product from '../models/Product';
import { AuthRequest } from '../types/auth';
import { uploadToCloudinary } from '../utils/uploadHelper';

// Get all products for the authenticated seller
export const getSellerProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, category, search, sortBy = 'createdAt', order = 'desc' } = req.query;
    const sellerId = req.user?.userId;

    // Build query
    const query: any = { seller: sellerId };
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search as string, 'i')] } }
      ];
    }

    // Execute query with population
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
      .sort({ [sortBy as string]: order === 'desc' ? -1 : 1 })
      .lean();

    // Calculate inventory for each product
    const productsWithInventory = products.map(product => {
      let totalInventory = 0;
      
      if (product.variants && product.variants.length > 0) {
        totalInventory = product.variants.reduce((sum, variant) => {
          return sum + (variant.inventory?.available || 0);
        }, 0);
      }
      
      return {
        ...product,
        inventory: totalInventory
      };
    });

    res.json(productsWithInventory);
  } catch (error) {
    console.error('Error fetching seller products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

// Get single product
export const getProduct = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const sellerId = req.user?.userId;

    const product = await Product.findOne({ _id: id, seller: sellerId })
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};

// Create new product
export const createProduct = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const sellerId = req.user?.userId;
    const productData = {
      ...req.body,
      seller: sellerId
    };

    // Validate required fields
    if (!productData.name || !productData.description || !productData.category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create the product
    const product = new Product(productData);
    await product.save();

    // Populate references before sending response
    await product.populate('category', 'name slug');
    await product.populate('subcategory', 'name slug');

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Failed to create product' });
  }
};

// Update product
export const updateProduct = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const sellerId = req.user?.userId;
    
    // Ensure the product belongs to the seller
    const product = await Product.findOne({ _id: id, seller: sellerId });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update the product
    Object.assign(product, req.body);
    product.updatedAt = new Date();
    
    await product.save();
    
    // Populate references before sending response
    await product.populate('category', 'name slug');
    await product.populate('subcategory', 'name slug');

    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Failed to update product' });
  }
};

// Delete product
export const deleteProduct = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const sellerId = req.user?.userId;

    const product = await Product.findOneAndDelete({ _id: id, seller: sellerId });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete associated images from Cloudinary if configured
    if (product.images && product.images.length > 0) {
      // Note: Implement Cloudinary deletion if needed
      // for (const imageUrl of product.images) {
      //   await deleteFromCloudinary(imageUrl);
      // }
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
};

// Duplicate product
export const duplicateProduct = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const sellerId = req.user?.userId;

    const originalProduct = await Product.findOne({ _id: id, seller: sellerId });
    
    if (!originalProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Create a copy of the product
    const originalData = originalProduct.toObject();
    const { _id, createdAt, updatedAt, ...productData } = originalData;
    
    // Modify name and SKU to indicate it's a copy
    productData.name = `${productData.name} (Copy)`;
    productData.status = 'draft';
    
    // Generate new SKU for variants
    if (productData.variants && productData.variants.length > 0) {
      productData.variants = productData.variants.map((variant: any) => {
        const newVariant = { ...variant };
        newVariant.sku = `${variant.sku}-COPY-${Date.now()}`;
        delete newVariant._id;
        return newVariant;
      });
    }

    const duplicatedProduct = new Product(productData);
    await duplicatedProduct.save();
    
    await duplicatedProduct.populate('category', 'name slug');
    await duplicatedProduct.populate('subcategory', 'name slug');

    res.status(201).json(duplicatedProduct);
  } catch (error) {
    console.error('Error duplicating product:', error);
    res.status(500).json({ message: 'Failed to duplicate product' });
  }
};

// Bulk update products
export const bulkUpdateProducts = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const { productIds, updates } = req.body;
    const sellerId = req.user?.userId;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: 'Invalid product IDs' });
    }

    // Update only products that belong to the seller
    const result = await Product.updateMany(
      { _id: { $in: productIds }, seller: sellerId },
      { $set: updates }
    );

    res.json({
      message: 'Products updated successfully',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error bulk updating products:', error);
    res.status(500).json({ message: 'Failed to update products' });
  }
};

// Get product analytics
export const getProductAnalytics = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const sellerId = req.user?.userId;

    const product = await Product.findOne({ _id: id, seller: sellerId });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // In a real application, you would fetch actual analytics data
    // This is a placeholder implementation
    const analytics = {
      views: product.views || 0,
      viewsThisWeek: Math.floor(Math.random() * 100),
      viewsThisMonth: Math.floor(Math.random() * 500),
      conversionRate: (Math.random() * 10).toFixed(2),
      averageOrderValue: (product.basePrice.wholesale * (1 + Math.random())).toFixed(2),
      topReferrers: [
        { source: 'Direct', visits: Math.floor(Math.random() * 100) },
        { source: 'Search', visits: Math.floor(Math.random() * 80) },
        { source: 'Social Media', visits: Math.floor(Math.random() * 60) }
      ],
      salesByRegion: [
        { region: 'North America', sales: Math.floor(Math.random() * 1000) },
        { region: 'Europe', sales: Math.floor(Math.random() * 800) },
        { region: 'Asia', sales: Math.floor(Math.random() * 600) }
      ]
    };

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching product analytics:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
};

// Upload product image
export const uploadProductImage = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Upload to Cloudinary or local storage
    const imageUrl = await uploadToCloudinary(req.file.buffer, 'products');

    res.json({ url: imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Failed to upload image' });
  }
};

// Upload product video
export const uploadProductVideo = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file provided' });
    }

    // Check file size (max 2GB)
    if (req.file.size > 2 * 1024 * 1024 * 1024) {
      return res.status(400).json({ message: 'Video file too large. Maximum size is 2GB' });
    }

    // Upload to Cloudinary or local storage
    const videoUrl = await uploadToCloudinary(req.file.buffer, 'product-videos', 'video');

    res.json({ url: videoUrl });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ message: 'Failed to upload video' });
  }
};