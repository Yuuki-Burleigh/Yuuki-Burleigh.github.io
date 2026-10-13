#!/usr/bin/env bash
# Build and serve one site per hero film: v2, v3, v35, v4 (the old v1 site is tag v1-signal-path).
# Usage: bash scripts/build-variants.sh            -> builds dist-<film> for each
#        npx vite preview --outDir dist-v3 --port 4403
set -e
for v in v2 v3 v35 v4; do
  VITE_FILM=$v npx vite build --outDir dist-$v --emptyOutDir
  for o in v2 v3 v35 v4; do [ $o = $v ] || rm -rf dist-$v/media/path/$o; done
done
