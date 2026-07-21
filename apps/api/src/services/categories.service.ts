import { categoryRepository } from '../repositories/category.repository';
import { ApiError } from '../utils/ApiError';

/**
 * Service: Category business logic.
 */
export const categoryService = {
  getAll: () => categoryRepository.findAll(),

  getById: async (id: string) => {
    const cat = await categoryRepository.findById(id);
    if (!cat) throw new ApiError(404, 'Category not found.');
    return cat;
  },

  create: (data: { name: string; description?: string; imageUrl?: string }) => {
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
    return categoryRepository.create({ ...data, slug });
  },

  update: (id: string, data: Partial<{ name: string; description: string; imageUrl: string }>) => {
    return categoryRepository.update(id, data);
  },

  delete: (id: string) => categoryRepository.delete(id),
};
