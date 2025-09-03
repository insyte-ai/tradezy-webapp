import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(
    payload, 
    process.env.JWT_SECRET || 'secret', 
    { expiresIn: (process.env.JWT_EXPIRE || '7d') as any }
  );
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_REFRESH_SECRET || 'refresh-secret', 
    { expiresIn: (process.env.JWT_REFRESH_EXPIRE || '30d') as any }
  );
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_SECRET || 'secret') as TokenPayload;
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'refresh-secret') as { userId: string };
};

export const generateEmailVerificationToken = (): string => {
  return jwt.sign(
    { purpose: 'email-verification', timestamp: Date.now() },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '24h' }
  );
};

export const generatePasswordResetToken = (): string => {
  return jwt.sign(
    { purpose: 'password-reset', timestamp: Date.now() },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '1h' }
  );
};