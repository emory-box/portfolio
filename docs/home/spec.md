# Portfolio home

## Approved scope

The owner requested layout and scroll effects similar to https://saracommunicates.com/.
The actual reference was inspected in Chrome on 2026-11-08. Use its full-screen
media rhythm, shrinking overlapping features, large scroll-highlight biography,
asymmetric work grid and generous contact/footer composition. Keep our own real
projects and copy; do not copy the reference's identity, artwork or claims.
Unknown personal information remains bracketed dummy copy with one draft notice.
Missing images remain labelled grey slots until the owner supplies artwork.
Read ../shared/website-spec.md for shared endings; other local themes do not apply.

## Home layout and motion

- Home alone uses charcoal #121314, white #F5F5F5 and self-hosted Inter, documented
  in DESIGN.md. Muted bio words remain readable before being highlighted.
- Reading order: full-screen hero; two featured project scenes (Greeny then
  Moti-Pulse); large biography and expandable profile; Work (all three real
  projects); contact; personal footer. Work count derives from the project list.
- Header overlays the hero and stays fixed on home. Full name becomes a short
  name after scrolling. Work/About/Contact are real anchors. Mobile uses a
  keyboard-operable Menu/Close control with Escape and focus restoration.
  This home-only header does not change the non-sticky project navigation rule.
- Hero media shifts gently with scroll. The two featured links stick, shrink
  and overlap as their section passes; native scrolling controls progress.
- Bio words brighten in reading order, reversing with upward scrolling. Work
  cards reveal as whole units, once; focused cards immediately become visible.
- Work uses a 12-column asymmetric grid: first card columns 2–5, second 6–11,
  third 1–8. At mobile width all cards stack. Real type/duration/copy is retained.
- Contact is centered and large; the home footer expands the same personal
  name/role, Info and genuine contact fields into a large owner masthead.
- Reduced motion disables media transforms, pinning and reveals, showing every
  word/card. Short viewports and enlarged root text disable feature pinning.
  With no JavaScript the header/navigation and all content remain usable.
- No scroll interception, wheel locks, new dependencies or hosted services.

## Data and authoring

Edit authoring/portfolio/content.cjs: profile.name, shortName, biography,
heroImage, portrait, genuine contact URLs and project cover paths. Missing contact
URLs render as text, never fake links. Images use repository-relative paths.
Run node authoring/portfolio/build.cjs --home-only for home changes. The command
without that flag also synchronizes the approved project endings. GitHub Pages
serves static files directly; publishing requires no build.

## Acceptance

Check 360/768/1280/1920, 200% text, keyboard, mobile menu, reverse scrolling,
reduced motion and no script. Every real project link must resolve. Existing
project HTML, navigation, Contents, diagrams, models and videos stay unchanged.
