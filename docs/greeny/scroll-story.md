# Greeny scroll story

## Agreed experience

The owner approved one continuous garden scene at the beginning of the Greeny
portfolio case study. Scrolling moves the garden between opposite sides of
the composition and gently changes its viewing angle. Each stop pairs the
feature explanation with the corresponding action in the garden. The latest
approval selects pastel clay, a 2D sensor panel and soft light beams A, and
removes full app-screen mockups from scroll scenes. Connectivity later adds
one approved 2D phone illustration as a network endpoint. Reverse
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
- Current device-introduction copy: owner-supplied `2.svg`, preserved as
  [system-architecture.svg](../../authoring/greeny/references/system-architecture.svg).
  Use its Sprinkler, Integrated Sensors, Fan, Lighting, Net / Shade Cover,
  The Hub and Application – Greeny descriptions. The Application explanation
  includes both Online mode and Offline mode. This supersedes the earlier
  editorial headings and shorter descriptions, without changing the scene
  order, illustrative readings, device graph or scroll animations. The
  protocol comparison and architecture rationale are outside this copy update.

## Storyboard

| Stop | Source film | Garden action | Explanation / data |
| --- | --- | --- | --- |
| Introduction | 0–5s | Whole garden at its initial angle | Garden introduction |
| Sensors | 5–10s | Full text/readings first; extra scrolling holds the scene while the Sensor annotation reveals, then releases toward Sprinkle | Soil moisture, temperature, humidity and light |
| Sprinkle | 10–15s | Water from both heads; framed Sprinkle label points to one head | Owner-supplied irrigation description |
| Ventilation | 15–20s | Fan rotor moves | Fan active |
| Shade | 20–25s | Opens with the incoming scroll, remains fully deployed during text/label hold, retracts before Grow lights is settled | Shade active |
| Grow lights | 25–30s | Steady lamps with gently breathing light beams | Lights active |
| Connectivity / App | 30–40s | Approved device graph and Hub → Gateway → Internet → App, plus a separate local connection; garden stays at its Hub pose | Hub → App / Online → Offline in one pinned scene |

## Implementation decisions

- Figma update: the header contains only the original Greeny mark and wordmark.
  The introduction uses the supplied “Manage your garden easier with Greeny”
  headline, subtitle and scroll note. The Sensors chapter uses the current
  SVG-supplied description, shows its illustrative readings on arrival, and
  labels the physical sensor with a framed label and projected dashed leader.
  The transparent, duplicated “Section 3” note does not create another chapter.
- The sensor label follows the existing projection from the 3D renderer. It is
  decorative because the heading and description convey the same meaning.
  Reduced motion retains a still label and readings; missing WebGL retains
  the fallback image and readable content. Device geometry and approved colors
  stay unchanged.

### All device stops: content, held annotation reveal, then continuation

The owner approved a separate scroll beat for the device badge and dashed
leader, after the adjacent content is fully visible. This applies to Sensors,
Sprinkler, Ventilation, Shade, Grow lights and Connectivity.
Preserve each scene's composition and exact copy; do not reveal its annotation
at the same time as the explanation. Introduction has no device annotation
and retains its existing presentation.

- Once a device scene reaches its settled position, retain that camera pose
  and pin its existing explanation at the same viewport height.
- Add native scroll space equal to 55% of viewport height, clamped to 320–560px.
  The first 18% is a quiet beat with the annotation still hidden. Reveal the
  badge and dashed leader together over the next 60%, using a smooth opacity
  curve. Keep the fully revealed annotation for the remaining 22%.
- Complete each annotation before releasing its scene to the next transition.
  Device actions continue looping while active except for the scroll-driven
  canopy described below; sensor signals start after
  their reveal begins. Pause freezes their clock as before. There are no
  timers, wheel interception or scroll locks.
- Reverse scrolling reverses the same sequence. A return visit does not depend
  on a once-only class. Every added interval is subtracted from the renderer's
  virtual seven-stop timeline, so subsequent scene poses remain unchanged.
  The final Hub scene holds for its annotation and the App text sequence below,
  then exits with the story above the case study. It must not overlap the
  following content.
- During the Sensors hold, the explanation's fade controls readings as one group;
  omit the former panel/row entrance timers so all readings are ready first.
- Reduced motion shows the static annotation without the hold. Very short
  viewports and WebGL fallback retain the normal readable document. Skip an
  individual hold if its explanation cannot fit while retaining holds for
  other readable scenes. Re-measure all explanation blocks after content/font
  resizing, viewport changes, reduced-motion changes or renderer fallback.

This behavior is implemented in `garden-story.js`, `garden-overlay.js` and
the scoped `.garden-step.has-device-hold` rules in `garden-story.css`. The
hold distance, original scene height, pin position and copy offset are stored
on each step rather than duplicated in per-device CSS. The model asset,
materials and projections are unchanged. The canopy's action now follows the
scroll-specific rule below; other device actions are retained.

### Shade deployment follows scroll

The owner superseded the former eight-second canopy cycle. While scrolling
from Ventilation toward Shade, deploy the cloth progressively. It is fully
extended when Shade's explanation becomes fully visible, remains fully
extended through the quiet beat and the complete 2D label reveal, and only
retracts as the user continues toward Grow lights. By the time Grow lights'
explanation is fully visible, the canopy is fully retracted to the existing
rolled strip at the rear frame. Reverse scrolling reverses this sequence.

Use the existing virtual scene position rather than elapsed animation time:
opening runs from position 3.06 to 3.94; closing runs from 4.06 to 4.94.
These bounds match the explanation's fully visible range. Smooth both ends,
and hold deployment at 100% across the entire Shade stop and label interval.
Preserve the approved closed-state scale .10 and open-state scale 1; do not
alter the GLB, canopy material, frame, camera positions or annotation target.
The projected Shade target continues following the actual cloth geometry.

The settled Shade scene idles rather than scheduling an animation loop just
for the canopy. Other devices retain their existing continuous effects and
pause/resume behavior. Reduced motion uses the fully deployed static Shade
state and the rolled state in other stops, with no animated extension.
### Connectivity network

The owner approved the native 2D illustrations in
`projects/greeny/img/story/connectivity-icons.svg`. Gateway, The Internet and
Greeny App use the same framed caption treatment as Hub, without dashed
caption-to-icon leaders or target dots. Preserve the original Greeny logo
inside the phone. These are explanatory illustrations, not controls.

- Device wiring: left lamp → right lamp → Hub; fan → left sprinkler → sensor
  → Hub; left sprinkler → left lamp; sensor → right sprinkler → Hub.
  Render the shared left-sprinkler-to-sensor edge once, with no Shade edge.
- Hub → Gateway routes outside the composition. Gateway → The Internet →
  Greeny App uses straight, horizontally aligned connections. The separate
  App ↔ Hub branch means local-network access; it must not cross the
  Hub-to-Gateway route or cover captions. Its label sits on a dedicated lane.
- On desktop, route beneath the projected garden base and above the animation
  control. On mobile, use separate inner/outer lanes beside the content.
  Keep the diagram inside the story stage so it exits before the case study.
- Reveal the network with the held Hub annotation, after the explanation
  settles and the user scrolls further. Hide it in other stops; reverse
  scrolling restores it. Packets share the story's pause-aware clock.
  Stage-level wires, packets and the Local network label inherit the same
  content fade as the endpoint illustrations during exit and reverse entry;
  never leave bright connections behind after their icons fade away.
  Reduced motion retains a still diagram, and the readable connection
  description and illustrations remain available without WebGL/JavaScript.

`garden-connectivity.js` owns the responsive 2D routes; `garden-scene.js`
owns the device graph and projects the actual Hub and garden-base bounds.
This does not change the GLB, material colors or camera positions.
Run `node scripts/qa/check-greeny-connectivity.cjs` for route separation,
staged reveal, viewport fit, native graph, pause and fallback checks.
`node scripts/qa/check-greeny-network-story.cjs` checks fixed model and diagram
placement while the final copy changes, reverse scrolling and readable fallbacks.

The owner removed the bottom status/progress strip: no scene name, Hub status,
step count or progress line. Keep only the standalone Pause/Resume control in
the lower corner of the story stage; it retains pointer and keyboard access.

### Final Hub and App copy share one scene

The owner removed the separate App/Remote care scene. There are seven physical
garden stops, ending at the existing Hub composition. Once the Hub annotation
and network have fully appeared, further native scrolling changes only the
copy: The Hub → Application – Greeny / Online mode → Offline mode.
The owner removed the App's introductory sentence and its standalone reading
beat; do not leave a blank title-only state. Retain the other supplied
architecture descriptions. The garden keeps
the Hub scene's side, angle and position; the complete device graph, endpoint
illustrations, framed labels and external connections remain in place and
continue their existing pause-aware data animation. Do not fade or reposition
the diagram merely because the Hub paragraph is changing.

- Extend the final annotation hold with two reading beats, each 80% of the
  viewport height clamped to 480–800px. The initial annotation interval keeps
  its existing 55% / 320–560px rule. Store that initial interval separately as
  `--garden-annotation-distance` so it does not stretch the label reveal.
- Crossfade adjacent text panels between 8% and 32% of each beat with a smooth
  curve. Keep the remaining scroll space for reading. Reserve the largest
  panel's natural height so the heading frame and diagram do not jump.
- Reverse scrolling restores Online and Hub in order. After Offline finishes,
  retain the complete final composition and release into normal page scrolling
  toward the case study. The continuation link now lives with the project facts
  after the story instead of inside an extra App scene.
- Expose only the current panel to assistive technology during the sequence;
  inactive panels are inert. Provide a quiet scroll cue. Reduced motion,
  short landscape, missing JavaScript/WebGL or oversized copy shows all text
  in normal reading order without the animated sequence.
- At narrow widths below 700px viewport height, use a smaller final garden
  viewport and tighter diagram spacing, keeping text at the existing 13px
  size. Keep that same composition throughout all three copy states.

The owner superseded the terminal fade-out. There is no extra exit interval,
opacity animation, second garden translation or further camera turn after
Offline. The final pose stays fully visible in its section. CSS sticky
positioning releases it at the section boundary; further scrolling moves the
garden, text and network together as ordinary document content while the next
section enters. Do not keep a viewport-fixed canvas over the case study.
Reverse scrolling follows the same continuous boundary and restores the pin.
Pause and existing device loops remain available until the story scrolls out
of view. No model geometry, materials or camera position is edited. Regression command:
`node scripts/qa/check-greeny-terminal.cjs`.

`garden-network-story.js` owns panel crossfades and accessibility state;
`garden-story.js` owns native scroll intervals and the fixed final pose.

### Introduction text hierarchy

The introduction keeps the owner's exact headline, description and scroll
instruction. Only this stop uses the following text treatment:

- Headline: sentence case, self-hosted Nunito 700,
  `clamp(2rem, 3.2vw, 2.875rem)`, line-height 1.12, tracking -.025em,
  maximum 16ch. “with Greeny” starts a new line; “Greeny” uses `--green-200`.
- Description: Inter 400, 1.0625rem, line-height 1.65, maximum 33ch,
  `--text-muted`, 24px after the headline.
- Scroll instruction: Inter 400, .8125rem, line-height 1.6, maximum 36ch,
  `--text-dim`, 32px after the description. A decorative down arrow uses
  `--green-200`; this remains explanatory text, not a button.

Keep text selectable, allow natural wrapping and honor text scaling. This
hierarchy does not change device-scene headings, navigation, garden placement,
scroll behavior, model geometry, lighting or color profiles. Case-study
headings after the garden continue to follow [spec.md](spec.md).

### Retained device and scroll behavior

- Section 3 uses the owner's “Sprinkler” heading and exact irrigation description.
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
  returning. Time-based effects share the pause-aware animation clock; Shade
  deployment follows scroll as described above. Beams breathe subtly without
  flashing the actual lamps.
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

- Browser: all seven stops and reverse scrolling at 360, 768, 1280 and 1920px;
  readable source app images, no horizontal overflow, missing requests or
  JavaScript errors. No JavaScript retains all headings and screens.
- Recovery: WebGL unavailable and context loss during model loading both
  retain the image fallback. Keyboard and pointer pause/resume work. WebGL
  draw calls stop while paused, offscreen and in reduced-motion mode.
- Motion: reduced motion quantizes device effects to the current stop, with
  no continuous rotation, fan motion, shade extension or blinking.
- Loop regression: `node scripts/qa/check-greeny-loops.cjs` checks continuing
  transmission while readings are visible, reverse scrolling with retained readings,
  time-based device loops, pause/resume and reduced-motion idling. It reads
  the actual GLB canopy transform to check opening/held-label/closing order,
  full endpoint states and reverse scroll, and verifies that the settled Shade
  canvas remains unchanged without further scrolling.
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
