#!/usr/bin/env bash
# Build every earlier portfolio version listed in versions.json into dist/versions/<slug>/, each from its
# own git tag with its own dependencies, so old versions stay live without re-committing their builds.
# Usage: bash scripts/build-versions.sh            (after `npm run build`; needs full history + tags)
set -euo pipefail
ROOT=$(git rev-parse --show-toplevel)
OUT=${1:-$ROOT/dist/versions}
TMP=$(mktemp -d)
trap 'git -C "$ROOT" worktree prune; rm -rf "$TMP"' EXIT
node -e 'for (const v of require(process.argv[1])) console.log([v.slug, v.ref, v.film || "-"].join(" "))' "$ROOT/versions.json" |
while read -r slug ref film; do
  W="$TMP/$slug"
  git -C "$ROOT" worktree add -q --detach "$W" "$ref"
  ( cd "$W" && npm ci --no-audit --no-fund --loglevel=error >/dev/null \
    && VITE_FILM=$([ "$film" = - ] || echo "$film") npx vite build --base="/versions/$slug/" --outDir "$OUT/$slug" --emptyOutDir --logLevel error )
  # a film cut keeps only its own footage
  if [ "$film" != - ] && [ -d "$OUT/$slug/media/path" ]; then
    for d in "$OUT/$slug"/media/path/*/; do [ "$(basename "$d")" = "$film" ] || rm -rf "$d"; done
  fi
  git -C "$ROOT" worktree remove --force "$W"
  echo "built /versions/$slug/ from $ref"
done
