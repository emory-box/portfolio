# Home runtime

Only the root homepage loads `index.js`. All modules use browser-native ES
imports; GitHub Pages serves them directly.

| File | Responsibility |
| --- | --- |
| `index.js` | Project selection, game state and feature initialization |
| `home-navigation.js` | Object zoom/return, history, focus and interruption |
| `home-objects.js` | Original artwork ownership and travelling slots |
| `home-about.js` | Single-gap ID-card outline and complete-copy fade |
| `home-skills-art.js`, `home-butter-morph.js`, `home-skills-pages.js` | Continuous butter morph, word cloud and readable paged list |
| `home-note-art.js`, `home-contact.js` | Note morph, email draft and clipboard |
| `home-game-art.js`, `tic-tac-toe.js` | Original game artwork and computer moves |
| `home-toys.js` | Pan/egg flip and basketball bounce |
| `home-view-fit.js` | Opened-view sizing and accessible reading fallbacks |

Read [the Home specification](../../../docs/home/spec.md) before editing.
Templates and asset metadata live in `authoring/portfolio/home/`; browser
checks live in `scripts/qa/home/`.
