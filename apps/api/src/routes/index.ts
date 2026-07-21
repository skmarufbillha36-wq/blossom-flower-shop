import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './products.routes';
import cartRoutes from './cart.routes';
import orderRoutes from './orders.routes';
import categoryRoutes from './categories.routes';
import uploadRoutes from './upload.routes';

const router = Router();

/** Health check endpoint */
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/upload', uploadRoutes);

export default router;
