import { Router } from 'express';
import {
  register,
  login,
  refreshAccessToken,
  logout,
  getProfile,
  updateProfile,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  resendVerificationEmail
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

const router = Router();

const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validation failed', {
      path: req.path,
      errors: errors.array(),
      body: req.body
    });
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role').isIn(['seller', 'buyer']).withMessage('Role must be either seller or buyer'),
  body('firstName').optional().trim(),
  body('lastName').optional().trim(),
  body('company.name').optional().trim(),
  validate
], register);

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  validate
], login);

router.post('/refresh-token', [
  body('refreshToken').notEmpty(),
  validate
], refreshAccessToken);

router.post('/logout', authenticate, logout);

router.get('/profile', authenticate, getProfile);

router.put('/profile', authenticate, [
  body('firstName').optional().trim(),
  body('lastName').optional().trim(),
  body('phoneNumber').optional().trim(),
  validate
], updateProfile);

router.post('/password-reset/request', [
  body('email').isEmail().normalizeEmail(),
  validate
], requestPasswordReset);

router.post('/password-reset/confirm', [
  body('token').notEmpty(),
  body('newPassword').isLength({ min: 6 }),
  validate
], resetPassword);

router.post('/verify-email', [
  body('token').notEmpty().withMessage('Verification token is required'),
  validate
], verifyEmail);

router.post('/resend-verification', [
  body('email').isEmail().normalizeEmail(),
  validate
], resendVerificationEmail);

export default router;