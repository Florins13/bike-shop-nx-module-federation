#!/bin/bash
# Build all Native Federation Shared MFEs
set -e

echo "🔨 Building all Native Federation Shared MFEs..."

echo ""
echo "📦 Building cart (Angular 20)..."
cd cart && npm run build && cd ..

echo ""
echo "📦 Building bikes (Angular 21)..."
cd bikes && npm run build && cd ..

echo ""
echo "📦 Building orders (Angular 19)..."
cd orders && npm run build && cd ..

echo ""
echo "📦 Building shell (Angular 19)..."
cd shell && npm run build && cd ..

echo ""
echo "✅ All Native Federation Shared MFEs built successfully!"
