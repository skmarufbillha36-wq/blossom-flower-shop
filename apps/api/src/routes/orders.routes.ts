import { Router } from 'express';
import { ordersController } from '../controllers/orders.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/admin.middleware';

const router = Router();

// ─── Customer Routes (require login) ─────────────────────

/** POST /api/orders — Place an order from current cart */
router.post('/', authenticate, ordersController.placeOrder);

/** GET /api/orders — Get current user's order history */
router.get('/', authenticate, ordersController.getMyOrders);

/** GET /api/orders/:id — Get a single order (own orders only) */
router.get('/:id', authenticate, ordersController.getOrderById);

// ─── Admin Routes ─────────────────────────────────────────

/** GET /api/orders/admin/all — Get all orders (admin only) */
router.get('/admin/all', authenticate, requireAdmin, ordersController.getAllOrders);

/** PUT /api/orders/admin/:id/status — Update order status (admin only) */
router.put('/admin/:id/status', authenticate, requireAdmin, ordersController.updateStatus);

export default router;
