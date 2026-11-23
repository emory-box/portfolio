# Greeny case-study presentation

## Current authority

The owner requested the website match [Figma frame 2995:20025](https://www.figma.com/design/8NMst3c890fJWBihmNnBKu/UX-UI-Portfolio?node-id=2995-20025).
This frame supersedes the earlier uploaded layouts for presentation. Read
[spec.md](spec.md) and [figma-sync.md](figma-sync.md) for the current contract.
The owner-approved reading-density pass supersedes desktop sizing: the written
page and endings cap at 1080px, major media at 960px, and native UI cards use
smaller content-driven heights. `reading-layout.css` owns these overrides;
body text, content order, source artwork and live garden behavior are retained.

Only the opening garden banner changes. All later live scenes retain their
copy, camera movement, device holds, looping effects, shade timing, connectivity
and parked ending. Ecosystem appears after the retained live story.
The owner approved removing the separate Application block to match the current
Figma; Online/Offline beats within scrollytelling remain unchanged.

Introduction is a heading-only, scroll-revealed transition into the written
case study: “Research and Design process of Greeny application”. Greeny is
highlighted in brand green. The owner explicitly requested this role; About us
is removed.

## Reading order

| Chapter | Contents |
| --- | --- |
| Ecosystem - Greeny | Protocol; Advantage; Scalability |
| Introduction | Research and Design process of Greeny application |
| Logo | Meaning; Safezone & Grid |
| User Research | User segmentation; Duc Phu and Phuong Lan personas |
| User Experience | Function Ideation; Site map; Task Flow; Sketches |
| UI system | Colors; Typography; Icon; Components |
| User Interface | Dashboard showcase; AI showcase; original source 39 and outdoor source 52 |
| Project video | Existing inline video, immediately after User Interface in Contents |

Video is followed by the two-column Team/Guidance credits, Back to top,
Next projects and the personal footer. Greeny's Figma footer uses two columns
for identity and contact, without the extra Work/About/Contact navigation.
Recommendations use the supplied Home covers for Moti-Pulse and Synergy.
The header identity stays static; Contents follows the shared specification.
Retain compatibility anchors except the removed About us.

## Original source content

- The five Function Ideation groups are Garden Management, Store garden data,
  Garden Wiki, Notifications and Customer management. Their branches follow
  the current frame and original frame 46; do not silently rename categories.
- Seven Task Flows remain in this order: Signin/Signup, Remote control,
  environment readings, AI Detect, Apply schedule, Create schedule, Add device.
  Preserve node positions, return routes and accessible descriptions. All seven
  independent disclosures start closed.
- Sketches reproduces twelve original image crops from frame 46. The helper
  retains Figma image transforms and combines original image/glyph data into
  standalone SVGs for web and full-size viewing.
- Duc Phu and Phuong Lan use the complete owner-supplied English slides 14–15.
  Trung Khang remains omitted. Do not invent interview quotes or outcomes.
- Colors and typography are native HTML. Brand order is Primary #6C9537,
  Secondary #8EBE50, White #FFFFFF, Black #191919. Preserve four Neutral and
  four Semantic swatches with names, and fourteen original type specimens.
- Logo Grid and Safezone follow current Figma node 2995:20111. Seven original
  vector layers form the 240×300 diagrams, with the source wordmark and labels,
  transparent background and native English explanations. Superseded raster
  crops and their export helper are removed; keep the current vector sources.
- Environmental graphs use original component SVG exports. The sensor image explains
  measurements and sits below the graphs, with its Parrot Flower Pot attribution.
  It is not another UI component.
- Chart states, dashboard status, device controls and garden cards use original
  SVG exports from file `P0juURVnXARkV1owcBfbdJ`. Weather retains upright native
  cards with four original SVG illustrations, as selected by the owner. Source
  nodes, dimensions and hashes are recorded in `references/components.json`.
  Five onboarding illustrations are delivered as one high-resolution PNG with
  fixed proportions, source borders and staggered layout at all viewport sizes.
  Use the original `img/onboarding.png` artwork without rebuilding its screens;
  all five descriptions remain available to assistive technology on the website.
  The new interface showcases use editable headings/copy with original phone
  shells, screens, masks and shadows.

## Reproducible sources

Run `node authoring/greeny/case-study/build.cjs` with the existing Raw/Greeny
deck available. It updates the case-study wrapper, its Contents links, local
artwork and source manifest. It preserves garden story, credits, video and footer.

`authoring/greeny/case-study/references/figma-assets.json` records the Figma
file/frame and original asset paths, source nodes and hashes, including the
six original Meaning layers from node 2995:20090. Runtime
assets are local; no expiring Figma URL is loaded. Filenames retain source
identifiers for traceability.

`slides.json` accounts for 47 original deck inputs: 30 presented, three
reference-only (7, 17, 18), and fourteen approved omissions. Original 17–18
inventory is superseded by the current five-group Figma diagram. Frame 46 now
supplies that diagram's source and Sketches. Source 45 is represented by the
two current Figma showcases. Historical uploaded references remain authoring
evidence, not runtime page screenshots.

Source checks validate originals and hashes. Browser checks cover reading order,
disclosures, image closing, keyboard access, 200% text, RTL, reduced motion,
local delivery and unchanged garden behavior.
