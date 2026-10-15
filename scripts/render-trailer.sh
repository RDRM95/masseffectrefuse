#!/usr/bin/env bash
# Render the short trailer composition.
source "$(dirname "$0")/_common.sh"
npx remotion render src/index.ts Trailer "$OUT_DIR/Trailer.mp4" "${PROPS_ARG[@]}"
echo "Rendered $OUT_DIR/Trailer.mp4"
