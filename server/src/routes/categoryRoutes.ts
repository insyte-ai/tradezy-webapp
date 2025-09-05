import { Router } from 'express';
import { categoryController } from '../controllers/categoryController';

const router = Router();

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/hierarchy', categoryController.getCategoryHierarchy);
router.get('/featured', categoryController.getFeaturedCategories);
router.get('/:slug', categoryController.getCategoryBySlug);

export default router;