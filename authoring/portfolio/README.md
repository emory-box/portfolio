# Portfolio home and shared endings

- `content.cjs`: edit profile fields, genuine contact URLs and project summaries.
  Unknown personal facts stay bracketed; missing contact destinations stay null.
  Set `profile.heroImage`, `profile.portrait` and each project's `cover` to a repository-relative image
  path when artwork is ready; null produces the approved grey placeholder.
- `chrome.cjs`: renders the personal footer, two other-project cards and Greeny
  credits. Grey image slots deliberately stand in for unselected covers/portrait.
- `build.cjs`: writes root `index.html` and updates only marked ending/footer
  fragments on existing case studies. It never rewrites project interiors.

Run `node authoring/portfolio/build.cjs` after editing the source. No build is
needed to view or publish the delivered static site. Home direction and shared
rules live in `docs/home/spec.md` and `docs/shared/website-spec.md`.

Greeny's case-study builder preserves `project-credits` outside the generated
chapter group, so either authoring command retains the same page ending.

Home-only regeneration: `node authoring/portfolio/build.cjs --home-only`.
`profile.shortName` supplies the compact scrolled home wordmark.
Home motion and menu use native `assets/js/home.js`; no runtime build is needed.
