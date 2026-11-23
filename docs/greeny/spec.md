# Greeny — local website specification

## Scope and reading order

The delivered Greeny website uses English, including scrollytelling readings,
sensor status announcements, diagrams, app specimens and image descriptions.
Preserve personal names and Vietnamese place names in their original spelling.
Keep original reference files unchanged; translate editable authoring strings
and use `lang="en"` for the English case-study content. This language decision
supersedes earlier requirements to keep Vietnamese sensor-panel labels.

The Garden readings panel omits the closing illustrative-readings sentence.
Keep all four original values; render values at 20px/1.1, Nunito 700, with
11px unit suffixes across desktop and compact layouts.

Read the [shared website specification](../shared/website-spec.md) first, then
this file before adding, changing or reviewing Greeny content. This is the local
entry point for Greeny; its visual rules apply only to `projects/greeny/`.

The approved presentation is Figma frame 2995:20025 in
8NMst3c890fJWBihmNnBKu. See [implementation scope](figma-sync.md).
The heading, grouping and specimen rules below reflect that frame and supersede
the older uploaded-layout presentation. Preserve all seven live garden scenes
after the opening banner; only that first banner uses the new composition.
The owner subsequently approved the compact reading layout described below.
Its narrower columns and smaller media override Figma's desktop dimensions,
while preserving content, identity and order.

After the unchanged scrollytelling, render ECOSYSTEM - GREENY with Protocol,
Advantage and Scalability. The owner approved removing APPLICATION - GREENY
to follow the current Figma frame. Online/Offline copy inside the live garden
story remains unchanged. Preserve Ecosystem's exact English copy and emphasis.

Introduction contains only “Research and Design process of Greeny application”,
with Greeny in brand green. Reveal it gently as the reader reaches
the case study, announcing the change from the garden story to the written
project. Do not restore About us or insert an empty paragraph/card.

The final 3D story scene combines Hub and App in one fixed composition:
scrolling changes only the copy through Hub → App / Online → Offline,
then keeps the final composition visible and hands it back to normal document
scrolling toward the case study. There is no fade-out or separate App garden
scene. Preserve the model and complete network diagram across those text
changes. See [scroll story](scroll-story.md#final-hub-and-app-copy-share-one-scene)
for timings, responsive layout and accessible reading fallbacks.

## Project navigation

Greeny implements the [approved shared header and Contents contract](../shared/website-spec.md).

| Header field | Owner-approved content |
| --- | --- |
| App | Greeny, with the supplied `img/logo-mask.svg` mark |
| Project type | Design with Hardware consideration |
| Duration | 2 months |
| Home action | All projects ↗, linked to `../../index.html` |

The header scrolls away in normal document flow and does not reappear on upward
scroll. Greeny's `<html>` opts in through `.project-page`; the story reserves
zero sticky-header space. Preserve its model, materials and narrative behavior.
The logo/name group is static and not clickable, as required by the shared rule.

Contents starts closed at every width and first appears at `#ecosystem`, after the
3D story and project facts. It remains available after that first appearance.
List the product-context section, then the six chapters and their immediate subtopics from the hierarchy table
below, in that order; omit the scrollytelling stops, individual personas,
individual task flows and component specimens. Project video follows User Interface immediately as a peer heading in the
same Contents group/column, linking to `#project-video`; twenty links total.
The toggle sits at the bottom-right, outside the panel background. All open,
close, focus, current-section and responsive behavior follows the shared spec.
Use Greeny's surface/text tokens, `--green-200` for the current-link accent and
a light translucent tint without an underline. The toggle has no selected styling.
The owner removed the visible Pause animation control and Continue to the case
study link. Preserve native scrolling, reduced motion, offscreen idling and
WebGL fallbacks without reserving space for these removed controls.

The shared assets are `assets/css/project-navigation.css` and
`assets/js/project-contents.js`. Subtitle anchors are preserved in
the native case-study authoring helpers: Meaning, User segmentation,
Function Ideation and Colors. The obsolete About us link is removed. See the existing chapter/subtopic hierarchy
below for their exact labels; do not add extra navigation levels.

## Final project video

After User Interface, before project credits, Back to top and Next projects,
show the supplied YouTube video `NN9Esg6nsKk` in a separate Project video section.
It stays outside the model story and native case-study chapter wrapper.
Use the existing Greeny cover as a local poster. Play loads a YouTube iframe
inline with controls, fullscreen and mobile inline playback; there is no player
or third-party request before activation. Omit the standalone Watch on YouTube link. Without JavaScript, the poster
keeps a native Play video link to the supplied video. This explicitly authorized embed is an exception
to the otherwise local-only media policy. Shared metadata/template/build logic
is in `authoring/portfolio/`; style and playback helpers are
`assets/css/project-endings.css` and `assets/js/project-video.js`.

## Title and subtitle contract

The implementation is scoped to `.greeny-case-study` in
[figma-layout.css](../../projects/greeny/figma-layout.css), loaded after
case-study.css. Reuse
`.deck-reference-heading` for a section's title/subtitle group.

| Role | Approved treatment |
| --- | --- |
| Section title | Nunito, weight 500; `var(--step-4)`; line-height `1.15`; letter-spacing `-.025em`; `var(--text)` |
| Subsection heading (`h3`) | Inter, weight 600; `var(--step-2)`; line-height `1.4`; letter-spacing `-.015em`; `var(--text)`. No leading border; align with its content. UI-family subtitles use Nunito 500 at up to 32px |
| Persona name | Inter, weight 500; `var(--step-2)`; line-height `1.2`; letter-spacing `-.02em`; `var(--text)` |
| Persona reading labels | Inter, weight 600; `var(--step-0)`; line-height `1.5`; letter-spacing `0`; `var(--text)` |

Titles retain their natural case. Separate chapter headings with a quiet rule
below the title, with 24px padding before the rule and 40px to the next heading.
Subtopics have 24px to their content. Do not add numbering or a green marker.
Introduction is a leading-aligned transition at the same 52px desktop scale,
with 72px top/80px bottom padding and no supporting paragraph. Its inner frame
has 2px green side borders and 24px padding, rather than a horizontal rule.
The Logo chapter follows with no extra chapter-top padding.
Keep the shared self-hosted font families and responsive type scale.

### Chapter and subtopic hierarchy

Only these chapter titles use `h2` and the section-title style. All their
subtopics use `h3` and the subsection-heading style, including subtopics
that appear in a separate content block farther down the page:

| Chapter title (`h2`) | Subtitles (`h3`), in reading order |
| --- | --- |
| Ecosystem - Greeny | Protocol; Advantage; Scalability (cards, no extra Contents level) |
| Introduction | Research and Design process of Greeny application; transition only |
| Logo | Meaning; Safezone & Grid |
| User Research | User segmentation; User Personas |
| User Experience | Function Ideation; Site map; Task Flow; Sketches |
| UI system | Colors; Typography; Icon; Components |
| User Interface | None |

Do not promote an individual subtopic to a new chapter merely because it has
its own anchor or content section. Keep those anchors and their reading order.
Persona names, individual task-flow labels, font-family names and component
group headings sit below their subtopic at `h4`; their reading labels or
specimen headings use `h5`. Keep their approved visual styles. App-font
specimens and text baked into source artwork retain their source presentation.

Use the existing self-hosted font families through `--font-display` and
`--font-body`. Their Greeny case-study aliases include the Vietnamese glyph
subsets. Font sizes reference the existing scale in
[base.css](../../assets/css/base.css), so text follows browser settings.

## Grouping, spacing and responsive layout

Safezone & Grid follows the current Figma node `2995:20111`, superseding the
earlier raster crops from `3028:24799`. Preserve the seven supplied SVG layers
in `img/brand/current/`: original marks/masks, construction grid, boundary and
four-corner clear-space lines. `brand-vectors.cjs` composes these unmodified
layers with the source labels and wordmark into two 240×300 SVG diagrams.
Use the source 10×13 construction grid and four equal corner marks, without a
filled image background. The compact desktop layout displays each diagram at
216×270px beside a fluid paragraph, with 16px above the row and 24px gaps.
Paragraphs use Inter 16px/1.7; stack the groups on narrow screens. Preserve
full-size image viewing. The old PNGs/crop manifest remain historical evidence.

- Use a 1080px maximum reading container (180px side margins at 1440px).
  Mobile/tablet retain the existing gutters; do not increase their padding.
  Desktop chapter gaps are 96px; continuation topics use 40px. Reduce these to
  72px/40px on tablets and 56px/32px on phones. Avoid doubled adjacent padding.
- Keep one context section, six case-study chapters and fifteen content blocks. Only the first
  block in each chapter carries data-case-start. Preserve stable anchors.
- At 960px and above, retain two equal persona cards with a 24px outer gap,
  80px portraits, metadata row and full source copy. Use 20px card padding and
  internal gaps; stack them below 960px. Do not shrink reading text to fit.
  Only Duc Phu and Phuong Lan are presented.
- User segmentation places text beside a 216px portrait with a 64px desktop gap.
  Stack at 759px and below, with a 180px image and 24px gap.
- Function Ideation is the five-group native diagram from the current Figma.
  Use connected branches, never a flattened page screenshot. On mobile use a
  vertical reading order with a visible connecting rail.
- Preserve Sitemap and seven Task Flow diagrams' nodes, wiring and geometry.
  Task flows are independently collapsible, all initially closed.
- Sketches follows Task Flow within User Experience. Present twelve original
  crops in three columns at desktop, two on tablet and one on phones. Group
  the additional entry screens. Use the existing closeable image dialog;
  local originals remain the no-script fallback.
- UI system: Brand, Neutral and Semantic each have four labeled swatches.
  Brand order is Primary, Secondary, White, Black. Retain fourteen Inter and
  Nunito specimens; each family heading precedes its rows.
- Components: environmental line/bar states share aligned columns, with the
  explanatory sensor image and source attribution below. Device control places
  dashboard status beside two aligned control groups. Upright weather cards,
  garden cards and five original onboarding illustrations follow.
  The owner now requires original SVG exports from GREENY file
  `P0juURVnXARkV1owcBfbdJ` rather than native approximations of these specimens.
  See the source-component contract below.
- Match Meaning's original six SVG layers and wiring, with native explanatory
  text positioned around the central mark. Keep the source closing statement.
  Below 760px, stack the same content and hide decorative diagram connectors.
- Onboarding uses the original composition in `img/onboarding.png`,
  containing all five translucent screens in their fixed staggered arrangement.
  Scale this entire composition proportionally at every width; never wrap or
  resize the five screens independently. Keep the title outside the image and
  retain the existing full-size image dialog and all five text alternatives.
  Preserve its original border, blur and shadow pixels. Do not rebuild the
  individual screens or overwrite it with an HTML-rendered approximation.
- Use the local Nunito Greeny alias with the full 200–1000 variable weight
  range for case-study headings. This allows the source weight 500 to render
  correctly without changing shared fonts or the live garden story.
- User Interface uses two native text/phone-artwork showcase panels, then
  original source 39 and 52. Do not restore collages 41/42, duplicate headings,
  or Advertising/Poster dividers.
- Wrap at 360px and 200% text size; do not clip headings or add internal body
  scrolling. Preserve reduced motion and native no-script disclosures.
- Scope presentation changes to Greeny. Seven-scene movement, looping effects,
  annotation holds, canopy timing and Hub/App text beats remain unchanged.

### Compact reading layout — approved

When the two persona cards sit side by side, share content-sized rows for
their identity blocks, About, Pain Points, Needs and Motivations. The identity
divider and each matching reading label align across both cards, even when
occupation or body text wraps. Below 960px, stack independent cards naturally.

`reading-layout.css`, loaded after `figma-layout.css`, owns the approved density
adjustments. Keep the header, Contents and live garden outside its container
scope. Apply the 1080px measure to the written case study and its ending/footer.

- Center large diagrams, onboarding and chart groups within a 960px maximum;
  icon artwork caps at 900px. Preserve image proportions and full-size viewing.
- The User Interface gallery fills the reading column, matching both ends of
  the divider beneath its section title. Do not apply a separate width or
  viewport-height cap to this gallery. Preserve the artwork proportions.
  Video retains its original poster and caps at 960px, with its existing
  viewport-height limit. No additional cropping.
- Source chart/control SVGs keep their intrinsic proportions inside the compact
  columns. Do not restore the old 947px graph-group reservation, 409px chart
  minimum or HTML control-card heights around these exported images.
- Keep 64px between component families (48px on phones), with smaller internal
  gaps. Use 320px desktop sketch frames, preserving whole sketches with contain.
- Body copy, heading hierarchy, persona text and navigation typography retain
  their sizes. Only text inside the scaled UI artwork follows its panel width,
  with a 16px floor; do not zoom or transform the entire page.
- Meaning's original diagram layers follow proportional container coordinates
  as the column narrows. Keep its explanatory labels readable and wires aligned.

### Original component SVGs — approved

Use the supplied [GREENY Components file](https://www.figma.com/design/P0juURVnXARkV1owcBfbdJ/GREENY?node-id=8-4).
Dark presentation instances in that file preserve the intended theme; library
defaults may be light. The website uses nineteen unchanged SVG exports in
`projects/greeny/img/components/`: four charts, two dashboard status panels,
six device-control states, three garden cards and four weather illustrations.

`references/components.json` records each source node, delivered dimensions and
SHA-256 hash. `component-assets.cjs` emits the image markup. Preserve all artwork,
original glyphs, borders, effects and embedded photos; do not redraw paths or
recreate the UI with HTML. Original wording inside source SVGs is retained;
page headings, descriptions and image alternatives remain English.

The owner chose upright Weather cards: retain their native layout and readings,
replacing only the four illustrations with original SVGs. Do not use the tilted
full-card exports from the source slide. Onboarding keeps its approved PNG.
Fifteen full component examples open through the existing image viewer; their
drawn buttons are part of the artwork, not live app controls. Fit images without
cropping, distorting or scaling beyond their natural size unnecessarily.

For a new top-level section, reuse this markup with real source labels and a
unique ID. The labels below are template placeholders, not website copy:

```html
<section class="section deck-reference-section"
         id="new-section" aria-labelledby="new-section-title"
         data-case-chapter="new-chapter" data-case-start>
  <div class="wrap">
    <header class="deck-reference-heading">
      <h2 id="new-section-title">Tên section</h2>
      <!-- Omit h3 when there is no source subtitle. -->
      <h3>Subtitle của section</h3>
    </header>
    <!-- Source-backed section content. -->
  </div>
</section>
```

For a continuation topic, reuse its parent's `data-case-chapter` value, omit
`data-case-start`, and use its `h3` subtitle. Only introduce an additional chapter
after the owner approves it. The current grouping is preserved by
`authoring/greeny/case-study/chapter-layout.cjs`, applied by the native builder.
Update that source mapping when adding an approved content block so regeneration
does not restore the old equal-spacing treatment. These spatial rules apply
only to the case study; leave scrollytelling, navigation and Contents unchanged.

Set `lang` for the actual language when it differs from the surrounding text.
For generated case-study content, make changes in its authoring source and
rebuild; the existing opening helper is in
[opening.cjs](../../authoring/greeny/case-study/opening.cjs).

### Task Flow disclosures

The seven source-ordered Task Flow diagrams are independent native `details`
disclosures, initially closed. Each summary retains its source title as an `h4`
and shows a green chevron; clicking or pressing Enter/Space opens or closes
only that flow. Multiple flows may stay open. Keep all diagram geometry,
positions, wiring, text and full-size links unchanged. Diagram text descriptions
remain available to screen readers without a visible transcript disclosure.

Use Greeny's dark surfaces, a 1px structural border, 12px radius, a minimum
64px summary row and 12px between flows. The diagram body has its own quiet
top divider and 24px inset (12px on narrow screens). Fit diagrams to the body
without horizontal scrolling. Do not add duplicate titles inside the body.

`projects/greeny/case-study.js` enhances native toggles with a reversible
300ms height transition (`cubic-bezier(0.2, 0, 0, 1)`) and a matching chevron.
Reduced motion resolves directly to the final height. Without JavaScript,
native disclosures remain functional. Hidden/closing bodies cannot receive
keyboard focus. Keep this behavior isolated from the garden and Contents.
The authoring template in `authoring/greeny/case-study/experience.cjs`
preserves the disclosures on rebuild.

## Artwork inspection

Normal activation of a case-study image or diagram link opens the original
local artwork in an in-page native dialog, enhanced by `case-study.js`. Keep a
visible Close control inside the viewport, including at 320px and 200% text.
Close, Escape and clicking the backdrop dismiss the viewer and restore focus
to the opening link and its reading position. Original size/Fit to screen only
changes the viewer's image sizing, with scrolling contained inside its canvas.
Keep native original-file links as the no-script and modified-click fallback.

## Supporting specifications

### Editable Figma website handoff

The current website follows the owner's updated
[Desktop1440](https://www.figma.com/design/8NMst3c890fJWBihmNnBKu?node-id=2995-20025).
The earlier editable handoff remains inside the original Greeny Figma section,
alongside its
and [UI Kit](https://www.figma.com/design/8NMst3c890fJWBihmNnBKu?node-id=2898-16457).
The owner requested an image for scrollytelling and editable layouts for the
six case-study chapters. This handoff contains39 tokens,10 text styles and43
components, including14 closed/open task-flow variants. The live HTML/CSS and
this local specification continue to define website behavior; the Figma image
does not replace the native garden model or scroll animation.


User Interface is followed by Project video, the original two-column project
credits, Back to top, Next projects and the personal footer. The credits marker
sits outside the fifteen generated content blocks and is preserved by the Greeny
builder. Greeny's current Figma footer has identity/contact columns without
Work/About/Contact navigation. Its recommendations retain the original shared
`cover` artwork; the newer `homeCover` images belong only to Home.
Follow [the shared ending contract](../shared/website-spec.md#project-endings-and-personal-footer--approved).

Read only the documents relevant to the task:

| Task | Specification |
| --- | --- |
| Content, section order, opening layout, approved omissions or source assets | [Case study](case-study.md) |
| Scroll scenes, device effects, callouts or readings | [Scroll story](scroll-story.md) |
| 3D geometry, device placement or model rebuilds | [Garden model](garden-model.md) |
| Web-rendered model color changes | [Color-review workflow](color-review.md) |
| Palette tokens and shared design constraints | [DESIGN.md](../../DESIGN.md), using only its applicable Greeny theme |

Shared navigation and Contents remain governed by the shared specification.
This local typography contract does not change their rollout status.

## Completion check for future additions

Verify that every added section uses the approved title/subtitle roles and
spacing, retains its source content and introduces no new typeface or font
delivery mechanism. Compare it with Introduction and Personas on the running
Greeny page. Check 360, 768, 1280 and 1920px and 200% text, including long
English labels, with no clipped headings or horizontal page overflow.
