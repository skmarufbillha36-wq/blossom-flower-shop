# 🛠 Development Setup Guide

This guide explains how to set up the **Blossom Flower Shop** project for local development.

---

## Prerequisites

| Tool | Version | Download |
|---|---|---|
| Node.js | 20+ | https://nodejs.org |
| npm | 10+ | (bundled with Node.js) |
| Docker Desktop | Latest | https://docker.com |
| Git | Latest | https://git-scm.com |
| PostgreSQL | 15+ | (only for local dev without Docker) |

---

## Option 1: Docker Setup (Recommended)

The easiest way — no local PostgreSQL or configuration needed.

### Step 1 — Clone

```bash
git clone <repo-url>
cd flower-shop
```

### Step 2 — Start All Services

```bash
docker compose up --build
```

This will:
- Pull `postgres:15-alpine` image
- Build the **API** image (`esbuild` bundle)
- Build the **Web** image (Next.js standalone)
- Run Prisma migrations automatically
- Start all 3 services

### Step 3 — Seed the Database

```bash
# In a separate terminal:
docker compose --profile seed run --rm seed
```

This inserts:
- 6 categories (Roses, Tulips, Sunflowers, Bouquets, Orchids, Lilies)
- 12 sample products
- 1 Admin user: `admin@flowershop.com` / `admin123456`
- 1 Customer: `customer@example.com` / `customer123`
- 1 sample order

### Step 4 — Open in Browser

| URL | Description |
|---|---|
| http://localhost:3000 | Customer storefront |
| http://localhost:3000/login | Login page |
| http://localhost:3000/admin/dashboard | Admin panel |
| http://localhost:5000/api/health | API health check |

---

## Option 2: Local Development (Without Docker)

### Step 1 — Install Dependencies

```bash
npm install --legacy-peer-deps
```

This installs all packages across the monorepo workspaces.

### Step 2 — Set Up Environment

```bash
# API environment
cp apps/api/.env.example apps/api/.env
```

Edit `apps/api/.env`:

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/flower_shop"
JWT_SECRET="your-super-secret-key"
JWT_EXPIRES_IN="7d"
PORT=5000
```

### Step 3 — Create the Database

```bash
# Create the database in PostgreSQL
createdb flower_shop

# OR using psql:
psql -U postgres -c "CREATE DATABASE flower_shop;"
```

### Step 4 — Generate Prisma Client

```bash
npx prisma generate --schema=packages/database/prisma/schema.prisma
```

### Step 5 — Run Migrations

```bash
npx prisma migrate dev --schema=packages/database/prisma/schema.prisma
```

### Step 6 — Seed the Database

```bash
npx ts-node packages/database/src/seed.ts
```

### Step 7 — Start Both Services

```bash
# Start API + Web simultaneously
npm run dev

# OR start them separately:
npm run dev:api    # API on http://localhost:5000
npm run dev:web    # Web on http://localhost:3000
```

---

## Project Workspace Scripts

| Script | Command | Description |
|---|---|---|
| Start all | `npm run dev` | API + Web in parallel |
| API only | `npm run dev:api` | Express dev server |
| Web only | `npm run dev:web` | Next.js dev server |
| Build all | `npm run build` | Production build |
| Lint | `npm run lint` | ESLint all packages |
| Format | `npm run format` | Prettier all files |

---

## Database Commands

```bash
# Generate Prisma client after schema changes
npx prisma generate --schema=packages/database/prisma/schema.prisma

# Create and apply a new migration
npx prisma migrate dev --name your_migration_name \
  --schema=packages/database/prisma/schema.prisma

# Open Prisma Studio (visual DB browser)
npx prisma studio --schema=packages/database/prisma/schema.prisma

# Reset database (deletes all data!)
npx prisma migrate reset --schema=packages/database/prisma/schema.prisma

# Seed database
npx ts-node packages/database/src/seed.ts
```

---

## Docker Commands Reference

```bash
# Build + start all services
docker compose up --build

# Start in background
docker compose up -d

# View logs
docker compose logs -f             # All services
docker compose logs -f api         # API only
docker compose logs -f web         # Web only

# Stop all containers
docker compose down

# Stop + delete database volume (fresh start)
docker compose down -v

# Open PostgreSQL shell
docker compose exec db psql -U postgres flower_shop

# Rebuild a specific service
docker compose build api --no-cache
docker compose build web --no-cache

# Seed database (Docker)
docker compose --profile seed run --rm seed
```

---

## Troubleshooting

### ❌ `Port already in use`

```bash
# Find and kill process using port 5000 or 3000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### ❌ `Prisma Client not found`

```bash
npx prisma generate --schema=packages/database/prisma/schema.prisma
```

### ❌ `Database connection failed`

1. Make sure PostgreSQL is running
2. Check `DATABASE_URL` in `.env`
3. Make sure the database exists: `createdb flower_shop`

### ❌ `Cannot find module '@flower-shop/types'`

```bash
# Reinstall workspace dependencies
npm install --legacy-peer-deps
```

### ❌ TypeScript errors in VS Code (red files)

```bash
# Regenerate Prisma types
npx prisma generate --schema=packages/database/prisma/schema.prisma

# Then in VS Code: Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

---

## VS Code Recommended Extensions

- **Prisma** — Syntax highlighting for `.prisma` files
- **ESLint** — Real-time linting
- **Prettier** — Code formatting
- **Docker** — Manage containers from VS Code
- **Thunder Client** — Test API endpoints directly in VS Code
