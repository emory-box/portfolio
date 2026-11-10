# Shared project website specification

## Scope and status

This is the global structural specification for all current and future project
pages under `projects/`. The portfolio home page is outside this header and
Contents contract. It has its own [home specification](../home/spec.md), while
the personal-footer contract below applies to home and project pages. Here,
"global" means shared within this repository.

The owner approved the global/local split, header requirements and Contents
contract below. Greeny is the first implementation. Other existing projects
retain their current markup and behavior until their migration is requested.

## Reading order and ownership

Before creating, changing or reviewing a project page:

1. Read this file and check which requirements are approved or proposed.
2. Read `docs/<slug>/spec.md` when present. Until local entry files are created,
   use the current entry points below and follow only task-relevant references.
3. For a new project, create its local specification from its own source material
   and owner decisions. Obtain the app name, original logo, project type and
   completion duration before finalizing its header.
4. Implement approved shared rules using that project's local visual identity.
   Record any owner-approved exception with its scope in the local specification
   and link it from this file before treating it as a shared-rule exception.
5. Verify the applicable acceptance criteria below and report remaining gaps.

| Project | Current local entry point | Supporting documents when relevant |
| --- | --- | --- |
| Greeny | [Local specification](../greeny/spec.md) | [Case study](../greeny/case-study.md), [scroll story](../greeny/scroll-story.md), [model](../greeny/garden-model.md), [color review](../greeny/color-review.md) |
| Moti-Pulse | [Design](../moti-pulse/design.md) | [Diagrams](../moti-pulse/diagram-redesign.md), [motion](../moti-pulse/motion-review.md), [Hi-Fi](../moti-pulse/hifi-video-spec.md) |
| Synergy | [Case study](../synergy/case-study.md) | Source and authoring references linked from that document |

Shared requirements govern navigation and Contents structure and behavior.
Local specifications govern project content, section order, colors, typography,
surfaces, imagery, diagrams and special interactions. Use only the target
project's local rules. A reference to another project's implementation is not
permission to import its branding, content, scroll effects or media behavior.

Root `DESIGN.md` currently contains shared guidance and named project themes.
Use its shared constraints and the target project's applicable theme; its Greeny
defaults do not define the identity of a new project. Existing local header and
Contents descriptions are historical where they conflict with an approved rule
in this file. Other local rules, including model and content protections, remain
in effect. New owner instructions take precedence and should be recorded in the
document that owns the changed rule.

## Header — approved

### Content and order

| Position | Required content |
| --- | --- |
| Start | Original app logo, followed by the app name; static, non-clickable identity |
| Middle | Owner-provided project type, a thin decorative vertical divider, then completion duration |
| End | `All projects` home link, followed by a thin up-right arrow matching the owner's reference |

Use the owner's actual project-type wording. Ask when the type or duration is
missing; supply neither from assumptions. Preserve original logo geometry and
center the mark optically beside the app name. The home action is a semantic
anchor to `../../index.html`, styled as the header action. Draw its decorative
arrow with a thin diagonal shaft and an open corner pointing up-right (↗),
without an enclosing box; hide the decorative arrow from assistive technology.

The logo and app-name group is display-only. Render it as a non-interactive
element such as `<div class="brand">`, never an anchor, button or simulated
control. Do not add `href`, click handlers, interactive roles, `tabindex`,
pointer cursors or hover/pressed affordances to this group. Keep the app name
as readable text, with decorative logo imagery hidden from assistive technology
when that name already identifies it. Only `All projects` provides the header's
home navigation. This applies to every current and future project page,
including existing pages awaiting the rest of their shared-header migration;
the portfolio home page and project footers remain outside this rule.

### Position and presentation

- Place the header at the top of normal document flow. It scrolls out of view
  with the page and stays there when scrolling upward. Use neither sticky/fixed
  positioning nor scroll-triggered reappearance for this header.
- At wide widths, present the three groups on one row: app identity at the
  start, metadata in the middle, home action at the end.
- At narrow widths or enlarged text, wrap the groups while preserving their
  reading order and full labels. Keep the home action visible and usable.
- Apply the project's own color and type tokens. Shared layout does not impose
  Moti-Pulse's white background, Greeny's green or Synergy's turquoise.
- The reference establishes content hierarchy and the arrow shape. Preserve
  readable spacing, clear separation and consistent alignment as width changes.

### Confirmed metadata for the first rollout

These owner-supplied values are recorded here while local specification entry
files are pending. When moving them into local specifications, replace these
rows with references so each value has one authoritative location.

| App | Project type | Duration |
| --- | --- | --- |
| Moti-Pulse | UX/UI Research Case study | 1 month |
| Greeny | [Defined in Greeny's local specification](../greeny/spec.md#project-navigation) | See local specification |
| Synergy | [Defined in Synergy's local specification](../synergy/case-study.md#project-navigation) | See local specification |

## Contents — approved shared baseline

The owner requested consistent Contents across projects. The current Moti-Pulse
panel is the reference for this approved interaction contract. Its section names,
research groupings, theme and project-specific breakpoint are local details.
The owner approved the first rollout on Greeny after reviewing its actual labels.

- List the actual project's sections in their reading order, with labels and
  optional groups supplied by its local specification. Use native `#id` links
  with unique, stable targets.
- Keep the toggle at the bottom-right of the viewport. The closed toggle shows
  `Contents` and an arrow. Opening hides the visible label and reverses the arrow.
  The arrow stays on the same horizontal line and in the same viewport position.
- Keep the toggle outside the panel background. Let the background wrap the
  centered navigation content with comfortable padding, adapting columns and
  spacing to fit the available viewport without an internal scrollbar.
- Open and close with one continuous horizontal transition. Reversing the
  action mid-transition remains smooth. Reduced motion uses an immediate change.
- Opening leaves the toggle's visual treatment neutral. A subtle current-section
  indicator belongs to the section link, separately from toggle state. Use the
  project's accent color and a light background tint without an underline.
- After the panel is available, only clicking or keyboard-activating its toggle
  changes its open state. Selecting a section, scrolling, resizing and Escape
  preserve that state. Following a link brings its target heading into view and
  moves keyboard focus appropriately while keeping the panel open.
- Use a semantic button with `aria-expanded`, `aria-controls` and an accessible
  name that switches between `Open Contents` and `Close Contents`. Provide a
  labeled navigation region and expose the current section accessibly.
- Without JavaScript, keep the section links available as an inline navigation
  list or native disclosure in the document flow.

Start closed at every viewport width. Each project defines its first content
target in its local specification; Greeny's approved target is Introduction,
after scrollytelling. The control becomes available when that target first
enters the viewport, and remains available afterward. Scrolling never changes
the stored open state. Moti-Pulse's existing 1800px default-open threshold is
not an approved global breakpoint and is not applied to new implementations.

When enlarged text cannot fit all groups in the viewport, keep the same labels
available through chapter/topic views with an explicit topic button and an
`All sections` action. Do not shrink the text, omit links or add an internal
scrollbar. This fallback changes the panel's content view, not its open state.

## Shared implementation

- `assets/css/project-navigation.css`: opt-in `.project-header` layout and
  `.project-contents` presentation using the target project's semantic tokens.
- `assets/js/project-contents.js`: Contents state, responsive fit, native anchor
  navigation/focus and current-section indication. It has no dependencies.
- Add `.project-page` to the project's root `<html>` and load the shared CSS
  after its local styles. The header stays in document flow; `--header-h: 0px`
  represents zero reserved sticky-header space for anchors and scroll stories.
  Header height itself is controlled by the shared layout and wraps naturally.
- Keep identity, metadata and the Contents link list in static HTML. Supply
  the first-appearance selector through `data-start` and actual unique targets
  through native relative hash links. Add the shared JS only to opted-in pages.
- Projects may override `--contents-accent` and `--contents-current-bg` locally;
  do not import another project's palette or typography.
- Preserve subtitle IDs in the project's authoring sources so regeneration
  retains valid Contents targets. Keep links inline and usable without JS.

Greeny and Synergy currently opt in. Moti-Pulse has not yet been migrated.

## Project endings and personal footer — approved

The owner approved the Vistra-style continuation: after each case study's own
content, show **Next projects**, with two cards leading to other real projects.
Each card has a cover area, project name and project type. Exclude the current
project, keep links relative, and include an All projects link to the home work
section. Desktop uses two equal columns; narrow screens stack the cards.
Recommendation covers are grey placeholders until artwork is supplied/selected.

Follow this section with the same personal footer fields across home and case studies:
owner name/role, Work/About/Contact, genuine email/LinkedIn/CV when supplied,
copyright and Back to top. Keep each project's palette and type through semantic
tokens; case studies share the compact structure. Home may expand these same
fields into its own large masthead composition and use its own fixed header,
as defined in docs/home/spec.md. Project credits belong before recommendations,
not in the personal footer. Greeny's original team/guidance/build note is retained
in a separate credits area at the end of its main content.

The owner explicitly permits dummy profile copy and grey image slots in this
draft. Identify unknown facts with brackets and a clear draft notice on home.
Missing contact/profile/document destinations are non-interactive text, never
fake URLs, empty links or disabled-looking working controls. Do not invent
credentials, clients, experience counts or outcomes.

Shared presentation is `assets/css/project-endings.css`. The editable content
and optional static authoring command live in `authoring/portfolio/`; the
`project-recommendations`, `portfolio-footer` and `project-credits` HTML comment
markers preserve each component on regeneration. Deployment needs no build.
Future projects establish their own local spec, join the authoring project list
and use this same ending/footer contract without importing another local theme.

## Shared accessibility and acceptance

For each implementation, verify both the shared contract and the target
project's local requirements:

- All required header fields are source-backed and readable; the home link
  resolves from a nested project URL, including GitHub Pages deployment paths.
- The header stays in document flow during downward and upward scrolling.
- Contents targets exist, match reading order and remain usable by keyboard.
  Toggle focus is visible; the active section is distinguishable without relying
  solely on color. Accessible names and expanded/current states match the UI.
- At 360, 768, 1280 and 1920px, and with 200% text size on a narrow viewport,
  the shared controls remain readable without overlap or horizontal page scroll.
  Check shorter viewports before accepting a Contents layout without scrolling.
- Text contrast, focus contrast and control target size meet WCAG 2.2 AA.
  Reduced motion and disabled JavaScript retain access to project navigation.
- A shared-component change is checked on every affected project. Project
  colors, typography, section order and special interactions remain governed by
  their own specifications.

`node scripts/qa/check-project-navigation.cjs` checks the Greeny rollout's
header, Contents links and persistent state, focus, responsive fit, reduced
motion, 200% text, transition reversal, accessible button name and no-JS view.
Pass `synergy` to the same command to check Synergy's metadata, 21 targets,
compact topic navigation and shared interaction contract. Run relevant project
behavior checks as well when removing sticky-header space.
Publishing and committing remain subject to the owner's task instructions.
