import { Request, Response } from 'express';
import User, { UserRole, UserStatus } from '../models/User';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateEmailVerificationToken,
  generatePasswordResetToken
} from '../utils/jwt';
import { AuthRequest } from '../middleware/auth';
import logger from '../utils/logger';
import emailService from '../services/emailService';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info('Registration attempt', { 
      email: req.body.email, 
      role: req.body.role,
      hasPassword: !!req.body.password 
    });

    const {
      email,
      password,
      role,
      firstName,
      lastName,
      phoneNumber,
      company
    } = req.body;

    // Validate required fields
    if (!email || !password || !role) {
      logger.warn('Registration failed: missing required fields', { 
        hasEmail: !!email, 
        hasPassword: !!password, 
        hasRole: !!role 
      });
      res.status(400).json({ error: 'Email, password, and role are required' });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn('Registration failed: email already exists', { email });
      res.status(400).json({ error: 'Email already registered' });
      return;
    }

    const status = role === UserRole.ADMIN 
      ? UserStatus.APPROVED 
      : role === UserRole.SELLER 
        ? UserStatus.APPROVED 
        : UserStatus.PENDING;

    logger.info('Creating new user', { email, role, status });

    const user = new User({
      email,
      password,
      role,
      status,
      firstName: firstName || '',
      lastName: lastName || '',
      phoneNumber: phoneNumber || '',
      company: company || {},
      emailVerificationToken: generateEmailVerificationToken(),
      onboardingCompleted: false,
      onboardingStep: 0
    });

    await user.save();
    logger.info('User created successfully', { userId: user._id, email: user.email });

    // Send verification email
    try {
      await emailService.sendEmailVerification(user.email, user.emailVerificationToken!);
      logger.info('Verification email sent', { userId: user._id, email: user.email });
    } catch (emailError: any) {
      logger.error('Failed to send verification email', { 
        userId: user._id, 
        email: user.email,
        error: emailError.message 
      });
      // Continue with registration even if email fails
    }

    const accessToken = generateAccessToken({
      userId: (user._id as any).toString(),
      email: user.email,
      role: user.role
    });

    const refreshToken = generateRefreshToken((user._id as any).toString());
    
    user.refreshTokens.push(refreshToken);
    await user.save();

    logger.info('Registration successful', { userId: user._id, email: user.email });
    
    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user._id as any,
        email: user.email,
        role: user.role,
        status: user.status,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified,
        onboardingCompleted: user.onboardingCompleted
      },
      accessToken,
      refreshToken
    });
  } catch (error: any) {
    logger.error('Registration error', { 
      error: error.message, 
      stack: error.stack,
      body: req.body 
    });
    
    // Check for validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      }));
      res.status(400).json({ 
        error: 'Validation failed', 
        details: validationErrors 
      });
    } else {
      res.status(500).json({ 
        error: 'Registration failed',
        message: error.message 
      });
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    if (user.status === UserStatus.SUSPENDED) {
      res.status(403).json({ error: 'Account suspended' });
      return;
    }

    if (user.status === UserStatus.REJECTED) {
      res.status(403).json({ error: 'Account rejected' });
      return;
    }

    const accessToken = generateAccessToken({
      userId: (user._id as any).toString(),
      email: user.email,
      role: user.role
    });

    const refreshToken = generateRefreshToken((user._id as any).toString());
    
    user.refreshTokens.push(refreshToken);
    user.lastLogin = new Date();
    await user.save();

    res.json({
      message: 'Login successful',
      user: {
        id: user._id as any,
        email: user.email,
        role: user.role,
        status: user.status,
        firstName: user.firstName,
        lastName: user.lastName,
        company: user.company
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ error: 'Refresh token required' });
      return;
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId);

    if (!user || !user.refreshTokens.includes(refreshToken)) {
      res.status(401).json({ error: 'Invalid refresh token' });
      return;
    }

    const newAccessToken = generateAccessToken({
      userId: (user._id as any).toString(),
      email: user.email,
      role: user.role
    });

    const newRefreshToken = generateRefreshToken((user._id as any).toString());
    
    user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
    user.refreshTokens.push(newRefreshToken);
    await user.save();

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    const userId = req.user?.userId;

    if (userId && refreshToken) {
      const user = await User.findById(userId);
      if (user) {
        user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
        await user.save();
      }
    }

    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    
    const user = await User.findById(userId).select('-password -refreshTokens');
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const updates = req.body;

    delete updates.password;
    delete updates.email;
    delete updates.role;
    delete updates.status;

    const user = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password -refreshTokens');

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ 
      message: 'Profile updated successfully',
      user 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.json({ message: 'If the email exists, a reset link has been sent' });
      return;
    }

    const resetToken = generatePasswordResetToken();
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 3600000);
    await user.save();

    res.json({ 
      message: 'Password reset token generated',
      resetToken 
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      res.status(400).json({ error: 'Invalid or expired reset token' });
      return;
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshTokens = [];
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;
    
    if (!token) {
      res.status(400).json({ error: 'Verification token required' });
      return;
    }

    const user = await User.findOne({ emailVerificationToken: token });
    
    if (!user) {
      logger.warn('Invalid email verification token', { token });
      res.status(400).json({ error: 'Invalid verification token' });
      return;
    }

    if (user.emailVerified) {
      res.json({ 
        message: 'Email already verified',
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          emailVerified: true
        }
      });
      return;
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    logger.info('Email verified successfully', { userId: user._id, email: user.email });

    res.json({ 
      message: 'Email verified successfully',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        emailVerified: true
      }
    });
  } catch (error: any) {
    logger.error('Email verification error', { error: error.message });
    res.status(500).json({ error: 'Failed to verify email' });
  }
};

export const resendVerificationEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    
    if (!email) {
      res.status(400).json({ error: 'Email required' });
      return;
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      // Don't reveal if email exists
      res.json({ message: 'If the email exists, a verification email has been sent' });
      return;
    }

    if (user.emailVerified) {
      res.json({ message: 'Email already verified' });
      return;
    }

    // Generate new token if it doesn't exist
    if (!user.emailVerificationToken) {
      user.emailVerificationToken = generateEmailVerificationToken();
      await user.save();
    }

    // Send verification email
    try {
      await emailService.sendEmailVerification(user.email, user.emailVerificationToken);
      logger.info('Verification email resent', { userId: user._id, email: user.email });
    } catch (emailError: any) {
      logger.error('Failed to resend verification email', { 
        userId: user._id, 
        email: user.email,
        error: emailError.message 
      });
      res.status(500).json({ error: 'Failed to send verification email' });
      return;
    }

    res.json({ message: 'Verification email sent' });
  } catch (error: any) {
    logger.error('Resend verification error', { error: error.message });
    res.status(500).json({ error: 'Failed to resend verification email' });
  }
};