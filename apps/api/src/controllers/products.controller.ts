import { Request, Response } from 'express';
import { productService } from '../services/products.service';
import { ApiResponseBuilder } from '../utils/ApiResponse';

/**
 * Controller: Handles HTTP requests for product endpoints.
 */
export const productsController = {
  getAll: async (req: Request, res: Response) => {
    const filters = {
      categoryId: req.query.categoryId as string | undefined,
      search: req.query.search as string | undefined,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 12,
    };

    const result = await productService.getAll(filters);
    res.json(ApiResponseBuilder.success('Products fetched.', result.products, result.pagination));
  },

  getFeatured: async (_req: Request, res: Response) => {
    const result = await productService.getFeatured();
    res.json(ApiResponseBuilder.success('Featured products fetched.', result.products));
  },

  getById: async (req: Request, res: Response) => {
    const product = await productService.getById(req.params.id);
    res.json(ApiResponseBuilder.success('Product fetched.', product));
  },

  create: async (req: Request, res: Response) => {
    const product = await productService.create(req.body);
    res.status(201).json(ApiResponseBuilder.success('Product created.', product));
  },

  update: async (req: Request, res: Response) => {
    const product = await productService.update(req.params.id, req.body);
    res.json(ApiResponseBuilder.success('Product updated.', product));
  },

  delete: async (req: Request, res: Response) => {
    await productService.delete(req.params.id);
    res.json(ApiResponseBuilder.success('Product deleted.'));
  },
};
