#!/bin/bash
set -euo pipefail

APP_DIR=${APP_DIR:-/app}
cd "$APP_DIR"

for dir in node_modules .next; do
  mkdir -p "$dir"
  chown -R node:node "$dir"
done

if [ ! -d node_modules ] || [ -z "$(ls -A node_modules 2>/dev/null)" ]; then
  echo "→ Installing deps into named volume..."
  su-exec node pnpm install
fi

echo "→ Starting Next.js dev server..."
exec su-exec node pnpm dev
