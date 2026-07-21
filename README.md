# 🌸 Blossom Flower Shop

Full-stack flower shop e-commerce — Next.js 14, Express.js, PostgreSQL, Docker, Cloudinary CDN.

## 🚀 Deployment Guide

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import `blossom-flower-shop` repo
3. Set **Root Directory** → `apps/web`
4. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL` = your Railway API URL (e.g. `https://your-api.railway.app`)
5. Click **Deploy**

---

### Backend + Database → Railway

1. Go to [railway.app](https://railway.app) → **New Project**
2. Click **+ New** → **Database** → **PostgreSQL** (creates DB automatically)
3. Click **+ New** → **GitHub Repo** → select `blossom-flower-shop`
4. Set **Root Directory** → `apps/api`
5. Add Environment Variables:

```
DATABASE_URL          = (auto-provided by Railway PostgreSQL)
JWT_SECRET            = any-long-random-secret-string
CLOUDINARY_CLOUD_NAME = iedhaa6l
CLOUDINARY_API_KEY    = 611616153163134
CLOUDINARY_API_SECRET = t2RoGG0UnpD_7dLwDQxvn94G1UE
PORT                  = 5000
NODE_ENV              = production
```

6. After deploy, run migrations via Railway **Shell**:
```bash
npm run db:migrate
npm run db:seed
```

---

## 💻 Local Development

```bash
# Start everything (web + api + database)
docker compose up -d

# Access
# Frontend: http://localhost:3000
# API:      http://localhost:5000
```

### Login Credentials (local)

| Role | Email | Password |
|---|---|---|
| Admin | admin@flowershop.com | admin123456 |
| Customer | customer@example.com | customer123 |

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Zustand |
| Backend | Express.js, TypeScript, Prisma ORM |
| Database | PostgreSQL 15 |
| Images | Cloudinary CDN |
| DevOps | Docker, Docker Compose |
| Deployment | Vercel (web) + Railway (api + db) |

---

## 📁 Project Structure

```
flower-shop/
├── apps/
│   ├── web/          ← Next.js frontend (Vercel)
│   └── api/          ← Express.js backend (Railway)
├── packages/
│   ├── types/        ← Shared TypeScript types
│   └── database/     ← Prisma schema + seed
└── docker-compose.yml
```
