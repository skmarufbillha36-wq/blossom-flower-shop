# ─── Stage 1: Install dependencies ───────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

RUN apk add --no-cache libc6-compat

# Copy package manifests (npm workspaces hoists everything to root node_modules)
COPY package.json ./
COPY packages/types/package.json       ./packages/types/
COPY packages/database/package.json    ./packages/database/
COPY apps/api/package.json             ./apps/api/

# Install all workspace dependencies
RUN npm install --legacy-peer-deps

# ─── Stage 2: Generate Prisma + Bundle with esbuild ───────
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache libc6-compat

# Copy hoisted node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all source files
COPY package.json ./
COPY packages/types     ./packages/types
COPY packages/database  ./packages/database
COPY apps/api           ./apps/api

# Generate Prisma Client (must run before bundling)
RUN npx prisma generate --schema=./packages/database/prisma/schema.prisma

# Bundle entire API into a single file using esbuild
# --external keeps native modules (Prisma, bcrypt) as require() calls
RUN cd apps/api && npx esbuild src/server.ts \
      --bundle \
      --platform=node \
      --target=node20 \
      --outfile=dist/server.js \
      --external:@prisma/client \
      --external:bcryptjs \
      --external:cloudinary \
      --external:multer

# ─── Stage 3: Lean production runner ──────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# wget for health check, openssl for Prisma migration engine
RUN apk add --no-cache wget openssl

# Non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 expressjs

# Copy only what's needed to run the server
COPY --from=builder --chown=expressjs:nodejs /app/node_modules              ./node_modules
COPY --from=builder --chown=expressjs:nodejs /app/apps/api/dist/server.js   ./server.js
COPY --from=builder --chown=expressjs:nodejs /app/packages/database/prisma  ./packages/database/prisma

# Entrypoint: run migrations → start server
COPY --chown=expressjs:nodejs apps/api/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Create uploads directory with correct ownership before switching user
# Docker volumes mount as root by default — we need expressjs to own this dir
RUN mkdir -p /app/uploads && chown -R expressjs:nodejs /app/uploads

USER expressjs
EXPOSE 5000

# Force Prisma to use the OpenSSL 3.x engine binary on Alpine
ENV PRISMA_QUERY_ENGINE_LIBRARY=/app/node_modules/.prisma/client/libquery_engine-linux-musl-openssl-3.0.x.so.node

ENTRYPOINT ["./entrypoint.sh"]
