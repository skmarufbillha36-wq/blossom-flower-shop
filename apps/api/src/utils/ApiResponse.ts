import { ApiResponse } from '@flower-shop/types';

/**
 * Standardized API response helper.
 * All API responses must use this class to ensure consistency.
 */
export class ApiResponseBuilder {
  static success<T>(message: string, data?: T, pagination?: ApiResponse<T>['pagination']): ApiResponse<T> {
    return {
      success: true,
      message,
      ...(data !== undefined && { data }),
      ...(pagination && { pagination }),
    };
  }

  static error(message: string, errors?: Record<string, string[]>) {
    return {
      success: false,
      message,
      ...(errors && { errors }),
    };
  }
}
