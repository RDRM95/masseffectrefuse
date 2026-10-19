# MASS EFFECT: REFUSE — The Ending We Earned

An unofficial, non-commercial fan film: an animated alternate ending to *Mass Effect 3*, produced entirely in code with [Remotion](https://www.remotion.dev/). Shepard refuses the Catalyst's three choices, the Crucible never fires, and a galaxy that prepared for the Reapers since 2183 wins the war through conventional military force. Harbinger dies to a hyper-mass accelerator round, not a magic beam.

- **Runtime:** 9 min 46 s, eight chapters, 1920 × 1080, 30 fps, original score and sound design.
- **Everything is original:** spacecraft, environments, character staging, dialogue, music and sound effects were created for this project. No game assets were extracted or redistributed. Mass Effect is a trademark of Electronic Arts / BioWare; this project is not affiliated with or endorsed by them.
- **Watch:** the GitHub Pages player at `https://rdrm95.github.io/masseffectrefuse/` once Pages is enabled (see [Deployment](#deployment)). The MP4s are published as GitHub Release assets.

## Chapters

| # | Chapter | Length | What happens |
|---|---------|--------|--------------|
| 0 | The Cycle | 1:18 | Prologue text, Earth, the Home Fleet, title. Red lights in the distance. |
| 1 | The Prepared Galaxy | 1:24 | Reapers hit Earth and Palaven. Both homeworlds hold on their own; Platform Four kills a Sovereign-class with a hyper-mass accelerator. |
| 2 | The Catalyst | 1:52 | The Citadel, the chamber, Destroy / Control / Synthesis, the refusal, extraction (Shepard and Anderson alive), Hackett: "Let's get back to work." |
| 3 | The Long War | 1:06 | Shipyards, Turian deployments, Salarian analysis, joint operations, krogan landings, Cerberus raids, Normandy reconnaissance, the galaxy map turning blue. |
| 4 | The Reapers Respond | 0:36 | Inside the Reaper network. Harbinger concludes the dispersed harvest has failed and converges every formation. |
| 5 | The Final Harvest | 1:24 | The allied grand fleet against the last Reaper concentration. Harbinger isolated, barriers stripped by coordinated fire, destroyed by a 2,400-tonne HADES round. |
| 6 | Victory | 0:42 | The last Reaper capital ship. Every network confirms. Hackett: "The war is over." Then: "Begin recovery operations." |
| 7 | The Future | 1:24 | Earth, Palaven, Thessia, Tuchanka (Wrex and Eve), Rannoch, the Citadel, the Illusive Man, the Normandy crew, Shepard over Earth. "It was won." |

A 66-second trailer composition cuts excerpts straight out of the chapter compositions.

## Quick start

```bash
npm ci
npm run audio          # (re)generate the original score and SFX → public/audio
npm run dev            # Remotion Studio: scrub every chapter in the browser
npm run render:chapter -- Opening       # renders/Opening.mp4
npm run render:film                     # renders/MassEffectRefuse-Full.mp4 (all chapters)
npm run render:trailer                  # renders/Trailer.mp4
bash scripts/render-scene.sh FinalHarvest 1800 2200   # a frame range
npm run frames -- FinalHarvest every:300             # QA stills → frames/
npm run site:build && node scripts/serve-static.mjs dist-site 4178   # local web player
npm test && npm run test:e2e
```

Rendering uses the headless Chromium bundled with Remotion, or a pre-installed one when `REMOTION_BROWSER_EXECUTABLE` is set. A full-film render takes roughly 60–80 minutes on four cores (`REMOTION_CONCURRENCY` defaults to 3). `scripts/render-all-chapters.sh` renders every chapter separately and concatenates them with FFmpeg, which is more robust on small machines.

## Project layout

```
src/
  timeline/chapters.ts     master timeline (durations, music cues, start frames)
  compositions/            one file per chapter + FullFilm, Trailer, registry
  spacecraft/              original SVG ships: Alliance, Turian, Reaper, Normandy, allies, structures
  environments/            starfield, planets (projected Earth continents), Catalyst chamber, bridge, galaxy map
  characters/              silhouette staging (Shepard, Hackett, Catalyst, crew, Illusive Man)
  effects/                 weapons, explosions, HUD, text cards, grade
  camera/                  2.5D camera with parallax
  subtitles/               cue system + WebVTT export
  audio/                   Music/Sfx components
scripts/
  audio/                   offline synthesiser and the score (generate-audio.ts)
  render-*.sh              render scene / chapter / film / trailer
  capture-frames.ts        QA still capture
  export-site-data.ts      chapters.json + VTT for the web player
  build-site.sh            GitHub Pages build
site/                      cinematic web player (HTML/CSS/JS)
tests/                     Vitest unit tests and Playwright end-to-end tests
public/audio, public/fonts generated media and SIL-OFL fonts
```

See `PRODUCTION_ROADMAP.md` (status and next tasks), `SCRIPT.md` (full screenplay), `SHOT_LIST.md`, `ASSET_REGISTER.md` and `KNOWN_ISSUES.md`.

## Deployment

Two workflows live in `.github/workflows/`:

- **CI and Pages** (`ci.yml`): on every push to `main` it typechecks, runs the unit and end-to-end tests, renders a smoke-test frame, builds the site and deploys it to GitHub Pages. The player streams the film from the GitHub Release named by `RELEASE_TAG` (default `v0.1.0`; override with the `FILM_RELEASE_TAG` repository variable).
- **Render and publish media** (`render.yml`, manual): renders `FullFilm` and `Trailer` in parallel on GitHub runners (2–3 hours), attaches both MP4s to the release, then redeploys the site. This is the one-click way to put the film online.

First-time setup, in order:

1. Merge this branch into `main` (the workflows must exist on the default branch to appear in the Actions tab).
2. Repository **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. **Actions → Render and publish media → Run workflow** (defaults are fine). When it finishes the player at `https://rdrm95.github.io/masseffectrefuse/` plays the film.

Alternatively, render locally (`npm run render:film && npm run render:trailer`) and upload with `gh release create v0.1.0 renders/MassEffectRefuse-Full.mp4 renders/Trailer.mp4`; the CI deploy will then pick the files up.

## Licence

Code, artwork, writing and music in this repository are released under the MIT licence for non-commercial fan use. Fonts are under the SIL Open Font License (see `public/fonts/OFL-*.txt`). Mass Effect and all related names are trademarks of Electronic Arts Inc.
