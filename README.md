# Portfolio

A static portfolio of project case studies. The root page indexes the work; each
case study is a folder under `projects/`. No framework, no build step, hosted on
GitHub Pages.

Current projects:

- **Greeny** — an IoT smart-garden companion, rebuilt as a live interface
  (`projects/greeny/`).
- **Moti-Pulse** — a goal-motivation app built on FlowTheory research
  (`projects/moti-pulse/`).

## Structure

```
index.html                      the collection: project index
assets/
  css/base.css                  design tokens + shell (header, footer, buttons)
  css/fonts.css                 self-hosted Inter + Nunito
  css/home.css                  home theme only
  js/site.js                    scroll reveal + section nav
  fonts/                        latin variable woff2
projects/
  greeny/                       dark green case study
    index.html
    greeny.css
    img/                        logo mask, favicon, garden crops
  moti-pulse/                   light blue case study
    index.html
    moti.css
    img/                        logo crop
scripts/
  setup.ps1 / setup.sh          new-machine setup
  screenshots.mjs               review captures at 360 to 1920
DESIGN.md                       locked design system (tokens + rationale)
```

## Run locally

```bash
npx serve .
```

Open <http://localhost:3000>. The collection is at `/`, Greeny at
`/projects/greeny/`, Moti-Pulse at `/projects/moti-pulse/`. Any static server
works.

## Add a project

1. Copy the shape of `projects/greeny/` into `projects/<slug>/`.
2. Link `../../assets/css/fonts.css`, `../../assets/css/base.css` and the page
   stylesheet; add a theme class to `<body>` when the palette differs; keep
   every URL relative.
3. Add an `<li>` to the project list and work index in `index.html`, and to the
   footer list.
4. Capture the page with `node scripts/screenshots.mjs`.

`AGENTS.md` has the full checklist, including the token rule.

## Deploy to GitHub Pages

1. Push the repository to GitHub.
2. **Settings → Pages → Build and deployment → Source: Deploy from a branch.**
3. Branch `main`, folder `/(root)`, then Save.
4. The site appears at `https://<user>.github.io/<repo>/`.

Everything uses relative paths and `.nojekyll` is committed, so the nested
project pages work without a build action.

## First run on a new machine

```powershell
# Windows
powershell -ExecutionPolicy Bypass -File scripts/setup.ps1
```

```bash
# macOS / Linux
bash scripts/setup.sh
```

The script checks Node.js 22+, installs FFmpeg (HyperFrames renders), Google
Chrome and `puppeteer-core` (Hallmark browser checks), confirms the vendored
skills and sets the Codex skill budget. See `AGENTS.md` for the manual steps.

## Agent skills

Skills are vendored in `.agents/skills/` and pinned in `skills-lock.json`, so
cloning is enough. Both Codex and OpenCode read that directory. Refresh with
`npx skills update -p -y`; sources are listed in `AGENTS.md`.

## Credits

Greeny was a student UX/UI case study. Team: Tấn Duy, Phương Thanh, Kim Vi,
Minh Hiển. Instructor: Trần Cường Tiến. Garden photography comes from the
original case-study materials; the interface is a rebuild for the web.

Moti-Pulse is a UX research case study, rebuilt from its presentation board.
Both project logos are crops of the original marks, kept in each project's
`img/` folder.

The header wordmark reads **Portfolio** as a placeholder. Replace it with the
owner's name once it is known.
