# Hi-Fi function demos

The owner requested the eight delivered loops in Hi-Fi, with an explanation
of each feature. Scrolling to a function starts its video; scrolling to
another pauses the previous video. The recordings themselves remain unchanged.

Use the eight validated MP4s from `moti-pulse-recording-loops/renders`, copied
to deployed assets under `projects/moti-pulse/video/`. Keep source dimensions,
posters, muted inline playback, native controls and looping. Use relative URLs.
Preserve the four original Hi-Fi screens in a disclosure after the demos.

Instructions may describe only actions visible in each supplied recording.
Do not invent product behavior, claims, metrics or copy inside the recordings.

## Behavior

- Select the visible video closest to the viewport center once at least 60%
  of its height is visible (with a viewport-relative allowance for short windows).
- At most one demo plays. Pause all demos outside that active position and
  while the document is hidden. Pause rather than reset playback positions.
- A native manual pause persists until the visitor explicitly plays again.
- Manual Play pauses other demos, including with reduced motion enabled.
- Reduced motion disables autoplay; native controls remain usable. Changing
  the preference pauses playback immediately and updates the help text.
- Failed or blocked autoplay leaves a usable native player; no unhandled
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
