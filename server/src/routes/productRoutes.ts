import { Router } from 'express';
import { productController } from '../controllers/productController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

// Public routes with optional auth for prices
router.get('/', optionalAuth, productController.getProducts);
router.get('/filters', productController.getFilterOptions);
router.get('/category/:categorySlug', optionalAuth, productController.getProductsByCategory);
router.get('/:slug', optionalAuth, productController.getProductBySlug);

export default router;