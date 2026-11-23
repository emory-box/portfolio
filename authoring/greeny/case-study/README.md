# Greeny case-study authoring

Rebuilds the static content **after** Scrollytelling, from the supplied
slides 5–49 plus outdoor artwork slide 52 in the Raw/Greeny folder.

| File | Purpose |
| --- | --- |
| `content.cjs` | Source copy, personas, feature tree, palette examples and onboarding captions |
| `diagrams.cjs` | Source-positioned nodes, decisions, return routes and labels |
| `render-diagram.cjs` | Native SVG diagrams and matching HTML transcripts |
| `build.cjs` | Assembles current HTML, copies required artwork and exports SVGs |
| `chapter-layout.cjs` | Tags fifteen blocks: product context and six case-study chapters, keeping stable IDs and reading order |
| `opening.cjs` | Ecosystem, Introduction transition, Branding, safezone, segmentation and two retained personas |
| `experience.cjs` | User Experience, source-ordered Task Flow, Colors, Typography, Icon and Components |
| `figma-presentation.cjs` | Current five-group diagram, twelve original sketch crops, onboarding, native phone showcases and Contents synchronization |
| `component-assets.cjs` | Original component SVG image markup, with image viewing and source-node metadata |
| `references/components.json` | Nineteen original GREENY component exports, dimensions and hashes |
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
The current Figma presentation is in `projects/greeny/figma-layout.css`, loaded
after `case-study.css`. `references/figma-assets.json` records current original
Figma assets and hashes. See `docs/greeny/figma-sync.md` for the approved scope.
The current Logo Grid/Safezone uses the seven original vector layers in
`img/brand/current/`, composed by `brand-vectors.cjs`. Keep these originals
instead of recreating their logo or wordmark.
Task flows are independent, initially closed native disclosures. The builder
also retains `projects/greeny/case-study.js`, which enhances their height
transitions; no script is required to open or close a flow.
That same local script enhances case-study image links with a closeable native
dialog. Keep its links and script inclusion when regenerating the page; original
files remain the no-script fallback.
Figma frame `2995:20025` now supersedes the earlier uploaded layouts for visual
presentation. Ecosystem precedes the research/design transition; the separate
Application block is omitted in the approved current frame.
Introduction is a heading-only scroll transition; About us is
removed. User Experience adds the current five-group Function Ideation and
source-frame-46 Sketches below Task Flow. The first two User Interface panels
are native text with original layered phone artwork, followed by source 39
and 52. Only the first garden banner changes; later story scenes stay intact.

The uploaded SVG/PNG references remain source evidence for original logo
glyphs, app specimens, diagram geometry and photographic artwork. Their
historical layouts are superseded by the current Figma frame. Personas retain
the two supplied English slides; Trung Khang remains omitted. The icon board
and task diagrams remain native vectors with accessible descriptions.

See `docs/greeny/case-study.md` for the current layout and scope.

Slides 33.1 and 33.2 are separate source inputs. Slides 35–38 contain the same
Wireframe title without artwork: the latest approved ending omits those
headings. Type specimen fields not specified in the source
are now supplied by the experience SVG and recorded explicitly. Full-size artwork and diagrams open through native
links; diagrams also expose complete HTML transcripts.

Keep header/footer navigation, garden-story and summary markup unchanged.
The shared portfolio ending is synchronized for Greeny only by
`node authoring/portfolio/build.cjs --project=greeny`. Video precedes the two-column
credits; both sit outside the generated case-study wrapper. Current Meaning
artwork layers are local SVGs in `projects/greeny/img/meaning/`, with source nodes
and hashes in `references/figma-assets.json`.
`brand-vectors.cjs` composes the current Safezone & Grid diagrams from seven
original SVG layers in `projects/greeny/img/brand/current/`. Its 240×300 output
preserves the source geometry and embeds local fonts for full-size viewing.
Superseded raster crops and their unused export helper are removed.
Onboarding uses `projects/greeny/img/onboarding.png`, the original Figma group
3007:23968, with its borders and effects intact. The website displays this one
image; the heading and accessible descriptions remain native HTML. Ordinary
case-study rebuilds reuse it. Do not regenerate the screens in HTML/CSS.
The live page loads `reading-layout.css` after the source-matched Figma stylesheet.
It caps the written content at 1080px, reduces large media and specimen heights,
and leaves the original typography and live garden unchanged. Onboarding keeps
its original image, scaled as one composition.
Component artwork comes from GREENY file `P0juURVnXARkV1owcBfbdJ`, page `8:4`.
Dark presentation instances supply charts, status, device controls and garden
cards; the four weather illustrations come directly from the library. The owner
retains upright weather cards. Keep the nineteen SVG files in `img/components/`
unchanged. Their registry is included in `slides.json`; source checks validate
every hash. Regeneration reuses these local files and never redraws the widgets.
Its credits marker is preserved outside the generated chapter group; Next
projects and the personal footer remain outside `main` across either rebuild.
Do not edit 3D assets, garden scripts or garden CSS for a case-study change.
The generator replaces only `.greeny-case-study` and the truthful footer
build-description text; it adds the isolated stylesheet link if absent.
Retain the legacy anchors listed in `docs/greeny/case-study.md`.
