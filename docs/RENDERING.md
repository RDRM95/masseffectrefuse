# Rendering workflow

Exact, reproducible steps to produce every deliverable.

## Prerequisites

- Node 22, npm, FFmpeg 6 (`ffmpeg`/`ffprobe` on PATH).
- `npm ci`.
- A Chromium: Remotion downloads one on first run. In environments with a pre-installed browser set `REMOTION_BROWSER_EXECUTABLE=/path/to/headless_shell` (the config also auto-detects `/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`).
- Audio is committed under `public/audio`. Regenerate after changing the score: `npm run audio` (about two minutes; single cue: `npx tsx scripts/audio/generate-audio.ts final-harvest`).

## Commands

| Goal | Command | Output |
|------|---------|--------|
| Preview in the browser | `npm run dev` | Remotion Studio on localhost:3000 |
| One chapter | `bash scripts/render-chapter.sh Catalyst` | `renders/Catalyst.mp4` |
| A frame range | `bash scripts/render-scene.sh FinalHarvest 1800 2250 harbinger-kill` | `renders/harbinger-kill.mp4` |
| Full film, one pass | `bash scripts/render-film.sh` | `renders/MassEffectRefuse-Full.mp4` |
| Full film, chapter by chapter + concat | `bash scripts/render-all-chapters.sh` | all chapter MP4s + `renders/MassEffectRefuse-Full.mp4` |
| Trailer | `bash scripts/render-trailer.sh` | `renders/Trailer.mp4` |
| QA stills | `npx tsx scripts/capture-frames.ts Victory every:150` | `frames/Victory/*.jpg` |
| Silent render (no soundtrack) | `EXTRA_PROPS='{"noAudio":true}' bash scripts/render-chapter.sh Opening` | |

Settings live in `remotion.config.ts`: H.264, CRF 18, yuv420p, JPEG frames at quality 92, `REMOTION_CONCURRENCY` (default 3).

## Timings observed (4 vCPU cloud session, concurrency 3)

| Composition | Frames | Wall time |
|-------------|--------|-----------|
| Opening | 2340 | ~7 min |
| PreparedGalaxy | 2520 | ~10 min |
| Full film | 17580 | ~70 min via `render-all-chapters.sh` (252 MB at CRF 18) |

## Verifying a render

```bash
ffprobe -v error -show_entries format=duration:stream=codec_type,width,height,r_frame_rate -of default=nw=1 renders/MassEffectRefuse-Full.mp4
ffmpeg -i renders/MassEffectRefuse-Full.mp4 -af volumedetect -f null -            # loudness
ffmpeg -i renders/MassEffectRefuse-Full.mp4 -vf "blackdetect=d=2:pix_th=0.02" -an -f null -   # unintended black
ffmpeg -ss 395 -i renders/MassEffectRefuse-Full.mp4 -frames:v 1 harbinger.jpg   # spot-check a frame
```

Expected: duration 586 s, h264 1920×1080 30/1, aac 48 kHz stereo. The only long "black" spans are the text prologue (0–42 s).

## Publishing

See README → Deployment. Media goes to a GitHub Release; the Pages site streams it from there. The `Render and publish media` workflow does the render, the upload and the Pages deploy on GitHub's runners.
