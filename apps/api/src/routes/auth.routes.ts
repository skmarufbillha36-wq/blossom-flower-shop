import { Router } from 'express';
import { authController, registerSchema, loginSchema } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';

const router = Router();

/** POST /api/auth/register — Create a new customer account */
router.post('/register', validate(registerSchema), authController.register);

/** POST /api/auth/login — Login and receive a JWT token */
router.post('/login', validate(loginSchema), authController.login);

/** POST /api/auth/logout — Logout (client should discard token) */
router.post('/logout', authenticate, authController.logout);

/** GET /api/auth/me — Get current authenticated user's profile */
router.get('/me', authenticate, authController.getMe);

export default router;
