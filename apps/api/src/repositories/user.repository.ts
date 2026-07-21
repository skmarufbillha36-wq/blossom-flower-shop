import { prisma } from '@flower-shop/database';
import { RegisterDto } from '@flower-shop/types';

/**
 * Repository: All database operations for the User model.
 * No business logic here — only Prisma calls.
 */
export const userRepository = {
  /**
   * Find a user by their email address.
   */
  findByEmail: (email: string) => {
    return prisma.user.findUnique({ where: { email } });
  },

  /**
   * Find a user by their ID.
   */
  findById: (id: string) => {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });
  },

  /**
   * Create a new user record.
   */
  create: (data: Omit<RegisterDto, 'password'> & { passwordHash: string }) => {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        phone: data.phone,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });
  },
};
