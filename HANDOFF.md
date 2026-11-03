# Handoff — portfolio prototype (Greeny + Moti-Pulse)

This file is the bridge to a new machine and a new agent. Delete it once its
contents are absorbed.

Read first, in this order: `AGENTS.md` (layout, setup, rules), `DESIGN.md`
(tokens and the three themes), `README.md` (run and deploy).

## Repo

- Current workspace: `D:\portfolio`. The transferred folder did not include Git history.
- Static site, no framework, no build step. GitHub Pages from `main` / `(root)`;
  `.nojekyll` is committed.
- 58 repo-scoped skills are vendored in `.agents/skills/` (Codex and OpenCode
  read this path). `skills-lock.json` pins them.
- Fonts are self-hosted (`assets/fonts/`); no external requests.

## Run

```bash
npx serve .
# http://localhost:3000/                     home
# http://localhost:3000/projects/greeny/     Greeny
# http://localhost:3000/projects/moti-pulse/ Moti-Pulse
```

New machine: `powershell -ExecutionPolicy Bypass -File scripts/setup.ps1`
(Windows) or `bash scripts/setup.sh` (macOS/Linux), then open a new terminal.
It checks Node 22+, installs FFmpeg, Chrome and `puppeteer-core`, confirms the
skills and sets the Codex skill budget.

## What exists

| Page | Theme | State |
| --- | --- | --- |
| `index.html` | `.theme-home` — paper #F2EEE5, ink #191710, vermilion #C9452A | Prototype done: hero, two-project work index, two case cards, approach, closing |
| `projects/greeny/` | no class — dark #191919, green ramp | Full case study: hero dashboard, personas, IoT system, live UI system, 3 rebuilt app screens, brand, notes |
| `projects/moti-pulse/` | `.theme-moti` — source-board gradient, white, #536BFF, #5874ED | Rebuilt from the current board: full research, personas, feature maps, IA, six task flows, 25 sketches, four original hi-fi screens, six original mockup stills |

Shared shell: `assets/css/base.css` (tokens, header, footer, buttons, reveal,
mobile nav). Page styles: `assets/css/home.css`, `projects/*/<slug>.css`.

## Source material

The raw material lives outside the repo at `D:\Web-portfolio\Raw`, with
`Greeny\` and `Moti-pulse\` subfolders. Use these sources for further work;
keep the raw source folder outside Git.

Already extracted into the repo:

- Greeny logo: `projects/greeny/img/logo-mask.png` — alpha mask cut from slide 9,
  357×412, recoloured through CSS `mask`. The wordmark is uppercase `GREENY`.
- Greeny favicon: generated from the same mask.
- Garden photos: `projects/greeny/img/garden-*.jpg` — small crops from the deck,
  only used at their native size (phone cards, ≤295px wide).
- Moti-Pulse logo: `projects/moti-pulse/img/logo.png` — 44×44 crop from the board
  header, displayed at 44px or less.

The user relaxed the "exact logo" rule: final logo files may be supplied later.
If so, replace those two files and keep the CSS sizing.

## Decisions

- Each page owns its palette via a body class; the shell is shared. The home is
  deliberately independent of both projects.
- Real marks, no redrawn logos.
- No invented metrics or claims: Greeny copy comes from the deck; Moti numbers
  (5 interviews, 51 responses, 51% aged 18–22, two personas) come from the board.
  The `Portfolio` wordmark is an explicit placeholder for the owner's name.
- Hallmark floor is followed except two documented waivers in the CSS stamps:
  the case studies exceed 80 words per screen, and the palettes live in page
  theme token blocks rather than `:root` (the linter only scans `:root`).

## Open work (prioritized)

1. **Moti source rebuild completed** — verified 360, 768, 1280 and 1920px with
   no horizontal overflow, missing images, broken anchors or script errors.
   Original charts, sketches and app screens are extracted assets; page text,
   cards, personas and architecture are HTML/CSS. `moti.js` tracks contents and
   collapses the sidebar for wide diagrams. Source asset notes are in
   `projects/moti-pulse/img/README.md`. Current captures: `screenshots/moti-source/`.
2. **Render sweep** — run
   `node .agents/skills/hallmark/scripts/sloplint.mjs <page> --render` on all
   three pages. Static runs currently report only the documented token-block
   and word-count waivers.
3. **Identity** — replace `Portfolio` in the home and both case-study headers;
   add a real contact/about block when the owner supplies it. The Moti-Pulse
   author/team credit is still missing.
4. **Moti source limitations** — the supplied JPEG has no interactive prototype
   or animation, so the six mockups are stills. Chart descriptions preserve the
   relative bar heights without inventing response counts. Some source colors
   have low contrast; fidelity was preserved, so a contrast pass would change
   the supplied design. The source demographic is 51% aged 23–29.
5. **Accessibility** — Moti skip link, keyboard order, contents toggle, reduced
   motion and no-JavaScript visibility were checked. Native screen-reader
   testing and a full contrast audit remain outstanding across the portfolio.
6. **Code-review leftovers** — duplicated hero/footer rules between home and
   Greeny, unused `.mini-card--compact` / `.demo--*` hooks, and the repeat of the
   device-strip markup inside the phone mocks. None block the prototype.
7. **Third project** — follow "Adding a project" in `AGENTS.md`; copy a project
   folder, link `fonts.css` → `base.css` → page CSS, add a theme class, then add
   the project to the home work index, project list and footer.

## Verify quickly

```bash
node scripts/screenshots.mjs "screenshots"      # 360→1920 captures
node .agents/skills/hallmark/scripts/sloplint.mjs index.html projects/moti-pulse/index.html projects/greeny/index.html
```

## Suggested skills for the next agent

- `hallmark` — visual audit and the render sweep; read the CSS stamps first.
- `better-interface`, `better-accessibility`, `better-typography` — polish passes
  on the home and the Moti page.
- `code-review` — for the next meaningful diff, against this commit as the fixed
  point.
- `implement` (and `tdd` only if the site grows behaviour) — for new sections.
- `handoff` — at the end of the next session.

## Git

### New-machine setup (2026-11-03)

- Verified all 58 vendored skills: 57 entries in `skills-lock.json` plus the
  local `design-md` skill.
- Ran `scripts/setup.ps1`: Node 24 and Chrome are available; installed FFmpeg
  and global `puppeteer-core`; configured the Codex skill budget. Open a new
  terminal for FFmpeg's updated PATH.
- Upload destination: `https://github.com/emory-box/portfolio-case-studies`
  (public), authorized by the owner. `emory-box/portfolio` contains a different
  live site and is separate from this project.
- Static sloplint ran on all three pages and reported 55 FAIL, 90 REFLEX and
  11 WARN. The earlier claim that only documented waivers remain is stale.
- There is no package manifest or configured typecheck, test or build command.

Last commits before handoff:

```
feat: add Moti-Pulse case study and a portfolio home identity
refactor: split portfolio into home and per-project case studies
feat: build Greeny case study site
chore: initialize repo with repo-scoped agent skills
```

Worktree was clean apart from this handoff file and three small copy fixes.
