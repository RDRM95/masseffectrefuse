#!/usr/bin/env bash
# Render the complete film (all chapters) to a single MP4.
# Usage: scripts/render-film.sh [output path]
source "$(dirname "$0")/_common.sh"
OUT="${1:-$OUT_DIR/MassEffectRefuse-Full.mp4}"
npx remotion render src/index.ts FullFilm "$OUT" --log=verbose "${PROPS_ARG[@]}"
echo "Rendered $OUT"
ffprobe -v error -show_entries format=duration:stream=codec_type,width,height,r_frame_rate -of default=nw=1 "$OUT"
