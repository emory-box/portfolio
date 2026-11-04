# Moti-Pulse scroll motion review

Scope: the reading sequence from the hero to the footer, chart entrances,
contents disclosure and Hi-Fi playback. Static HTML/CSS/Web Animations;
AGENTS.md, DESIGN.md and the approved Moti design notes govern the work.
Source wording, narrative order, assets and recorded video content stay intact.

## Observed problems

- Chart titles wait at opacity zero for their chart's visibility threshold.
  At 360×740, a visible bar-title area remains blank while only the chart's
  first 120px are in view (`moti.js`, prepareChartTitle/observeBars).
- Generic entrances start after an element becomes visible. A 12% threshold
  delays the start on tall motivation/persona blocks; whole blocks then move
  20px. Introductions are already static while their section title fades in.
- Generic entrances have no completed-element registry. After a completed
  heading entrance, switching reduced motion on then off triggers it again
  (browser probe recorded two starts for the same Problems heading).
- Pie sweeps start with only 15% of the image visible, spending much of the
  sequence before the visitor sees the chart.
- The shared shell reserves sticky-header scroll padding even though this
  page's header is static. Native centering in a 640×240 window leaves an
  otherwise small pie below its required visible area. Use this page's 24px
  reading offset instead of the shell's header allowance.

## Fix and acceptance slices

1. Reading entrances: prepare semantic groups before they enter; heading then
   its existing introduction 100ms later. Use 300ms ease-out, 12px movement
   and 4px blur for short text. Split long columns/personas into their existing
   semantic blocks. Keep controls, diagrams and image collections directly
   usable. Remember viewed groups; finish immediately on keyboard focus.
2. Charts: show titles as they enter the reading area, before chart playback.
   Keep the bar sequence (axes/grid fade, then staggered columns). Wait for
   85% of each pie (with an allowance for short windows), then sweep followed
   by the existing sequential legend pops. Keep pending pies from briefly
   showing the completed image first. Remember chart visits in reduced motion
   as well as normal motion. Each sequence runs once.
3. Verification: walk down at 360 and 1280px, including a short window, rapid
   jumps, reverse scrolling and preference changes. Check 320/360/768/1280/1920
   reflow, keyboard focus, no JavaScript, missing animation APIs and Hi-Fi
   playback. Reduced motion shows content immediately and stops autoplay.
   Restore visible content if effects are canceled; never re-hide a group
   already visible when motion is enabled again.

Preserve the established hero entrance, contents movement, original chart
values and original video playback contract. This review does not rewrite
the case study or redesign its layout.

## Scope and coverage

This covers animation and the reading flow, not a new layout or copy review.

| Domain | Evidence inspected | Result |
| --- | --- | --- |
| Accessibility | Keyboard focus during waiting/running effects; accessibility-tree control names; initial/live reduced motion; no-JS and missing-API fallbacks | Fixed focus visibility; checks pass |
| Layout | Top-to-bottom/reverse scroll at 360/1280px; reflow at 320/360/768/1280/1920px; 640×240 short-window centering | Fixed inherited header offset; checks pass |
| Writing | Original HTML unchanged; existing source links, control labels and feature instructions retained | Clear within this flow |
| Typography | Self-hosted Inter; settled chart titles and introductions; no persistent blur, movement or hidden text after effects | Clear within this flow |
| Colors | Computed settled foreground/background pairs for prose, titles and video time controls | 4.67:1–15.21:1; tokens unchanged |
| UI | Prepared entrances, 100ms hierarchy, one-time registry, chart thresholds, fast jumps, hover and 10% playback-speed inspection | Fixed sequencing findings; checks pass |

## Findings and fixes

All findings below are resolved in the implementation.

| Severity | Domain | Location | Before | After | Why |
| --- | --- | --- | --- | --- | --- |
| MEDIUM | UI | `projects/moti-pulse/moti.js:195` | Headings fade after surrounding static text is visible; tall blocks begin late | Prepare semantic entrances before entry; heading/intro/content start at 0/100/200ms when arriving together | Reading order stays clear without a visible-to-hidden flash |
| MEDIUM | UI | `projects/moti-pulse/moti.js:26` | Visible chart-title area stays blank until the chart qualifies | Title enters independently; a rapid chart jump finishes the title before drawing | Labels are legible before the chart needs them |
| MEDIUM | UI | `projects/moti-pulse/moti.js:205` | Preference changes replay old headings; reduced-motion visits are not remembered | Remember groups and charts during both preference states; preserve already-visible content | Previously read text and charts stay readable |
| MEDIUM | UI | `projects/moti-pulse/moti.js:83` | Pie sweep starts at 15% visibility; complete image can appear before its sweep | Prepare the pending state and wait for 85%, with a short-window allowance | The visitor sees one coherent sweep and subsequent legend sequence |
| MEDIUM | Accessibility | `projects/moti-pulse/moti.js:251` | A link can receive focus during its transparent/delayed entrance | Finish both waiting and active groups on focus | Keyboard focus remains visible and the link immediately readable |
| MEDIUM | Layout | `projects/moti-pulse/moti.css:20` | Static page inherits a sticky-header scroll allowance | Use the page's 24px reading offset | Short-window centering can reach the chart trigger |
| MEDIUM | UI | `projects/moti-pulse/moti.css:544` | Hover styling can latch after touch input | Gate hover-only rules on hover-capable pointers; preserve open/selected styles | Touch feedback does not resemble a stuck selection |

## Verification

Local browser probes (Chrome, using the existing global puppeteer-core):

- `node .cache/check-moti-scroll-sequence.cjs`: passed heading/introduction
  timings, title-before-chart, one-time playback, focus during both pending
  and active animation, reduced-motion visits, missing APIs, no-JS and full
  downward/upward scroll at 360/1280px. All supported widths reflowed.
- `node .cache/check-moti-motion-access.cjs`: passed 10% animation speed
  inspection, named controls in the accessibility tree, computed contrast,
  640×240 chart triggers and touch-hover gating.
- Existing `check-bar-columns.cjs` and `check-pie-motion.cjs`: original nine
  bar SVG values and 36 columns unchanged; grid precedes column staggering;
  pie masks/legends clean up and motion cancellation leaves content visible.
- Existing Hi-Fi gallery/presentation checks: single active demo, manual
  pause, sibling selection, seeking, sound, fullscreen/focus return and native
  fallback passed. Hero and contents movement retain their existing timelines.
- JavaScript syntax and `git diff --check` passed. DESIGN.md validation:
  zero errors and 19 existing warnings. No root typecheck/test/build pipeline
  exists. The probe scripts and screenshots are local review artifacts.
- Final code reviews: Standards — zero remaining findings; Spec — zero
  remaining findings. Focus lifetime, reduced-motion visit history and rapid
  jumps were corrected and rechecked before the final review.

Not verified: native screen-reader speech, Firefox and Safari. Original
artwork colors and unrelated page flows were not audited for contrast.

Approve for the inspected motion and reading flow; no unresolved findings.
