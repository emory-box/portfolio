# Synergy source map

The original 45 slides remain in `D:/Web-portfolio/Raw/Synergy`.
`slides.json` maps every numbered input to its current website artifact or
native HTML equivalent and records its SHA-256. Slide 25 is the Wireframes
subsection heading; it has no additional screenshot content.

The live artwork is in `projects/synergy/img/`. Chapter titles, their topic
lists and contents remain accessible HTML. The six `chapter-*.png` files are
untouched divider sources (6, 9, 15, 22, 28, 40), used only through decorative
SVG viewports for the original numerals, hash, underline and doodles. The
right-hand crop includes the complete numeral; a source-space clip excludes
the old title so it cannot appear beside the native heading. Do not replace
native chapter text with a screenshot.

From the repository root, verify the source directory and served artwork:

```powershell
node scripts/synergy/check-sources.cjs
# Or supply the original directory on another machine:
node scripts/synergy/check-sources.cjs "D:/Web-portfolio/Raw/Synergy"
```

Recreate the one current Spacing composition (slides 33–34), keeping the two
capture slices at their original scale and vertical alignment:

```powershell
node authoring/synergy/export-spacing.cjs
```

Recreate the current continuous Components atlas (slides 37–39), with the
source title, shared background and original card columns:

```powershell
node authoring/synergy/export-components.cjs
```

Website behavior and the scroll contract are documented in
[the case-study spec](../../docs/synergy/case-study.md).
