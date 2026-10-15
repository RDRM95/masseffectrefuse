#!/usr/bin/env bash
# Render every chapter composition individually, then concatenate with FFmpeg
# into the full film (an alternative to rendering FullFilm in one pass).
source "$(dirname "$0")/_common.sh"
CHAPTERS=(Opening PreparedGalaxy Catalyst LongWar ReapersRespond FinalHarvest Victory Future)
LIST="$OUT_DIR/concat.txt"; : > "$LIST"
for c in "${CHAPTERS[@]}"; do
  bash scripts/render-chapter.sh "$c"
  echo "file '$OUT_DIR/$c.mp4'" >> "$LIST"
done
ffmpeg -y -f concat -safe 0 -i "$LIST" -c copy "$OUT_DIR/MassEffectRefuse-Full.mp4"
echo "Concatenated -> $OUT_DIR/MassEffectRefuse-Full.mp4"
