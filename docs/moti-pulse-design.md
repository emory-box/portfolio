# Moti-Pulse: approved editorial direction

The owner selected **A / Editorial** from the three working previews. The
previews are preserved on local branch `prototype/moti-design-review`, commit
`3b7b176`; they are not production routes.

## Content and layout

The source is `D:\Web-portfolio\Raw\Moti-pulse\Desktop - 2.jpg`. The owner's
latest clarification is authoritative: retain its wording, section titles,
evidence and narrative order. Only layout, animation and presentation may
change. Do not add editorial headlines, connective copy, derived statistics,
feature descriptions, or move findings ahead of their source context.
Preserve Problems, Research for solutions, User Segmentation, Qualitative and
Quantitative Research, User Personas, Function Ideation, Information
Architecture, Task Flow, Sketches and Hi-Fi. Preserve all 25 sketches and
six task flows. The owner's later decision removes the Mockups section and
the "View original interface screens" disclosure, including its navigation
entry and unused styles/reveal hooks. Hi-Fi now ends the case study, followed
directly by the footer. Keep the removed source files available as assets.
Use `img/logo-centered.png` consistently for the Moti-Pulse mark on the home
page, in the case-study header/footer and as its favicon. Use the original logo and
product artwork. Do not invent credits, outcomes, quotes or metrics.

The accepted layout has a split hero, a narrow/wide editorial reading rhythm,
open research rows. The evidence remains available
through full-size original images. Use the original survey charts, preserving
their exact evidence rather than approximating unlabelled bar counts. The
three motivation/solution pairs remain paired and in their source order.

The owner requested new Information Architecture and Task Flow imagery in
the Moti theme. Both sections now use generated, self-contained SVGs with
compact horizontal layouts at every width. The original hierarchy, labels,
branches and loops remain; source SVGs are retained. The architecture also
keeps its exact HTML text alternative. See `moti-diagram-redesign.md` for the
graph model, authoring command and validation.

The owner subsequently requested the original board's floating contents panel.
Use its User Research / User Experience / User Interface grouping and active
section highlight. It appears after the hero, starts open at 1800px and up,
and starts collapsed on narrower viewports to preserve A's
layout. Only activating the toggle changes the disclosure. Choosing a section
focuses its heading area while keeping the panel open; Escape, scrolling back
to the hero and resizing preserve its state after it has appeared.
Without JavaScript, the contents remain available inline.

The centered original logo, source metadata in the header, removal of redundant
section navigation and the footer's Next project / Greeny remain approved site
chrome. The later source-copy clarification removes the extra hero feature
labels and restores the original English/Vietnamese hero wording. The added
"Intention" line and editorial closing section remain removed.
The latest contents refinement keeps the toggle outside the panel background,
at the bottom-right of the viewport at every width. The background wraps
the navigation content only.
The panel slides horizontally beneath the stationary toggle while its arrow
reverses; the toggle does not move upward or leave its line. The panel never
scrolls internally; spacing and columns adapt to short viewports. Section
headings are large source titles without section numbering.
The closed toggle visibly reads “Contents”. Opening collapses that label and
reverses the arrow; the button keeps its neutral fill, border and icon color,
with no selected appearance. Its right edge and arrow center stay fixed
through the existing drawer animation. Keyboard focus remains visible, and
the accessible name changes between “Open Contents” and “Close Contents”.
Verified the label, neutral open appearance, stationary arrow and viewport
position at 320–1920px, including 320×240 and 640×240 windows. Keyboard,
reduced motion, rapid reversals and native no-JavaScript disclosure passed.

## Approved motion

- Hero text and phone screens enter once over 600ms, staggered by 120ms.
- Reading groups enter once over 300ms, with each heading followed by its
  introduction 100ms later. Long motivation/persona content uses its existing
  semantic blocks. Already-viewed text stays visible after preference changes;
  keyboard focus reveals pending content immediately. Original diagrams and
  image collections remain directly readable. Chart titles enter before the
  chart sequence; pies wait until 85% visible and bars retain their existing
  grid-then-columns sequence. See `moti-motion-review.md` for verification.
  Keep the source connections and order intact.
- Hi-Fi presents the eight approved original-recording loops.
  The owner explicitly requested feature instructions;
  these describe actions in the supplied recordings and add no product claims.
  Only the visible demo nearest the viewport center autoplays. Other demos
  pause; manual pause, reduced motion and document visibility are honored.
  Videos use a phone-silhouette presentation and a slim external control bar,
  with native-player fallback. Still-artifact images are display-only and have
  no link, hover or zoom affordance. Paper references retain their link styling.
  Hi-Fi uses a two-column demo gallery with a single-column introduction.
  Each feature groups its title and description above a compact phone demo
  on a pale-blue surface, followed by expandable "How it works" instructions.
  Paired media panels align; mobile stacks into one column. Play/Pause has a primary round
  control with a 300ms contextual icon cross-fade. Reduced motion keeps only
  opacity; hover states apply only to hover-capable pointers.
- Reduced motion and no JavaScript show the content directly, without pinned
  scrolling or entrance effects. Changing the preference cancels live effects.

## Acceptance checks

Use static HTML/CSS/JavaScript, relative URLs and existing self-hosted fonts.
No added dependency, framework or external service. Verify 360, 768, 1280 and
1920px (also check reflow at 320px), original sections and artifacts, keyboard
navigation and disclosures, live reduced-motion changes, no-JavaScript
visibility, local images and links, and desktop screen progression. Review
against the accepted A preview and the source content before committing.
