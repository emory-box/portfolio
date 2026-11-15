# Repository cleanup — current delivery

The owner requested removal of unnecessary files, clearer organization, and a
commit/push of the current website. This pass includes the pending illustrated
Home implementation and its approved refinements. Prior cleanup reports and
superseded design notes remain in Git history.

## Scope and decisions

- Keep live project pages, the current garden GLB/Blender sources, original
  recordings, current illustrations, licenses and vendored skills.
- Group Home runtime modules in `assets/js/home/`, Home authoring in
  `authoring/portfolio/home/`, and Home checks in `scripts/qa/home/`.
- Keep shared profile/endings code in `authoring/portfolio/` and shared QA in
  `scripts/qa/`. `check-portfolio-endings.cjs` names its cross-project scope.
- The base pegboard is still the native authoring fallback and is retained.
- Remove four superseded SVGs, the unused hook generator, and obsolete Mali
  font files/license. Home's fallback font declarations use its current
  Reddit Sans identity. Current Montserrat/Reddit Sans/Roboto licenses remain.
- Replace append-only Home implementation history with current guides. Keep
  one original-asset registry with exact dimensions and source-node mappings.
- Preserve the editable Greeny Figma handoff links in its local specification;
  remove temporary import scripts, upload URLs, previews and old captures.

## Delivery slices

1. Audit dependencies and record the protected project/model hashes.
2. Move Home files, update references, remove obsolete assets, and regenerate
   Home through the existing authoring seam. Blocked by the audit.
3. Verify paths, interactions, documentation and protected assets; review,
   commit and push the finished site. Blocked by the reorganized source.

## Result

Moved32 files. Removed9 obsolete source assets/helpers and1205 generated
cache/capture files, totaling229,954,205 bytes (219.3MiB). The exact source-file
paths, hashes, sizes, moves and aggregate cache totals are in
[removed-files.json](removed-files.json). Temporary QA captures remain
reproducible; the latest suite's text logs stay under ignored `.cache/qa/`.

## Verification

- All13 Home browser checks pass through `node scripts/qa/home/run.cjs`.
  Coverage includes source geometry, project selection, all opened views,
  About/Skills/Note/game/toys, original-object continuity, interruptions,
  keyboard/focus, reduced motion, no script and text enlargement.
- `check-portfolio-endings.cjs` passes all four pages at360/768/1280/1920px,
  plus keyboard, native links, reduced motion, no script and200% text.
- `check-site.cjs` resolves222 local files across all four pages after moves.
- Project HTML and garden GLB hashes match the pre-cleanup snapshot.
- Current Markdown links and Home runtime/authoring/QA syntax pass.
- DESIGN lint: zero errors and19 pre-existing warnings. Git whitespace passes.
- There is no root package build or typecheck pipeline. No dependency was added.

The commit review compares the staged work with baseline
`124ef86544728e401073420326be535026f59e1a` against the Home/shared specifications
and repository standards.

Standards review: no remaining findings after correcting the README's browser
prerequisites. Spec review: no missing requirements or implementation findings.
