# Greeny Figma implementation

Approved source: `8NMst3c890fJWBihmNnBKu`, frame `2995:20025`.
The frame's current UX includes the five-group Function Ideation and twelve
original sketch crops from frame `3009:24382` (46).

## Scope and decisions

- Match the supplied case-study hierarchy, typography, grouping and imagery.
- Keep the seven live garden scenes, source copy, device holds, rotations,
  canopy timing, connectivity beats and terminal scene behavior. Only the
  opening banner receives the Figma composition. No model/color export changes.
- Introduction is a scroll-revealed chapter transition, as clarified by the
  owner; do not restore About us below it.
- Render ECOSYSTEM - GREENY after scrollytelling, with the original
  Protocol/Advantage/Scalability cards. The owner approved removing the separate
  APPLICATION - GREENY block to match the updated frame. Keep Online/Offline
  content within the live garden story.
- Introduction displays the exact line “Research and Design process of Greeny
  application”, with Greeny in #6C9537, leading alignment and green side borders.
- Keep the original task-flow wiring and independent native disclosures.
- Keep native HTML/CSS/SVG for UI specimens and diagrams, original artwork
  for photos/sketches/mockup layers, local fonts and relative asset URLs.
- Keep the shared display-only project identity and Contents interaction.
  Contents includes Ecosystem before Introduction, drops Application and About
  us, adds Sketches after Task Flow, and follows actual
  rendered section order, with Project video immediately after User Interface.

## Implementation slices and verification

1. Opening banner and Introduction transition, preserving existing scene logic.
2. Figma case-study layout, five-group diagram, sketches and app showcase.
3. Contents, source documentation and reproducible authoring; verify local
   delivery, correct section order and image closing behavior.
4. Compare desktop at 1440px and check 360, 768, 1280 and 1920px, keyboard,
   reduced motion and no horizontal overflow. Run existing Greeny behavior
   checks to protect device loops, shade timing, connectivity and terminal pin.

The existing browser checks are the verification seam. No dependency, framework,
hosted service or changes to other project pages are needed.

## Verification completed

- Static delivery and source provenance: `check-site.cjs` and
  `scripts/greeny/check-case-study-sources.cjs` pass. Two consecutive authoring
  runs leave HTML and source manifest unchanged.
- `check-greeny-case-study.cjs` passes at 320, 360, 768, 1280 and 1920px,
  including keyboard disclosures, original sketch/diagram viewing, focus
  restoration, 200% text, RTL, reduced motion and no-script fallbacks.
- `check-greeny.cjs`, `check-greeny-terminal.cjs`,
  `check-greeny-network-story.cjs`, `check-greeny-connectivity.cjs`,
  `check-greeny-loops.cjs` and `check-greeny-resilience.cjs` pass.
- Compared the native layout at 1440px; checked 360, 768, 1280 and 1920px
  for document overflow and missing media. Verified Introduction appears
  progressively after arrival and is immediate with reduced motion.
- All six non-banner scene blocks and garden controller/styles match the
  task baseline. Standards/spec review findings on palette labels, onboarding
  type and disclosure defaults were corrected.
- DESIGN.md lint reports zero errors and nineteen token-documentation warnings.
  The repository has no package-level typecheck or application build gate.

## Current full-page layout audit

The current frame removes Application; the owner explicitly approved following
that change on the website. Ecosystem (2995:20035) remains three 384×240px
desktop cards. Introduction (2995:20070) uses a 52px weight-500 heading, 72/80px
vertical padding and 2px green side borders around its 24px inset.

Meaning uses six original local SVG layers, source geometry and native text.
Safezone/Grid now use the seven original vector layers from current node
2995:20111, replacing the earlier dark-backed raster crops. Function trees, icon board,
environmental graphs, device controls and garden cards use the source sizing
and alignment. Five onboarding cards retain their translucent surfaces and
84px alternating vertical stagger. The owner subsequently requested one image
for the entire onboarding group. The current `img/onboarding.png` is the original
Figma composition (3007:23968), preserving its exact borders, blur and shadows.
It scales proportionally at all widths, without individual card wrapping.

The ending follows User Interface → video → two-column Team/Guidance credits →
Back to top → Next projects → identity/contact footer. No extra footer navigation
is rendered on Greeny. Contents has twenty targets and first appears at Ecosystem.
All seven garden scenes and their controller/styles remain outside this audit.

The owner later approved a compact reading presentation: `reading-layout.css`
caps post-story content/endings at 1080px, centers major media up to 960px and
reduces specimen heights and internal spacing. This overrides Figma's desktop
dimensions while retaining its content, artwork, typography and order. Navigation,
Contents, the live garden and original video posters remain unchanged.

The owner subsequently supplied GREENY file `P0juURVnXARkV1owcBfbdJ`, page `8:4`,
as the source for actual component artwork. Nineteen original SVGs now replace
the corresponding chart, status, device-control, garden-card and weather-art
approximations. Dark slide instances reference the original library components.
The owner selected upright weather cards with only their illustrations replaced.
The remaining page hierarchy, compact layout and approved onboarding PNG stay.

The full-page pass verifies local delivery and source hashes, Contents and
image inspection at 320–1920px, keyboard navigation, 200% text, RTL, reduced
motion and no-script behavior. Ending checks pass for all three projects.
The header/story/facts prefix is byte-identical to the audit baseline; two
consecutive scoped rebuilds are stable and leave other project pages untouched.
