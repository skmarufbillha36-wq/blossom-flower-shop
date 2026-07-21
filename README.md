<div align="center">

# 🌸 Blossom Flower Shop

**A full-stack e-commerce platform for ordering custom flower arrangements — built as a university capstone project.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![Express](https://img.shields.io/badge/Express-4-green?logo=express)](https://expressjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)](https://www.postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)](https://www.prisma.io)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)](https://www.docker.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)

</div>

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Tech Stack](#-tech-stack)
- [Architecture](#️-architecture)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Option 1: Docker (Recommended)](#option-1-docker-recommended)
  - [Option 2: Local Development](#option-2-local-development)
- [API Reference](#-api-reference)
- [Database Schema](#️-database-schema)
- [Environment Variables](#-environment-variables)

---

## 🎯 Project Overview

**Blossom Flower Shop** is a complete e-commerce web application that allows customers to browse, customize, and order flower arrangements online. It includes a powerful admin dashboard for inventory and order management.

**Objective:** Design and implement a production-ready full-stack web application demonstrating modern software engineering practices — clean architecture, REST API design, containerization, and responsive UI.

**Scope:**
- Customer-facing storefront with product catalog, custom bouquet builder, and cart/checkout flow
- Admin dashboard for product and order management
- Secure JWT authentication with role-based access control
- Fully containerized with Docker Compose for one-command deployment

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 14 | React framework with SSR/SSG |
| **TypeScript** | 5 | Type safety |
| **Tailwind CSS** | 3 | Utility-first styling |
| **Zustand** | 4 | Global state (auth + cart) |
| **Axios** | 1 | HTTP client with JWT interceptors |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Express.js** | 4 | REST API server |
| **TypeScript** | 5 | Type safety |
| **Prisma** | 5 | ORM + type-safe database access |
| **JWT** | — | Stateless authentication |
| **bcryptjs** | 2 | Password hashing |
| **Zod** | 3 | Environment variable validation |

### Infrastructure
| Technology | Purpose |
|---|---|
| **PostgreSQL 15** | Primary relational database |
| **Docker Compose** | Multi-container orchestration |
| **esbuild** | Fast TypeScript bundling |

---

## 🏗️ Architecture

The project follows a **Monorepo** structure with **Clean Architecture** principles:

```
flower-shop/
├── apps/
│   ├── api/          ← Express REST API
│   │   └── src/
│   │       ├── config/         ← Zod-validated env config
│   │       ├── controllers/    ← HTTP request handlers
│   │       ├── services/       ← Business logic layer
│   │       ├── repositories/   ← Database access layer
│   │       ├── middlewares/    ← Auth, error, validation
│   │       ├── routes/         ← API route definitions
│   │       └── utils/          ← ApiError, ApiResponse helpers
│   │
│   └── web/          ← Next.js 14 Frontend
│       └── src/
│           ├── app/            ← App Router pages
│           │   ├── (public)/   ← Public routes
│           │   ├── (auth)/     ← Login / Register
│           │   ├── (customer)/ ← Protected customer pages
│           │   └── (admin)/    ← Protected admin pages
│           ├── components/     ← Reusable UI components
│           ├── store/          ← Zustand stores
│           └── lib/            ← Axios instance
│
└── packages/
    ├── types/        ← Shared TypeScript interfaces
    └── database/     ← Prisma schema + client + seed
```

### API Data Flow
```
HTTP Request
    │
    ▼
Route Handler
    │
    ▼
Controller  ──→  validates request, calls service
    │
    ▼
Service     ──→  business logic, throws ApiError on failure
    │
    ▼
Repository  ──→  Prisma database query
    │
    ▼
Response    ──→  ApiResponseBuilder.success() / error()
```

---

## ✨ Features

### 🛍️ Customer
| Feature | Description |
|---|---|
| **Product Catalog** | Browse all products with search, category filter, and pagination |
| **Product Detail** | Full product page with quantity selector and stock indicator |
| **Custom Bouquet Builder** | Interactive 3-step builder: choose size → pick flowers → finishing touches |
| **Shopping Cart** | Add/remove items, update quantities, persistent across sessions |
| **Checkout** | Delivery address, scheduled date, and order notes |
| **Order History** | View past orders with status tracking |
| **Authentication** | Register, login, JWT-secured sessions |

### 🔧 Admin
| Feature | Description |
|---|---|
| **Dashboard** | Sales stats, recent orders, quick actions |
| **Product Management** | Full CRUD — create/edit modal, delete with confirmation |
| **Order Management** | View all orders, update status inline (Pending → Confirmed → Delivered) |
| **Category Management** | Add/edit/delete product categories |

---

## 📁 Project Structure

```
flower-shop/
├── apps/
│   ├── api/
│   │   ├── src/
│   │   │   ├── config/
│   │   │   │   └── env.ts               ← Zod-validated config
│   │   │   ├── controllers/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── products.controller.ts
│   │   │   │   ├── cart.controller.ts
│   │   │   │   ├── orders.controller.ts
│   │   │   │   └── categories.controller.ts
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── products.service.ts
│   │   │   │   ├── cart.service.ts
│   │   │   │   ├── orders.service.ts
│   │   │   │   └── categories.service.ts
│   │   │   ├── repositories/
│   │   │   │   ├── user.repository.ts
│   │   │   │   ├── product.repository.ts
│   │   │   │   ├── cart.repository.ts
│   │   │   │   ├── order.repository.ts
│   │   │   │   └── category.repository.ts
│   │   │   ├── middlewares/
│   │   │   │   ├── auth.middleware.ts   ← JWT verification
│   │   │   │   ├── admin.middleware.ts  ← Role guard (ADMIN only)
│   │   │   │   ├── error.middleware.ts  ← Global error handler
│   │   │   │   └── validate.middleware.ts
│   │   │   ├── routes/
│   │   │   │   ├── index.ts             ← /api/health
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── products.routes.ts
│   │   │   │   ├── cart.routes.ts
│   │   │   │   ├── orders.routes.ts
│   │   │   │   └── categories.routes.ts
│   │   │   ├── utils/
│   │   │   │   ├── ApiError.ts
│   │   │   │   └── ApiResponse.ts
│   │   │   ├── app.ts
│   │   │   └── server.ts
│   │   ├── Dockerfile
│   │   ├── entrypoint.sh
│   │   └── package.json
│   │
│   └── web/
│       ├── src/
│       │   ├── app/
│       │   │   ├── (public)/
│       │   │   │   ├── page.tsx         ← Homepage
│       │   │   │   ├── shop/            ← Product catalog
│       │   │   │   ├── products/[id]/   ← Product detail
│       │   │   │   └── bouquet-builder/ ← Custom builder
│       │   │   ├── (auth)/
│       │   │   │   ├── login/
│       │   │   │   └── register/
│       │   │   ├── (customer)/
│       │   │   │   ├── cart/
│       │   │   │   ├── checkout/
│       │   │   │   └── orders/
│       │   │   └── (admin)/
│       │   │       └── admin/
│       │   │           ├── dashboard/
│       │   │           ├── products/
│       │   │           └── orders/
│       │   ├── components/
│       │   │   ├── layout/
│       │   │   │   ├── Header.tsx
│       │   │   │   └── Footer.tsx
│       │   │   └── ui/
│       │   │       ├── Button.tsx
│       │   │       ├── Badge.tsx
│       │   │       └── Skeleton.tsx
│       │   ├── store/
│       │   │   ├── authStore.ts
│       │   │   └── cartStore.ts
│       │   └── lib/
│       │       └── api.ts               ← Axios + JWT interceptors
│       ├── Dockerfile
│       └── package.json
│
├── packages/
│   ├── types/
│   │   └── src/index.ts                 ← Shared TS interfaces
│   └── database/
│       ├── prisma/
│       │   └── schema.prisma            ← 8-model schema
│       ├── src/
│       │   ├── index.ts                 ← Prisma client singleton
│       │   └── seed.ts                  ← Sample data seeder
│       └── Dockerfile.seed
│
├── docs/
│   ├── setup.md                         ← Development setup guide
│   └── api/                             ← API documentation
│
├── docker-compose.yml                   ← 3-service orchestration
├── Makefile                             ← Helper commands
├── .env.docker                          ← Docker environment defaults
└── package.json                         ← Monorepo root
```

---

## 🚀 Getting Started

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (recommended)
- OR: Node.js 20+, PostgreSQL 15+

---

### Option 1: Docker (Recommended)

**One command to run everything** — no local setup needed.

```bash
# 1. Clone the repository
git clone <repo-url>
cd flower-shop

# 2. Build and start all services
docker compose up --build

# 3. In a new terminal, seed the database (first time only)
docker compose --profile seed run --rm seed
```

| Service | URL |
|---|---|
| 🌐 Web (Next.js) | http://localhost:3000 |
| 🔌 API (Express) | http://localhost:5000/api |
| ❤️ Health Check | http://localhost:5000/api/health |
| 🗄️ PostgreSQL | localhost:5432 |

**Test credentials after seeding:**

| Role | Email | Password |
|---|---|---|
| Admin | admin@flowershop.com | admin123456 |
| Customer | customer@example.com | customer123 |

**Common commands:**

```bash
docker compose up --build          # Build + start
docker compose up -d               # Start in background
docker compose logs -f api         # View API logs
docker compose logs -f web         # View Web logs
docker compose down                # Stop all
docker compose down -v             # Stop + delete database
docker compose exec db psql -U postgres flower_shop  # DB shell
```

---

### Option 2: Local Development

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Set up environment
cp .env.docker .env
# Edit .env with your local PostgreSQL credentials

# 3. Generate Prisma client
npx prisma generate --schema=packages/database/prisma/schema.prisma

# 4. Run migrations
npx prisma migrate dev --schema=packages/database/prisma/schema.prisma

# 5. Seed the database
npx ts-node packages/database/src/seed.ts

# 6. Start both services in parallel
npm run dev
```

---

## 📡 API Reference

**Base URL:** `http://localhost:5000/api`

### Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | ❌ | Create a new account |
| POST | `/auth/login` | ❌ | Login, returns JWT |
| GET | `/auth/me` | ✅ | Get current user profile |

### Products
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/products` | ❌ | List all products (with filters) |
| GET | `/products/:id` | ❌ | Get product by ID |
| POST | `/products` | Admin | Create product |
| PUT | `/products/:id` | Admin | Update product |
| DELETE | `/products/:id` | Admin | Delete product |

### Categories
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/categories` | ❌ | List all categories |
| POST | `/categories` | Admin | Create category |
| PUT | `/categories/:id` | Admin | Update category |
| DELETE | `/categories/:id` | Admin | Delete category |

### Cart
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/cart` | ✅ | Get current cart |
| POST | `/cart/items` | ✅ | Add item to cart |
| PUT | `/cart/items/:id` | ✅ | Update item quantity |
| DELETE | `/cart/items/:id` | ✅ | Remove item |
| DELETE | `/cart` | ✅ | Clear cart |

### Orders
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/orders` | ✅ | Place order from cart |
| GET | `/orders/my` | ✅ | Get customer's orders |
| GET | `/orders` | Admin | Get all orders |
| PUT | `/orders/:id/status` | Admin | Update order status |

### API Response Format

All endpoints return a consistent response shape:

```json
{
  "success": true,
  "message": "Products fetched.",
  "data": { ... }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Product not found.",
  "errors": []
}
```

---

## 🗄️ Database Schema

```
User
 ├── id, name, email, passwordHash, phone, role (CUSTOMER | ADMIN)
 ├── Cart (1:1) → CartItem[] → Product
 └── Order[] → OrderItem[] + Delivery

Product
 ├── id, name, slug, description, price, stock
 ├── isFeatured, isAvailable
 └── Category (N:1)

Category
 └── id, name, slug, description, imageUrl

Order
 ├── status: PENDING | CONFIRMED | PREPARING | DELIVERING | DELIVERED | CANCELLED
 ├── OrderItem[] (snapshot of products at purchase time)
 └── Delivery (address, city, scheduledAt, notes)
```

---

## 🔐 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | Secret key for JWT signing |
| `JWT_EXPIRES_IN` | ✅ | Token expiry (e.g. `7d`) |
| `PORT` | ❌ | API server port (default: 5000) |
| `CLOUDINARY_CLOUD_NAME` | ❌ | For image upload feature |
| `CLOUDINARY_API_KEY` | ❌ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ❌ | Cloudinary API secret |

---

<div align="center">

Built with ❤️ as a university capstone project  
**Stack:** Next.js · Express · PostgreSQL · Prisma · Docker · TypeScript

</div>
