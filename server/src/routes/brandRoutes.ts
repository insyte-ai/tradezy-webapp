import express from 'express';
import brandController from '../controllers/brandController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', brandController.getBrands);
router.get('/featured', brandController.getFeaturedBrands);
router.get('/:slug', brandController.getBrandBySlug);

// Admin routes
router.post('/', protect, authorize('admin'), brandController.createBrand);
router.put('/:id', protect, authorize('admin'), brandController.updateBrand);

export default router;