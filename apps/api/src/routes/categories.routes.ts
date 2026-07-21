import { Router } from 'express';
import { categoriesController } from '../controllers/categories.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/admin.middleware';

const router = Router();

/** GET /api/categories — List all categories (public) */
router.get('/', categoriesController.getAll);

/** GET /api/categories/:id — Get single category (public) */
router.get('/:id', categoriesController.getById);

/** POST /api/categories — Create category (admin only) */
router.post('/', authenticate, requireAdmin, categoriesController.create);

/** PUT /api/categories/:id — Update category (admin only) */
router.put('/:id', authenticate, requireAdmin, categoriesController.update);

/** DELETE /api/categories/:id — Delete category (admin only) */
router.delete('/:id', authenticate, requireAdmin, categoriesController.delete);

export default router;
