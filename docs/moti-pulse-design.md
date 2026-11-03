# Moti-Pulse: approved editorial direction

The owner selected **A / Editorial** from the three working previews. The
previews are preserved on local branch `prototype/moti-design-review`, commit
`3b7b176`; they are not production routes.

## Content and layout

The source is `D:\Web-portfolio\Raw\Moti-pulse\Desktop - 2.jpg`. It defines
the case study's facts and required sections, rather than the website layout.
Preserve Problems, Research for solutions, User Segmentation, Qualitative and
Quantitative Research, User Personas, Function Ideation, Information
Architecture, Task Flow, Sketches, Hi-Fi and Mockups. Preserve all 25 sketches,
six task flows, four hi-fi screens and six mockups. Use the original logo and
product artwork. Do not invent credits, outcomes, quotes or metrics.

The accepted layout has a split hero, a narrow/wide editorial reading rhythm,
open research rows and a blue product section. The evidence remains available
through native disclosure elements and full-size original images. Charts can
be redrawn from source proportions; individual bar counts are not labelled in
the source and must not be presented as exact data. Percentage labels retain
the source values. The original charts remain available for comparison.

The owner subsequently requested the original board's floating contents panel.
Use its User Research / User Experience / User Interface grouping and active
section highlight. It appears after the hero, opens in the spare right gutter
at 1800px and up, and starts collapsed on narrower viewports to preserve A's
layout. The native disclosure can be opened manually and closed with Escape;
choosing a link on narrow viewports closes the panel and focuses the section.
Without JavaScript, the contents remain available inline.

Subsequent owner-approved refinements: center the original header logo using
the corrected source crop; move UX/UI case study and 4 weeks into the header;
replace the hero's jump button with static Life mission / Goals & tasks /
Pomodoro labels; remove the redundant chapter strip and "Intention" line;
replace the footer's repeated contents list with Next project / Greeny.
The contents toggle sits inside the panel's right edge at a fixed vertical
position. The panel slides horizontally beneath it while the arrow reverses;
the toggle does not move upward or leave its line. The panel never scrolls
internally; spacing and columns adapt to short viewports.

## Approved motion

- Hero text and phone screens enter once over 600ms, staggered by 120ms.
- Insights enter on scroll; source-based chart bars rise once into place.
- On desktop, a sticky product stage changes between mission, goals and timer
  as the corresponding text is read. Mobile shows screens in normal flow.
- Reduced motion and no JavaScript show the content directly, without pinned
  scrolling or entrance effects. Changing the preference cancels live effects.

## Acceptance checks

Use static HTML/CSS/JavaScript, relative URLs and existing self-hosted fonts.
No added dependency, framework or external service. Verify 360, 768, 1280 and
1920px (also check reflow at 320px), original sections and artifacts, keyboard
navigation and disclosures, live reduced-motion changes, no-JavaScript
visibility, local images and links, and desktop screen progression. Review
against the accepted A preview and the source content before committing.
