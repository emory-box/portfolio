# Moti-Pulse diagram rebuild

The owner requested new Information Architecture and Task Flow imagery that
matches the existing theme and looks more professional. Replace presentation
only: retain every original label, decision, branch, loop and hierarchy.

## Source and model

The original `projects/moti-pulse/img/flow-*.svg` files remain unchanged.
The architecture comes from the original App → Dashboard / Life mission /
Goal / Timer hierarchy in the case-study HTML. `diagrams/flows.json` records
the six source graphs; node IDs follow the original SVG shape inventory.
Their order field controls visual placement, not graph connectivity.

| Source | Nodes | Connections |
| --- | ---: | ---: |
| Life mission | 17 | 18 |
| Goal | 13 | 13 |
| Tasks | 14 | 15 |
| Schedule | 39 | 44 |
| Pomodoro | 30 | 33 |
| Report | 10 | 9 |
| Information Architecture | 14 | 13 |

Keep source capitalization and wording, including the original flow heading
“Promodoro”. Preserve the subtasks return loop and the Pomodoro restart,
same-task and same-setting return paths. No inferred screens or outcomes.

## Presentation and delivery

- Produce seven standalone horizontal SVGs for the architecture and each of
  the six task flows. The owner found the earlier large/vertical presentation
  too big and requested smaller horizontal images at every screen size.
- Reuse white, ink #202342, muted #606478, blue #4A5FF7, strong blue #2437B6,
  lavender #EEF1FF and pale blue #DFE5FF. Embed the existing Inter font so
  exported images retain their typography without external requests.
- Use pill-shaped start/end nodes, rounded action/screen nodes and diamond
  decisions. Distinguish roles by shape/label and fill; include a diagram key.
  Give connectors arrowheads, consistent weight and space around text.
- Task flows use wide eight-column rows; Report fits one horizontal row.
  Keep the architecture's horizontal hierarchy. Preserve native task-flow disclosures,
  separate the diagram surface from the title and allow vertical page scrolling
  without horizontal scrolling or internal scroll panels.
- Use relative image sources with intrinsic dimensions to avoid layout
  shifts. Keep images display-only. Preserve existing reading animations and
  other sections. Keep the exact architecture as an HTML text alternative.
- Center compact frames, cap architecture imagery at 340px high and task-flow
  imagery at 420px, and fit proportionally on narrow screens. The horizontal
  layout remains consistent; no internal or horizontal page scrolling.

The optional authoring helper is `node scripts/build-moti-diagrams.cjs`.
It uses the Chrome/puppeteer-core already installed by the setup script;
`CHROME_PATH` may override the local browser path. The deployed site serves
the committed SVG files directly and has no runtime build requirement.
The helper also updates the picture elements' intrinsic dimensions when an
export's height changes, keeping the reserved layout aligned with the images.

## Acceptance slices

1. Record source nodes/connections and rebuild the horizontal exports with identical data.
2. Integrate the images, diagram key, text alternative and theme surfaces.
3. Compare source diagrams, check every label/branch, text fit and edge routes;
   check 320/360/768/1280/1920px, keyboard disclosures, reduced motion,
   no JavaScript and no missing assets. Review standards and source-spec axes.

## Verification

- Compared the six original source diagrams against the model: all 123 flow
  nodes and 132 connections retained, including Yes/No branches and returning
  loops. Kept the original Schedule spelling “Reimider” after the source review.
- The architecture retains 14 nodes and 13 connections. The original
  HTML hierarchy and wording remain in the accessible text disclosure.
- All seven SVGs render with embedded Inter. Browser geometry checks pass
  node text fit, canvas clipping and connectors crossing unrelated nodes;
  the subtasks return is routed separately from its outgoing Yes branch.
- Checked 320, 360, 768, 1000, 1280 and 1920px: horizontal images, capped heights
  and no horizontal page scrolling.
  Keyboard disclosures, reduced motion and no-JavaScript use passed, with
  no missing media or script errors. Eight Hi-Fi demos remain operational.
- Original six SVG hashes are unchanged. The model, generated images and
  optional authoring helper are committed together for reproducibility.
- Standards and source-spec reviews: no remaining findings. JavaScript syntax
  and whitespace checks passed. DESIGN.md lint: zero errors and 19 existing
  warnings. No root typecheck/test/build pipeline is configured.

Validation used local Chrome and the existing puppeteer-core. Native
screen-reader speech and other browser engines were not verified.
