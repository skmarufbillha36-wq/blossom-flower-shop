import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';

/**
 * Middleware factory: Validates request body against a Zod schema.
 * Returns 400 with field-level errors if validation fails.
 *
 * @example
 * router.post('/register', validate(registerSchema), authController.register);
 */
export const validate = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string[]> = {};
        error.errors.forEach((e) => {
          const field = e.path.join('.');
          if (!errors[field]) errors[field] = [];
          errors[field].push(e.message);
        });
        throw new ApiError(400, 'Validation failed', errors);
      }
      next(error);
    }
  };
};
