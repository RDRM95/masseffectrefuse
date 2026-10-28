#!/usr/bin/env bash
# Render a frame range of a composition (for inspecting a single scene).
# Usage: scripts/render-scene.sh <CompositionId> <startFrame> <endFrame> [name]
source "$(dirname "$0")/_common.sh"
COMP="${1:?composition id}"; START="${2:?start frame}"; END="${3:?end frame}"; NAME="${4:-$COMP-$START-$END}"
npx remotion render src/index.ts "$COMP" "$OUT_DIR/$NAME.mp4" --frames="$START-$END" "${PROPS_ARG[@]}"
echo "Rendered $OUT_DIR/$NAME.mp4"
