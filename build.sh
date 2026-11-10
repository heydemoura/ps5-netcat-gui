#!/bin/sh
# Build the static Cloudflare Pages bundle into dist/ (functions/ is picked up by wrangler from the project root)
set -e; cd "$(dirname "$0")"
rm -rf dist && mkdir -p dist
cp public/index.html og/og.jpg og/og.png dist/
printf '/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: no-referrer\n' > dist/_headers
