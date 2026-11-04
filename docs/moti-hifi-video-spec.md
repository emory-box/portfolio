# Hi-Fi function demos

The owner requested the eight delivered loops in Hi-Fi, with an explanation
of each feature. Scrolling to a function starts its video; scrolling to
another pauses the previous video. The recordings themselves remain unchanged.

Use the eight validated MP4s from `moti-pulse-recording-loops/renders`, copied
to deployed assets under `projects/moti-pulse/video/`. Keep source dimensions,
posters, muted inline playback and looping. Use relative URLs.
Preserve the four original Hi-Fi screens in a disclosure after the demos.

Instructions may describe only actions visible in each supplied recording.
Do not invent product behavior, claims, metrics or copy inside the recordings.

## Behavior

- Select the visible video closest to the viewport center once at least 60%
  of its height is visible (with a viewport-relative allowance for short windows).
- At most one demo plays. Pause all demos outside that active position and
  while the document is hidden. Pause rather than reset playback positions.
- A manual pause persists until the visitor explicitly plays again.
- Manual Play pauses other demos, including with reduced motion enabled.
- Reduced motion disables autoplay; playback controls remain usable. Changing
  the preference pauses playback immediately and updates the help text.
- Failed or blocked autoplay leaves usable controls; no unhandled
  promise rejection. Use `preload="none"` so offscreen media is not fetched.
- No JavaScript: descriptions, posters and native controls remain usable.

## Implementation seams / acceptance tickets

1. Publish and verify all eight video/poster pairs, with matching hashes.
2. Add accessible feature rows and source-backed instructions; preserve the
   existing Hi-Fi heading, introduction and original screen artifacts.
3. Add a native-video playback coordinator with a single active selection,
   native pause handling, visibility handling and reduced-motion behavior.
4. Check real scroll playback and rapid switching, manual controls, looping,
   offscreen pauses, browser autoplay fallback, keyboard/no-JS operation,
   and reflow at 320, 360, 768, 1280 and 1920 px. Review standards and spec.

Static HTML/CSS/JavaScript only. No dependency or hosted service is needed.

## Presentation refinement

The owner requested display-only images without hover affordances and a less
dated video presentation. Still-artifact image links are replaced with static
wrappers; paper references and site navigation remain interactive.

Enhanced Hi-Fi players mask only the recordings' outer white canvas to the
phone outline using per-recording poster bounds. The encoded videos, screen
content and colors are unchanged. A slim external toolbar provides Play/Pause,
keyboard seeking, elapsed/duration text, sound and fullscreen. Escape exits
fullscreen and restores focus. Native controls are retained before enhancement,
without JavaScript, and when media errors prevent enhanced playback.

## Completed verification

All eight deployed MP4 hashes match the validated delivery files. Browser
checks passed single-player scroll selection, rapid switching, retained
positions, manual pause/play, hidden-document pause, live reduced-motion
changes, blocked-autoplay fallback, and no-JavaScript native controls.
Space-key play/pause passed with reduced motion and with JavaScript disabled.
Layouts fit 320, 360, 768, 1280 and 1920 px; the original four screens remain
in their disclosure. Both standards and source-spec reviews found no remaining
issues. JavaScript syntax and whitespace checks passed. DESIGN.md lint reported
zero errors and the 19 existing warnings. No root typecheck/test/build pipeline
is configured.

Presentation checks also passed the enhanced toolbar's keyboard Play/Pause,
seeking, sound toggle, fullscreen/Escape and focus restoration. Fullscreen
keeps its player active even when the page behind it scrolls. Source-level
load errors restore native controls. All six static mockups retain their
centering and media heights after image links are removed; pie and bar chart
animations still pass. Unplayed seek tracks use the existing muted token,
with 5.85:1 contrast on white and 5.20:1 on lavender. Encoded MP4 hashes are
unchanged by this presentation refinement.
