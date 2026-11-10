# Portfolio — agent guide

A static portfolio: a collection of project case studies. The root page indexes
them; each case study lives in its own folder under `projects/`. No framework,
no build step, deployed to GitHub Pages from the repository root.

## Project specification entry point

Before creating, changing or reviewing a project page, read
[the shared website specification](docs/shared/website-spec.md), then only that
project's local specification and the supporting documents relevant to the task.
The shared file defines scope, approval status and local document entry points.
For new projects, establish their own local specification before page work;
ask the owner for missing project metadata. Apply the shared structure with the
target project's identity. Other projects' local rules stay scoped to them.

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
authoring/greeny/               current Blender source, required base scene, exporter
authoring/moti-pulse/           original diagram + recording-loop sources
scripts/                        setup + static server
scripts/moti/                   diagram and video authoring tools
scripts/qa/                     static, browser and native-model checks
docs/                           current project documentation, indexed by docs/README.md
DESIGN.md                       locked design system (tokens + rationale)
```

`index.html` is the only page GitHub Pages serves at `/`. Every case study is a
folder with its own `index.html`, so URLs stay clean:
`/projects/greeny/`, `/projects/moti-pulse/`.

Each page sets its palette with a body class (`.theme-home`, `.theme-moti`, or
none for Greeny). The shell classes come from `base.css`; page CSS only adds the
theme tokens and page-specific layout.

The home-page header wordmark currently reads **Portfolio**. Replace it with
the owner's name when set. Project headers use the app name according to the
shared website specification.

Logos are the originals: Greeny uses the owner's vector mark
(`projects/greeny/img/logo-mask.svg`), Moti-Pulse uses a crop from its board
(`projects/moti-pulse/img/logo-centered.png`). Use the centered crop for the
home page, case-study header/footer and favicon. Do not redraw them; the owner
may supply final logo files later. Greeny's square `img/favicon.svg` reuses
the supplied mark with the brand-green fill.

## Adding a project

1. Create `projects/<slug>/` with `index.html`, `<slug>.css` and `img/`.
2. Link `../../assets/css/fonts.css`, then `base.css`, then the page stylesheet.
   Follow the shared website specification for the header and Contents. Existing
   markup may provide a structural reference; use the new project's own theme.
   Keep the shared footer conventions.
3. Add a theme class to `<body>` if the project's palette differs from Greeny's,
   and override the tokens on that class in the page stylesheet.
4. Keep every URL relative (`img/...`, `../../assets/...`); never a leading `/`.
5. Add the project to the list in `index.html` (the project list and the work
   index) and to the footer list.
6. Check it at 360, 768, 1280 and 1920 px, then capture:
   `node scripts/qa/screenshots.mjs`
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

**Greeny color-only requests:** read `docs/greeny/color-review.md` first.
Use `scripts/greeny/colors.cjs preview`, send the generated before/after PNG
and wait for explicit approval of that specific draft. Only then run
`approve <draft-id>`. Do not edit `models/colors.json`, replace the fallback,
rebuild Blender or alter the GLB for an unapproved color request. Use the
actual web renderer for the preview, never a generated imitation. Approval
to install this workflow does not approve a demonstration color.

For navigation, start with `README.md`, `docs/README.md` and the relevant
project/authoring README. The live Greeny asset is `models/garden.glb`;
`authoring/greeny/source/garden-base.blend` is a required rebuild input.
Keep authoring inputs outside `projects/`; keep one current web export.
Do not create versioned previews, legacy model exports or duplicate MP4
deliveries unless the owner requests them. History belongs in Git.

Run `node scripts/qa/check-site.cjs` after path changes. For video changes,
run `node scripts/moti/verify-moti-recording-loops.cjs`; for Greeny behavior,
run the two `scripts/qa/check-greeny*.cjs` checks against the local server.
Static serving is `node scripts/serve.cjs` (port 4317 by default).
Ignore temporary renders, waveform/Python caches and captures.

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
