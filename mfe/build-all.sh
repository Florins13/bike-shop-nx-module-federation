#!/bin/bash
# Build all MFEs in production mode and report bundle sizes
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

for app in shell cart bikes orders; do
  echo "============================================"
  echo "Building $app..."
  echo "============================================"
  cd "$SCRIPT_DIR/$app"
  npx ng build --configuration production 2>&1
  echo ""
  echo "--- Bundle sizes for $app ---"
  du -sh dist/ 2>/dev/null || echo "No dist folder"
  find dist/ -name '*.js' -exec du -h {} \; 2>/dev/null | sort -rh | head -20
  echo ""
done

echo "============================================"
echo "All builds complete. Summary:"
echo "============================================"
for app in shell cart bikes orders; do
  size=$(du -sh "$SCRIPT_DIR/$app/dist/" 2>/dev/null | cut -f1)
  echo "  $app: ${size:-N/A}"
done
