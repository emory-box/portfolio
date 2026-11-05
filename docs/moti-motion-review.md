# Moti-Pulse section motion

Scope: scroll entrances for the project brief and eleven case-study sections,
plus their chart playback and Hi-Fi autoplay. Preserve source content, section
order, artwork geometry, video recordings, layout, hero and Contents behavior.

## Problem and contract

Independent entrance triggers made lower content appear before earlier text.
The browser regression reproduced Problems with heading opacity 0,
introduction opacity 0 and pain-point content opacity 1 in the same frame.
Separately triggered charts and videos could begin while their surrounding
section was still entering.

The owner's latest instruction replaces the former heading/introduction
stagger with two stages:

1. Fade the section's complete content in together over 300ms, ease-out.
   Headings, introduction, prose, static artwork, card surfaces and controls
   share one opacity timeline. No separate delayed child entrances, blur or
   movement. Leave layout geometry unchanged.
2. Once the section is fully visible, allow its existing chart animations and
   Hi-Fi autoplay when the media also meets its own visibility requirement.
   Recheck current visibility at section completion; a stale earlier scroll
   position must not trigger media that the visitor has already passed.

Long sections do not wait for their entire height to fit the viewport. Their
content wrapper starts as its top enters the reading area. Later charts and
videos still wait until their own position qualifies. Diagrams and sketches
share their section's entrance and retain their exact layout.

## Implementation

`moti.js` owns one record per section: pending, revealing or ready. The brief
uses its own element; case-study sections use their existing `.wrap`.
Charts consult that record before starting. Section completion rechecks any
pending charts without requiring another scroll. The video controller also
rechecks on section completion and retains its nearest-visible-demo policy.

- Pie: 85% visible, with the existing short-viewport allowance; sweep first,
  then the existing six legend pops from top to bottom.
- Bar: 95% visible, with the short-viewport allowance; axes/grid fade, then
  columns rise in the established staggered order.
- Hi-Fi: only the visible demo nearest the viewport center autoplays; other
  demos pause. Manual pause, seeking, fullscreen and native fallback remain.
- Each section and chart plays once. Returning upward does not re-hide it.
- Keyboard focus immediately completes its section, including a running
  entrance, so focused controls and links remain visible.
- Reduced motion cancels active effects, shows content and stops autoplay.
  Restoring motion does not re-hide visited or currently visible sections.
- No JavaScript or missing animation/observer APIs leaves content readable.

The state is local to the existing static page script. No runtime dependency,
framework, markup wrapper or external service was added.

## Verification

The targeted browser regression is `.cache/check-section-order.cjs`: it
failed before the fix with `{heading:0,intro:0,body:1}` and passed after the fix
with equal opacity for all three elements.

The staged browser probe `.cache/check-section-motion-stages.cjs` checks
whole-section opacity across nine different content layouts, holds parent
entrances halfway to test chart/video gating, rechecks stale visibility,
and exercises keyboard focus, preference changes, missing APIs, no JavaScript,
downward/reverse scrolling and responsive widths. The probe and captures are
local review artifacts, using the existing Chrome/puppeteer-core installation.

Both targeted probes passed after the fix. The staged probe verified matching
opacity in nine section layouts, charts/video waiting for a paused parent,
immediate playback eligibility after completion, stale-position rejection,
focus and preference handling, missing APIs, no JavaScript, full down/up
scrolling at 360/1280px and reflow at 320/360/768/1280/1920px. It recorded no
script errors. Existing bar-column, pie-motion and Hi-Fi gallery playback
checks also passed, retaining all nine source charts, 36 columns and manual
video pause/sibling behavior.
Separate Standards and Spec reviews reported no actionable findings.

JavaScript syntax and `git diff --check` are the repository's available code
checks; no root typecheck/test/build pipeline is configured. DESIGN.md lint
remains unavailable because automatic approval review hit the account usage
limit. Native screen-reader speech and Firefox/Safari are not verified.
