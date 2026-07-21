import { RegisterDto, LoginDto } from '@flower-shop/types';
import { userRepository } from '../repositories/user.repository';
import { hashPassword, comparePassword } from '../utils/hash';
import { signToken } from '../utils/jwt';
import { ApiError } from '../utils/ApiError';

/**
 * Service: Authentication business logic.
 * Handles registration, login, and profile retrieval.
 */
export const authService = {
  /**
   * Register a new customer account.
   * - Checks for duplicate email
   * - Hashes password before storing
   * - Returns user + JWT token
   */
  register: async (dto: RegisterDto) => {
    // Check if email already exists
    const existing = await userRepository.findByEmail(dto.email);
    if (existing) {
      throw new ApiError(409, 'An account with this email already exists.');
    }

    const passwordHash = await hashPassword(dto.password);

    const user = await userRepository.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      phone: dto.phone,
    });

    const token = signToken({ userId: user.id, role: user.role });

    return { user, token };
  },

  /**
   * Authenticate a user with email and password.
   * Returns user + JWT token on success.
   */
  login: async (dto: LoginDto) => {
    // Find user by email (include password hash for comparison)
    const user = await userRepository.findByEmail(dto.email);
    if (!user) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    const isPasswordValid = await comparePassword(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    const token = signToken({ userId: user.id, role: user.role });

    // Don't return the password hash
    const { passwordHash: _, ...safeUser } = user;

    return { user: safeUser, token };
  },

  /**
   * Get the authenticated user's profile.
   */
  getProfile: async (userId: string) => {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found.');
    }
    return user;
  },
};
