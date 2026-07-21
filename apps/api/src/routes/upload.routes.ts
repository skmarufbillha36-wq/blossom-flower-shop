import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/admin.middleware';
import { ApiResponseBuilder } from '../utils/ApiResponse';

const router = Router();

/* ─── Determine storage backend ─────────────────────────────────────────── */
const useCloudinary =
  !!process.env.CLOUDINARY_CLOUD_NAME &&
  !!process.env.CLOUDINARY_API_KEY &&
  !!process.env.CLOUDINARY_API_SECRET;

let storage: multer.StorageEngine;

if (useCloudinary) {
  /* ── Cloudinary storage ── */
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder:         'blossom-flower-shop',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      transformation: [{ width: 1200, crop: 'limit', quality: 'auto' }],
    } as Record<string, unknown>,
  });

  console.log('[upload] ☁️  Using Cloudinary storage');
} else {
  /* ── Local disk storage (fallback) ── */
  const UPLOADS_DIR = '/app/uploads';
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
    filename:    (_req, file, cb) => {
      const ext  = path.extname(file.originalname).toLowerCase();
      const name = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
      cb(null, name);
    },
  });

  console.log('[upload] 💾  Using local disk storage (no Cloudinary keys set)');
}

/* ─── Multer instance ────────────────────────────────────────────────────── */
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files are allowed (JPEG, PNG, WebP, GIF).'));
  },
});

/**
 * POST /api/upload
 * Upload a single image (admin only).
 * Returns the public URL — either a Cloudinary CDN URL or a local server URL.
 */
router.post(
  '/',
  authenticate,
  requireAdmin,
  upload.single('image'),
  (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json(ApiResponseBuilder.error('No file uploaded.'));
    }

    /* Cloudinary returns req.file.path as the CDN URL */
    const imageUrl = useCloudinary
      ? (req.file as Express.Multer.File & { path: string }).path
      : `${process.env.API_BASE_URL ?? `http://localhost:${process.env.PORT ?? 5000}`}/uploads/${req.file.filename}`;

    return res.status(201).json(
      ApiResponseBuilder.success('Image uploaded successfully.', { imageUrl }),
    );
  },
);

export default router;
