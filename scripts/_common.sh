#!/usr/bin/env bash
# Shared settings for render scripts.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
export REMOTION_CONCURRENCY="${REMOTION_CONCURRENCY:-3}"
OUT_DIR="${OUT_DIR:-$ROOT/renders}"
mkdir -p "$OUT_DIR"
# Pass EXTRA_PROPS='{"noAudio":true}' to render without the soundtrack.
PROPS_ARG=()
if [ -n "${EXTRA_PROPS:-}" ]; then PROPS_ARG=(--props="$EXTRA_PROPS"); fi
