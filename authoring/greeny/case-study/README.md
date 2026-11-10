# Greeny case-study authoring

Rebuilds the static content **after** Scrollytelling, from the supplied
slides 5–49 plus outdoor artwork slide 52 in the Raw/Greeny folder.

| File | Purpose |
| --- | --- |
| `content.cjs` | Source copy, personas, feature tree, palette examples and onboarding captions |
| `diagrams.cjs` | Source-positioned nodes, decisions, return routes and labels |
| `render-diagram.cjs` | Native SVG diagrams and matching HTML transcripts |
| `build.cjs` | Assembles current HTML, copies required artwork and exports SVGs |
| `chapter-layout.cjs` | Tags the thirteen content blocks as six visual chapters; keeps IDs/order intact and preserves the approved spacing hierarchy on rebuild |
| `opening.cjs` | Uploaded reference layout for About us, Branding, safezone, segmentation and the two retained personas |
| `experience.cjs` | User Experience, source-ordered Task Flow, Colors, Typography, Icon and Components |
| `ui-samples.cjs` | Static native app charts, weather, device controls and garden cards |
| `extract-experience.cjs` | Extracts exact vector diagrams and delivery-size photos from the experience reference |
| `references/` | One current reference per covered scope, source hashes, extracted glyphs and delivery-asset metadata |
| `slides.json` | All 47 source inputs, hashes, live representations and owner-approved omissions |

```powershell
node authoring/greeny/case-study/build.cjs
# Only after the experience SVG source changes, using the existing Chrome helper:
node authoring/greeny/case-study/extract-experience.cjs
# Then rebuild the HTML and source manifest:
node authoring/greeny/case-study/build.cjs
# Or point to the supplied deck on another machine:
node authoring/greeny/case-study/build.cjs "D:/Web-portfolio/Raw/Greeny"
node scripts/greeny/check-case-study-sources.cjs
node scripts/qa/check-greeny-case-study.cjs
```

The authoring command needs the raw deck; the delivered site needs no build
step, framework or additional client JavaScript. Output is current HTML,
`projects/greeny/case-study.css`, original photographic/illustration/mockup
resources in `img/case-study/`, and eight native SVGs in `img/diagrams/`.
The stylesheet is hand-authored and is not overwritten by the generator.
Task flows are independent, initially closed native disclosures. The builder
also retains `projects/greeny/case-study.js`, which enhances their height
transitions; no script is required to open or close a flow.
That same local script enhances case-study image links with a closeable native
dialog. Keep its links and script inclusion when regenerating the page; original
files remain the no-script fallback.
The uploaded opening reference supersedes the deck's opening presentation.
Slide 6 is omitted; slide 10's grid is restored beside Safezone in the latest
opening reference. Slide 7's introduction overview is omitted while
its sensor illustration remains in Components. Duc Phu and Phuong Lan are
retained using their separately supplied English slides; the owner omitted
Trung Khang (slide 16). Both uploaded SVGs
now supply English opening/UX/UI copy and the current 4/4/4 color specimens.
User Experience through Components follows the second uploaded SVG;
The approved `interface-layout.png` replaces the former User Interface and
Advertising sections with one title and contiguous panels 45, 39, 52. The owner
subsequently removed the device-control and plant-care collages (41 and 42).
Its JSON records the original source mapping and crop ratios. Unselected
mockups, repeated Wireframe headings, Advertising divider and poster copy
are omitted; compatibility anchors remain.
See `docs/greeny/case-study.md` for the current layout and scope.

Slides 33.1 and 33.2 are separate source inputs. Slides 35–38 contain the same
Wireframe title without artwork: the latest approved ending omits those
headings. Type specimen fields not specified in the source
are now supplied by the experience SVG and recorded explicitly. Full-size artwork and diagrams open through native
links; diagrams also expose complete HTML transcripts.

Keep header/footer navigation, garden-story and summary markup unchanged.
The shared portfolio ending is synchronized by `authoring/portfolio/build.cjs`.
Its credits marker is preserved outside the generated chapter group; Next
projects and the personal footer remain outside `main` across either rebuild.
Do not edit 3D assets, garden scripts or garden CSS for a case-study change.
The generator replaces only `.greeny-case-study` and the truthful footer
build-description text; it adds the isolated stylesheet link if absent.
Retain the legacy anchors listed in `docs/greeny/case-study.md`.
