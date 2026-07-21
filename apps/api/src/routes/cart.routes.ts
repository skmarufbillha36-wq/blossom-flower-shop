import { Router } from 'express';
import { cartController } from '../controllers/cart.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// All cart routes require authentication
router.use(authenticate);

/** GET /api/cart — Get current user's cart */
router.get('/', cartController.getCart);

/** POST /api/cart/items — Add item to cart */
router.post('/items', cartController.addItem);

/** PUT /api/cart/items/:itemId — Update item quantity */
router.put('/items/:itemId', cartController.updateItem);

/** DELETE /api/cart/items/:itemId — Remove item from cart */
router.delete('/items/:itemId', cartController.removeItem);

/** DELETE /api/cart — Clear entire cart */
router.delete('/', cartController.clearCart);

export default router;
