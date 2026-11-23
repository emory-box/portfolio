# Home authoring

Run from the repository root:

```powershell
node authoring/portfolio/build.cjs --home-only
```

This exports root `index.html` and leaves project pages intact. It is optional
authoring; visitors and GitHub Pages use the exported page directly.

| File | Purpose |
| --- | --- |
| `index.cjs` | Semantic homepage template and original illustration slots |
| `assets.cjs` | Exact intrinsic dimensions and Figma node IDs for retained SVGs |
| `butter.cjs` | Contours extracted from current original butter artwork |
| `pan.cjs` | References to the original pan/egg paths for animation |
| `favicons.cjs` | Original portrait/project tab icons; `--render` also exports32px PNG fallbacks through local Chrome |
| `capture-moti-cover.cjs` | Browser export of the actual Moti-Pulse banner |

Shared profile/project/skill content is in `../content.cjs`; shared project
endings are in `../chrome.cjs`. Runtime modules are in `assets/js/home/`.
Original artwork stays in `assets/img/home/` with its supplied dimensions.

Read [the Home specification](../../../docs/home/spec.md) for current layout,
typography, motion, responsive and approval rules. Browser checks are under
`scripts/qa/home/`.

To refresh the Moti banner while the local server runs:

```powershell
node authoring/portfolio/home/capture-moti-cover.cjs
node authoring/portfolio/build.cjs --home-only
```
