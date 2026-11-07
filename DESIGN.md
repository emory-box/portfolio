---
version: alpha
name: Greeny
description: Case-study portfolio for Greeny, an IoT smart-garden companion. Dark surface, one living green ramp, Inter for text and Nunito for the display voice.
colors:
  bg: "#191919"
  bg-deep: "#141414"
  surface: "#242424"
  surface-raised: "#2C2C2C"
  surface-high: "#333333"
  line: "#3A3A3A"
  line-soft: "#2E2E2E"
  text: "#F8FBF4"
  text-muted: "#A8B0A6"
  text-dim: "#99A199"
  green-050: "#F8FBF4"
  green-100: "#CFE3B5"
  green-200: "#AFD182"
  green-300: "#8EBE50"
  green-400: "#6C9537"
  green-500: "#4A6425"
  neutral-050: "#FAFAFA"
  neutral-100: "#F1F4F9"
  neutral-200: "#CBD4E1"
  neutral-300: "#94A3B8"
  neutral-400: "#64748B"
  neutral-500: "#475569"
  success: "#6BC214"
  warning: "#FB9C0C"
  info: "#4CC1E2"
  error: "#E0352F"
typography:
  display-xl:
    fontFamily: Nunito
    fontSize: 4.5rem
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: -0.03em
  display-lg:
    fontFamily: Nunito
    fontSize: 3rem
    fontWeight: 800
    lineHeight: 1.06
    letterSpacing: -0.025em
  display-md:
    fontFamily: Nunito
    fontSize: 1.5rem
    fontWeight: 700
    lineHeight: 1.2
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: 500
    lineHeight: 1.4
rounded:
  xs: 6px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  pill: 999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  section: 120px
components:
  phone-frame:
    backgroundColor: "#0C0C0C"
    textColor: "{colors.text}"
    rounded: "{rounded.xl}"
    padding: 10px
  card:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: 16px
  card-deep:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: 14px
  chip-accent:
    backgroundColor: "{colors.green-300}"
    textColor: "{colors.bg-deep}"
    rounded: "{rounded.sm}"
    padding: 6px
  ghost-button:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.pill}"
    padding: 12px
  primary-button:
    backgroundColor: "{colors.green-200}"
    textColor: "{colors.bg-deep}"
    rounded: "{rounded.pill}"
    padding: 14px
---

## Overview

Greeny is a smart-garden ecosystem: a hub, sensors and actuators, and one
mobile app that keeps a garden in reach. The case study is presented on the
same dark surface as the original deck (#191919), with a single green ramp
carrying every accent.

The page is technical and quiet. Interface elements are rebuilt in live HTML
and CSS rather than shown as screenshots, so the product has to be legible at
every size.

## Colors

- **Background (#191919):** the deck's own surface; it keeps the green from
  glowing like a highlighter.
- **Green ramp:** #F8FBF4 → #CFE3B5 → #AFD182 → #8EBE50 → #6C9537 → #4A6425.
  #AFD182 is the default accent; #8EBE50 is the pressed/strong state; the
  darker steps are for large fields and borders, never for small text on dark.
- **Neutrals:** the cool grey scale is reserved for secondary product UI
  (charts, metadata).
- **Semantic:** success #6BC214, warning #FB9C0C, info #4CC1E2, error #E0352F.
  They appear only inside the recreated app, never as page decoration.

## Typography

Inter carries body copy, labels and product UI. Nunito carries the display
voice: wordmark, page headings and the section numerals. Inside a rebuilt app
screen, Nunito may set titles down to 12px, because that is what the original
app does; page chrome never sets it below 20px.

## Themes

The shell in `assets/css/base.css` owns the tokens, header, footer and controls.
Each page overrides the token set with a body class, so one repository carries
several identities without duplicating the chrome:

- **Greeny** (`projects/greeny/`, no body class): dark #191919, green ramp,
  a continuous 3D garden story followed by the research and interface case study.
  The owner-approved opening follows the supplied garden film: introduction,
  sensors, watering, fan, shade, lights, connectivity and remote care. One
  locally rendered garden alternates sides and gently turns with native scroll.
  Each scroll scene pairs its physical action with source-supported explanatory
  text. The owner removed phone screens from these scenes; the separate app
  interface case study remains. A Vietnamese 2D readings panel follows a brief
  sensor signal, retaining the film's 32%, 24°C, 62% and 12,400 lx examples
  and its illustrative-data disclosure. No new sensor data or product claims.
  Mobile stacks the garden above the text/panel. Reduced motion keeps the
  garden still; unavailable scripting/WebGL retains a readable image story.
  Three.js is pinned and self-hosted; there are no visitor CDN requests.
  The approved current model follows the owner's smooth clay garden image:
  a rounded lawn tile with sparse clay tufts and white flowers, a low two-sided
  taupe fence, smooth earth and twelve thick two-leaf seedlings. Greenery uses
  the brand ramp; the rounded tubular Y sensor uses #6C9537. Physical surfaces
  are matte and untextured. The owner approved the refined preview: seedling
  leaves now use #8EBE50 / #AFD182 with #6C9537 stems. Canopy cloth uses the
  explicitly approved physical-object blue #1B6799; page chrome retains the
  green ramp. A floating fan is centered between the left bay's posts, with
  three identical swept clay blades, no stand and no crossing pipe. Two small
  grass tufts fill the lawn beside the hub, visibly spaced apart. Two pill
  irrigation heads attach to side roof tracks with rounded L-shaped arms
  and white couplers, below two separate stem-suspended lamps.
  Web-only recolors use approved `projects/greeny/models/colors.json`
  overrides. Drafts are rendered by the actual web renderer and require
  owner review before promotion; the GLB geometry stays unchanged.
  The hub has a cream rounded casing and pill lens:
  mint for the connected demonstration state, amber during data transfer.
  The readings panel uses paper #F1F5E9, ink #2A4034, muted #596D5C and rule
  #D6E1D0. Sensor signals use mint #B8D6B9. Approved lighting A adds soft 2D
  beams and pools in #FFE8AC, projected from the two actual moving lamps.
  See `docs/greeny/garden-model.md` for the current approved model and
  `docs/greeny/scroll-story.md` for retained scroll behavior;
  authoring sources are documented in `authoring/greeny/README.md`.
- **Portfolio home** (`.theme-home`): paper #F2EEE5, ink #191710, vermilion
  #C9452A. Deliberately independent of every project.
- **Synergy** (`.theme-synergy`): preserve the owner's slides 1–45 and the
  explicit chapter order in slide 5: Logo, User Research, User Experience,
  Wireframe, Design system, User Interface. Black #000000, white #FFFFFF,
  elevated #1C1C1E / #2C2C2E, Brilliant Azure #4698F9 and Bright Turquoise
  #0AF5E1. Inter carries display and body as specified in slides 31–32.
  Thin turquoise chapter headings, rounded dark surfaces, original blue logo
  and source app artwork define this theme. These source colors and type
  override the Greeny-specific single-green and Nunito rules below.
  Native HTML holds text, navigation, personas, palette and type tables;
  original diagrams retain their exact layout and wiring. SVG viewports crop
  supplied artwork without retouching it. Clickable artwork opens a local image
  without scripts and enhances to a keyboard-accessible dialog. Separate enlarge
  buttons and duplicate artwork captions are omitted. The owner-approved
  recording defines seven rounded layers: Overview, then the six source chapters.
  Long layers retain natural reading height, then hold their bottom edge as
  the next slides over them. The background layer scales down by at most 4%
  (2% on mobile) and darkens by up to 30%; native scroll reverses the effect.
  Source colors and artwork stay unchanged. Whole blocks enter once; no script
  and reduced motion use ordinary readable flow. All slides 1–45 are accounted
  for, including slide 25's Wireframes heading. See `docs/synergy/case-study.md`.
  Chapter dividers follow slides 6/9/15/22/28/40: native light titles and topic
  lists, with the original outlined and solid numerals and decorative strokes.
  Subsection title bars follow their own source slides: gray #1C1C1E, turquoise
  #0AF5E1, Inter Light, rounded corners and a small Synergy / chapter context.
  Source image headings remain single where already included in an atlas.
  Overview opens with four whole original images 1–4, edge to edge, in order.
  Its smaller muted title and the owner's exact introduction follow image 4;
  text stays inside the page margins. User Interface uses only images 41–45.
  Components is one continuous atlas of slides 37–39 on the shared original
  background, including the source title and all card layouts. It remains
  inside Design System. Icon & Graphic and Buttons remain separate subsections.
  Spacing joins original slides 33–34 at their shared capture seam, preserving
  the staggered pair of phones and every measurement label as one composition.
- **Moti-Pulse** (`.theme-moti`): the owner approved **A / Editorial**. The source
  board supplies the content; the website uses a split hero, open research rows,
  alternating reading widths. Colors: white #FFFFFF,
  ink #202342, text #606478, blue #4A5FF7, strong blue #2437B6, lavender #EEF1FF
  and pale blue #DFE5FF. Inter carries all text; the main container caps at
  1200px. Original product screens and sketches remain source artifacts.
  The owner's latest clarification locks the source copy, section titles and
  narrative order; only layout, motion and presentation change. Use original
  charts and product artifacts without derived values or added narrative.
  Section headings are large, unnumbered source titles. Motivation/solution
  pairs share one full-width row divider to align across viewport sizes.
  Hero entrances last 600ms with 120ms staggering. Each reading section's
  complete content fades in together over 300ms, without separate delayed
  headings, prose or image entrances. Charts and Hi-Fi autoplay wait until
  that entrance finishes and their media is visible. Reduced motion and no script
  keep content directly visible. See `docs/moti-pulse/design.md` for the
  approved scope and the branch preserving all three design previews.
  The source-style floating contents panel uses the same white/lavender tokens,
  three research/design groups and an active-section highlight. Its toggle
  stays at the bottom-right of the viewport at every width. The closed toggle
  reads “Contents”; opening hides that label and reverses only the arrow,
  retaining the same neutral surface. The panel background wraps the links,
  leaving the stationary toggle outside, with comfortable 12px padding.
  The owner removed Mockups and the original-interface-screen disclosure;
  Hi-Fi's eight function demos now lead directly to the footer.
  Architecture keeps the original three-level graph with sibling features
  beneath each module; its source layout is frozen in
  `authoring/moti-pulse/diagrams/information-architecture-source.svg`, exported from the original
  HTML graph. Only its colors and outlines change. Task-flow SVGs
  preserve every original shape, glyph outline, position and wire path from
  `authoring/moti-pulse/diagrams/source/flow-*.svg`; only paint and outline styling change. Do not reflow or
  reroute them. Diagrams fit compact frames without horizontal scrolling;
  flow imagery can grow to 520px high. HTML text alternatives and original
  source diagrams remain available. See `docs/moti-pulse/diagram-redesign.md`.

Logos are the originals, not redrawn: the Greeny mark is a mask cut from the
deck (`projects/greeny/img/logo-mask.png`), the Moti-Pulse mark is cropped from
its board (`projects/moti-pulse/img/logo-centered.png`), shared by the home
page, case-study header/footer and favicon. Do not replace them with an
invented mark; the owner may supply final logo files later.

## Layout

A 1200px capped container with growing gutters. Sections are separated by a
hairline (#3A3A3A) rather than a colour change. The phone is the repeating
unit of composition: one in the hero, one per interface screen.

## Elevation & Depth

Depth comes from tone steps (#242424 → #2C2C2C → #333333) and one soft shadow
on the hero phone. No glows, no blurred colour fields.

## Shapes

Rounded rectangles throughout: 6px for chips, 12–16px for cards, 24px for
surfaces, pill for actions. The phone is the only object with a large radius
(40px), so it reads as hardware rather than a card.

## Components

- **Phone frame:** 10px black bezel, 40px radius, notch capsule, status bar.
- **Card:** #2C2C2C surface, 1px #3A3A3A hairline, 12px radius.
- **Chip:** #8EBE50 fill, #141414 text, 6px radius, 12px label.
- **Buttons:** one primary (green pill), one ghost (surface pill). Both have
  full state coverage including focus-visible.

## Do's and Don'ts

- Do keep the accent to controls, data and the mark.
- Do let the recreated app carry the colour; page chrome stays neutral.
- Don't add a second accent hue.
- Don't set headlines in tracked capitals or add an eyebrow above them.
- Don't invent metrics, testimonials or client logos for the case study.
