import { Router } from 'express';
import { productsController } from '../controllers/products.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/admin.middleware';

const router = Router();

/** GET /api/products — List all products (with filters + pagination) */
router.get('/', productsController.getAll);

/** GET /api/products/featured — Get featured products for homepage */
router.get('/featured', productsController.getFeatured);

/** GET /api/products/:id — Get a single product */
router.get('/:id', productsController.getById);

/** POST /api/products — Create a new product (admin only) */
router.post('/', authenticate, requireAdmin, productsController.create);

/** PUT /api/products/:id — Update a product (admin only) */
router.put('/:id', authenticate, requireAdmin, productsController.update);

/** DELETE /api/products/:id — Soft-delete a product (admin only) */
router.delete('/:id', authenticate, requireAdmin, productsController.delete);

export default router;
