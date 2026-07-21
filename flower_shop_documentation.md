# Flower Shop Website — Project Documentation

**Student:** Abdelkarem Ahmed
**Course:** GitHub & Vibe Coding Training — Work Experience
**Instructor:** Kürşat Enes Selçuk Yücel
**Institution:** Ostim Technical University
**Date:** July 22, 2026

---

## Table of Contents

1. Project Objective & Scope
2. System Architecture
3. Technology Stack
4. Why These Technologies?
5. Project Structure
6. Database Schema
7. API Endpoints
8. Key Features Implemented
9. UI/UX Design Decisions
10. Image Storage — Cloudinary CDN
11. Containerization — Docker
12. Security Measures
13. Deployment Strategy
14. Challenges & Solutions

---

## 1. Project Objective & Scope

### Objective

The objective of this project is to design and develop a fully functional, production-ready e-commerce website for a flower shop. The website aims to provide real business value — not just serve as a course assignment — by enabling a real flower shop to showcase its products, receive online orders, and manage its operations efficiently.

The end goal is to deliver a professional-grade product that can be presented to an actual flower shop business, deployed to a live environment, and potentially sold as a commercial solution.

### Core Features Implemented

| Feature | Description | Status |
|---|---|---|
| Flower Catalog | Browse all flowers with search, category filter, and price range filter | Complete |
| Product Detail Page | Individual product page with full image and description | Complete |
| Shopping Cart | Add/remove items, quantity control, cart summary | Complete |
| Checkout Flow | Delivery address, order summary, and order placement | Complete |
| Custom Bouquet Builder | Select flowers, colors, and size to build a custom bouquet | Complete |
| User Authentication | JWT-based register, login, and session management | Complete |
| Order History | Authenticated users can view their past orders | Complete |
| Admin Dashboard | Product management with image upload | Complete |
| Image Upload (Cloudinary) | All product images stored on CDN, not local disk | Complete |

**Out of Scope (Phase 1):**
- Online payment gateway integration
- Mobile native application
- Real-time order tracking

---

## 2. System Architecture

The project follows a **Monorepo architecture** — all parts of the system live in one repository.

```
flower-shop/
├── apps/
│   ├── web/        ← Next.js 14 Frontend
│   └── api/        ← Express.js REST API
├── packages/
│   ├── types/      ← Shared TypeScript types
│   └── database/   ← Prisma schema + client
├── docker-compose.yml
└── package.json
```

### 3-Tier Architecture

```
[Browser] → [Next.js :3000] → [Express API :5000] → [PostgreSQL :5432]
```

### Image Storage Flow

```
[Admin] → multipart/form-data → [API] → multer-storage-cloudinary
       → [Cloudinary CDN] → returns permanent HTTPS URL → [PostgreSQL]
```

---

## 3. Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| Next.js 14 | React framework with SSR/SSG for SEO |
| TypeScript | Type-safe JavaScript |
| Vanilla CSS + Tailwind utilities | Custom design system |
| Zustand | Lightweight global state (cart, auth) |
| Axios | HTTP client for API calls |

### Backend

| Technology | Purpose |
|---|---|
| Node.js 20 | JavaScript runtime |
| Express.js 4 | REST API framework |
| TypeScript | Type-safe backend code |
| Prisma ORM 5 | Type-safe database client and migrations |
| JWT | Stateless user authentication |
| Bcrypt | Password hashing |
| Multer | Multipart file upload handling |
| multer-storage-cloudinary | Cloudinary adapter for Multer |
| Cloudinary SDK 2 | Image upload and CDN management |

### Database & Infrastructure

| Technology | Purpose |
|---|---|
| PostgreSQL 15 | Primary relational database |
| Docker + Docker Compose | Containerization and orchestration |
| Cloudinary CDN | Persistent cloud image storage |
| Vercel | Frontend deployment |

---

## 4. Why These Technologies?

### Next.js (Frontend)

Next.js was chosen over plain React because a flower shop relies heavily on **search engine visibility**. When a customer searches "flower delivery" on Google, the website must appear in results.

Next.js provides **Server-Side Rendering (SSR)** and **Static Site Generation (SSG)**, making pages fully readable by search engine crawlers — something client-side-only React cannot achieve.

Additional benefits: built-in routing, built-in image optimization, strong e-commerce ecosystem.

### Node.js + Express (Backend)

Allows **TypeScript across the entire stack**. Frontend and backend share the same type definitions via the `packages/types` workspace — eliminating a common class of bugs where the API and UI disagree on data shapes.

Express is lightweight and non-opinionated, giving full control over API design. Node.js's **non-blocking I/O model** handles many concurrent connections efficiently.

### PostgreSQL (Database)

E-commerce data is inherently **relational**:
- Customers → place → Orders → contain → Products → belong to → Categories

PostgreSQL is ACID-compliant (data integrity guaranteed), open-source, and trusted by companies like Instagram, Netflix, and Spotify. Prisma ORM adds type safety and automatic migrations.

### Cloudinary (Image Storage)

Local disk storage was initially used (`/app/uploads`). This fails in Docker: **rebuilding a container permanently deletes all uploaded files**.

Cloudinary stores images on a globally distributed CDN with permanent, stable URLs. Images survive server restarts, rebuilds, and redeployments — and load fast worldwide via the CDN.

### Docker (Containerization)

Eliminates "works on my machine" — every environment (developer laptop, university server, cloud) runs identical containers. One command (`docker compose up -d`) starts the entire system.

### Zustand (State Management)

Dramatically simpler than Redux. The cart store is fewer than 50 lines with no boilerplate. Built-in `localStorage` persistence keeps the cart alive across page refreshes.

### Monorepo (npm Workspaces)

`packages/types` defines TypeScript interfaces once (Product, Order, User) and shares them between frontend and backend — guaranteeing both sides always agree on data shapes.

---

## 5. Project Structure

### Frontend (apps/web/src/)

```
app/
├── (public)/
│   ├── page.tsx              ← Home page (hero, featured, bestsellers)
│   ├── shop/page.tsx         ← Shop with sidebar filters + product grid
│   ├── products/[id]/        ← Product detail page
│   ├── cart/page.tsx         ← Shopping cart
│   ├── checkout/page.tsx     ← Checkout and order placement
│   ├── orders/page.tsx       ← Order history
│   ├── login/page.tsx        ← Login
│   ├── register/page.tsx     ← Registration
│   └── bouquet-builder/      ← Custom bouquet builder
├── (admin)/admin/
│   ├── dashboard/            ← Orders overview
│   └── products/             ← Product CRUD + image upload
├── globals.css               ← Full design system
└── layout.tsx                ← Root layout

components/
├── layout/Header.tsx         ← Nav with active link, cart badge, auth
├── layout/Footer.tsx
├── features/catalog/
│   └── ProductCard.tsx       ← Reusable product card
└── ui/Skeleton.tsx           ← Loading skeletons

store/
├── cartStore.ts              ← Zustand cart (add, remove, qty, total)
└── authStore.ts              ← Zustand auth (login, logout, user)

lib/api.ts                    ← Axios with base URL + auth interceptor
```

### Backend (apps/api/src/)

```
routes/
├── auth.routes.ts            ← Register, Login
├── products.routes.ts        ← Product CRUD
├── categories.routes.ts      ← Categories
├── orders.routes.ts          ← Orders
└── upload.routes.ts          ← Image upload to Cloudinary

middleware/
├── auth.middleware.ts        ← JWT verification
└── admin.middleware.ts       ← Admin role check

repositories/
├── product.repository.ts     ← DB queries
├── category.repository.ts
└── order.repository.ts
```

---

## 6. Database Schema

### Entity Relationship

```
User ────────< Order >────────< OrderItem >──── Product ──── Category
```

### Models (Prisma)

**User**
```
id        String   (cuid, primary key)
email     String   (unique)
password  String   (bcrypt hash)
name      String
role      CUSTOMER | ADMIN
orders    Order[]
createdAt DateTime
```

**Product**
```
id          String
name        String
description String?
price       Decimal
imageUrl    String?   ← Cloudinary CDN URL
stock       Int
isFeatured  Boolean
categoryId  String?
category    Category?
```

**Order**
```
id        String
userId    String
items     OrderItem[]
total     Decimal
status    PENDING | CONFIRMED | DELIVERED | CANCELLED
address   String
createdAt DateTime
```

---

## 7. API Endpoints

### Authentication

| Method | Endpoint | Auth |
|---|---|---|
| POST | /api/auth/register | No |
| POST | /api/auth/login | No |
| GET | /api/auth/me | JWT |

### Products

| Method | Endpoint | Auth |
|---|---|---|
| GET | /api/products | No |
| GET | /api/products/:id | No |
| POST | /api/products | Admin |
| PUT | /api/products/:id | Admin |
| DELETE | /api/products/:id | Admin |

### Categories

| Method | Endpoint | Auth |
|---|---|---|
| GET | /api/categories | No |
| POST | /api/categories | Admin |

### Orders

| Method | Endpoint | Auth |
|---|---|---|
| GET | /api/orders | JWT |
| GET | /api/orders/all | Admin |
| POST | /api/orders | JWT |
| PUT | /api/orders/:id/status | Admin |

### Upload

| Method | Endpoint | Auth |
|---|---|---|
| POST | /api/upload | Admin |

---

## 8. Key Features Implemented

### Shop Page with Filters

The shop page features a floating sidebar (sticky, white card with shadow) containing:
- **Real-time search** — filters as the user types (debounced API calls)
- **Category filter** — radio-style buttons with active state highlight
- **Price range filter** — checkboxes (Under $20, $20-$50, Above $50)
- **Sort by** — Newest, Price Low-High, Price High-Low
- **Pagination** — for large product sets

### Product Cards

Consistent cards with max-width 220px:
- 240px tall product image (Cloudinary CDN, hover zoom)
- Product name (bold)
- Category label (brand color, uppercase)
- Price + Add to Cart button with loading state and success animation

### Shopping Cart (Zustand)

- Persists via localStorage (survives page refresh)
- Header badge shows real-time item count
- Quantity adjustment (increment/decrement)
- Real-time subtotal, shipping, and total calculation

### Authentication (JWT)

- Passwords: bcrypt hashes (never plain text)
- Tokens: stored in localStorage, attached to every request via Axios interceptor
- Protected routes: redirect to /login if unauthenticated
- Admin routes: additional role check middleware

---

## 9. UI/UX Design Decisions

### Design System (globals.css)

| Token | Value | Usage |
|---|---|---|
| Primary color | #f43f5e (rose-red) | Buttons, active states, links |
| Primary light | #fff1f2 | Hover backgrounds |
| Display font | Playfair Display | Logo, hero headings |
| Body font | Inter | All UI text |
| Card radius | 16px | Soft, modern aesthetic |

### Shop Page Layout

- Left: Floating card sidebar (260px, sticky) with search/category/price filters
- Right: 3-column product grid (responsive: 2 tablet, 1 mobile)
- Gray page background makes white sidebar card visually distinct
- Banner uses the shop's flower image with a white gradient overlay

### Header Navigation

- Active page link highlighted in brand color (using Next.js `usePathname`)
- Cart badge shows live item count
- Responsive mobile menu

---

## 10. Image Storage — Cloudinary CDN

### Problem

Local storage at `/app/uploads` causes two failures:
1. Docker container rebuilds permanently delete all uploaded files
2. Images are not accessible across different servers (e.g., Vercel + Railway)

### Solution

All images upload to Cloudinary via multer-storage-cloudinary:

```
Upload flow:
Browser → API → Multer → Cloudinary → CDN URL → PostgreSQL
```

### Legacy Migration

A Node.js script was created and executed inside the Docker container to migrate all 7 existing products:
- Read each product's local image from the filesystem
- Upload to Cloudinary under folder `blossom-flower-shop`
- Update the database record with the new CDN URL

Result: 7 migrated, 0 failed.

---

## 11. Containerization — Docker

### Services (docker-compose.yml)

```
flower_shop_db   ← PostgreSQL 15 (port 5432)
flower_shop_api  ← Express.js API (port 5000)
flower_shop_web  ← Next.js frontend (port 3000)
```

Health checks ensure services start in order: db → api → web.

### Commands

```bash
docker compose up -d          # Start all services
docker compose build web      # Rebuild frontend after changes
docker compose build api      # Rebuild backend after changes
docker compose logs -f web    # View frontend logs
docker compose down           # Stop all services
```

### Environment Variables

Never committed to Git. Stored in .env files:

```
DATABASE_URL          ← PostgreSQL connection
JWT_SECRET            ← Token signing secret
CLOUDINARY_CLOUD_NAME ← iedhaa6l
CLOUDINARY_API_KEY    ← API key
CLOUDINARY_API_SECRET ← API secret
NEXT_PUBLIC_API_URL   ← Backend URL for frontend
```

---

## 12. Security Measures

| Threat | Mitigation |
|---|---|
| Password theft | bcrypt hashing (cost factor 10) |
| Unauthorized API access | JWT verification middleware |
| Admin-only endpoints | Role check middleware (role === ADMIN) |
| SQL injection | Prisma parameterized queries |
| Credentials in code | Environment variables only, never in Git |
| Cross-origin attacks | CORS configured to trusted origins only |

---

## 13. Deployment Strategy

### Local Development

```
docker compose up -d
Web:  http://localhost:3000
API:  http://localhost:5000
DB:   localhost:5432
```

### Production

| Component | Platform | Reason |
|---|---|---|
| Frontend (Next.js) | Vercel | Built by Next.js creators, zero-config, free tier |
| Backend (API) | Railway / Render | Supports Node.js + Docker |
| Database | Neon / Supabase | Managed PostgreSQL with free tier |
| Images | Cloudinary | Already integrated, globally distributed CDN |

---

## 14. Challenges & Solutions

### Challenge 1: Images Disappearing After Rebuild

**Problem:** Docker container rebuilds deleted all uploaded images from the local volume.
**Solution:** Migrated all image storage to Cloudinary CDN. Created and executed a migration script to move all 7 existing products' images.

### Challenge 2: next/image Broken in Docker

**Problem:** Next.js's Image component requires explicit `remotePatterns` configuration per domain — and failed with Cloudinary URLs in the Docker environment.
**Solution:** Used native HTML `<img>` tags for product images. No domain restrictions, works identically in all environments.

### Challenge 3: Shared Types Between Frontend and Backend

**Problem:** Without a single source of truth, the Product type in the API could silently diverge from the one in the frontend, causing subtle runtime bugs.
**Solution:** Created `packages/types` as a shared npm workspace package. Both apps import from this package — they always have identical type definitions.

### Challenge 4: Cart State Lost on Page Refresh

**Problem:** Refreshing the page cleared the cart, causing poor user experience.
**Solution:** Zustand's persist middleware automatically serializes cart state to localStorage. Cart is rehydrated on page load with zero additional code.

### Challenge 5: Database Connection Between Containers

**Problem:** The API container cannot connect to the database using `localhost` in Docker networking.
**Solution:** Docker Compose creates an internal network where services resolve by name. The database connection uses `db` as hostname:
```
postgresql://postgres:password@db:5432/flower_shop
```

---

## Conclusion

This project demonstrates the complete lifecycle of a modern web application — from architectural planning and technology selection through implementation, containerization, cloud integration, and deployment.

The flower shop website is production-ready with:
- A secure, scalable REST API with role-based access control
- A professionally designed, SEO-optimized Next.js frontend
- A cloud-native image pipeline via Cloudinary CDN
- A fully containerized, reproducible deployment environment via Docker

Every technology choice was driven by a concrete, justified business need. The result is a system that a real flower shop could adopt today.

---

*This documentation was prepared as part of the GitHub & Vibe Coding Training program at Ostim Technical University.*
*Monorepo: flower-shop | Student: SR | Date: July 22, 2026*
