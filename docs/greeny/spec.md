# Greeny — local website specification

## Scope and reading order

Read the [shared website specification](../shared/website-spec.md) first, then
this file before adding, changing or reviewing Greeny content. This is the local
entry point for Greeny; its visual rules apply only to `projects/greeny/`.

The owner approved the current title/subtitle treatment from Introduction
through all Personas as the default for future Greeny case-study content.
Use that treatment when adding a section. Preserve existing sections beyond
Personas until a task explicitly requests their restyling. The owner subsequently
requested the User Experience and UI system continuation; those sections now
also use this heading contract. Source app screens,
component specimens, diagrams and the 3D story retain their own presentation.

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

Contents starts closed at every width and first appears at `#brief`, after the
3D story and project facts. It remains available after that first appearance.
List the six chapters and their immediate subtopics from the hierarchy table
below, in that order; omit the scrollytelling stops, individual personas,
individual task flows and component specimens. There are eighteen links.
The toggle sits at the bottom-right, outside the panel background. All open,
close, focus, current-section and responsive behavior follows the shared spec.
Use Greeny's surface/text tokens, `--green-200` for the current-link accent and
a light translucent tint without an underline. The toggle has no selected styling.
After Contents first appears, keep the story's Pause control in the opposite
lower corner so the two controls do not overlap on return visits to the model.

The shared assets are `assets/css/project-navigation.css` and
`assets/js/project-contents.js`. Five subtitle anchors are also preserved in
the native case-study authoring helpers: About us, Meaning, User segmentation,
Function Ideations and Colors. See the existing chapter/subtopic hierarchy
below for their exact labels; do not add extra navigation levels.

## Title and subtitle contract

The implementation is scoped to `.greeny-case-study` in
[case-study.css](../../projects/greeny/case-study.css). Reuse
`.deck-reference-heading` for a section's title/subtitle group.

| Role | Approved treatment |
| --- | --- |
| Section title | Nunito, weight 500; `var(--step-4)`; line-height `1.15`; letter-spacing `-.025em`; `var(--text)` |
| Subsection heading (`h3`) | Inter, weight 600; `var(--step-2)`; line-height `1.4`; letter-spacing `-.015em`; `var(--text)`. A 3px `var(--green-200)` leading border with 12px inline padding identifies this heading role |
| Persona name | Inter, weight 500; `var(--step-2)`; line-height `1.2`; letter-spacing `-.02em`; `var(--text)` |
| Persona reading labels | Inter, weight 600; `var(--step-0)`; line-height `1.5`; letter-spacing `0`; `var(--text)` |

Titles retain the supplied natural case. Keep the chapter title visually primary
and give its subsection headings a smaller, consistent semibold treatment,
distinct from muted descriptive copy. The slim green leading marker identifies
subsections without numbering or adding a card. Omit a subsection heading when
the source has none. The large green uppercase chapter headings in the uploaded
layout have been superseded by this contract.

### Chapter and subtopic hierarchy

Only these chapter titles use `h2` and the section-title style. All their
subtopics use `h3` and the marked subsection-heading style, including subtopics
that appear in a separate content block farther down the page:

| Chapter title (`h2`) | Subtitles (`h3`), in reading order |
| --- | --- |
| Introduction | About us |
| Logo | Meaning; Safezone & Grid |
| User Research | User segmentation; User Personas |
| User Experience | Function Ideations; Site map; Task Flow |
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

- Keep title and subtitle in one header, aligned to the same starting edge.
  The subtitle starts 12px below the title. A standalone subtopic header has
  just its `h3`, with no extra top margin and no repeated chapter title.
- Group the existing thirteen content blocks into the six approved chapters.
  Each block carries `data-case-chapter`; only the first block of each chapter
  has `data-case-start`. Keep their native section IDs and source reading order.
- Chapter boundaries use `--deck-chapter-space: clamp(80px, 9.375vw, 120px)`.
  Place one quiet, container-aligned rule halfway through this gap, before
  the next chapter heading. Introduction has no preceding rule and starts
  with the smaller topic gap. Do not add cards around entire sections.
- Continuation topics use `--deck-topic-space: clamp(32px, 3.125vw, 40px)`.
  The next block owns the gap; set block-end padding to zero so neighboring
  blocks never double the whitespace. Safezone & Grid shares Logo's page
  background instead of introducing a separate full-width surface band.
- Chapter heading-to-content spacing is
  `--deck-heading-space: clamp(24px, 2.5vw, 32px)` when there is no subsection
  heading. Every header containing a subsection heading uses 24px to its
  content, including standalone continuation topics. Preserve the title/subtitle
  typography and their 12px internal gap. The marker follows the leading edge
  in RTL and grows with wrapped text; do not truncate subsection labels.
- Use `--deck-family-space: clamp(32px, 3.75vw, 48px)` between component families
  and task-flow figures, with 16px between a family/flow label and its specimen.
  Keep specimen UI styling and the three contiguous User Interface panels intact.
  User Interface contains source artwork 45, 39 and 52, in that order. The owner
  removed the device-control/schedule collage (41) and plant-identification/care
  collage (42). Exclude these two panels from generated HTML and web artwork;
  keep their source records as approved omissions.
- Present only Duc Phu and Phuong Lan (source slides 14–15), with their complete
  source copy. Trung Khang (slide 16) is an owner-approved omission. Keep its
  source record for provenance; exclude it from generated HTML and web artwork.
- At 960px and above, show both personas side by side in equal-width cards
  inside the existing container. Below 960px, stack them in source order.
  Each card uses `var(--surface)`, a 1px `var(--line)` border, 16px radius,
  24px padding (20px at 700px and below), and a 24px gap between cards.
  Keep the 80px portrait beside the name, followed by a three-column metadata
  row. Separate identity from reading content with a quiet rule. Reading blocks
  are 24px apart with 12px below labels; body copy uses `var(--step-0)` and
  line-height `1.7`. No truncation, hidden content or internal scrolling.
- Keep User segmentation compact and top-aligned below its heading. Its grid
  has a 1040px maximum width, a flexible text column, a 220px photo column and
  a 32px gap. Separate the three text groups by 20px. At 700px and below, stack
  text before the photo with a 24px gap and cap the photo at 180px wide. Retain
  the full original photo ratio and source copy; do not vertically center the
  text against the portrait or enlarge the photo to fill the available height.
- Place each font-family heading (Inter/Nunito) before its specimen rows in
  DOM and visual order, aligned to their leading edge with 24px below the
  heading. Align the two family columns at the top; retain this grouping when
  they stack on narrow screens. Keep specimen typography and content intact.
- Place content inside the existing `.wrap`. The legacy `--deck-space` token
  remains for older samples; it no longer determines chapter/topic boundaries.
- Let headings grow vertically and wrap naturally. Keep `text-wrap: balance`
  on titles and the narrow-screen overflow protection. Use content-driven
  responsive columns below the heading; preserve source reading order.
- Keep all added styles inside Greeny's case-study scope. Retain the local
  section order, source-backed content and existing stable anchors.

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
positions, wiring, text, full-size links and readable transcripts unchanged.

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

The case study ends with its original project credits, followed by the shared
two-project recommendations and personal footer. The credits marker sits outside
the thirteen generated content blocks and is preserved by the Greeny builder.
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
Vietnamese labels, with no clipped headings or horizontal page overflow.
