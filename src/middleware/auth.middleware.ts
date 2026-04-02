import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { Role } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: Role;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = { userId: decoded.userId, role: decoded.role as Role };
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const authorize = (...roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Access denied: insufficient permissions' });
      return;
    }
    next();
  };
};
