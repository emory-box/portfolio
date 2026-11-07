# Hi-Fi function demos

The owner requested the eight delivered loops in Hi-Fi, with an explanation
of each feature. Scrolling to a function starts its video; scrolling to
another pauses the previous video. The recordings themselves remain unchanged.

Use the eight validated MP4s from `moti-pulse-recording-loops/renders`, copied
to deployed assets under `projects/moti-pulse/video/`. Keep source dimensions,
posters, muted inline playback and looping. Use relative URLs.
The owner subsequently removed the original-screen disclosure and the
Mockups section. Hi-Fi's eight demos now lead directly to the footer. Remove
the Mockups contents link, unused styles and reveal hooks; retain source assets.

Instructions may describe only actions visible in each supplied recording.
Do not invent product behavior, claims, metrics or copy inside the recordings.

## Behavior

- Select the visible video closest to the viewport center once at least 60%
  of its height is visible (with a viewport-relative allowance for short windows).
- At most one demo plays. Pause all demos outside that active position and
  while the document is hidden. Pause rather than reset playback positions.
- A manual pause persists until the visitor explicitly plays again.
- Desktop pairs share a vertical position: scrolling initially plays the first
  demo in that row. Playing its sibling makes that the active choice; small
  scrolls retain it until another row becomes closer. Mobile scrolls through
  the eight demos individually.
- Manual Play pauses other demos, including with reduced motion enabled.
- Reduced motion disables autoplay; playback controls remain usable. Changing
  the preference pauses playback immediately and updates the help text.
- Failed or blocked autoplay leaves usable controls; no unhandled
  promise rejection. Use `preload="none"` so offscreen media is not fetched.
- No JavaScript: descriptions, posters and native controls remain usable.

## Implementation seams / acceptance tickets

1. Publish and verify all eight video/poster pairs, with matching hashes.
2. Add accessible feature rows and source-backed instructions; preserve the
   existing Hi-Fi heading and introduction.
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

## Layout polish brief

Use the owner's requested `better-ui` values and the existing Moti tokens.
Keep the source introduction, eight feature descriptions and step lists,
recording order, media files and single-player playback behavior. The owner
rejected the initial split introduction and long text/phone rows. Replace
those with a two-column demo gallery and a single-column introduction.
Each feature contains its title and description, a compact phone demo on a
pale-blue surface, then keyboard-expandable instructions labeled "How it
works". Align paired media panels using shared grid tracks. Stack into one
column on narrow screens. Preserve every instruction in its original order.

Give Play/Pause a distinct primary control and optically center its triangle.
Cross-fade the two icons over 300ms using cubic-bezier(0.2, 0, 0, 1), with
scale 0.25–1 and blur 4px–0 only when reduced motion is not requested.
Use opacity alone with reduced motion. Press scales to 0.96 over 150ms
ease-out; disabled controls never scale. Limit hover styling to hover-capable
pointers. Preserve keyboard seeking, sound, fullscreen and native fallback.

Acceptance: check 320, 360, 768, 1280 and 1920px, 200% zoom, growing text,
RTL structure, play/pause icon states and interrupted transitions, reduced
motion, touch hover, native fallback and the existing scroll-playback checks.

## Previous verification

The revised gallery passed browser checks at 320, 360, 640, 768, 1280 and
1920px, mirrored layout, paired-panel alignment and keyboard expansion of
all eight instruction lists. Desktop checks cover row autoplay, manually
choosing either sibling, retaining that choice during small scrolls, manual
pause and switching rows. Mobile checks cover all eight sequential demos,
retained positions, rapid scrolling, hidden tabs, live reduced motion and
blocked autoplay. Enhanced controls, native fallback and fullscreen checks
passed. All eight deployed video hashes still match the delivery files.

All eight deployed MP4 hashes match the validated delivery files. Browser
checks passed single-player scroll selection, rapid switching, retained
positions, manual pause/play, hidden-document pause, live reduced-motion
changes, blocked-autoplay fallback, and no-JavaScript native controls.
Space-key play/pause passed with reduced motion and with JavaScript disabled.
Layouts fit 320, 360, 768, 1280 and 1920 px. Both standards and source-spec reviews found no remaining
issues. JavaScript syntax and whitespace checks passed. DESIGN.md lint reported
zero errors and the 19 existing warnings. No root typecheck/test/build pipeline
is configured.

Presentation checks also passed the enhanced toolbar's keyboard Play/Pause,
seeking, sound toggle, fullscreen/Escape and focus restoration. Fullscreen
keeps its player active even when the page behind it scrolls. Source-level
load errors restore native controls. Pie and bar chart animations still pass.
Unplayed seek tracks use the existing muted token,
with 5.85:1 contrast on white and 5.20:1 on lavender. Encoded MP4 hashes are
unchanged by this presentation refinement.
