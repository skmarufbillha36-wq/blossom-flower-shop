import { ProductFilters } from '@flower-shop/types';
import { productRepository } from '../repositories/product.repository';
import { ApiError } from '../utils/ApiError';

/**
 * Service: Product business logic.
 */
export const productService = {
  /**
   * Get all available products with optional filters and pagination.
   */
  getAll: async (filters: ProductFilters) => {
    const result = await productRepository.findAll(filters);
    const totalPages = Math.ceil(result.total / (filters.limit ?? 12));
    return {
      products: result.products,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages,
      },
    };
  },

  /**
   * Get a single product by ID.
   */
  getById: async (id: string) => {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new ApiError(404, 'Product not found.');
    }
    return product;
  },

  /**
   * Get featured products for the homepage.
   */
  getFeatured: () => {
    return productRepository.findAll({ isFeatured: true, limit: 8 });
  },

  /**
   * Create a new product (admin only).
   * Automatically generates a URL-friendly slug from the name.
   */
  create: async (data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: string;
    imageUrl?: string;
    isFeatured?: boolean;
  }) => {
    // Generate slug from product name
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();

    // Ensure slug uniqueness by appending timestamp if needed
    const existing = await productRepository.findBySlug(slug);
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    return productRepository.create({ ...data, slug: finalSlug });
  },

  /**
   * Update a product (admin only).
   */
  update: async (id: string, data: Parameters<typeof productRepository.update>[1]) => {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new ApiError(404, 'Product not found.');
    }
    return productRepository.update(id, data);
  },

  /**
   * Soft-delete a product (admin only).
   */
  delete: async (id: string) => {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new ApiError(404, 'Product not found.');
    }
    return productRepository.delete(id);
  },
};
