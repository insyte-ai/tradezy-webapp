import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import User, { UserRole, UserStatus } from '../models/User';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded;

    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    if (user.status === UserStatus.SUSPENDED) {
      res.status(403).json({ error: 'Account suspended' });
      return;
    }

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!roles.includes(req.user.role as UserRole)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
};

export const optionalAuth = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      const decoded = verifyAccessToken(token);
      req.user = decoded;
    }

    next();
  } catch (error) {
    next();
  }
};

export const requireApprovedBuyer = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await User.findById(req.user.userId);
    
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    if (user.role !== UserRole.BUYER && user.role !== UserRole.ADMIN) {
      res.status(403).json({ error: 'Only buyers can access this resource' });
      return;
    }

    if (user.role === UserRole.BUYER && user.status !== UserStatus.APPROVED) {
      res.status(403).json({ error: 'Your account is pending approval' });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};