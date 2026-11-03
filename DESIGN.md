---
version: alpha
name: Greeny
description: Case-study portfolio for Greeny, an IoT smart-garden companion. Dark surface, one living green ramp, Inter for text and Nunito for the display voice.
colors:
  bg: "#191919"
  bg-deep: "#141414"
  surface: "#242424"
  surface-raised: "#2C2C2C"
  surface-high: "#333333"
  line: "#3A3A3A"
  line-soft: "#2E2E2E"
  text: "#F8FBF4"
  text-muted: "#A8B0A6"
  text-dim: "#99A199"
  green-050: "#F8FBF4"
  green-100: "#CFE3B5"
  green-200: "#AFD182"
  green-300: "#8EBE50"
  green-400: "#6C9537"
  green-500: "#4A6425"
  neutral-050: "#FAFAFA"
  neutral-100: "#F1F4F9"
  neutral-200: "#CBD4E1"
  neutral-300: "#94A3B8"
  neutral-400: "#64748B"
  neutral-500: "#475569"
  success: "#6BC214"
  warning: "#FB9C0C"
  info: "#4CC1E2"
  error: "#E0352F"
typography:
  display-xl:
    fontFamily: Nunito
    fontSize: 4.5rem
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: -0.03em
  display-lg:
    fontFamily: Nunito
    fontSize: 3rem
    fontWeight: 800
    lineHeight: 1.06
    letterSpacing: -0.025em
  display-md:
    fontFamily: Nunito
    fontSize: 1.5rem
    fontWeight: 700
    lineHeight: 1.2
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: 500
    lineHeight: 1.4
rounded:
  xs: 6px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  pill: 999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  section: 120px
components:
  phone-frame:
    backgroundColor: "#0C0C0C"
    textColor: "{colors.text}"
    rounded: "{rounded.xl}"
    padding: 10px
  card:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: 16px
  card-deep:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: 14px
  chip-accent:
    backgroundColor: "{colors.green-300}"
    textColor: "{colors.bg-deep}"
    rounded: "{rounded.sm}"
    padding: 6px
  ghost-button:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.pill}"
    padding: 12px
  primary-button:
    backgroundColor: "{colors.green-200}"
    textColor: "{colors.bg-deep}"
    rounded: "{rounded.pill}"
    padding: 14px
---

## Overview

Greeny is a smart-garden ecosystem: a hub, sensors and actuators, and one
mobile app that keeps a garden in reach. The case study is presented on the
same dark surface as the original deck (#191919), with a single green ramp
carrying every accent.

The page is technical and quiet. Interface elements are rebuilt in live HTML
and CSS rather than shown as screenshots, so the product has to be legible at
every size.

## Colors

- **Background (#191919):** the deck's own surface; it keeps the green from
  glowing like a highlighter.
- **Green ramp:** #F8FBF4 → #CFE3B5 → #AFD182 → #8EBE50 → #6C9537 → #4A6425.
  #AFD182 is the default accent; #8EBE50 is the pressed/strong state; the
  darker steps are for large fields and borders, never for small text on dark.
- **Neutrals:** the cool grey scale is reserved for secondary product UI
  (charts, metadata).
- **Semantic:** success #6BC214, warning #FB9C0C, info #4CC1E2, error #E0352F.
  They appear only inside the recreated app, never as page decoration.

## Typography

Inter carries body copy, labels and product UI. Nunito carries the display
voice: wordmark, page headings and the section numerals. Inside a rebuilt app
screen, Nunito may set titles down to 12px, because that is what the original
app does; page chrome never sets it below 20px.

## Themes

The shell in `assets/css/base.css` owns the tokens, header, footer and controls.
Each page overrides the token set with a body class, so one repository carries
several identities without duplicating the chrome:

- **Greeny** (`projects/greeny/`, no body class): dark #191919, green ramp,
  phone-first case study.
- **Portfolio home** (`.theme-home`): paper #F2EEE5, ink #191710, vermilion
  #C9452A. Deliberately independent of every project.
- **Moti-Pulse** (`.theme-moti`): follows the owner's `Desktop - 2.jpg` board:
  white, blue headings #536BFF, blue evidence panels #5874ED, pale blue borders
  #DCEAFF and a lavender/cyan hero gradient. Inter carries all page text. The
  research column is 55.4% of the desktop canvas, capped at 1058px; diagrams,
  sketches and mockups expand to 83.8%, capped at 1600px. A right-side contents
  panel tracks the sections. Mobile reflows cards, personas and mockups into
  one column; original diagrams remain available as full-size images. The
  supplied board overrides the general single-accent and mixed-heading rules
  for this case study. Original product screens and sketches remain source
  artifacts; surrounding page text and components are live HTML/CSS.

Logos are the originals, not redrawn: the Greeny mark is a mask cut from the
deck (`projects/greeny/img/logo-mask.png`), the Moti-Pulse mark is cropped from
its board (`projects/moti-pulse/img/logo.png`). Do not replace them with an
invented mark; the owner may supply final logo files later.

## Layout

A 1200px capped container with growing gutters. Sections are separated by a
hairline (#3A3A3A) rather than a colour change. The phone is the repeating
unit of composition: one in the hero, one per interface screen.

## Elevation & Depth

Depth comes from tone steps (#242424 → #2C2C2C → #333333) and one soft shadow
on the hero phone. No glows, no blurred colour fields.

## Shapes

Rounded rectangles throughout: 6px for chips, 12–16px for cards, 24px for
surfaces, pill for actions. The phone is the only object with a large radius
(40px), so it reads as hardware rather than a card.

## Components

- **Phone frame:** 10px black bezel, 40px radius, notch capsule, status bar.
- **Card:** #2C2C2C surface, 1px #3A3A3A hairline, 12px radius.
- **Chip:** #8EBE50 fill, #141414 text, 6px radius, 12px label.
- **Buttons:** one primary (green pill), one ghost (surface pill). Both have
  full state coverage including focus-visible.

## Do's and Don'ts

- Do keep the accent to controls, data and the mark.
- Do let the recreated app carry the colour; page chrome stays neutral.
- Don't add a second accent hue.
- Don't set headlines in tracked capitals or add an eyebrow above them.
- Don't invent metrics, testimonials or client logos for the case study.
