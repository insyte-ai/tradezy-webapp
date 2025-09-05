import { Router } from 'express';
import {
  updateBuyerOnboarding,
  updateSellerOnboarding,
  getOnboardingStatus,
  completeOnboarding,
} from '../controllers/onboardingController';
import { authenticate } from '../middleware/auth';
import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

const router = Router();

const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Onboarding validation failed', {
      path: req.path,
      errors: errors.array(),
      body: req.body,
    });
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

// Get onboarding status
router.get('/status', authenticate, getOnboardingStatus);

// Buyer onboarding update
router.post('/buyer', authenticate, [
  body('step').isInt({ min: 1, max: 3 }).withMessage('Invalid step'),
  body('data').isObject().withMessage('Data must be an object'),
  validate,
], updateBuyerOnboarding);

// Seller onboarding update
router.post('/seller', authenticate, [
  body('step').isInt({ min: 1, max: 4 }).withMessage('Invalid step'),
  body('data').isObject().withMessage('Data must be an object'),
  validate,
], updateSellerOnboarding);

// Complete onboarding (mark as complete)
router.post('/complete', authenticate, completeOnboarding);

export default router;