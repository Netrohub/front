#!/bin/bash
# Build script for Cloudflare Pages
echo "🚀 Starting NXOLand Frontend Build..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the application
echo "🏗️ Building application..."
npx vite build

echo "✅ Build completed successfully!"
