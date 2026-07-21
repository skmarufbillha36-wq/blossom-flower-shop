import { prisma } from '@flower-shop/database';

/**
 * Repository: All database operations for the Category model.
 */
export const categoryRepository = {
  /** Get all categories */
  findAll: () => {
    return prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  },

  /** Find a category by ID */
  findById: (id: string) => {
    return prisma.category.findUnique({ where: { id } });
  },

  /** Create a new category */
  create: (data: { name: string; slug: string; description?: string; imageUrl?: string }) => {
    return prisma.category.create({ data });
  },

  /** Update a category */
  update: (id: string, data: Partial<{ name: string; description: string; imageUrl: string }>) => {
    return prisma.category.update({ where: { id }, data });
  },

  /** Delete a category */
  delete: (id: string) => {
    return prisma.category.delete({ where: { id } });
  },
};
