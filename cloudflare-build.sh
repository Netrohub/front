#!/bin/bash
# Direct build command for Cloudflare Pages
echo "🚀 NXOLand Frontend Build for Cloudflare Pages"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build with explicit npx
echo "🏗️ Building with npx vite build..."
npx vite build

echo "✅ Build completed!"
