---
name: MindLog Natural MD3
colors:
  surface: '#fafaf2'
  surface-dim: '#dadad3'
  surface-bright: '#fafaf2'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4ec'
  surface-container: '#efeee7'
  surface-container-high: '#e9e8e1'
  surface-container-highest: '#e3e3db'
  on-surface: '#1a1c18'
  on-surface-variant: '#414943'
  inverse-surface: '#2f312c'
  inverse-on-surface: '#f1f1ea'
  outline: '#717973'
  outline-variant: '#c0c9c1'
  surface-tint: '#3a674f'
  primary: '#14422d'
  on-primary: '#ffffff'
  primary-container: '#2d5a43'
  on-primary-container: '#9fcfb2'
  inverse-primary: '#a1d1b4'
  secondary: '#42664f'
  on-secondary: '#ffffff'
  secondary-container: '#c1e9cd'
  on-secondary-container: '#466a53'
  tertiary: '#4e3614'
  on-tertiary: '#ffffff'
  tertiary-container: '#684c28'
  on-tertiary-container: '#e4be91'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bceecf'
  primary-fixed-dim: '#a1d1b4'
  on-primary-fixed: '#002112'
  on-primary-fixed-variant: '#224f39'
  secondary-fixed: '#c4eccf'
  secondary-fixed-dim: '#a8d0b4'
  on-secondary-fixed: '#002111'
  on-secondary-fixed-variant: '#2a4e39'
  tertiary-fixed: '#ffddb6'
  tertiary-fixed-dim: '#e6c093'
  on-tertiary-fixed: '#2a1800'
  on-tertiary-fixed-variant: '#5c421f'
  background: '#fafaf2'
  on-background: '#1a1c18'
  surface-variant: '#e3e3db'
typography:
  display-lg:
    fontFamily: Newsreader
    fontSize: 57px
    fontWeight: '400'
    lineHeight: 64px
    letterSpacing: -0.25px
  headline-lg:
    fontFamily: Newsreader
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Newsreader
    fontSize: 26px
    fontWeight: '400'
    lineHeight: 34px
  headline-md:
    fontFamily: Newsreader
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
  headline-sm:
    fontFamily: Newsreader
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  title-lg:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.15px
  title-sm:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.1px
  body-lg:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0.5px
  body-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0.25px
  body-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.4px
  label-lg:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.1px
  label-md:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.5px
  label-sm:
    fontFamily: Manrope
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.5px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-md: 1.5rem
  gutter-lg: 2rem
  margin: 1rem
  margin-md: 2rem
  margin-lg: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system expresses a grounding, mindful, and safe emotional space. Built on Google Material Design 3 guidelines infused with tactile organic warmth, it replaces sterile clinical interfaces with a comforting warm-paper tactile experience.

### Tone & Personality
- **Grounding & Compassionate:** Soft, empathetic, non-judgmental. Interacting with the interface feels like opening an artisanal unbleached linen notebook.
- **Organic & Restorative:** Inspired by forest bathing, herbal tea, dried botanicals, and raw ceramics.
- **Calm & Unhurried:** Generous negative space, gentle transitions, and soft contrasts prevent sensory overload for users in emotionally vulnerable states.

### Target Audience
Individuals tracking mental health, navigating therapy, practicing mindful reflection, or seeking a quiet, private sanctuary away from high-stimulus feeds and harsh blue light.

## Colors

The palette is rooted in unbleached paper canvases and therapeutic botanical greens. Every surface and interactive tone is calibrated to comply with WCAG 2.1 AA contrast requirements while avoiding harsh pure blacks or stark whites.

### Surface System (Warm Paper Canvas)
- **Surface / Canvas Base:** `#FBF9F4` — Soft warm alabaster base.
- **Surface Dim:** `#F4F0E8` — Recessed containers, muted journal archives.
- **Surface Container (Default):** `#EFECE3` — Default card background, input fields.
- **Surface Container High:** `#E8E4DA` — Elevated modals, floating bottom sheets.
- **Surface Container Highest:** `#E1DDD2` — Hover states, pill chips, active selections.

### Brand & Interactive Accents
- **Primary (`#2D5A43`):** Deep Forest Sage. Used for prominent FABs, primary CTAs, active segmented buttons, and key progress rings.
- **On-Primary (`#FFFFFF`):** High-contrast crisp white typography and iconography over the primary hue.
- **Primary Container (`#D1E7DA`):** Soft leafy green for active state pills, selected mood filters, and date picker selections.
- **On-Primary Container (`#0F2E1E`):** Deep shadowed green for legible text inside primary containers.
- **Secondary (`#587D65`):** Muted Eucalyptus Green. Used for secondary actions, secondary chips, and progress backdrops.
- **Tertiary (`#8C6D46`):** Warm Raw Clay / Ochre. Reserved for reflective milestones, emotional streak badges, and journaling prompts.
- **Outline & Divider (`#D3CEBE` / `#807D74`):** Soft stone outlines with zero harshness.

## Typography

The type system blends the literary grace of an editorial journal with the crisp clarity of a modern digital application.

- **Headlines (Newsreader):** A warm, bookish serif. Its graceful italics and organic curves give entry prompts, mood intros, and calendar summaries the intimate resonance of a private diary.
- **Body & Labels (Manrope):** A geometric, modern sans-serif with humanist proportions. Offers open counters and uniform strokes for fatigue-free reflection, long-form diary entry drafting, and dense emotional stats.
- **Editorial Emphasis:** Diary prompts use `Newsreader` in italics (`headline-sm`, 400 italic) to invite reflective stream-of-consciousness writing.

## Layout & Spacing

Layouts follow an 8pt base grid with a 4pt subgrid for micro-alignments, emphasizing uncluttered breathing room and restful visual pacing.

### Layout Rhythm & Breakpoints
- **Mobile (<600px):** 4-column fluid layout, `margin` of `1rem`, `gutter` of `1rem`. Uses compact vertical scrolling cards and bottom navigation bar.
- **Tablet (600px–1024px):** 8-column layout, `margin-md` of `2rem`, `gutter-md` of `1.5rem`. Introduces side navigation rail and split-pane view (diary list on left, editor on right).
- **Desktop (>1024px):** 12-column layout max-width constrained to `1120px` to maintain comfortable optical line lengths for emotional long-form reading, with `margin-lg` of `3rem` and `gutter-lg` of `2rem`.

### Spacing Usage
- `space-xs` (4px): Micro-spacing between icon and chip label; tag clusters.
- `space-sm` (8px): Gaps between mood selector pills, list item icon paddings.
- `space-md` (16px): Card interior padding, spacing between diary preview paragraphs.
- `space-lg` (24px): Padding around dialogs, spacing between card groups.
- `space-xl` (40px): Section dividers separating diary entries by week/month, hero header margins.

## Elevation & Depth

In alignment with Material Design 3 and the tactile paper metaphor, depth is communicated primarily through **tonal layering** and **warm ambient shadows**, rather than clinical gray drop-shadows.

### Tonal Hierarchy
- **Level 0 (Canvas):** `#FBF9F4` (Surface). Flat, unshaded baseline.
- **Level 1 (Cards, List Groups):** `#EFECE3` (Surface Container). Zero shadow or subtle `0 1px 3px rgba(45, 90, 67, 0.04)`.
- **Level 2 (Active/Hovered Cards):** `#E8E4DA` (Surface Container High) + `0 3px 8px rgba(45, 90, 67, 0.07)`.
- **Level 3 (Floating Action Button & Menus):** Primary or Surface Container Highest + `0 6px 16px rgba(45, 90, 67, 0.12)`.
- **Level 4 (Bottom Sheets, Modal Prompts):** `#FBF9F4` backdrop + `0 12px 28px rgba(32, 48, 38, 0.14)`.

### Shadow Characteristics
All box-shadows are tinted with the brand's forest green undertone (`rgba(45, 90, 67, ...)`) rather than neutral black, yielding an organic, sunlit warmth across layered surfaces.

## Shapes

The shape system adopts a friendly, organic roundedness that softens digital rigidity:
- **Base Components (Cards, Text Fields, Prompts):** `rounded-md` (`0.5rem` / 8px) to `rounded-lg` (`1rem` / 16px).
- **Large Containers (Dialogs, Modal Bottom Sheets, Date Pickers):** `rounded-xl` (`1.5rem` / 24px) for upper corners, evoking soft folder flaps.
- **Interactive Micro-Components (Buttons, Chips, Mood Pills, FABs):** Fully pill-shaped (`9999px`), inviting organic touch interactions.

## Components

### Buttons
- **Primary FAB (New Entry):** Pill-shaped, Primary Forest Green (`#2D5A43`) background with On-Primary (`#FFFFFF`) icon and text. Elevation Level 3.
- **Filled Button:** Height `44px`, pill-shaped, `#2D5A43` background, `#FFFFFF` label (`label-lg`). Press state shifts to `#234634`.
- **Tonal Button:** `#D1E7DA` background with `#0F2E1E` text. Used for secondary actions (e.g., "Save as Draft", "Add Photo").
- **Text Button:** No background, `#2D5A43` text, rounded-md hover overlay in `rgba(45, 90, 67, 0.08)`.

### Chips & Filter Tags
- **Mood Filter Chips:** Height `32px`, pill-shaped.
  - *Unselected:* Background `#EFECE3`, border `1px solid #D3CEBE`, text `#587D65`.
  - *Selected:* Background `#D1E7DA`, border `1px solid transparent`, text `#0F2E1E`, leading checkmark or botanical icon.
- **Prompt Suggestion Chips:** Subtle italicized serif accents inside unbordered `#E8E4DA` pills.

### Text Fields & Journal Editor
- **Diary Writing Canvas:** Borderless, clean warm surface (`#FBF9F4`) with generous `space-lg` padding. The cursor and text selection tint with Primary Sage (`#2D5A43`).
- **Structured Form Inputs:** Filled variant with `#EFECE3` background, `0.5rem` top corner rounding, and a subtle `1px` bottom border in `#807D74` that transitions to a `2px` `#2D5A43` underline on focus.

### Cards & Mood Summaries
- **Journal Preview Card:** Background `#EFECE3`, padding `space-md`, border-radius `1rem`. Displays entry date in `label-sm` muted green, headline excerpt in `Newsreader` (`title-lg`), and subtle mood indicator pill in the top-right corner.
- **Weekly Insight Card:** Background `#F4F0E8` with a subtle left accent border (`4px solid #587D65`). Houses reflective metrics and streak insights.

### Checkboxes, Radios, & Switches
- **Checkboxes & Radios:** Rounded geometry, checked background in `#2D5A43` with clean white checkmark/dot. Unchecked outline in `#807D74`.
- **Mood Sliders / Switches:** Track colored in `#D1E7DA` with a `#2D5A43` thumb. Dragging emits a soft tinted glow.

### Specialized App Components
- **Mood Orb Selector:** Five graduated circular touch targets representing emotional states, rendered in organic tints (Moss, Sage, Sand, Terracotta, Ochre) with active selection indicated by an outer pulsing halo ring.
- **Mindful Streak Badge:** Pill-shaped badge tinted in Tertiary Clay (`#8C6D46`) with an organic leaf/seedling motif.