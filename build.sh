#!/bin/bash
# Build script for Cloudflare Pages
echo "🚀 Starting NXOLand Frontend Build..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Check if vite is available
echo "🔍 Checking Vite installation..."
if ! command -v vite &> /dev/null; then
    echo "⚠️  Vite not found in PATH, using npx..."
    VITE_CMD="npx vite"
else
    echo "✅ Vite found in PATH"
    VITE_CMD="vite"
fi

# Build the application
echo "🏗️ Building application with: $VITE_CMD build"
$VITE_CMD build

echo "✅ Build completed successfully!"
