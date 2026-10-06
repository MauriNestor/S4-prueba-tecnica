---
name: S4 Academic Bento
colors:
  surface: '#f7f9ff'
  surface-dim: '#d7dadf'
  surface-bright: '#f7f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f4f9'
  surface-container: '#ebeef3'
  surface-container-high: '#e5e8ee'
  surface-container-highest: '#e0e3e8'
  on-surface: '#181c20'
  on-surface-variant: '#444654'
  inverse-surface: '#2d3135'
  inverse-on-surface: '#eef1f6'
  outline: '#747686'
  outline-variant: '#c4c5d6'
  surface-tint: '#3052d2'
  primary: '#1a40c2'
  on-primary: '#ffffff'
  primary-container: '#3b5bdb'
  on-primary-container: '#e2e5ff'
  inverse-primary: '#b8c3ff'
  secondary: '#585f66'
  on-secondary: '#ffffff'
  secondary-container: '#dce3ec'
  on-secondary-container: '#5e656c'
  tertiary: '#005c1f'
  on-tertiary: '#ffffff'
  tertiary-container: '#10772e'
  on-tertiary-container: '#9cfca1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b8c3ff'
  on-primary-fixed: '#001355'
  on-primary-fixed-variant: '#0736ba'
  secondary-fixed: '#dce3ec'
  secondary-fixed-dim: '#c0c7cf'
  on-secondary-fixed: '#151c22'
  on-secondary-fixed-variant: '#41484e'
  tertiary-fixed: '#98f89e'
  tertiary-fixed-dim: '#7ddb84'
  on-tertiary-fixed: '#002107'
  on-tertiary-fixed-variant: '#00531b'
  background: '#f7f9ff'
  on-background: '#181c20'
  surface-variant: '#e0e3e8'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-medium:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
  code-sm:
    fontFamily: monospace
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-sm: 0.75rem
  gutter-lg: 1.5rem
  margin: 1.5rem
  margin-mobile: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style
The design system establishes a focused, calm, and highly structured environment for academic management, timetabling, and faculty administration. It directly serves administrative staff, university coordinators, educators, and students requiring high information density without cognitive clutter.

The aesthetic fuses **Soft UI ergonomics** with the visual balance of a **Bento Grid layout model**. It moves away from clinical, rigid institutional dashboards into a modern, tactile, and approachable interface. Surfaces rely on luminous off-white layered planes, pill-contoured chips, and delicate, diffuse ambient shadows reminiscent of modern Mantine UI design patterns. Contrast levels systematically respect WCAG AA standards, ensuring that data-dense schedules, institutional records, and student rosters remain effortless to parse during long working sessions.

## Colors
The color system emphasizes precision, trustworthiness, and visual clarity across complex data grids and academic schedules.

### Palette Architecture
- **Primary Indigo (`#3b5bdb`)**: Anchors primary actions, current active schedule slots, and key navigation highlights.
  - Hover: `#364fc7`
  - Active: `#2b3fa0`
  - Subtle Surface: `#edf2ff`
  - Border Accents: `#bac8ff`
- **Neutrals & Surfaces**:
  - Canvas / Page Background: `#f8f9fa`
  - Card & Bento Surface: `#ffffff`
  - Primary Typography: `#212529`
  - Secondary / Supporting Typography: `#495057`
  - Muted / Placeholder Text: `#868e96`
  - Structural Borders: `#e9ecef` (subtle) to `#dee2e6` (interactive/inputs)
- **Status & Semantic Contexts**:
  - Success (Aprobado / Activo): `#2b8a3e` (Fondo: `#ebfbee`, Borde: `#b2f2bb`)
  - Destructive / Error (Reprobado / Conflicto de Horario): `#c92a2a` (Fondo: `#fff5f5`, Borde: `#ffc9c9`)
  - Warning (Pendiente / Cupo Lleno): `#e67700` (Fondo: `#fff9db`, Borde: `#ffe066`)
  - Info (Informativo / En Trámite): `#1c7ed6` (Fondo: `#e7f5ff`, Borde: `#a5d8ff`)

All functional status pairings guarantee a contrast ratio of at least 4.5:1 against their designated background tints.

## Typography
The typography balances structural clarity with geometric warmth:
- **Headlines (Plus Jakarta Sans)**: Delivers friendly authority and contemporary academic presence. Used exclusively across dashboard headers, module panels, section dividers, and modal titles.
- **Body & Controls (Inter)**: Handles complex tabular sets, schedules, forms, and analytical summaries with neutral, non-distracting legibility.
- **Identifiers & Codes (Monospace / System Mono)**: Assigned to academic codes (`MATH-101`, `S-0001`, `AULA-304`, folios de matrícula). Rendered with high contrast and slight tracking to avoid character confusion.

## Layout & Spacing
The layout follows a modular **Bento Grid** architecture built on a standard 12-column grid system. Rather than standard continuous vertical feeds, widgets and metrics are housed within self-contained visual tiles that can span 3, 4, 6, 8, or 12 columns.

### Responsive Breakpoints & Reflow
- **Desktop (≥ 1200px)**: 12-column layout with `gutter-lg` (`1.5rem`) and `margin-desktop` (`2rem`). Bento cells hold side-by-side timetables, quick actions, agenda blocks, and metric widgets.
- **Tablet (768px - 1199px)**: 6-column layout with `gutter` (`1.25rem`) and `margin` (`1.5rem`). Multi-column widgets collapse into half-width and full-width modules.
- **Mobile (< 768px)**: 1-column stack layout with `gutter-sm` (`0.75rem`) and `margin-mobile` (`1rem`). Timetable grids convert into horizontal swipe rails or segmented day-cards.

## Elevation & Depth
Depth is realized through soft, ambient multi-layer shadows paired with ultra-subtle borders, avoiding heavy drop shadows or harsh skeuomorphism.

- **Level 0 (Canvas Base)**: `#f8f9fa` flat plane.
- **Level 1 (Bento Tile / Resting Card)**: Pure white background (`#ffffff`), encased in a crisp border `1px solid #e9ecef`, layered with an ambient shadow `0 4px 20px -2px rgba(0, 0, 0, 0.04)`.
- **Level 2 (Hover State / Popovers)**: Elevated cards during cursor interaction or flyout controls. Border shifts to `#dee2e6` with `0 10px 25px -4px rgba(0, 0, 0, 0.06), 0 4px 10px -2px rgba(0, 0, 0, 0.02)`.
- **Level 3 (Modals / Scheduling Drawer Overlays)**: Surface `#ffffff` supported by an ambient scrim `rgba(33, 37, 41, 0.35)` with backdrop blur `4px`, and surface shadow `0 20px 35px -5px rgba(0, 0, 0, 0.1)`.
- **Inner Depth (Search Inputs / Timetable Tracks)**: Subtle inset track styling for empty calendar slots using `box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.03)` with a pale background `#f8f9fa`.

## Shapes
A roundedness level of `2` provides smooth, friendly corners that fit the modern Soft UI language without sacrificing professional structure.

- **Bento Modules & Master Cards**: Styled with `rounded-2xl` (1.25rem / 20px) to establish clean, distinct module boundaries.
- **Inputs, Buttons, and Select Menus**: Built with `rounded-lg` (0.5rem / 8px) for crisp, reliable targets.
- **Pill Badges & Status Chips**: Styled with fully rounded pill radii (`rounded-full` / 9999px) to contrast against structural rectilinear grids.
- **Inner Data Cells / Schedule Blocks**: Use `rounded-md` (0.375rem / 6px) to optimize space inside compact calendar matrices.

## Components

### Botones (Buttons)
- **Primary**: Solid `#3b5bdb` fill with `#ffffff` text, font weight 500, `rounded-lg`. Hover shifts to `#364fc7`. Active deepens to `#2b3fa0`. Focus renders a distinct ring `ring-2 ring-[#bac8ff] ring-offset-2`.
- **Subtle / Secondary**: Light indigo surface (`#edf2ff`), text `#3b5bdb`, border `1px solid transparent`. Hover transitions to `#dbe4ff`.
- **Outline**: Surface `#ffffff`, border `1px solid #dee2e6`, text `#495057`. Hover to `#f8f9fa` with border `#ced4da`.
- **Disabled**: Background `#e9ecef`, text `#adb5bd`, pointer-events none, zero shadow.

### Entradas de Texto y Selectores (Inputs & Selects)
- Mantine-inspired fields: Height 38px (compact) to 42px (default). Background `#ffffff`, border `1px solid #dee2e6`, text `#212529`. Placeholder `#868e96`.
- **Focus State**: Border shifts smoothly to `#3b5bdb` complemented by a crisp focus ring `0 0 0 2px rgba(59, 91, 219, 0.25)`.
- **Error State**: Border shifts to `#c92a2a` with focus ring `0 0 0 2px rgba(201, 42, 42, 0.2)`.

### Etiquetas de Estado (Badges & Status Chips)
- Rendered in pill style with padding `0.25rem 0.65rem`, text `label-md`.
- **Activo / Aprobado**: Background `#ebfbee`, border `1px solid #b2f2bb`, text `#2b8a3e`.
- **En Conflicto / Baja**: Background `#fff5f5`, border `1px solid #ffc9c9`, text `#c92a2a`.
- **Revisión / Pendiente**: Background `#fff9db`, border `1px solid #ffe066`, text `#e67700`.
- **Informativo / General**: Background `#edf2ff`, border `1px solid #bac8ff`, text `#3b5bdb`.

### Casillas de Verificación y Selección Radial (Checkboxes & Radios)
- Box size 18px × 18px, border `1.5px solid #ced4da`, background `#ffffff`, `rounded-md` (4px).
- Checked: Background `#3b5bdb`, border `#3b5bdb`, checkmark `#ffffff`. Soft hover glow.

### Tarjetas Bento (Bento Grid Cards)
- Background `#ffffff`, border `1px solid #e9ecef`, `rounded-2xl`, padding `space-lg`.
- Clear header zone containing a title in `headline-sm`, subtitle/metadata in `label-sm`, and an optional right-aligned pill action.
- Hover animation: Subtle upward translate `-1px` with an expanded soft shadow `0 8px 24px -2px rgba(0, 0, 0, 0.06)`.

### Bloque de Horario / Celda de Clase (Timetable Schedule Blocks)
- Specialized card nested within calendar matrices.
- Background `#edf2ff` with a left border strip `3px solid #3b5bdb`.
- Displays subject name in `body-medium`, classroom and student count in `label-sm`, and course code (`MATH-101`) in `code-sm`.
- Overlaps and room collision alerts trigger an alternate state using `#fff5f5` with border `#c92a2a`.