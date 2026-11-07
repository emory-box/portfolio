# Synergy case study

## Brief and source contract

Build the Synergy university-app case study from the owner's files in
`D:/Web-portfolio/Raw/Synergy`. Preserve the supplied content, diagrams,
screen designs and the numbered order. Layout, responsive presentation,
scroll entrances and functional hover/focus states may change. Do not add
outcome metrics, research methods, testimonials or a download destination.

The folder now contains all 45 images, numbered 1–45. Slide 25 has been
checked: it is the Wireframes subsection heading, with no additional diagram.
Slides 5, 6, 9, 15, 22, 25, 28 and 40 become real contents/headings in HTML;
Slide 1 is now a whole original image in Overview. All 37 supplied artworks remain
byte-for-byte originals; eight title/contents slides have native HTML equivalents.
`authoring/synergy/slides.json` maps and hashes every
input; `node scripts/synergy/check-sources.cjs` verifies coverage and artwork.

## Reading order and glossary

The **chapter** is one numbered item in slide 5's contents. An **artifact** is
an original logo construction, diagram, sketch, app screen or mockup. A
**feature** is a university-app capability, not a portfolio navigation route.

| Chapter | Source slides | Website content |
| --- | --- | --- |
| Overview | 1–4 | Owner-provided introduction, then the four whole original slides in order |
| 1. Logo | 6–8 | Meaning; original S + chat bubble; grid and safezone |
| 2. User Research | 9–14 | Minh Huy and Gia Anh; complete feature-ideation sheets |
| 3. User Experience | 15–21 | Sitemap; all five taskflow sheets, including alternatives and failures |
| 4. Wireframe | 22–27 | Both sketch sheets; Wireframes heading (25); both wireframe compositions |
| 5. Design system | 28–39 | Color, surfaces, full type specimens, spacing, icons, buttons, components |
| 6. User Interface | 40–45 | Source chapter heading, then only the five original mockups (41–45) |

Slide 5 lists components before spacing, while the image file sequence shows
spacing first. Follow the explicit contents order: color, typography,
Icon & Graphic, Buttons, Components, then Spacing. The owner clarified that
Components is a large, always-open subsection inside Design System, containing
only slides 37–39. Icon & Graphic (35) and Buttons (36) remain separate source
subsections; they are not removed or counted as additional scroll layers.

## Design decision

Use a scoped `.theme-synergy`, preserving the other case-study themes.
The source palette is black #000000, elevated #1C1C1E / #2C2C2E,
white #FFFFFF, Brilliant Azure #4698F9 and Bright Turquoise #0AF5E1.
The slide's azure ramp is #9CD1FE / #4698F9 / #0A6CF6 / #053DB1;
the turquoise ramp is #45F9D9 / #07D1D2 / #059FB0. Keep source typography:
self-hosted Inter, light chapter headings, bold feature titles. Preserve source
neutral colors rather than invent a different palette for a style checker.

Original artwork stays untouched. SVG viewports isolate relevant areas of
the supplied PNG/JPG files without redrawing logos or rerouting diagrams.
Text, persona content, chapter navigation, palette and type tables are HTML.
Artwork itself is a native enlargement link, progressively enhanced to a
keyboard-accessible dialog with fit/original-size controls. Separate “Enlarge
image” actions and captions repeating artwork titles are removed. Each link has
an accessible name, visible keyboard focus and a zoom-in pointer. Escape returns
focus to the image without moving the current reading position, including tall
diagrams. Without JavaScript the link opens the original local image.

No dependency, API, hosted service, build step, fake download or new product
behavior. Hover belongs to links and controls. Source product UI is an artifact,
not a working university portal. Whole content blocks enter together, once,
with opacity/transform only; reduced motion and no scripting expose all content.

## Approved scroll revision

The owner's recording `Recording 2026-11-06 203444.mp4` defines the visual
transition. There are seven sibling **layers**: Overview, then the six chapters.
A layer is a rounded sheet, not a folder tab. Introductory copy and the case
index belong to Overview, so they do not create extra layers.

Each chapter keeps its natural height, including expanded artifact sheets.
After its final content reaches the viewport, its bottom edge holds while the
next sheet slides over it. The underlying sheet scales down by at most 4%
(2% on narrow screens), with a black overlay at at most 30% opacity. Scroll
position drives the effect directly in both directions; there is no wheel
interception, autoplay or forced one-screen paging. Source artwork and theme
colors stay unchanged.

`stack-scroll.js` owns measuring/pinning and writes scoped CSS properties;
`synergy.js` keeps contents, block entrances and the artifact dialog. Wrappers
hold stable document-flow anchor targets; the sticky sheet inside each wrapper
gets one viewport of overlap. ResizeObserver updates dimensions after images,
fonts, expanded details and viewport changes. Only transform and overlay
opacity change during scrolling. Reduced motion and unavailable scripting use
the complete ordinary document flow. No dependency is added.

Revision acceptance slices: (1) complete 1–45 source mapping; (2) seven layers
with readable long chapters and reversible overlap; (3) anchors, keyboard,
dialog, live reduced-motion changes, no-script and responsive verification.

## Approved Components and Spacing revision

Keep the seven layers. Components is one continuous source atlas inside Design
System, matching the owner's complete reference image. Slides 37, 38 and 39
keep their original scale and columns, at y=0, 1104 and 2261 respectively in a
1920×3270 viewport. The shared source background unifies the boards; the final
crop removes only unused bottom space. Slide 37's original title and all 16
component group layouts remain visible. There are no per-board headings,
captions, disclosures or gaps. Full text descriptions remain available to screen
readers, with the complete atlas acting as one enlargement link. The exporter is
`authoring/synergy/export-components.cjs`; the current standalone artifact is
`img/components.svg`. Icon & Graphic and Buttons remain separate subsections.

Overview opens with full images 1, 2, 3, 4, edge to edge and without gaps,
crops, rounded card frames or added feature layouts. The visible Overview
title and two exact owner-provided paragraphs follow the fourth image
(self-initiated project, education sector, three-month duration and purpose).
The title is a quiet 20–24px label, with muted 16–18px reading text capped at
60ch. The text and controls retain the page margins; the artwork fills the
available width with its original aspect ratio. Image focus rings are inset
so they remain visible at the screen edges. No new animation is introduced.
The case index follows the images inside that same layer. Contents labels and
the layer anchor use Overview. User Interface contains only images 41–45.

The owner's supplied Spacing image shows one continuous drawing: All Meetings
on the left, Home lower on the right. Slides 33 and 34 are consecutive 1920×1080
slices, not independent diagrams. Place the second at y=1080, with no gap or
rescaling between slices. The shared viewport (320, 390, 1300, 1580) keeps both
whole phones and all 8/12/16/20/24px measurement labels, removing only the
duplicate slide heading and surrounding empty margins. The responsive diagram
caps at 900px wide. Its native HTML heading uses the existing dark/cyan tokens.
`authoring/synergy/export-spacing.cjs` recreates the current standalone
`img/spacing.svg` without retouching pixels; it embeds both sources for the
no-script enlargement fallback. The in-page SVG and enhanced viewer use the
same geometry. Measurements are based on the source captures' pixel scale.

## Delivery slices and acceptance

### Approved source heading revision

The six layer dividers, independent of Overview, are recreated from slides
6, 9, 15, 22, 28 and 40: native HTML titles and short source topic lists on
the left, the original outlined/solid numerals and doodles on the right, and
the original hash and underline. Decorative SVG viewports reuse untouched
source captures; they are hidden from assistive technology. The Wireframes
divider uses the plural shown on slide 22. User Interface lists Mockups only,
since the earlier approved revision removed the duplicated Hi-Fi composites.

Subsection heading bars follow slides 7, 8, 10, 11, 16, 17, 25, 29, 31, 33,
35 and 36: dark gray, rounded corners, light turquoise display text and a
small Synergy / chapter breadcrumb. Use the source labels Meaning and Button.
Taskflows keeps the source's User research breadcrumb, even though its parent
is User Experience. Components already includes its source title bar in the
continuous atlas; retain its single accessible heading and avoid a second bar.
Sketching and Mockups are image-led source pages; retain their own artwork
titles, with the website's grouping headings available to screen readers.

Implement in two slices: (1) dividers and native heading bars with original
artwork; (2) source comparisons, readable wrapping at 320–1920 px, keyboard
inspection, reduced motion and unchanged seven-layer scrolling. No new
dependency, content, section order or animation behavior.

1. **Source-led page** (no blockers): static route, original identity, all six
   chapters in order, no invented claims, readable without scripts.
2. **Artifact inspection** (after 1): local images load, enlarged diagrams
   retain source wiring, keyboard closes dialog and returns focus, contents
   stays open until toggled, motion preference respected.
3. **Portfolio integration** (after 1): home work index, project list and footer
   link to Synergy; documentation and screenshot coverage include the new route.

## Verification seam

Test the served website, as existing portfolio browser checks do: chapter order,
source coverage, images, relative paths, no external requests, no page overflow
at 360/768/1280/1920, keyboard dialog/focus and contents behavior, reduced
motion, and no-script reading. The static reference checker covers GitHub Pages
delivery. There is no root package build, typecheck or unit-test command.

## Verified delivery

- `node scripts/qa/check-site.cjs`: passed, 133 reachable local files / four pages.
- `node scripts/synergy/check-sources.cjs`: passed, all 45 inputs present;
  all 43 original artworks (including decorative divider inputs) match their
  source hashes and appear in the page; the two remaining native HTML-only
  equivalents are recorded in the source map.
- `node scripts/qa/check-synergy.cjs`: passed at 360, 768, 1280 and 1920 px;
  includes expanded boards, keyboard focus/escape/return, persistent contents,
  no-script, reduced motion, loaded Inter, local delivery and home integration.
  Direct image clicks open the viewer; closing a tall atlas preserves its
  scroll position. All 33 artwork links replace the separate actions and
  repeated captions.
- `node scripts/qa/check-synergy-stack.cjs`: passed at 360/768/1280/1920,
  including full chapter reading before overlap, pinning, reverse scroll,
  resizing after disclosure changes, visible keyboard focus and motion toggles.
- `node scripts/qa/check-synergy-design.cjs`: passed at 320/360/768/1280/1920,
  confirming full-width images before the exact Overview introduction in DOM
  and visual order, the single Components atlas,
  correct User Interface images, the single continuous
  Spacing diagram, its aspect ratio, keyboard viewer and standalone SVG.
- Overview opening and introduction captures were compared at those five
  widths; the text also passed 200% sizing and RTL layout checks. The six
  other chapter sections retain their previous static markup.
- `node scripts/qa/screenshots.mjs .cache/portfolio-synergy-shots` with
  `SITE_URL=http://localhost:4317`: recaptured all 27 requested portfolio views;
  no console errors, no horizontal overflow.
- JavaScript syntax checks passed for the new enhancement and browser check,
  and the updated screenshot helper.
- `designmd lint DESIGN.md`: zero errors; 19 existing design-token warnings.
- The approved heading revision was compared with the source slides at
  320/360/768/1280/1920 px. Native bars and long chapter titles remain readable,
  without horizontal overflow, including 200% text size at 360 px. The separate
  approved Overview layout puts artwork before its introduction. Independent
  Standards/Spec review caught a
  decorative crop that leaked old title pixels and clipped numeral outlines;
  the final source-space clip removes those pixels and retains the full art.
  Live motion preference changes now use an event-updated boolean rather than
  reading the media query during every scroll frame. Mode changes clear pinning
  immediately and remeasure when enabled; the full stack acceptance check passes.
- Hallmark static + rendered sweep ran. Fixed the new caption-contrast finding.
  Nine raw-spacing findings and four off-scale-spacing findings remain in the
  unchanged shared `assets/css/base.css`; the new theme's spacing tokens make
  that existing literal spacing visible to the checker. No shared layout or
  other project theme was changed to satisfy the linter. Its file-URL capture
  also warns about font CORS; the served-page checks confirm Inter is loaded.
  The short source introduction is deliberately smaller than a full chapter.
- Initial fresh reviews corrected the hero gutter, sheet focus/indicators and
  logo construction. The latest scroll and Design System revisions were
  reviewed in-thread on Standards and Spec axes after fresh review agents
  became unavailable. No remaining finding in the changed scope. Original
  ideation wiring stays intact. Section captures were used for visual checks;
  very tall Chrome full-page captures can show compositor duplication.

Temporary captures and browser launch adapters remain in ignored cache folders.
