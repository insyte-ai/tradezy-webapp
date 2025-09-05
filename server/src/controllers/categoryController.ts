import { Request, Response } from 'express';
import Category from '../models/Category';
import logger from '../utils/logger';

export const categoryController = {
  // Get all categories
  async getAllCategories(req: Request, res: Response) {
    try {
      const { 
        isActive = true,
        parent = null 
      } = req.query;

      const query: any = {};
      
      if (isActive !== undefined) {
        query.isActive = isActive === 'true';
      }
      
      if (parent === 'null' || parent === null) {
        query.parent = null;
      } else if (parent) {
        query.parent = parent;
      }

      const categories = await Category.find(query)
        .populate('parent', 'name slug')
        .sort({ displayOrder: 1, name: 1 });

      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      logger.error('Error fetching categories:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching categories'
      });
    }
  },

  // Get category by slug
  async getCategoryBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;

      const category = await Category.findOne({ slug, isActive: true })
        .populate('parent', 'name slug');

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      // Get subcategories if any
      const subcategories = await Category.find({ 
        parent: category._id, 
        isActive: true 
      }).sort({ displayOrder: 1, name: 1 });

      return res.json({
        success: true,
        data: {
          category,
          subcategories
        }
      });
    } catch (error) {
      logger.error('Error fetching category:', error);
      return res.status(500).json({
        success: false,
        message: 'Error fetching category'
      });
    }
  },

  // Get category hierarchy (for navigation)
  async getCategoryHierarchy(_req: Request, res: Response) {
    try {
      // Get all root categories
      const rootCategories = await Category.find({ 
        parent: null, 
        isActive: true 
      }).sort({ displayOrder: 1, name: 1 });

      // Build hierarchy
      const hierarchy = await Promise.all(
        rootCategories.map(async (category) => {
          const children = await Category.find({ 
            parent: category._id, 
            isActive: true 
          }).sort({ displayOrder: 1, name: 1 });

          // Get grandchildren for each child
          const childrenWithSubcategories = await Promise.all(
            children.map(async (child) => {
              const grandchildren = await Category.find({ 
                parent: child._id, 
                isActive: true 
              }).sort({ displayOrder: 1, name: 1 });

              return {
                _id: child._id,
                name: child.name,
                slug: child.slug,
                description: child.description,
                icon: child.icon,
                subcategories: grandchildren.map(gc => ({
                  _id: gc._id,
                  name: gc.name,
                  slug: gc.slug,
                  description: gc.description
                }))
              };
            })
          );

          return {
            _id: category._id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            icon: category.icon,
            image: category.image,
            categories: childrenWithSubcategories
          };
        })
      );

      res.json({
        success: true,
        data: hierarchy
      });
    } catch (error) {
      logger.error('Error fetching category hierarchy:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching category hierarchy'
      });
    }
  },

  // Get featured categories (for homepage)
  async getFeaturedCategories(_req: Request, res: Response) {
    try {
      const categories = await Category.find({ 
        isActive: true,
        parent: null // Only root categories
      })
      .sort({ displayOrder: 1 })
      .limit(6);

      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      logger.error('Error fetching featured categories:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching featured categories'
      });
    }
  }
};