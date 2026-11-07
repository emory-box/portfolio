# Synergy

Static university-app case study at `/projects/synergy/`.

- `index.html`: seven scroll layers (Overview + six chapters), original artifact viewports.
- `synergy.css`: scoped slide-derived palette, type, responsive layout and motion.
- `synergy.js`: progressive contents, block entrances and artifact viewer.
- `stack-scroll.js`: native scroll pinning, scale/dim and dynamic measurements.
- `img/`: original supplied artwork, named by purpose. `logo.svg` embeds a crop
  of the original slide 7; it does not redraw the mark.
- `img/spacing.svg`: one joined source diagram from slides 33–34; the exporter
  is `authoring/synergy/export-spacing.cjs`.
- `img/components.svg`: one continuous atlas from slides 37–39, exported by
  `authoring/synergy/export-components.cjs`. Both diagrams stay inside Design
  System.

Click artwork itself to enlarge it. Each image is a native link with a visible
keyboard focus ring, enhanced to a dialog with fit/original-size controls.
Escape closes the viewer and returns focus without changing the reading position.
Without JavaScript the same link opens the local source image. Separate
enlargement buttons and repeated artwork captions are omitted.

Overview opens with full-width original slides 1–4 in order, followed by the
smaller Overview title and the owner's exact introduction.
User Interface uses only slides 41–45.

The six chapter dividers follow slides 6, 9, 15, 22, 28 and 40. Their titles
and topic lists are native HTML; original numerals and doodles remain source
artwork. Subsection heading bars use the source's turquoise light type, dark
rounded surface and Synergy / chapter breadcrumb. Components keeps its single
embedded source heading; Sketching and Mockups keep their image-led layout.

Source mapping, decisions and acceptance: [case-study spec](../../docs/synergy/case-study.md).
All 45 original inputs are present in `D:/Web-portfolio/Raw/Synergy`.
The complete hashed source mapping lives in `authoring/synergy/slides.json`;
run `node scripts/synergy/check-sources.cjs` from the repository root to check it.
No build or install is required. Run `node scripts/serve.cjs` from the repo root.
