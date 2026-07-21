import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { ApiResponseBuilder } from '../utils/ApiResponse';
import { env } from '../config/env';

/**
 * Global error handling middleware.
 * Must be registered LAST in the Express app.
 * Catches all errors thrown anywhere in the app.
 */
export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  // Known operational errors (thrown by us)
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(
      ApiResponseBuilder.error(err.message, err.errors)
    );
  }

  // Prisma duplicate record error
  if ((err as any).code === 'P2002') {
    return res.status(409).json(
      ApiResponseBuilder.error('A record with this value already exists.')
    );
  }

  // Prisma record not found
  if ((err as any).code === 'P2025') {
    return res.status(404).json(ApiResponseBuilder.error('Record not found.'));
  }

  // Unknown errors — don't leak internals in production
  console.error('💥 Unhandled error:', err);
  return res.status(500).json(
    ApiResponseBuilder.error(
      env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    )
  );
};
