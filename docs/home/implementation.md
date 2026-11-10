# Home and shared project endings

Approved brief: [spec.md](spec.md). No additional owner interview is needed;
the owner explicitly approved dummy personal content and grey image slots.

1. [x] Shared endings: render two other-project cards and a personal footer on
   each case study, preserve Greeny credits, and persist the shared rule.
   Blocked by: none. Verify native routes, correct suggestions and source coverage.
2. [x] Home: build the complete hero/work/about/contact path using the current
   home identity and explicit placeholders. Blocked by: shared data/footer seam.
   Verify real project links and non-interactive missing contact entries.
3. [x] Review and delivery: inspect 360/768/1280/1920, keyboard, 200% text,
   reduced motion, no script, source coverage and the protected project flows.
   Blocked by: both UI slices. Correct findings before reporting completion.

Verified: `check-home-endings.cjs`, `check-site.cjs`, both source-coverage checks,
Greeny case-study, shared navigation (Synergy), Synergy stack and Synergy browser
checks. Authoring is idempotent and a Greeny rebuild preserves the ending.
DESIGN lint has zero errors and the existing 19 warnings. Root has no package
build/typecheck pipeline. Captures remain in `.cache/qa/home-endings/`.

## Reference layout and motion revision — 2026-11-08

- [x] Inspect the actual Sara reference in Chrome; retain our own project content.
- [x] Home-only dark Inter identity, full-screen hero, two scroll-linked feature
  scenes, progressive bio highlight, asymmetric work, contact and expanded footer.
- [x] Native mobile menu, focus restoration, reversible scroll effects, reduced
  motion, no-script flow, short-screen fallback and 200% text.
- [x] Validate static paths, four viewport widths and original project endings.
  Protected SHA256 snapshots confirm all three project HTML files plus shared
  project navigation/endings CSS are unchanged by this home revision.

Checks: check-home-motion.cjs, check-home-endings.cjs, check-site.cjs,
DESIGN lint (0 errors, 19 existing warnings), git diff --check (no errors).
There is no root package build/typecheck pipeline. Authoring uses --home-only;
no dependencies, publishing or commits were added. Screenshots: .cache/qa/home-reference/.

Precommit follow-up: Work reveals now persist after upward scrolling and viewport
resizing; `check-home-motion.cjs` covers that regression. Shared project checks
also verify the approved non-clickable app identity.
