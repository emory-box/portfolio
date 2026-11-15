# Home implementation

Read [spec.md](spec.md) for the approved visual/behavior contract. This guide
maps that contract to the current code; prior design revisions remain in Git.

## Sources and output

- `authoring/portfolio/content.cjs`: supplied Emory Phạm identity, role, email and LinkedIn,
  project-specific summaries, exact current skill lists and marked placeholders.
- `authoring/portfolio/home/index.cjs`: semantic template for root `index.html`.
- `authoring/portfolio/home/assets.cjs`: original SVG dimensions and Figma IDs.
- `authoring/portfolio/home/butter.cjs`, `pan.cjs`: source-based animation helpers.
- `assets/css/home.css`: Home theme, source layouts and responsive states.
- `assets/js/home/`: native ES modules for navigation, object continuity,
  About, Skills, contact, game, toys and responsive fitting.

The local [runtime guide](../../assets/js/home/README.md) explains module
ownership. [Authoring instructions](../../authoring/portfolio/home/README.md)
explain regeneration and Moti banner capture. Use `--home-only` to keep
case-study interiors and endings intact.

## Current behavior

One illustrated desk opens five full-page views. The original object zooms,
lands and returns; surrounding objects fade. Close, Escape, browser history,
focus restoration and interrupted transitions share that lifecycle. The pan
flips its egg in place and the ball uses gravity/squash motion without opening
a view. Reduced motion and native no-script content remain available.

About uses the single-gap ID-card border, complete-copy fade and supplied
avatar/paperclip. It retains1084px width where desktop space permits. Skills
uses one connected butter surface and responsive Hard/Soft groups. Contact
keeps ruled inputs inside the original note, opens an email draft for review
and provides a copy-email action. Tic-tac-toe plays against the computer on
the original illustrated grid. All three project summaries and complete
banners are supplied by shared content; compact screens use vertical tabs.

The entrance runs in source order and completes within2seconds. Home labels
Skills, ?, Projects and Send me a note become bold on hover. Full spacing,
type, timings, breakpoint details and source frame links live in the spec.

## Verification

Serve locally, then run:

```powershell
node scripts/qa/home/run.cjs
node scripts/qa/check-portfolio-endings.cjs
node scripts/qa/check-site.cjs
```

The [QA guide](../../scripts/qa/home/README.md) lists focused checks. They cover
original SVG geometry, source lists, responsive320–1920px layouts,200% text,
keyboard/focus, reduced motion, no script, object continuity, contact, game,
toys, project states and entrance timing. Output is ignored under `.cache/qa/`.
There is no root npm build, typecheck or package-based test runner. Source
syntax, template idempotence, DESIGN lint and Git whitespace are checked
separately before delivery.
