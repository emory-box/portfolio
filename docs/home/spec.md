# Portfolio home specification

Read ../shared/website-spec.md first. This file governs only Home and its object views.

## Approved source and scope

Latest source: https://www.figma.com/design/8NMst3c890fJWBihmNnBKu/UX-UI-Portfolio?node-id=2880-17264

Current visible frames: Home2727:16249; About2748:16339; Skills2785:16153;
Projects Greeny2876:16313, Moti-Pulse2876:16454, Synergy2876:16595;
Note2877:16361; Play2877:16404. These Screens frames supersede the older
project/Note/Play button and layout variants.
Each frame is1440×1024. UI kit: visible type2845:16173, palette2827:16192,
spacing2827:16196, button examples2853:16715. Hidden older variants are superseded.

The owner clarified that distinct project descriptions belong in the Projects
view of Home. Keep case-study interiors and shared ending copy unchanged.
In content.cjs, homeSummary/homeCover/homeBoard are scoped separately from
the shared description/cover fields. Never invent roles, metrics or findings.

## Typography, palette and controls

- Background#F2F0F3, paper#F8F8F8, ink#464544, shadow#D1D1D3,
  text#242424, yellow#F8C73A. Hello! uses black.
- Montserrat700,128px/1.1 for Hello!; Montserrat600,48px/1.2 uppercase project names.
- Reddit Sans700,64px/1.2 About title; lead700,24px/1.3; body400,24px/1.5.
  Illustration labels400,32px/1.3. Project type300,24px/1.3, summary400,24px/1.5.
- Roboto400: navigation/button labels24px/1.3; duration16px/1.3;
  Skills list20px/24px. Skill headings Reddit Sans700,32px/1.3.
  Empathy uses Roboto400,20px/24px like the other list items, in#242424.
  List items have no bold words. Projects, Note and Play use#464544 text.
- Fonts are self-hosted, Home-scoped. Origins/licenses: assets/fonts/README.md.
- UI kit pills use radius1000px, 24px icons and8px gaps; Large56px with24px
  horizontal padding. Accent yellow by default, ink border on hover, ink/white
  on press. Geometry stays stable. Neutral flat has no permanent border.
  Keyboard focus uses a visible ink ring. Compact targets remain44px where possible.
- Close uses On-Color Large:56px,24px/32px Roboto,24px horizontal padding,
  an8px icon gap and the supplied24px close icon. Its native position is
  (1229,40),141×56; compact layouts keep it visible with48px/44px variants.
- Projects uses Accent Medium, View more and the supplied up-right icon:
  48px height,20px horizontal padding,24px/32px Roboto. Send and Play Again
  use Accent Small:40px height,16px padding,20px/24px Roboto, with the supplied
  mail/replay icons. Copy uses Accent-Flat XSmall:32px height,12px padding,
  16px/20px Roboto, with the supplied copy icon. Preserve each SVG's24px root.

## Native frame layout

- Header owner Emory Phạm is non-clickable. Right order: About, Projects, Contact.
  Shared profile role is UX Designer; genuine contact destinations come from
  `authoring/portfolio/content.cjs`. Contact may expose LinkedIn beside the email
  action without adding a footer to the illustrated Home.
  Header belongs to Home and does not follow the opened views.
- Hello! at(529,276),382×141; avatar(560,334),319.218×349.861.
  Bread(99,230),264.053×233; interactive pan(1056,205),252.721×223.
  Pegboard entry(228,584),169.091×248, label(128,859).
  Note(913,661),283.868×250.485, label(1170,815).
  Ball(918,453),135×119.124; tic-tac-toe(575.5,744.27),225×198.539.
  On hover-capable pointers, Skills, Projects, Send me a note and the pan's
  question mark switch to font-weight700. Keep their existing positions.
- About card(178,279),1084×493,6px ink line,radius60; avatar canvas450×493.197
  at(178,278.9), no yellow disc. Copy starts x628, heading y350, lead after8px,
  prose after24px. Clip(1132,203),180.467×199.669. Retain the owner's one small
  outline gap and complete-copy fade after drawing.
  Retain the1084px card width wherever desktop space permits instead of
  shrinking it proportionally with the1440px canvas. Below that, allow48px
  side gutters before the existing compact layouts take over. Anchor the clip
  to the card's right edge; let the text use the added width. The lead keeps
  its source line break and can use the full text column rather than a359px cap.
  The desktop heading reserves16px before the clip's leading edge and wraps
  when the viewport narrows or text grows. Compact layouts use the full column.
- Moti-Pulse is selected on initial load, with its board state and preview
  synchronized. Preserve the existing list order and subsequent user selections.
- Projects board(70,120),600×880. Supplied three state SVGs already contain
  app-logo cards, shelves and hooks. Keep upright; don't draw extra card frames.
  Transparent accessible tabs overlay logo slots. Hover displays a cropped
  portion of that project's original selected-state board asset, including its
  brand fill and attached border; no offset outline. A click brightens the same
  card briefly for 220ms, then shows the selected board and corresponding copy.
  A newer click, keyboard choice or exit cancels pending feedback/selection.
  Inactive previews are inert/aria-hidden but reserve a shared grid footprint,
  so changing project never moves or rescales the pegboard. Cover(710,131),660×400,
  radius36, without a border. Text starts(710,555). Use a40px project title,
  20px project type,16px duration and18px summary in the native frame, with
  24px between the banner and title. Right-aligned CTA at y908,48px high
  in the native frame, with its bottom at y956 matching the board's visible
  paper edge. Use a shared grid baseline and reserve the SVG's44px bottom
  canvas margin below the CTA. At ordinary and125% text sizes, both columns
  share the same visible top and bottom edges: fit the copy using the compact
  type scale and spacing, rather than pushing the board below the banner.
  Preserve at least24px after the summary. At200% text size, allow the row
  to grow for readable content while retaining the shared bottom edge.
  Contain every supplied banner without cropping. Greeny and Synergy use
  supplied covers. Moti-Pulse uses a direct export of
  its existing live hero, including the title and three original app screens.
  Contain that banner against white so none of its content is cropped. Export
  with node authoring/portfolio/home/capture-moti-cover.cjs while serving locally.
- Project metadata: Greeny/Design with Hardware consideration/2 months;
  Moti-Pulse/UX/UI Research Case study/1 month;
  Synergy/UX/UI Education Case Study./3 months. Source repetition is replaced
  with the owner's actual metadata and source-backed, distinct Home summaries.
- Skills uses current thick bread:1854.1545×1636.1005 canvas at(-207,-185).
  Butter source575.827×541.642. Hard/Soft groups stack on one butter surface,
  gap40px. First three UX skills share a slash-separated row; other items each
  have one row. Keep all six hard and four soft skills in content.cjs.
  Do not display the food reference photograph.

## Motion and preserved behavior

About, Projects, Skills, Note and Play each move their actual original object
and children into the focused view and back. No modal, replacement object or
whole-object crossfade. Existing880ms flight has a continuous handoff and a
1.55× camera cap. Interrupted/reopened motion starts from its current pose.
Borderless Close × stays top-right, with Escape and browser history support.

About: avatar settles, outline/clip reveal480ms, all native copy fades520ms.
Projects: board-state artwork fades only after the original board lands, then
tabs change its state and corresponding preview. Skills: one opaque connected
butter body morphs between supplied contours, highlights clipped inside it.
Closing gathers that same body before the bread returns. Deriving these live
animation paths is owner-authorized; original SVG source files stay intact.

Expanded Note/Play follow the Screens frames above, retaining the vertical
ruled Note and upright original game. Note offers Subject, Message, Send and
Copy. Its email sits in a shadow-grey pill with12px horizontal and7px vertical
padding. Inputs use horizontal rules, without enclosing boxes. The mail-app
helper remains available to assistive technology without a visible extra row.
Send opens the visitor's mail app for review; it does not send automatically.
Email: thanh.pham.work3112@gmail.com. Drafts/game survive Close. Tic-tac-toe
straightens its actual paper and fades demo moves before play on that same grid.
Play's native heading starts at(378.8,166.7); status starts at y768 and the
40px replay button follows with a32px gap. Current grid/demo exports and the
five button icons retain their Figma dimensions and node mappings in
authoring/portfolio/home/assets.cjs. No illustration is redrawn for this update.
The ball and pan are in-place toys, without zoom, hash changes or another view.
The native pan button is named "Flip the egg". Its original13 SVG paths are
referenced in source paint order; the same egg pieces lift, turn over and land
as the pan tilts. A white back face replaces the visible yolk mid-turn, and an
occluded well fill prevents a hole in the pan when the egg leaves. These are
animation helpers authorized by the owner's flip request; pan.svg stays intact.
Keep the original composite visible until its external SVG references load.

Ball motion uses parabolic arcs with descending heights, a little stretch in
the air and progressively softer squash/spread at each contact. Anchor the
squash at the actual painted ball base (50.252%,85.858% of its padded source
canvas), not the center of the button. Repeated clicks during a short gesture
do not restart it or add another animation. Reset toys when entering a view or
changing motion preferences; reduced motion uses opacity-only feedback.
No footer is added to Home.

Initial Home entrance finishes within2000ms: each item fades in over600ms,
with each content group starting175ms after the previous one so they reveal
in a clear sequence: header, Hello!, avatar, Skills, pan, Projects, Note,
tic-tac-toe, then ball. Each arrow follows its corresponding object. Pending
invisible objects do not intercept pointer clicks. Keyboard
focus reveals a pending control immediately. Early navigation or toy activation
cancels the entrance; reduced motion skips it.

## Responsive and delivery

Match1440×1024 native geometry. At smaller widths, contain visible art beneath
Close. At widths up to900px, Projects hides the pegboard and stacks the three
full-width project tabs vertically, with44px minimum hit areas. Show only the
selected project's complete banner and information below those tabs. Short
screens use vertical reading space rather than shrinking text or controls.
On the initial Home at widths up to680px, keep the Projects entry inside its
own left-side zone:3% leading inset,23% stage width, no inherited37% inner
pegboard offset. Its label sits beneath the board with separate vertical room.
The avatar's center zone must remain clear. Preserve each source illustration's
aspect ratio; test painted bounds rather than just transparent SVG canvases.
The one-word display greeting caps to the available mobile width, and the
header can wrap when text is enlarged. Do not mask overflowing artwork to hide
a collision. Desktop source slots remain unchanged.
About reflows. Skills uses native Hard/Soft tabs and short pages when needed,
but ordinary laptop/tablet sizes (1280×720 and 768×900) retain the source's
two stacked groups. Scale full-poster text with the bread while retaining
minimum 16px list items and 24px headings at ordinary text size. Native 1440×1024
keeps exact source type sizes. Enlarged text still uses accessible tabs/pages,
keeping all text on the butter and the whole bread visible. No ordinary scroll
is needed for opened art. Very short Note/Play views may gain vertical reading
space so controls stay usable. At200% text, preserve enlargement and allow
vertical reading space; fitting must not cancel enlarged text.

Support keyboard focus/tablists, live announcements, reduced motion and native
no-JS content/links. Check320/360/768/1280/1920px, short landscape and200% text.
Keep original Figma SVGs local; asset dimensions/nodes are in
`authoring/portfolio/home/assets.cjs`.
Regenerate only Home: node authoring/portfolio/build.cjs --home-only.
No framework, hosted service, runtime build, commit or deployment is implied.
