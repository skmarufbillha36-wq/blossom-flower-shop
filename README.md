# 🌸 Blossom Flower Shop

Full-stack flower shop e-commerce — Next.js 14, Express.js, PostgreSQL, Docker, Cloudinary CDN.

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
| Admin | admin@blossomflowers.com | Blossom@Admin2026 |
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

---

## 📁 Project Structure

```
flower-shop/
├── apps/
│   ├── web/          ← Next.js frontend
│   └── api/          ← Express.js backend
├── packages/
│   ├── types/        ← Shared TypeScript types
│   └── database/     ← Prisma schema + seed
└── docker-compose.yml
```
