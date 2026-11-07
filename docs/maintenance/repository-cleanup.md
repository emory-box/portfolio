# Repository cleanup — 2026-11-06

## Approved scope

The owner requested an organized repository and removal of redundant files,
then chose to keep only the current model and the sources required to rebuild
it. Removal groups were listed in chat before deletion. Asset content, page
design and animation behavior remain unchanged.

## Structure

- `projects/`: live case studies and assets loaded by visitors.
- `authoring/greeny/`: current native garden, required base scene, exporter,
  used geometry helpers, and original device references.
- `authoring/moti-pulse/`: original SVG diagram sources and eight independent
  original-recording video projects.
- `docs/greeny/`, `docs/moti-pulse/`: current project decisions and behavior.
- `scripts/moti/`: diagram/video tools; `scripts/qa/`: repeatable delivery checks.
- `scripts/serve.cjs`: static server with video byte ranges; setup scripts
  retain their existing entry points.

One web garden asset is named `projects/greeny/models/garden.glb` with its
`garden.json` manifest. `source/garden-base.blend` is explicitly required by
the exporter and is retained. Geometry helpers were extracted unchanged from
the used functions; obsolete material builders and earlier model generators
were not carried into the new authoring module.

## Removed material

Exact project-file paths and byte counts are in [removed-files.json](removed-files.json).
Generated cache/capture files are summarized there by count.

- Superseded Greeny model variants, previews, storyboard pages and renders.
- Greeny phone captures removed from the approved scroll scenes.
- Moti mockups/Timer source assets from removed sections, confirmed absent
  from the live pages' dependency closure.
- Duplicate exported MP4s, normalization intermediates, ZIP and the redundant
  delivery gallery. All eight live MP4s were hash-identical to the redundant
  exports before removal. Original video inputs remain intact.
- Python/waveform caches, old local captures and temporary agent outputs.
- Obsolete version-specific documents and the stale handoff, after current
  constraints and pending identity information were incorporated in the guides.

Vendored skills, lockfile, originals used by the live design, fonts, marks,
original recordings, and required native modeling inputs are retained.

## Verification

- Removed 727 listed old/redundant files, totaling 187,505,192 bytes
  (about 178.8 MiB), including ignored caches and local captures.
- Rebuilt the garden from the relocated, reduced authoring sources. Native
  scene/GLB checks passed palette, counts, added tufts, fan geometry/pivots,
  framing and source hashes. Geometry remains 113,448 triangles / 48 meshes.
- Static dependency check passed 81 reachable files across all three pages.
  Retained images, fonts, videos and shared libraries are byte-identical to before;
  rebuilding the seven Moti diagrams produced the same SVG files.
- All eight original recording hashes and live MP4 delivery hashes passed.
  All eight source-project render commands resolve at their new paths.
- Greeny checks passed all eight stops at 360, 768, 1280 and 1920px,
  including 360×640, sensor order, original values, lights, pause, offscreen
  idling, reduced motion, no script, no WebGL and context loss during loading.
- All 21 portfolio captures completed without console errors; 26 Markdown
  guides have no broken relative links. Script syntax and diff whitespace pass.
- A fresh server launched from `scripts/serve.cjs` passed MP4 byte-range
  serving. All three pages passed 360/768/1280/1920px browser checks with no
  overflow, missing eager images, script errors or failed requests.
- DESIGN lint: zero errors, 19 pre-existing warnings. No package or frontend
  build step was added; no root npm build/typecheck/test runner exists.

Standards and Spec reviews have zero remaining findings. Review identified
that deep video verification could target the old live file after rendering;
`--outputs` and `--only` now explicitly select staged files, with reports
written to cache rather than overwriting the approved delivery record.
Default and explicit staged-directory hash verification were checked.

Deep FFmpeg/HyperFrames media revalidation was not run: this shell has no
FFmpeg executables available. Existing delivery hashes confirm unchanged
media; native screen-reader speech and physical mobile GPUs remain unverified.
