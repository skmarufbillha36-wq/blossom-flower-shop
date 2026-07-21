import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

/**
 * Middleware: Guards routes to admin users only.
 * Must be used AFTER the authenticate middleware.
 */
export const requireAdmin = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new ApiError(401, 'Authentication required.');
  }

  if (req.user.role !== 'ADMIN') {
    throw new ApiError(403, 'Access denied. Admins only.');
  }

  next();
};
