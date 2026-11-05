# Moti-Pulse diagram presentation

The owner requested themed Information Architecture and Task Flow imagery.
The latest clarification makes the original graph layouts authoritative:
retain the order, wiring and position of every element in both sections.
Change visual styling only.

## Source contract

The original `projects/moti-pulse/img/flow-*.svg` files stay unchanged.
The display variants in `img/diagrams/` preserve their canvas dimensions,
ordered graphics, shape geometry, transforms and outlined text exactly.
Do not reroute wires, rearrange nodes, rewrap labels or replace source shapes.
Source branch labels and return paths remain in their original positions.

`diagrams/flows.json` records the source labels, node roles and graph inventory.
Node IDs follow the original SVG shape order; the source SVG determines layout.
Keep source wording, including “Promodoro” and “Reimider”.

| Source | Nodes | Connections |
| --- | ---: | ---: |
| Life mission | 17 | 18 |
| Goal | 13 | 13 |
| Tasks | 14 | 15 |
| Schedule | 39 | 44 |
| Pomodoro | 30 | 33 |
| Report | 10 | 9 |
| Information Architecture | 14 | 13 |

Architecture has no owner-supplied SVG. Its source is the original HTML/CSS
graph in commit `f575045`, before the diagram redesign. The fixed export
`diagrams/information-architecture-source.svg` captures that graph at its
1200px desktop width with the existing Inter font: App above four modules,
with sibling features in a row beneath each module. It preserves node boxes,
label lines and shared branch positions. It is the geometry source for the
styled display variant; do not replace it with a newly arranged hierarchy.
The exact HTML text alternative remains available.

## Styling and delivery

- Reuse white, ink #202342, blue #4A5FF7, strong blue #2437B6,
  lavender #EEF1FF and pale blue #DFE5FF.
- Keep original action circles, screen rectangles and decision diamonds.
  Use white actions, lavender screens, pale-blue decisions and dark-blue
  start/end nodes with white lettering. Strengthen existing wire contrast
  with dark blue and a subtle outline, preserving the exact filled paths.
- Task-flow typography remains the source's outlined glyphs. Architecture
  retains its original rectangular nodes, label positions and embedded Inter.
  It uses a dark-blue App node, lavender modules, white feature boxes and blue
  connectors. Neither requires external requests.
- Keep native task-flow disclosures and the separate pale-blue diagram
  surface beneath each title. Images are display-only.
- Center frames up to 1160px wide; cap task-flow imagery at 520px high and
  architecture at 340px. Scale proportionally to fit narrow screens with
  no horizontal scrolling or internal scroll panels.
- Use relative image URLs and intrinsic dimensions matching each source.
  Preserve other sections, reading animations and eight Hi-Fi videos.

The optional authoring helper is `node scripts/build-moti-diagrams.cjs`.
It reads the six original flow SVGs and fixed architecture export, adding
paint classes, styles and accessible metadata;
it does not reconstruct their geometry. It uses the Chrome/puppeteer-core
already installed by project setup. `CHROME_PATH` may override the browser.
The site serves the resulting static SVGs without a runtime build step.

## Verification

Compare every original and display SVG's ordered graphics and geometry
attributes, including glyph paths, plus root dimensions and viewBox. Confirm
the originals' Git hashes are unchanged. Check all six source role inventories.
Inspect styling at source size and the page at 320, 360, 768, 1280 and 1920px.
Verify native keyboard disclosures, reduced motion, no-JavaScript visibility,
media loading and the contents panel's tighter spacing.

The current variants passed exact ordered-element and geometry comparisons
against all six originals, including their outlined labels. All original
files match Git HEAD. Paint-role checks passed for 123 nodes and every source
wire path. Browser checks passed at 320, 360, 768, 1280 and 1920px, including
image fit, keyboard disclosures, reduced motion and no-JavaScript use, with
no missing requests or script errors. The contents panel also passed short
viewport and rapid-toggle checks. JavaScript syntax and whitespace checks passed.
Separate Standards and Spec reviews reported no actionable findings.

The architecture variant also passed an exact ordered-element and attribute
comparison with its fixed source export: 14 nodes, 23 shared branch bars and
nine feature arrowheads. Embedded Inter and label fit passed. Browser checks
at 320, 360, 768, 1280 and 1920px found no horizontal overflow, missing requests
or script errors. The keyboard text disclosure works with reduced motion
and JavaScript disabled.

The repo has no root typecheck, lint, test or build pipeline. Use JavaScript
syntax checks, `git diff --check`, local Chrome and the existing puppeteer-core.
DESIGN.md validation could not run in this session because automatic approval
review hit the account usage limit. Native screen-reader speech and other
browser engines have not been verified.
