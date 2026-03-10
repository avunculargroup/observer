# ADHD Observer — Design System & UI Guide

> **Purpose:** This document is the single source of truth for all visual and interaction design decisions in the ADHD Observer PWA. Claude Code should reference this guide when building any component, screen, or layout. Follow it precisely — do not invent new tokens, override spacing, or introduce colours outside this system.

-----

## 1. Brand Identity

### 1.1 Personality

ADHD Observer is **playful and approachable** — friendly, colourful, but never childish. It should feel like a calm, encouraging companion for parents during what can be an anxious time. Think: a well-designed journaling app that happens to be about behavioural observation.

**Three words:** Supportive. Warm. Clear.

### 1.2 Design Principles

1. **Friction-free capture** — Every interaction should reduce effort. Default to fewer taps, pre-filled options, and smart shortcuts. If a flow takes more than 10 seconds, simplify it.
1. **Calm confidence** — The interface should feel steady and reassuring. No harsh alerts, no aggressive reds, no clinical coldness. Observations are just observations — the app doesn’t judge.
1. **Colour as wayfinding** — The seven ADHD categories each have a distinct colour. Use colour consistently so parents can orient themselves at a glance without reading labels.
1. **Breathe** — Generous whitespace, relaxed spacing, rounded edges. The app should feel unhurried even when the parent is in a rush.

-----

## 2. Colour Palette & Tokens

### 2.1 Core Palette

```
/* ── Brand ── */
--color-primary:          #0D9488;   /* Teal 600 — primary actions, active states */
--color-primary-light:    #5EEAD4;   /* Teal 300 — hover states, light accents */
--color-primary-lighter:  #CCFBF1;   /* Teal 100 — subtle teal backgrounds */
--color-primary-dark:     #0F766E;   /* Teal 700 — pressed states, emphasis */

/* ── Warm Neutrals ── */
--color-bg:               #FAFAF7;   /* Warm off-white — page background */
--color-surface:          #FFFFFF;   /* White — card/sheet backgrounds */
--color-surface-raised:   #F5F3EF;   /* Warm grey — elevated surfaces, input backgrounds */
--color-border:           #E8E4DD;   /* Warm border — cards, dividers */
--color-border-subtle:    #F0EDE7;   /* Very light border — inner dividers */

/* ── Text ── */
--color-text-primary:     #1C1917;   /* Stone 900 — headings, primary text */
--color-text-secondary:   #57534E;   /* Stone 600 — body text, descriptions */
--color-text-tertiary:    #A8A29E;   /* Stone 400 — placeholders, timestamps, metadata */
--color-text-inverse:     #FFFFFF;   /* White text on dark/coloured backgrounds */

/* ── Semantic ── */
--color-success:          #16A34A;   /* Green 600 — confirmations, saved states */
--color-warning:          #F59E0B;   /* Amber 500 — gentle alerts */
--color-error:            #DC7E6B;   /* Soft terracotta — errors (never harsh red) */

/* ── Shadows ── */
--shadow-sm:              0 1px 2px rgba(28, 25, 23, 0.05);
--shadow-md:              0 4px 12px rgba(28, 25, 23, 0.08);
--shadow-lg:              0 8px 24px rgba(28, 25, 23, 0.12);
--shadow-sheet:           0 -4px 24px rgba(28, 25, 23, 0.12);   /* bottom sheets */
```

### 2.2 Category Colours

Each of the seven ADHD categories has a **primary**, **light** (chip/tag background), and **icon** colour. These are the only colours used to represent categories throughout the app — never mix or reassign them.

```
/* Category: Inattention */
--cat-inattention:            #6366F1;   /* Indigo 500 */
--cat-inattention-light:      #E0E7FF;   /* Indigo 100 */
--cat-inattention-icon:       #4F46E5;   /* Indigo 600 */

/* Category: Hyperactivity */
--cat-hyperactivity:          #F97316;   /* Orange 500 */
--cat-hyperactivity-light:    #FFF7ED;   /* Orange 50 */
--cat-hyperactivity-icon:     #EA580C;   /* Orange 600 */

/* Category: Impulsivity */
--cat-impulsivity:            #EF4444;   /* Red 500 (softened in context) */
--cat-impulsivity-light:      #FEF2F2;   /* Red 50 */
--cat-impulsivity-icon:       #DC2626;   /* Red 600 */

/* Category: Emotional Regulation */
--cat-emotional:              #EC4899;   /* Pink 500 */
--cat-emotional-light:        #FDF2F8;   /* Pink 50 */
--cat-emotional-icon:         #DB2777;   /* Pink 600 */

/* Category: Social & Peer */
--cat-social:                 #8B5CF6;   /* Violet 500 */
--cat-social-light:           #F5F3FF;   /* Violet 50 */
--cat-social-icon:            #7C3AED;   /* Violet 600 */

/* Category: School-Specific */
--cat-school:                 #0EA5E9;   /* Sky 500 */
--cat-school-light:           #F0F9FF;   /* Sky 50 */
--cat-school-icon:            #0284C7;   /* Sky 600 */

/* Category: Less Obvious Signs */
--cat-lessObvious:            #14B8A6;   /* Teal 500 */
--cat-lessObvious-light:      #F0FDFA;   /* Teal 50 */
--cat-lessObvious-icon:       #0D9488;   /* Teal 600 */
```

### 2.3 Category Icon Map

Each category uses a **Phosphor** icon in **duotone** weight. The duotone style gives icons a two-tone treatment — the primary stroke uses `--cat-[category]-icon` and the secondary fill uses `--cat-[category]-light`. This adds warmth and visual depth to the category grid without feeling heavy.

|Category            |Phosphor Icon  |Component Import                    |Emoji Fallback|
|--------------------|---------------|------------------------------------|--------------|
|Inattention         |`EarSlash`     |`<EarSlash weight="duotone" />`     |👂             |
|Hyperactivity       |`Lightning`    |`<Lightning weight="duotone" />`    |⚡             |
|Impulsivity         |`Timer`        |`<Timer weight="duotone" />`        |⏳             |
|Emotional Regulation|`Heartbeat`    |`<Heartbeat weight="duotone" />`    |🌊             |
|Social & Peer       |`UsersThree`   |`<UsersThree weight="duotone" />`   |👥             |
|School-Specific     |`GraduationCap`|`<GraduationCap weight="duotone" />`|🏫             |
|Less Obvious Signs  |`PuzzlePiece`  |`<PuzzlePiece weight="duotone" />`  |🧩             |

**Duotone colour application:**

```tsx
// The Phosphor duotone weight renders two layers:
// • Primary layer (strokes/outlines) — inherits the CSS `color` property
// • Secondary layer (fills/shapes) — controlled via the `--ph-duotone-opacity` CSS variable
//
// Set the icon's color to the category icon colour, and use CSS to control fill opacity:

<Lightning
  weight="duotone"
  size={28}
  color="var(--cat-hyperactivity-icon)"
  style={{ '--ph-duotone-opacity': 0.2 } as React.CSSProperties}
/>
```

**Usage rules:**

- Always use `weight="duotone"` for category icons. Use `weight="bold"` for UI action icons (close, back, settings).
- Always pair the icon with its assigned category colour. Never show category icons in grey or without their assigned colour.
- The duotone secondary opacity should be `0.2` in most contexts. In the quick-log category grid, increase to `0.3` for better visibility at larger sizes.

-----

## 3. Typography

### 3.1 Font Stack

```
/* Display & Headings */
--font-display: 'Nunito', sans-serif;

/* Body & UI */
--font-body: 'DM Sans', sans-serif;

/* Monospace (timestamps, data) */
--font-mono: 'JetBrains Mono', monospace;
```

**Load from Google Fonts:**

```html
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
```

### 3.2 Type Scale

All sizes in `rem` (base 16px). Use Tailwind classes where possible.

|Token             |Size            |Weight|Font          |Use                              |
|------------------|----------------|------|--------------|---------------------------------|
|`text-display`    |1.75rem (28px)  |800   |Nunito        |App title, empty states          |
|`text-h1`         |1.375rem (22px) |700   |Nunito        |Screen titles                    |
|`text-h2`         |1.125rem (18px) |700   |Nunito        |Section headings, card titles    |
|`text-h3`         |1rem (16px)     |600   |Nunito        |Subsection headings              |
|`text-body`       |0.9375rem (15px)|400   |DM Sans       |Primary body text                |
|`text-body-medium`|0.9375rem (15px)|500   |DM Sans       |Emphasized body, button labels   |
|`text-small`      |0.8125rem (13px)|400   |DM Sans       |Metadata, timestamps, helper text|
|`text-xs`         |0.6875rem (11px)|500   |DM Sans       |Badges, chip labels, overlines   |
|`text-mono`       |0.8125rem (13px)|400   |JetBrains Mono|Dates, times, counters           |

### 3.3 Line Heights

- Headings (Nunito): `line-height: 1.3`
- Body text (DM Sans): `line-height: 1.6`
- Small / compact UI text: `line-height: 1.4`

-----

## 4. Spacing & Layout Grid

### 4.1 Spacing Scale

Use a consistent 4px base unit. These map to Tailwind’s default spacing scale.

|Token     |Value|Tailwind|Use                                   |
|----------|-----|--------|--------------------------------------|
|`space-1` |4px  |`p-1`   |Inner chip padding, tight gaps        |
|`space-2` |8px  |`p-2`   |Icon-to-label gaps, compact padding   |
|`space-3` |12px |`p-3`   |Card inner padding (compact)          |
|`space-4` |16px |`p-4`   |Standard card padding, section gaps   |
|`space-5` |20px |`p-5`   |Screen horizontal padding             |
|`space-6` |24px |`p-6`   |Section spacing, generous card padding|
|`space-8` |32px |`p-8`   |Major section breaks                  |
|`space-10`|40px |`p-10`  |Screen top/bottom safe padding        |
|`space-12`|48px |`p-12`  |Large empty state spacing             |

### 4.2 Page Layout

```
Screen horizontal padding:     20px (space-5)
Card horizontal padding:       16px (space-4)
Bottom tab bar height:         64px + env(safe-area-inset-bottom)
FAB diameter:                  56px
FAB position:                  bottom-right, 20px from edge, 80px above tab bar
Bottom sheet border-radius:    20px (top-left, top-right)
Max content width:             480px (centred on larger screens)
```

### 4.3 Border Radius Scale

```
--radius-sm:    8px;    /* chips, badges, small inputs */
--radius-md:    12px;   /* cards, buttons */
--radius-lg:    16px;   /* modal cards, elevated surfaces */
--radius-xl:    20px;   /* bottom sheets, full-screen overlays */
--radius-full:  9999px; /* FAB, avatars, pill shapes */
```

-----

## 5. Component Patterns

### 5.1 Cards

Cards are the primary container for content. They sit on `--color-surface` with a `--color-border` 1px border and `--shadow-sm` on rest.

```
Background:      var(--color-surface)
Border:          1px solid var(--color-border)
Border radius:   var(--radius-md) → 12px
Padding:         16px (space-4)
Shadow:          var(--shadow-sm)
Hover/pressed:   var(--shadow-md), border shifts to var(--color-primary-light)
```

**Category cards** (used in journal wizard and quick-log) have a **left accent border** in the category colour:

```
border-left: 4px solid var(--cat-[category])
```

### 5.2 Chips / Tags

Chips represent ADHD signs and category labels. Two variants:

**Category chip** (small label):

```
Background:      var(--cat-[category]-light)
Text colour:     var(--cat-[category]-icon)
Font:            text-xs, font-weight 500
Padding:         4px 10px
Border radius:   var(--radius-full)
```

**Sign chip** (selectable in quick-log and journal):

```
Default state:
  Background:    var(--color-surface-raised)
  Border:        1px solid var(--color-border)
  Text:          var(--color-text-secondary)
  Padding:       8px 14px
  Border radius: var(--radius-sm)

Selected state:
  Background:    var(--cat-[category]-light)
  Border:        1.5px solid var(--cat-[category])
  Text:          var(--cat-[category]-icon)
  Font-weight:   500
```

### 5.3 Floating Action Button (FAB)

The FAB is the entry point for quick-log. It is always visible except when a bottom sheet is open.

```
Size:            56px × 56px
Border radius:   var(--radius-full)
Background:      var(--color-primary)
Icon:            Phosphor 'Plus' icon, weight="bold", 26px, white
Shadow:          var(--shadow-lg)
Position:        fixed, bottom-right (20px inset, 80px above tab bar)

Pressed state:
  Background:    var(--color-primary-dark)
  Transform:     scale(0.95)
  Transition:    150ms ease-out

Animation:
  On mount — gentle scale-in: 0 → 1 over 300ms with ease-out
```

### 5.4 Bottom Sheet

Used for the quick-log flow. Slides up from the bottom with a backdrop.

```
Background:      var(--color-surface)
Border radius:   var(--radius-xl) var(--radius-xl) 0 0
Shadow:          var(--shadow-sheet)
Padding:         space-5 horizontal, space-4 vertical
Max height:      85vh
Handle:          40px × 4px centred bar, var(--color-border), radius-full, top margin 8px

Backdrop:
  Background:    rgba(28, 25, 23, 0.3)
  Backdrop-filter: blur(4px)

Animation:
  Open — slide up from translateY(100%) over 300ms, ease-out
  Close — slide down over 200ms, ease-in
  Backdrop fades in/out with sheet
```

### 5.5 Bottom Tab Bar

Four tabs: Timeline, Journal, Insights, Settings.

```
Background:      var(--color-surface)
Border top:      1px solid var(--color-border)
Height:          64px + env(safe-area-inset-bottom)
Padding bottom:  env(safe-area-inset-bottom)

Tab item:
  Icon:          Lucide, 22px
  Label:         text-xs (11px), font-weight 500
  Gap:           4px between icon and label

  Inactive:      var(--color-text-tertiary)
  Active:        var(--color-primary)

  Active indicator: none (colour change is sufficient)
```

|Tab     |Phosphor Icon          |Active Weight|
|--------|-----------------------|-------------|
|Timeline|`ClockCounterClockwise`|`fill`       |
|Journal |`BookOpen`             |`fill`       |
|Insights|`ChartBar`             |`fill`       |
|Settings|`GearSix`              |`fill`       |

### 5.6 Intensity Selector

A 3-level selector used in quick-log and journal entries.

```
Layout:          3 circles in a horizontal row, 12px gap
Circle size:     36px diameter
Border radius:   var(--radius-full)

Level 1 (Mild):
  Default:       var(--color-surface-raised), 1px border var(--color-border)
  Selected:      var(--cat-[category]-light), 2px border var(--cat-[category])
  Label below:   "Mild"

Level 2 (Moderate):
  Same pattern, slightly larger fill opacity when selected

Level 3 (Strong):
  Same pattern, full category colour fill when selected
  Text colour:   white

Labels:          text-xs, var(--color-text-tertiary), appear below circles
```

### 5.7 Buttons

**Primary button:**

```
Background:      var(--color-primary)
Text:            white, text-body-medium (15px, weight 500)
Padding:         12px 24px
Border radius:   var(--radius-md)
Shadow:          var(--shadow-sm)
Pressed:         var(--color-primary-dark), scale(0.98)
Full-width:      when used as a sheet/form CTA
```

**Secondary button:**

```
Background:      var(--color-surface)
Border:          1.5px solid var(--color-border)
Text:            var(--color-text-primary), text-body-medium
Pressed:         background shifts to var(--color-surface-raised)
```

**Ghost button:**

```
Background:      transparent
Text:            var(--color-primary), text-body-medium
Pressed:         background var(--color-primary-lighter)
Use:             Cancel actions, secondary options
```

### 5.8 Input Fields

```
Background:      var(--color-surface-raised)
Border:          1px solid var(--color-border)
Border radius:   var(--radius-sm)
Padding:         12px 14px
Font:            text-body (15px)
Placeholder:     var(--color-text-tertiary)

Focus state:
  Border:        1.5px solid var(--color-primary)
  Box shadow:    0 0 0 3px var(--color-primary-lighter)
  Background:    var(--color-surface)
```

-----

## 6. Tone of Voice & Microcopy

### 6.1 Principles

- **Supportive, not clinical.** This isn’t a medical chart. Write like a thoughtful friend, not a form.
- **Brief and warm.** Prefer short, kind sentences. Avoid jargon.
- **Non-judgmental.** Observations are neutral data points. The app never implies something is “wrong.”
- **Encouraging consistency.** Gently motivate daily logging without guilt-tripping.

### 6.2 Microcopy Examples

|Context                     |Copy                                                        |
|----------------------------|------------------------------------------------------------|
|Empty timeline              |“Nothing here yet. Tap + to log your first observation.”    |
|Quick-log saved             |“Got it ✓”                                                  |
|Journal complete            |“Nice work — today’s journal is saved.”                     |
|Journal reminder banner     |“How was today? Take a minute to jot down what you noticed.”|
|Skipping a category         |“Nothing to note? No problem — skip ahead.”                 |
|Intensity label: mild       |“Mild — noticed it, but it passed”                          |
|Intensity label: moderate   |“Moderate — it stood out”                                   |
|Intensity label: strong     |“Strong — it really dominated the moment”                   |
|Reflection field placeholder|“Anything else on your mind today?”                         |
|Export screen intro         |“Generate a summary you can share with your child’s doctor.”|
|Error state                 |“Something didn’t save. Tap to try again.”                  |
|Offline indicator           |“You’re offline — observations will sync when you’re back.” |

### 6.3 Words to Avoid

|Avoid              |Prefer                      |
|-------------------|----------------------------|
|Symptom            |Sign, behaviour, observation|
|Diagnosis, disorder|Evaluation, assessment      |
|Problem, issue     |Pattern, thing you noticed  |
|Test, score        |Observation, note           |
|Submit             |Save, Log                   |
|Failed             |Didn’t save, try again      |

-----

## 7. Icon Style Guidance

### 7.1 Icon Library

Use **Phosphor React** (`@phosphor-icons/react`) exclusively. Do not mix icon libraries.

**Installation:** `npm install @phosphor-icons/react`

**Import pattern:**

```tsx
import { Lightning, Timer, Plus, X, CaretLeft } from '@phosphor-icons/react';
```

**Weights available:** `thin`, `light`, `regular`, `bold`, `fill`, `duotone`

**Weight usage by context:**

- **`duotone`** — Category icons (always). The two-tone effect adds personality and pairs with the category colour system.
- **`bold`** — UI action icons (close, back, menu, edit). Heavier stroke reads well at small sizes.
- **`regular`** — Tab bar icons, inline icons, secondary UI elements.
- **`fill`** — Active/selected states only (e.g. active tab bar icon). Never use fill as the default weight.

### 7.2 Icon Sizing

Phosphor icons use the `size` prop (in pixels) and `weight` prop instead of stroke width.

|Context                   |Size|Weight                               |
|--------------------------|----|-------------------------------------|
|Tab bar                   |24px|`regular` (inactive), `fill` (active)|
|Category grid (quick-log) |32px|`duotone`                            |
|Card headers              |22px|`duotone`                            |
|Inline with body text     |18px|`regular`                            |
|FAB icon                  |26px|`bold`                               |
|Action icons (close, back)|22px|`bold`                               |
|Chip/badge icons          |16px|`bold`                               |

### 7.3 Icon Colour Rules

- **Tab bar icons:** `--color-text-tertiary` (inactive), `--color-primary` (active)
- **Category icons:** Always use the category’s `--cat-[category]-icon` colour
- **UI action icons** (close, back, edit): `--color-text-secondary`
- **On primary background** (FAB, primary buttons): white

-----

## 8. Animation & Motion

### 8.1 Timing Functions

```
--ease-out:      cubic-bezier(0.16, 1, 0.3, 1);     /* entrances, reveals */
--ease-in:       cubic-bezier(0.55, 0, 1, 0.45);     /* exits, dismissals */
--ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1);  /* playful bounces — use sparingly */
```

### 8.2 Duration Scale

|Token            |Value|Use                               |
|-----------------|-----|----------------------------------|
|`duration-fast`  |150ms|Button press, colour changes      |
|`duration-normal`|250ms|Card transitions, chip selections |
|`duration-slow`  |350ms|Sheet open/close, page transitions|

### 8.3 Signature Animations

- **Quick-log save:** The save button briefly flashes `--color-success`, the sheet slides down, and a small “Got it ✓” toast fades in at the top for 1.5s.
- **Journal category transition:** Cards crossfade with a subtle 8px horizontal slide.
- **FAB:** Gentle idle pulse (box-shadow breath) every 30 seconds if no observation has been logged today. Stops after the first log.
- **Timeline entry appear:** New entries from the other parent slide in from the left with a 200ms ease-out and a very subtle scale (0.97 → 1).

-----

## 9. Dark Mode (Future)

Dark mode is **not in scope for v1** but the token system is designed to support it. When implemented:

- Swap `--color-bg` to `#1C1917` (Stone 900)
- Swap `--color-surface` to `#292524` (Stone 800)
- Category colours remain the same (they are already mid-saturation and legible on dark)
- Text colours invert: primary → `#F5F5F4`, secondary → `#A8A29E`

-----

## 10. Tailwind Configuration Notes

The project uses **Tailwind CSS**. Extend the default config with the tokens above:

```js
// tailwind.config.js — key extensions
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#0D9488', light: '#5EEAD4', lighter: '#CCFBF1', dark: '#0F766E' },
        surface: { DEFAULT: '#FFFFFF', raised: '#F5F3EF' },
        bg: '#FAFAF7',
        border: { DEFAULT: '#E8E4DD', subtle: '#F0EDE7' },
        cat: {
          inattention:   { DEFAULT: '#6366F1', light: '#E0E7FF', icon: '#4F46E5' },
          hyperactivity: { DEFAULT: '#F97316', light: '#FFF7ED', icon: '#EA580C' },
          impulsivity:   { DEFAULT: '#EF4444', light: '#FEF2F2', icon: '#DC2626' },
          emotional:     { DEFAULT: '#EC4899', light: '#FDF2F8', icon: '#DB2777' },
          social:        { DEFAULT: '#8B5CF6', light: '#F5F3FF', icon: '#7C3AED' },
          school:        { DEFAULT: '#0EA5E9', light: '#F0F9FF', icon: '#0284C7' },
          lessObvious:   { DEFAULT: '#14B8A6', light: '#F0FDFA', icon: '#0D9488' },
        },
      },
      fontFamily: {
        display: ['Nunito', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(28,25,23,0.05)',
        md: '0 4px 12px rgba(28,25,23,0.08)',
        lg: '0 8px 24px rgba(28,25,23,0.12)',
        sheet: '0 -4px 24px rgba(28,25,23,0.12)',
      },
    },
  },
};
```

-----

## 11. Accessibility Checklist

- All interactive elements must have a minimum tap target of **44×44px** (iOS guideline).
- Category colours pass **WCAG AA** contrast against their light backgrounds.
- Never use colour alone to convey information — always pair with an icon or label.
- All images and icons must have `aria-label` or `alt` text.
- Bottom sheet and modals must trap focus and be dismissible via swipe-down or a close button.
- Respect `prefers-reduced-motion` — disable animations and transitions when set.

-----

*End of design system. If a design decision isn’t covered here, choose the option that best aligns with the principles in Section 1.2: friction-free, calm, colour-coded, and spacious.*
