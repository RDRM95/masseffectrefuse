#!/usr/bin/env bash
# Render one chapter composition to MP4.
# Usage: scripts/render-chapter.sh <CompositionId> [extra remotion args]
# Example: scripts/render-chapter.sh Opening
source "$(dirname "$0")/_common.sh"
COMP="${1:?composition id required (e.g. Opening, PreparedGalaxy, Catalyst)}"; shift || true
npx remotion render src/index.ts "$COMP" "$OUT_DIR/$COMP.mp4" --log=verbose "${PROPS_ARG[@]}" "$@"
echo "Rendered $OUT_DIR/$COMP.mp4"
ffprobe -v error -show_entries format=duration:stream=codec_type,width,height,r_frame_rate -of default=nw=1 "$OUT_DIR/$COMP.mp4"
