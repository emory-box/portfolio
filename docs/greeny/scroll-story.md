# Greeny scroll story

## Agreed experience

The owner approved one continuous garden scene at the beginning of the Greeny
portfolio case study. Scrolling moves the garden between opposite sides of
the composition and gently changes its viewing angle. Each stop pairs the
feature explanation with the corresponding action in the garden. The latest
approval selects pastel clay, a 2D sensor panel and soft light beams A, and
removes phone screens from scroll scenes. Reverse
scrolling reverses the presentation. Existing research, system, interface and
brand content follows the story.

## Material and provenance

- Latest scrollytelling brief: [Figma Desktop - 3](https://www.figma.com/design/8NMst3c890fJWBihmNnBKu/UX-UI-Portfolio?node-id=2597-13878).
  This frame is an instruction sheet. Its garden image illustrates the existing
  live model; it is not a replacement image for the website.
- Reference film: `D:/Web-portfolio/greeny-site/dist/garden-film.html` and its
  `garden-film.js`. This is an editable 40-second canvas film, not an MP4.
- Garden: the current approved clay model is `models/garden.glb`.
  See [garden model](garden-model.md) and the
  [authoring guide](../../authoring/greeny/README.md) for source files and rebuilds.
- Explanations follow the film's functions. The 2D readings retain its four
  original values and illustrative-data disclosure. These are concept
  demonstrations, not live telemetry.
- Brand: existing portfolio tokens, self-hosted Nunito/Inter, original logo.

## Storyboard

| Stop | Source film | Garden action | Explanation / data |
| --- | --- | --- | --- |
| Introduction | 0–5s | Whole garden at its initial angle | Garden introduction |
| Sensors | 5–10s | Framed Sensor label, repeating signal and immediate 2D readings | Soil moisture, temperature, humidity and light |
| Sprinkle | 10–15s | Water from both heads; framed Sprinkle label points to one head | Owner-supplied irrigation description |
| Ventilation | 15–20s | Fan rotor moves | Fan active |
| Shade | 20–25s | Shade slowly extends and retracts along its existing frame | Shade active |
| Grow lights | 25–30s | Steady lamps with gently breathing light beams | Lights active |
| Connectivity | 30–35s | Data packets travel along device-to-hub connections | The existing device list |
| Remote care | 35–40s | Complete garden with continuing hub connections | App and connection explanation |

## Implementation decisions

- Figma update: the header contains only the original Greeny mark and wordmark.
  The introduction uses the supplied “Manage your garden easier with Greeny”
  headline, subtitle and scroll note. The Sensors chapter uses the supplied
  description and app sentence, shows its illustrative readings on arrival, and
  labels the physical sensor with a framed label and projected dashed leader.
  The transparent, duplicated “Section 3” note does not create another chapter.
- The sensor label follows the existing projection from the 3D renderer. It is
  decorative because the heading and description convey the same meaning.
  Reduced motion retains a still label and readings; missing WebGL retains
  the fallback image and readable content. Device geometry and approved colors
  stay unchanged.
- Section 3 uses the owner's “Sprinkle” heading and exact irrigation description.
  Its label reuses the Sensor frame, typography and dashed leader, targeting
  the first nozzle head's projected center. Both heads keep the existing water
  animation. All devices share one framed annotation, visible in its active
  scene and retained as a still label under reduced motion. Fan, Shade,
  Grow lights and Hub use the same badge and dashed leader. The Shade target
  follows the deployed cloth; the Hub target is its model-derived center.
- One reusable, sticky scene; native page scrolling, with no wheel interception
  or scroll snapping. No framework, server, build step or hosted service.
- Each stop provides real HTML headings and explanatory text. The 3D canvas
  is supplemental. App images have text alternatives.
- Desktop composition alternates the garden's side; mobile retains a stable
  garden above its screen and explanation to prevent overlap.
- Reduced motion uses fixed garden viewpoints and still device states.
  Without scripting or WebGL, show a garden image and the full ordered story.
- Stop the render loop outside the story and when the document is hidden.
  Cap resolution and avoid shadows on constrained screens.
- Device demonstrations loop while their scene is active, even without further
  scrolling, and resume on a return visit. Sensor transmission is independent
  of the readings reveal: readings stay visible when
  returning. All effects share the pause-aware animation clock. Shade cycles
  over eight seconds; beams breathe subtly without flashing the actual lamps.
- Delivery slices for the Figma update: (1) header and source copy, no blocker;
  (2) projected Sensor label and immediate readings, depends on (1); (3) browser
  verification and standards/spec review, depends on (2). The browser remains
  the test seam: source copy, no extra header links, callout tracking, first and
  return visits, active loops, keyboard pause and responsive fallbacks.
- A keyboard-accessible pause/resume control stops ongoing device animation.
  Short landscape viewports use a static garden image and a flowing story.
- Preserve all case-study anchors. Replace the existing hero presentation
  with the approved garden introduction; retain its project facts.
- Dependency approved by the owner: locally hosted Three.js r180 (0.180.0),
  GLTFLoader and its BufferGeometryUtils helper, with the upstream MIT license.
  Native scrolling replaces the previously proposed GSAP dependency.

## Delivery slices and checks

1. Static story, source screens and model assets. Check all content and links
   without JavaScript. No blockers.
2. Garden rendering and scroll choreography. Blocked by slice 1 (Three.js
   approval received). Verify every stop and reverse scrolling at browser level.
3. Device effects, mobile and accessibility. Blocked by slice 2. Check keyboard
   anchors, reduced motion, no WebGL, failure recovery and background idling
   at 360, 768, 1280 and 1920px.

The browser is the test seam: visitors must see the right device, screen and
copy together. There is no root typecheck/test/build pipeline. Run JavaScript
syntax checks, DESIGN.md lint, browser checks, and the two-axis code review.

## Out of scope

Real device control, live sensor readings, new product features, replacement
research copy, a framework migration, deletion of the earlier Blender model
or storyboard, and automatic publication of this iteration.

## Validation

- Browser: all eight stops and reverse scrolling at 360, 768, 1280 and 1920px;
  readable source app images, no horizontal overflow, missing requests or
  JavaScript errors. No JavaScript retains all headings and screens.
- Recovery: WebGL unavailable and context loss during model loading both
  retain the image fallback. Keyboard and pointer pause/resume work. WebGL
  draw calls stop while paused, offscreen and in reduced-motion mode.
- Motion: reduced motion quantizes device effects to the current stop, with
  no continuous rotation, fan motion, shade extension or blinking.
- Loop regression: `node scripts/qa/check-greeny-loops.cjs` checks continuing
  transmission while readings are visible, reverse scrolling with retained readings,
  every device loop, pause/resume and reduced-motion idling.
- Visual review: enlarged mobile app captures and stronger water droplets;
  mobile droplets are enlarged further to remain legible on the smaller garden.
  Standards and Spec reviews have no remaining findings after the fixes.
- New stylesheet: Hallmark lint has zero failures, reflex findings or warnings.
  Full-page lint still reports the retained page's wordmark false positive and
  existing style findings; its built-in render tier timed out. The targeted
  Chrome checks and captures above ran successfully using the existing
  puppeteer-core installation.
- DESIGN.md lint: zero errors and 19 existing warnings. JavaScript syntax and
  diff whitespace checks pass. No root build/typecheck/test pipeline exists.

Safari/Firefox and native screen-reader speech have not been verified.
