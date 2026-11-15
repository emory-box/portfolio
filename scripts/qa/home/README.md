# Home checks

Start the repository server, then run from the repository root:

```powershell
node scripts/serve.cjs
node scripts/qa/home/run.cjs
```

The runner executes the existing Home checks with two browser jobs at a time,
stores logs under `.cache/qa/home-suite/`, and exits nonzero if any check fails.
Run a subset by passing filenames without `.cjs`:

```powershell
node scripts/qa/home/run.cjs check-home-about check-home-projects
```

- `check-home-design`: original SVG metadata, source slots and native geometry.
- `check-home-scene-spacing`, `check-home-view-fit`: responsive layouts and zoom.
- `check-home-motion`, `check-home-object-continuity`: navigation, original-object
  identity, history, focus, interruptions and game behavior.
- `check-home-about`, `check-home-skills`, `check-home-butter-motion`: focused
  reveals, complete content and motion continuity.
- `check-home-contact`, `check-home-game-art`, `check-home-toys`: feature behavior.
- `check-home-projects`, `check-home-refinements`: project states, banners and
  sequential entrance timing.

Shared delivery checks remain in `scripts/qa/`: `check-site.cjs` and
`check-portfolio-endings.cjs`. Chrome/puppeteer discovery is shared through
`../browser-runtime.cjs`. Set `SITE_URL` or `CHROME_PATH` when needed.
