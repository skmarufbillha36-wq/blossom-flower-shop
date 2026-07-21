/**
 * Custom API Error class.
 * Throw this anywhere in the app — the global error handler will catch it.
 *
 * @example
 * throw new ApiError(404, 'Product not found');
 * throw new ApiError(400, 'Validation failed', { email: ['Email already in use'] });
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors?: Record<string, string[]>;

  constructor(statusCode: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = 'ApiError';

    // Maintains proper stack trace in V8 environments
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
