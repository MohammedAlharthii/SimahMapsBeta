#!/bin/sh
set -e

echo "⏳ Waiting for MySQL Database to be reachable..."
# Retry connection until database is ready
until npx prisma db push --skip-generate; do
  echo "Database is unavailable - sleeping 3 seconds..."
  sleep 3
done

echo "✅ Database schema synchronized successfully!"

# Check if admin user exists, if not seed the database
echo "🌱 Running database seeds (users, settings)..."
npm run db:seed || true

echo "🚀 Starting SIMA Real Estate CRM on port ${PORT:-3000}..."
exec node server.js
