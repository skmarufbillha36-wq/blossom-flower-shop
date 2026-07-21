#!/bin/sh
set -e

echo ""
echo "🌸 ================================="
echo "   Blossom Flower Shop API"
echo "================================= 🌸"
echo ""
echo "⏳ Syncing database schema..."

npx prisma db push --accept-data-loss \
  --schema=./packages/database/prisma/schema.prisma

echo "✅ Database ready!"
echo "🚀 Starting server on port ${PORT:-5000}..."
echo ""

exec node server.js
