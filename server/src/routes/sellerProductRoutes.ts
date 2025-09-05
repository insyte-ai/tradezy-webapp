import { Router } from 'express';
import { 
  getSellerProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getProduct,
  duplicateProduct,
  uploadProductImage,
  uploadProductVideo,
  bulkUpdateProducts,
  getProductAnalytics
} from '../controllers/sellerProductController';
import { authenticate, authorize } from '../middleware/auth';
import { uploadImage, uploadVideo } from '../middleware/upload';
import { UserRole } from '../models/User';

const router = Router();

// All routes require authentication and seller role
router.use(authenticate, authorize(UserRole.SELLER));

// Product CRUD operations
router.get('/products', getSellerProducts);
router.post('/products', createProduct);
router.get('/products/:id', getProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Product actions
router.post('/products/:id/duplicate', duplicateProduct);
router.post('/products/bulk-update', bulkUpdateProducts);
router.get('/products/:id/analytics', getProductAnalytics);

// Media upload
router.post('/upload/image', uploadImage.single('image'), uploadProductImage);
router.post('/upload/video', uploadVideo.single('video'), uploadProductVideo);

export default router;