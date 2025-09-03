import { Router } from 'express';
import {
  register,
  login,
  refreshAccessToken,
  logout,
  getProfile,
  updateProfile,
  requestPasswordReset,
  resetPassword
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const router = Router();

const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['seller', 'buyer']),
  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim(),
  body('company.name').notEmpty().trim(),
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

export default router;