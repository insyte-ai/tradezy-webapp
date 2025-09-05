import { Router } from 'express';
import { storeController } from '../controllers/storeController';

const router = Router();

// Public routes
router.get('/', storeController.getAllStores);
router.get('/featured', storeController.getFeaturedStores);
router.get('/:slug', storeController.getStoreBySlug);
router.get('/:slug/products', storeController.getStoreProducts);

export default router;