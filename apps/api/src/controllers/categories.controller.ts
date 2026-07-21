import { Request, Response } from 'express';
import { categoryService } from '../services/categories.service';
import { ApiResponseBuilder } from '../utils/ApiResponse';

export const categoriesController = {
  getAll: async (_req: Request, res: Response) => {
    const categories = await categoryService.getAll();
    res.json(ApiResponseBuilder.success('Categories fetched.', categories));
  },

  getById: async (req: Request, res: Response) => {
    const cat = await categoryService.getById(req.params.id);
    res.json(ApiResponseBuilder.success('Category fetched.', cat));
  },

  create: async (req: Request, res: Response) => {
    const cat = await categoryService.create(req.body);
    res.status(201).json(ApiResponseBuilder.success('Category created.', cat));
  },

  update: async (req: Request, res: Response) => {
    const cat = await categoryService.update(req.params.id, req.body);
    res.json(ApiResponseBuilder.success('Category updated.', cat));
  },

  delete: async (req: Request, res: Response) => {
    await categoryService.delete(req.params.id);
    res.json(ApiResponseBuilder.success('Category deleted.'));
  },
};
