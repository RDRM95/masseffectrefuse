# Known issues

Keep this honest. Remove items when fixed; add the commit that fixed them if useful.

## Distribution

- **Release assets.** The web player expects `MassEffectRefuse-Full.mp4` and `Trailer.mp4` on GitHub Release `v0.1.0`. The cloud session that produced this cut is not permitted to create releases or enable Pages, so the release does not exist yet; until it does the player shows "COULD NOT LOAD VIDEO" with the configured URL. Run the **Render and publish media** workflow (see README → Deployment) or upload local renders with `gh release create v0.1.0 renders/MassEffectRefuse-Full.mp4 renders/Trailer.mp4`.
- **GitHub Pages** must be enabled with Source = GitHub Actions before the deploy job can succeed. Until it is, the `deploy` job fails and the site is not live.

## Visual

- Ships are 2.5D: they translate and scale but never rotate in depth, so the camera language avoids shots that would need a ship to turn toward the viewer.
- The Citadel and Crucible read as flat illustrations under perspective transforms.
- Silhouette characters have no faces by design; a head turn and breathing are the only facial-area motion.
- Explosion shockwave rings are thin circles; at large sizes they can read as outlines rather than blasts.
- In Chapter 5 the allied line is mostly stationary (ships drift slowly); only the camera, weapons and the Reapers move much.
- Open-source Chromium (and therefore the Playwright test browser) cannot decode H.264; the end-to-end tests use a WebM clip. Real browsers play the MP4s.

## Audio

- The score is synthesised offline with simple oscillators and filters: it establishes mood and structure but is not an orchestral recording. Dynamics are controlled per cue; the master limiter can audibly soften the loudest hits in Chapter 5.
- Chapter music cues are rendered slightly longer than the chapter and faded; the full-film render trims them at chapter boundaries, so there is no overlap across chapter cuts.

## Pipeline

- Rendering in the cloud session at `REMOTION_CONCURRENCY=3` takes roughly 1.2–1.5× real time per chapter; the full film is about an hour.
- The Catalyst cue (`catalyst.mp3`) must be regenerated if the chapter length changes again; its "I choose us" cue is placed at 82 s and the Hackett pulse at 98 s.
