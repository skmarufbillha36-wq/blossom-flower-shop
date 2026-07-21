import { Request, Response } from 'express';
import { z } from 'zod';
import { authService } from '../services/auth.service';
import { ApiResponseBuilder } from '../utils/ApiResponse';

// ─── Validation Schemas ───────────────────────────────────

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// ─── Controller ───────────────────────────────────────────

/**
 * Controller: Handles HTTP request/response for auth endpoints.
 * All business logic is delegated to authService.
 */
export const authController = {
  register: async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    res.status(201).json(
      ApiResponseBuilder.success('Account created successfully.', result)
    );
  },

  login: async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    res.status(200).json(
      ApiResponseBuilder.success('Logged in successfully.', result)
    );
  },

  logout: (_req: Request, res: Response) => {
    res.status(200).json(ApiResponseBuilder.success('Logged out successfully.'));
  },

  getMe: async (req: Request, res: Response) => {
    const user = await authService.getProfile(req.user!.userId);
    res.status(200).json(ApiResponseBuilder.success('Profile fetched.', user));
  },
};
