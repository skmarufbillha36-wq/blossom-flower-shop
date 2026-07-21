# ╔══════════════════════════════════════════════════════════════╗
# ║         🌸 Flower Shop — Makefile Helper                     ║
# ╚══════════════════════════════════════════════════════════════╝
# Usage: make <command>
# Example: make up   make seed   make logs

.PHONY: help up down build seed logs clean reset ps

# ─── Default target ────────────────────────────────────────────
help:
	@echo ""
	@echo "  🌸 Flower Shop — Available Commands"
	@echo "  ─────────────────────────────────────"
	@echo "  make up       → Build & start all services"
	@echo "  make upd      → Build & start (detached/background)"
	@echo "  make down     → Stop all services"
	@echo "  make build    → Rebuild all Docker images"
	@echo "  make seed     → Run database seed (sample data)"
	@echo "  make logs     → Follow all service logs"
	@echo "  make logs-api → Follow API logs only"
	@echo "  make logs-web → Follow Web logs only"
	@echo "  make ps       → Show running containers"
	@echo "  make reset    → Stop + delete volumes (fresh DB)"
	@echo "  make clean    → Remove all containers, images, volumes"
	@echo "  make db-shell → Open PostgreSQL shell"
	@echo ""

# ─── Start ─────────────────────────────────────────────────────
up:
	docker compose up --build

upd:
	docker compose up --build -d
	@echo ""
	@echo "  ✅ Services started!"
	@echo "  🌐 Web:  http://localhost:3000"
	@echo "  🔌 API:  http://localhost:5000/api"
	@echo "  ❤️  Health: http://localhost:5000/api/health"
	@echo ""

# ─── Stop ──────────────────────────────────────────────────────
down:
	docker compose down

# ─── Build ─────────────────────────────────────────────────────
build:
	docker compose build --no-cache

# ─── Seed ──────────────────────────────────────────────────────
seed:
	@echo "🌱 Seeding database..."
	docker compose --profile seed run --rm seed
	@echo "✅ Seed complete! Admin: admin@flowershop.com / admin123456"

# ─── Logs ──────────────────────────────────────────────────────
logs:
	docker compose logs -f

logs-api:
	docker compose logs -f api

logs-web:
	docker compose logs -f web

# ─── Status ────────────────────────────────────────────────────
ps:
	docker compose ps

# ─── Database ──────────────────────────────────────────────────
db-shell:
	docker compose exec db psql -U postgres flower_shop

# ─── Reset / Clean ─────────────────────────────────────────────
reset:
	@echo "⚠️  This will DELETE all database data!"
	docker compose down -v
	@echo "✅ Reset complete. Run 'make up' to restart."

clean:
	@echo "⚠️  Removing all containers, images, and volumes..."
	docker compose down --rmi all -v --remove-orphans
	@echo "✅ Clean complete."
