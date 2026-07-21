import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'express-async-errors'; // Enables async error handling without try/catch

import routes from './routes';
import { errorMiddleware } from './middlewares/error.middleware';
import { env } from './config/env';

const app = express();

// ─── Security Middlewares ─────────────────────────────────
app.use(helmet()); // Sets security-related HTTP headers
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      process.env.FRONTEND_URL ?? 'http://localhost:3000',
    ],
    credentials: true,
  })
);

// ─── Request Parsing ──────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Logging ──────────────────────────────────────────────
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Routes ───────────────────────────────────────────────
app.use('/api', routes);

// ─── Static: Serve uploaded images ───────────────────────
// Must set Cross-Origin-Resource-Policy: cross-origin so browsers
// can load images from :5000 when page is served from :3000
app.use(
  '/uploads',
  (_req, res, next) => { res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin'); next(); },
  express.static('/app/uploads'),
);

// ─── 404 Handler ─────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// ─── Global Error Handler (must be last) ─────────────────
app.use(errorMiddleware);

export default app;
