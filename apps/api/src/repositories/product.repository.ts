import { prisma } from '@flower-shop/database';
import { ProductFilters } from '@flower-shop/types';

/**
 * Repository: All database operations for the Product model.
 */
export const productRepository = {
  /**
   * Find all products with optional filters and pagination.
   */
  findAll: async (filters: ProductFilters = {}) => {
    const { categoryId, minPrice, maxPrice, isFeatured, search, page = 1, limit = 12 } = filters;
    const skip = (page - 1) * limit;

    const where = {
      isAvailable: true,
      ...(categoryId && { categoryId }),
      ...(isFeatured !== undefined && { isFeatured }),
      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            price: {
              ...(minPrice !== undefined && { gte: minPrice }),
              ...(maxPrice !== undefined && { lte: maxPrice }),
            },
          }
        : {}),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total, page, limit };
  },

  /**
   * Find a product by its ID.
   */
  findById: (id: string) => {
    return prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
  },

  /**
   * Find a product by its URL slug.
   */
  findBySlug: (slug: string) => {
    return prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });
  },

  /**
   * Create a new product.
   */
  create: (data: {
    name: string;
    slug: string;
    description: string;
    price: number;
    stock: number;
    categoryId: string;
    imageUrl?: string;
    isFeatured?: boolean;
  }) => {
    return prisma.product.create({
      data,
      include: { category: true },
    });
  },

  /**
   * Update a product by ID.
   */
  update: (id: string, data: Partial<{
    name: string;
    slug: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    isFeatured: boolean;
    isAvailable: boolean;
    categoryId: string;
  }>) => {
    return prisma.product.update({
      where: { id },
      data,
      include: { category: true },
    });
  },

  /**
   * Soft-delete a product by marking it as unavailable.
   */
  delete: (id: string) => {
    return prisma.product.update({
      where: { id },
      data: { isAvailable: false },
    });
  },
};
