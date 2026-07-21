# ─── Stage 1: Install dependencies ───────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

RUN apk add --no-cache libc6-compat

# Copy package manifests (npm workspaces hoists to root node_modules)
COPY package.json ./
COPY packages/types/package.json       ./packages/types/
COPY packages/database/package.json    ./packages/database/
COPY apps/web/package.json             ./apps/web/

# Install everything into root node_modules (workspace hoisting)
RUN npm install --legacy-peer-deps

# ─── Stage 2: Build Next.js ───────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache libc6-compat

# Copy only root node_modules (hoisted by npm workspaces)
COPY --from=deps /app/node_modules ./node_modules

COPY package.json ./
COPY packages/types    ./packages/types
COPY packages/database ./packages/database
COPY apps/web          ./apps/web

# Build arg: API URL baked into the client bundle
ARG NEXT_PUBLIC_API_URL=http://localhost:5000/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build Next.js production bundle
RUN cd apps/web && npx next build

# ─── Stage 3: Minimal production runner ───────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# Next.js standalone mode copies only what it needs to run
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone     ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static         ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public               ./apps/web/public

USER nextjs
EXPOSE 3000

CMD ["node", "apps/web/server.js"]
