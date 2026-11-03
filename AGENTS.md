# Portfolio — agent guide

A static portfolio: a collection of project case studies. The root page indexes
them; each case study lives in its own folder under `projects/`. No framework,
no build step, deployed to GitHub Pages from the repository root.

## First run on a new machine

Skills are vendored in `.agents/skills/`, so cloning already restores them.
Only the runtime helpers need installing.

1. Install **Node.js 22+** and **Git**.
2. Run the setup script:
   - Windows: `powershell -ExecutionPolicy Bypass -File scripts/setup.ps1`
   - macOS/Linux: `bash scripts/setup.sh`

   It checks Node, installs **FFmpeg** (HyperFrames renders), installs
   **Google Chrome** and **`puppeteer-core`** (Hallmark browser checks),
   confirms the vendored skills, and sets the Codex skill budget.
3. Serve locally: `npx serve .` then open <http://localhost:3000>.
4. Manual version of the script, if you prefer:
   ```bash
   winget install Gyan.FFmpeg          # or: brew install ffmpeg
   winget install Google.Chrome        # or: brew install --cask google-chrome
   npm install -g puppeteer-core
   ```
5. Open a **new terminal** after installing FFmpeg so it lands on `PATH`.

For Codex, the setup script appends this to `~/.codex/config.toml` when missing
(58 skills exceed the default 8,000-character skill list budget):

```toml
[skills]
max_context_tokens = 10000
```

OpenCode has no such limit; it reads `.agents/skills/` directly.

## Project layout

```
index.html                      the collection: project index (theme-home)
assets/css/base.css             design tokens + shell (header, footer, buttons)
assets/css/fonts.css            self-hosted Inter + Nunito
assets/css/home.css             home theme only
assets/js/site.js               scroll reveal + section nav
assets/fonts/                   latin variable woff2
projects/greeny/                case study, dark green theme
projects/moti-pulse/            case study, light blue theme
scripts/                        setup + screenshot helpers
DESIGN.md                       locked design system (tokens + rationale)
```

`index.html` is the only page GitHub Pages serves at `/`. Every case study is a
folder with its own `index.html`, so URLs stay clean:
`/projects/greeny/`, `/projects/moti-pulse/`.

Each page sets its palette with a body class (`.theme-home`, `.theme-moti`, or
none for Greeny). The shell classes come from `base.css`; page CSS only adds the
theme tokens and page-specific layout.

The header wordmark currently reads **Portfolio**. Replace it with the owner's
name in the home page and both case-study headers when the name is set.

Logos are the originals: Greeny uses a mask cut from its deck
(`projects/greeny/img/logo-mask.png`), Moti-Pulse uses a crop from its board
(`projects/moti-pulse/img/logo.png`). Do not redraw them; the owner may supply
final logo files later.

## Adding a project

1. Create `projects/<slug>/` with `index.html`, `<slug>.css` and `img/`.
2. Link `../../assets/css/fonts.css`, then `base.css`, then the page stylesheet.
   Copy the header/footer markup from an existing case study so navigation stays
   consistent.
3. Add a theme class to `<body>` if the project's palette differs from Greeny's,
   and override the tokens on that class in the page stylesheet.
4. Keep every URL relative (`img/...`, `../../assets/...`); never a leading `/`.
5. Add the project to the list in `index.html` (the project list and the work
   index) and to the footer list.
6. Check it at 360, 768, 1280 and 1920 px, then capture:
   `node scripts/screenshots.mjs`
7. Commit the page, its images and its styles together.

## Site constraints (GitHub Pages)

- **Static only.** No server, no build step, no API routes, no framework.
- **Relative URLs only.** Project pages live one directory deep.
- **Fonts are self-hosted** (`assets/fonts/`); no request leaves the site.
- **Anchors, not routes.** Section links are `#id`; there is no client router.
- `.nojekyll` stays at the root so folders are published as-is.
- Deploy: repo Settings → Pages → Deploy from a branch → `main` / `(root)`.
- Verify before committing: serve locally and check 360, 768, 1280 and 1920 px,
  keyboard-only navigation, and reduced motion.

## Repo-scoped skills

All skills live in `.agents/skills/` and are read by **Codex** (`$REPO_ROOT/.agents/skills`)
and **OpenCode** (`.agents/skills`). They are committed with the repo; there is
no global dependency for this project.

- `skills-lock.json` pins every source, hash and agent. Commit it.
- Treat skill folders as vendored. Do **not** hand-edit them.
- Refresh all: `npx skills update -p -y`
- Add another: `npx skills add <owner>/<repo> --agent codex --skill '*' -y --copy`
  (`--agent codex` writes `.agents/skills`, which OpenCode also reads. Do not also
  install for `opencode`, or every skill appears twice.)
- Remove: `npx skills remove <name> -y`

Installed sources:

| Source | Skills |
| --- | --- |
| `mattpocock/skills` | engineering + productivity workflow (ask-matt, grill-with-docs, to-spec, to-tickets, implement, tdd, code-review, prototype, research, handoff, …) |
| `jakubkrehel/skills` | interface craft (better-interface, -ui, -typography, -colors, -layout, -accessibility, -writing, interface-review, variant, break, …) |
| `nutlope/hallmark` | page design/build/audit with slop linting and themes |
| `heygen-com/hyperframes` | HTML→video core set (`hyperframes`, `hyperframes-cli`, `hyperframes-registry`, `media-use`) |
| `google-labs-code/design.md` | no upstream skill; local `design-md` skill wrapping the `@google/design.md` CLI |

## Design work

- Read `DESIGN.md` (root) before any visual change. It is the token source of
  truth; validate with
  `npx -y -p "@google/design.md" designmd lint DESIGN.md`.
- Greeny must match the source deck in `../Web-portfolio/Raw/Greeny`: palette,
  type voice and the app's component shapes. Recreate elements in HTML/CSS/SVG;
  do not paste slide screenshots in their place.
- Building or redesigning a page: use `hallmark`. Polishing or auditing:
  `better-interface` (whole surface) then the focused `better-*` skills.
- Never invent content: no fake employers, projects, metrics, testimonials or
  copy. Ask for real material; mark placeholders clearly in one place.
- Accessibility is a ship gate: keyboard, focus, contrast, reduced motion,
  responsive at 360 px and up.

## Engineering workflow

For anything larger than a one-file change:

1. `grill-with-docs` — resolve the brief, produce glossary/ADRs.
2. `to-spec` → `to-tickets` — spec and tracer-bullet tickets.
3. `implement` (or `implement-spec`) — TDD at the agreed seams.
4. `code-review` — standards + spec axes before commit.

`ask-matt` routes to the right skill when unsure.

## House rules

- Ask before adding a dependency, a framework, or a hosted service.
- Prefer static output and zero client JS unless a feature needs it.
- Every change: run the repo's typecheck/lint/test/build if present, and say
  which ones you ran. If a gate does not exist yet, say so.
- Keep commits scoped and descriptive; do not commit `node_modules`, build
  output, or secrets.
