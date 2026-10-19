# Production roadmap

Living status document for future sessions. Update it whenever a chapter, asset or deliverable changes state.

## Status at a glance

| Stage | Deliverable | State |
|-------|-------------|-------|
| 1 | Remotion environment, timeline, render pipeline, browser preview, MP4 export | Done |
| 2 | Prologue "The Cycle" (text, Earth, Home Fleet, title, Reaper arrival) | Done, rendered |
| 3 | Chapter 2 "The Catalyst" (chamber, dialogue, refusal, extraction, Hackett) | Done |
| 4 | Chapter 3 "The Long War" montage, galaxy map | Done |
| 5 | Chapter 5 "The Final Harvest" (Harbinger) | Done |
| 6 | Chapters 4, 6, 7 (Reapers respond, Victory, Future) | Done |
| 7 | Full assembly, music/SFX sync, subtitles, grade, full render | Done (`scripts/render-all-chapters.sh`) |
| — | Trailer composition | Done |
| — | Web player, GitHub Pages workflow, tests | Done; Pages must be enabled in repo settings |
| — | MP4 distribution via GitHub Release | See KNOWN_ISSUES for the current state |

Total runtime: 586 s (9:46). All eight chapters are built; none remain as placeholders.

## Completed assets

Spacecraft (all original SVG, `src/spacecraft/`): Alliance dreadnought (hammerhead bow, spinal gun, stacked drives), cruiser, frigate, hyper-mass accelerator defence platform; Reaper capital (Sovereign-class), Reaper destroyer, Harbinger (amber, four eyes, broader hull), with firing, damage and fracture states; Normandy SR-2 (Alliance livery, stealth variant); Turian dreadnought and cruiser; Cerberus cruiser; geth dreadnought; quarian cruiser; asari cruiser; fighter; mass relay; Citadel (open, optional Crucible); Crucible.

Environments: deterministic starfield with nebula variants; planets (Earth with projected continents and terminator, Palaven, Thessia, Tuchanka, Rannoch, generic); Catalyst chamber with the three paths of light; flag bridge with holographic strategy table; galaxy military map; Arcturus drydock; Tuchanka sunrise.

Characters (silhouette staging, `src/characters/`): Shepard (from behind, N7 stripe; profile), Hackett (profile), the Catalyst (figure of light), Garrus, Liara, Tali, Joker, EDI, Wrex, Eve, generic human crew, the Illusive Man seated.

Effects: Reaper beam, Thanix beam (same component, blue), mass accelerator slugs, heavy HADES slug, barrier impacts, explosions (flash, fireball, hot core, smoke, shockwave, debris), hull fire, HUD frames/readouts/bars/reticle, text cards, grade (vignette, grain, tint, letterbox).

Audio (`scripts/audio/`): offline synthesiser (oscillators, SVF filter, ADSR, Schroeder reverb, ping-pong delay, soft limiter, drums) and eight original cues matched to chapter lengths plus 16 sound effects.

## Known limitations

- Characters are deliberately silhouettes with subtle motion; there is no facial animation or lip-sync by design.
- No voice acting. Dialogue is delivered through subtitles with radio treatment.
- Spacecraft are 2.5D SVG, not 3D models. They are recognisable in silhouette and lit by gradients, and they do not rotate in three dimensions.
- The Citadel and Crucible are the flattest assets and would benefit from a dedicated pass.

## Next development tasks (in priority order)

1. Publish the renders: create release `v0.1.0`, upload `MassEffectRefuse-Full.mp4` and `Trailer.mp4`, enable GitHub Pages (Source: GitHub Actions), merge to `main`, verify the live player.
2. Polish pass on Chapter 5: more varied allied ship motion (ships are mostly station-keeping), additional GARDIAN interception detail, a second camera angle on the HADES impact.
3. Citadel: perspective-correct arms with depth shading; Crucible docking detail for the Chapter 2 exterior.
4. Reaper capital: additional plating on the mantle and a subtle limb-articulation cycle during approach shots.
5. Catalyst chamber: volumetric light shafts and distant battle flashes reflected on the dais.
6. Optional 60 fps render of the battle chapters (`--fps` is fixed in `chapters.ts`; add an interpolated 60 fps variant if desired).
7. Colour grade per chapter (currently a shared grade with per-chapter tint overrides).
8. Optional voice synthesis if an appropriately licensed, non-imitative voice pipeline becomes available.

## How to continue in a new session

1. `npm ci && npm run audio` (audio is committed, so this is only needed after changing the score).
2. `npm run dev` to open Remotion Studio; each chapter is its own composition under "Chapters".
3. Capture stills before and after any visual change: `npm run frames -- <Composition> every:300`.
4. Keep `SHOT_LIST.md` and `ASSET_REGISTER.md` in step with code changes.
5. Re-render only the chapters you touched (`scripts/render-chapter.sh <Composition>`), then rebuild the full film with the concat step in `scripts/render-all-chapters.sh` or re-render `FullFilm`.
