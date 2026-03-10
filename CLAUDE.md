# CLAUDE.md — ADHD Observer

> AI assistant guide for the ADHD Observer repository. Read this before touching any code.

---

## Project Overview

**ADHD Observer** is a Progressive Web App (PWA) for two parents to collaboratively record, categorise, and review daily behavioural observations of their child during an ADHD evaluation. It is built around seven ADHD sign categories and supports two capture modes: a rapid quick-log and a structured daily journal.

This repository is **specification-first**: the full implementation is defined in `SPEC.md` and `DESIGN_SYSTEM.md`. No source code has been written yet. Claude Code is the intended implementer — follow the specifications precisely.

### Reference Documents

| File | Purpose |
|------|---------|
| `SPEC.md` | Single implementation reference — technology stack, project structure, data schema, component specs, feature behaviour, build plan |
| `DESIGN_SYSTEM.md` | Visual/interaction design authority — colour tokens, typography, spacing, component patterns, animation, accessibility |
| `CATALOGUE.md` | ADHD signs catalogue (55 signs across 7 categories) — informational; the data structures for `lib/data/categories.ts` are derived from this |

---

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 15.x |
| Language | TypeScript | 5.x (strict mode) |
| Styling | Tailwind CSS | 3.x + custom design tokens |
| PWA | Serwist (`@serwist/next`) | Latest |
| Database / Auth | Supabase (PostgreSQL + Realtime + Magic Link) | Latest JS client |
| Charts | Recharts | Latest |
| PDF Export | jsPDF | Latest |
| CSV Export | Papaparse | Latest |
| Icons | `@phosphor-icons/react` | Latest |
| Fonts | Google Fonts — Nunito, DM Sans, JetBrains Mono | — |
| Hosting | Vercel | — |

### Bootstrap Commands

```bash
npx create-next-app@latest adhd-observer --typescript --tailwind --app --src-dir --eslint
cd adhd-observer

npm install @supabase/supabase-js @supabase/ssr
npm install @phosphor-icons/react
npm install recharts
npm install jspdf papaparse
npm install serwist @serwist/next

npm install -D @types/papaparse
```

---

## Project Structure

The full source lives under `src/`. Below is the complete planned layout:

```
src/
├── app/
│   ├── layout.tsx                   # Root layout: fonts, metadata, PWA manifest link
│   ├── page.tsx                     # Redirects to /timeline
│   ├── manifest.ts                  # PWA manifest (dynamic)
│   ├── globals.css                  # Tailwind directives + CSS custom properties
│   ├── (auth)/
│   │   ├── login/page.tsx           # Magic link login screen
│   │   └── callback/route.ts        # Supabase auth callback handler
│   └── (app)/
│       ├── layout.tsx               # App shell: tab bar, FAB, auth guard, realtime provider
│       ├── timeline/page.tsx        # Timeline view
│       ├── journal/page.tsx         # Daily journal wizard
│       ├── insights/page.tsx        # Insights dashboard
│       └── settings/page.tsx        # Settings & export
├── components/
│   ├── ui/                          # Primitive UI components
│   │   ├── Button.tsx               # Primary, Secondary, Ghost variants
│   │   ├── Card.tsx                 # Base card with optional category accent
│   │   ├── Chip.tsx                 # Category chip and Sign chip (selectable)
│   │   ├── BottomSheet.tsx          # Animated bottom sheet with backdrop
│   │   ├── IntensitySelector.tsx    # 3-level circle selector
│   │   ├── InputField.tsx           # Styled text input / textarea
│   │   ├── Toast.tsx                # "Got it ✓" confirmation toast
│   │   └── EmptyState.tsx           # Illustrated empty states
│   ├── navigation/
│   │   ├── TabBar.tsx               # Bottom tab bar (4 tabs)
│   │   └── FAB.tsx                  # Floating action button
│   ├── quick-log/
│   │   ├── QuickLogSheet.tsx        # Bottom sheet orchestrator
│   │   ├── CategoryGrid.tsx         # 7-category icon grid (step 1)
│   │   ├── SignPicker.tsx           # Scrollable sign chips (step 2)
│   │   └── IntensityStep.tsx        # Intensity + note (step 3)
│   ├── journal/
│   │   ├── JournalWizard.tsx        # Category walk-through orchestrator
│   │   ├── CategoryCard.tsx         # Per-category sign toggles + intensity
│   │   ├── MoodSelector.tsx         # 1-5 emoji scale
│   │   └── ReflectionField.tsx      # Free-text textarea
│   ├── timeline/
│   │   ├── TimelineFeed.tsx         # Date-grouped observation list
│   │   ├── TimelineEntry.tsx        # Single observation card (expandable)
│   │   └── FilterBar.tsx            # Category, parent, date, intensity filters
│   ├── insights/
│   │   ├── FrequencyChart.tsx       # Weekly bar chart by category
│   │   ├── DayHeatmap.tsx           # Day-of-week observation heatmap
│   │   └── TopSigns.tsx             # Most frequently logged signs
│   └── export/
│       ├── ExportControls.tsx       # Date range picker + export buttons
│       └── PDFReport.tsx            # PDF generation logic
├── lib/
│   ├── supabase/
│   │   ├── client.ts                # Browser Supabase client
│   │   ├── server.ts                # Server Supabase client (RSC/Route handlers)
│   │   ├── middleware.ts            # Auth middleware helpers
│   │   └── realtime.ts             # Realtime subscription hooks
│   ├── data/
│   │   ├── categories.ts            # Category definitions + 55-sign catalogue
│   │   └── types.ts                 # TypeScript interfaces and enums
│   ├── hooks/
│   │   ├── useObservations.ts       # CRUD + realtime for observations
│   │   ├── useJournal.ts            # Journal-specific logic
│   │   ├── useReminder.ts           # Reminder state & scheduling
│   │   └── useOfflineQueue.ts       # IndexedDB offline queue
│   └── utils/
│       ├── dates.ts                 # Date formatting & grouping helpers
│       ├── export.ts                # PDF & CSV generation
│       └── constants.ts             # App-wide constants
├── sw.ts                            # Service worker (Serwist)
└── middleware.ts                    # Next.js middleware (auth redirect)

public/
├── icons/                           # PWA icons (192px, 512px, maskable)
└── splash/                          # Apple splash screens
```

---

## Environment Variables

Create `.env.local` at project root:

```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

These are the only required environment variables. Never commit `.env.local`.

---

## Database Schema (Supabase / PostgreSQL)

### Enums

```sql
CREATE TYPE observation_source AS ENUM ('quick_log', 'journal');
CREATE TYPE observation_context AS ENUM ('home', 'school', 'social', 'bedtime', 'morning', 'other');
CREATE TYPE category_type AS ENUM (
  'inattention', 'hyperactivity', 'impulsivity',
  'emotional', 'social', 'school', 'lessObvious'
);
```

### Tables

**`profiles`** — Extended user data:
- `id` (UUID, FK → `auth.users`)
- `display_name` (text)
- `reminder_time` (time, default `20:00`)
- `push_subscription` (jsonb)

**`observations`** — Individual behavioural logs:
- `id`, `created_at`, `user_id` (FK → profiles)
- `observed_at` (timestamptz) — when the behaviour occurred
- `source` (observation_source)
- `category` (category_type)
- `sign_id` (text) — matches `id` in `categories.ts`
- `sign_label` (text) — denormalised for display
- `intensity` (int2, 1–3)
- `context` (observation_context, nullable)
- `note` (text, nullable)
- `journal_id` (UUID, FK → journals, nullable)

**`journals`** — Daily journal entries per parent:
- `id`, `created_at`, `user_id` (FK → profiles)
- `journal_date` (date)
- `overall_mood` (int2, 1–5)
- `reflection` (text, nullable)
- `completed_at` (timestamptz, nullable)
- Unique constraint: `(user_id, journal_date)`

### Row-Level Security

- Both parents can **read all** observations and journals
- Users can only **insert/update/delete their own** records
- RLS must be enabled on all tables — never disable it

### Realtime

Enable Realtime on `observations` and `journals` tables in the Supabase dashboard. Use Supabase channels in `lib/supabase/realtime.ts` for live sync.

---

## Design System Rules

> Full specification is in `DESIGN_SYSTEM.md`. These are the non-negotiable constraints.

### Colours

- **Never** introduce colours outside the design token system
- All tokens are CSS custom properties in `globals.css` and Tailwind extensions in `tailwind.config.ts`
- Primary brand: `#0D9488` (Teal 600)
- Background: `#FAFAF7` (warm off-white), Surface: `#FFFFFF`
- Error: `#DC7E6B` (soft terracotta) — never harsh red for errors

**Category colours — fixed mapping:**

| Category | Primary | Light | Icon |
|----------|---------|-------|------|
| Inattention | `#6366F1` | `#E0E7FF` | `#4F46E5` |
| Hyperactivity | `#F97316` | `#FFF7ED` | `#EA580C` |
| Impulsivity | `#EF4444` | `#FEF2F2` | `#DC2626` |
| Emotional | `#EC4899` | `#FDF2F8` | `#DB2777` |
| Social | `#8B5CF6` | `#F5F3FF` | `#7C3AED` |
| School | `#0EA5E9` | `#F0F9FF` | `#0284C7` |
| Less Obvious | `#14B8A6` | `#F0FDFA` | `#0D9488` |

### Typography

- `font-display` (Nunito) — headings, display text
- `font-body` (DM Sans) — all body text (default)
- `font-mono` (JetBrains Mono) — timestamps, data

### Spacing & Layout

- 4px base grid — use multiples of 4 for all spacing
- Max content width: **480px**, horizontally centred on larger screens
- iOS safe area insets applied to bottom nav and FAB

### Animations

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entrances |
| `--ease-in` | `cubic-bezier(0.55, 0, 1, 0.45)` | Exits |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bouncy interactions |
| Fast | 150ms | Micro-interactions |
| Normal | 250ms | Sheet transitions |
| Slow | 350ms | Page transitions |

### Accessibility

- Minimum tap target: **44×44px**
- WCAG AA contrast compliance required on all text
- All icon-only buttons must have `aria-label`
- Focus trapping in modals and bottom sheets
- Respect `prefers-reduced-motion` — disable animations when set

---

## Code Conventions

### TypeScript

- Strict mode (`"strict": true`) — no `any`, no type assertions without justification
- Interfaces defined in `lib/data/types.ts` — import from there, do not redeclare
- Functional components only — no class components
- Prefer server components (Next.js 15 App Router); use `'use client'` only when necessary

### React & Next.js

- Use Next.js 15 App Router patterns — `app/` directory, server components by default
- Data fetching: Supabase client directly from components/hooks — no custom API routes needed for basic CRUD
- Auth: Supabase Magic Link only — no password auth, no OAuth
- Route groups: `(auth)` for unauthenticated routes, `(app)` for authenticated routes
- Middleware (`middleware.ts`) handles auth redirects

### Styling

- Tailwind utility classes only — no custom CSS classes except in `globals.css`
- Use design tokens from `tailwind.config.ts` — e.g., `bg-bg`, `text-text-secondary`, `cat-inattention`
- Never hardcode hex values in component files
- Mobile-first responsive design; this is a mobile-first PWA

### Offline Support

- Observations captured offline are queued in IndexedDB via `useOfflineQueue`
- Queue syncs to Supabase when connectivity is restored
- UI must reflect offline state clearly

### Icons

- Library: `@phosphor-icons/react` exclusively
- Category icons: **Duotone** weight
- Action icons (buttons, nav): **Bold** weight
- Size: 24px for actions, 32px for category icons

---

## Tone of Voice (Microcopy)

This app is used by parents during an anxious time. Language must be supportive and non-clinical.

**Avoid:** symptom, diagnosis, problem, disorder, condition
**Use:** observation, sign, evaluation, behaviour, moment

**Examples:**
- "Add an observation" (not "Log a symptom")
- "You noticed something" (not "You recorded a problem")
- "Today's reflections" (not "Daily assessment")
- "Good eye — logged!" (confirmation toast)

---

## Feature Specifications

### Quick Log Flow (target: ≤ 10 seconds, ≥ 4 taps)

1. Tap FAB → QuickLogSheet opens (bottom sheet)
2. Step 1: Select category from 7-icon grid
3. Step 2: Select sign(s) from scrollable chips
4. Step 3: Set intensity (1–3) + optional note
5. Tap "Log it" → saves to Supabase → Toast "Got it ✓" → sheet closes

### Daily Journal Flow

1. Navigate to Journal tab
2. JournalWizard steps through all 7 categories
3. Per category: toggle observed signs + set intensity
4. Final step: overall mood (1–5 emoji) + free-text reflection
5. Submit → creates `journals` record + linked `observations` records

### Timeline

- Chronological feed, newest-first, grouped by date
- Shows observations from **both parents** (realtime updates)
- Expandable cards — tap to see note, context, who logged it
- Filter by: category, parent, date range, intensity

### Insights

- Date range selector (default: last 30 days)
- FrequencyChart: weekly bar chart grouped by category
- DayHeatmap: observation count by day of week
- TopSigns: top 5 most-logged signs with counts

### Export

- PDF: formatted report with header, date range, summary stats, observation table
- CSV: raw observation data (all fields)
- Both generated client-side (jsPDF, Papaparse)

### Reminders

- In-app banner at configured time (default 20:00)
- Optional Web Push via browser Notification API
- Push subscription stored in `profiles.push_subscription`
- Graceful degradation — in-app banner is primary, push is bonus

---

## Build Phases

Implement in this order (from `SPEC.md`):

1. **Phase 1 — Foundation:** Scaffold, Supabase setup, auth flow, UI primitives, tab bar, FAB
2. **Phase 2 — Quick Log:** QuickLogSheet, CategoryGrid, SignPicker, IntensityStep, save to DB
3. **Phase 3 — Daily Journal:** JournalWizard, CategoryCard, MoodSelector, ReflectionField
4. **Phase 4 — Timeline:** TimelineFeed, TimelineEntry, FilterBar, realtime sync
5. **Phase 5 — Insights & Export:** Charts, heatmap, top signs, PDF/CSV export
6. **Phase 6 — Polish:** Reminders, offline queue, PWA optimisation, iOS splash/icons

---

## Important Constraints

- **v1 non-goals:** No dark mode, no teacher role, no photo attachments, no data import, no native app
- **Medical disclaimer:** This is an observation tool — not a diagnostic instrument. The app must include appropriate disclaimers in the settings/about screen
- **Two users only:** The system is designed for exactly two parents sharing one dataset; do not build multi-tenancy
- **No server-side data processing:** All exports are client-side; all analytics are computed client-side from fetched data
- **Supabase free tier constraints:** 500MB DB, 2GB bandwidth/month — keep queries efficient; add appropriate indexes
