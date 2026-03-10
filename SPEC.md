# ADHD Observer — Implementation Spec

> **Purpose:** This is the single implementation reference for building the ADHD Observer PWA. It is written for Claude Code to consume directly. Every file, component, data structure, and behaviour is specified here. Follow it precisely.

---

## 1. Project Overview

ADHD Observer is a Progressive Web App for two parents to collaboratively record, categorise, and review daily behavioural observations of their six-year-old son during an ADHD evaluation. It is built around seven ADHD sign categories and supports two capture modes: a rapid quick-log and a structured daily journal.

### 1.1 Core Requirements

- Two authenticated users (parents) sharing one dataset in real time
- Quick-log capture in under 10 seconds (4 taps minimum)
- Structured daily journal walking through all seven categories
- Chronological timeline of all observations from both parents
- Simple insights dashboard with frequency charts and pattern recognition
- PDF and CSV export for clinician conversations
- Daily reminder system with in-app banners and optional Web Push
- Offline-first with background sync
- PWA optimised for iOS Safari home screen

### 1.2 Non-Goals for v1

- Dark mode (token system supports it but not implemented)
- Teacher input / third user role
- Photo attachments
- Historical data import
- Native iOS app

---

## 2. Technology Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Framework | Next.js (App Router) | 15.x | Server components, API routes, PWA support |
| Language | TypeScript | 5.x | Strict mode enabled |
| Styling | Tailwind CSS | 3.x | Extended with custom design tokens (see §4) |
| PWA Tooling | Serwist (next-pwa successor) | Latest | Service worker generation, precaching, offline |
| Database | Supabase (PostgreSQL + Realtime) | Latest JS client | Free tier: 500MB DB, 2GB bandwidth |
| Auth | Supabase Magic Link | — | Passwordless email login |
| Charts | Recharts | Latest | Lightweight React charting |
| PDF Export | jsPDF | Latest | Client-side PDF generation |
| CSV Export | Papaparse | Latest | Client-side CSV generation |
| Icons | @phosphor-icons/react | Latest | Duotone weight for categories, bold for actions |
| Fonts | Google Fonts | — | Nunito, DM Sans, JetBrains Mono |
| Hosting | Vercel | — | Zero-config Next.js deployment |

### 2.1 Package Installation

```bash
npx create-next-app@latest adhd-observer --typescript --tailwind --app --src-dir --eslint
cd adhd-observer

# Core dependencies
npm install @supabase/supabase-js @supabase/ssr
npm install @phosphor-icons/react
npm install recharts
npm install jspdf papaparse
npm install serwist @serwist/next

# Dev dependencies
npm install -D @types/papaparse
```

---

## 3. Project Structure

```
src/
├── app/
│   ├── layout.tsx                  # Root layout: fonts, metadata, PWA manifest link
│   ├── page.tsx                    # Redirect to /timeline
│   ├── manifest.ts                 # PWA manifest (dynamic)
│   ├── globals.css                 # Tailwind directives + CSS custom properties
│   ├── (auth)/
│   │   ├── login/page.tsx          # Magic link login screen
│   │   └── callback/route.ts       # Supabase auth callback handler
│   ├── (app)/
│   │   ├── layout.tsx              # App shell: tab bar, FAB, auth guard, realtime provider
│   │   ├── timeline/page.tsx       # Timeline view
│   │   ├── journal/page.tsx        # Daily journal wizard
│   │   ├── insights/page.tsx       # Insights dashboard
│   │   └── settings/page.tsx       # Settings & export
├── components/
│   ├── ui/
│   │   ├── Button.tsx              # Primary, Secondary, Ghost variants
│   │   ├── Card.tsx                # Base card with optional category accent
│   │   ├── Chip.tsx                # Category chip and Sign chip (selectable)
│   │   ├── BottomSheet.tsx         # Animated bottom sheet with backdrop
│   │   ├── IntensitySelector.tsx   # 3-level circle selector
│   │   ├── InputField.tsx          # Styled text input / textarea
│   │   ├── Toast.tsx               # "Got it ✓" confirmation toast
│   │   └── EmptyState.tsx          # Illustrated empty states
│   ├── navigation/
│   │   ├── TabBar.tsx              # Bottom tab bar (4 tabs)
│   │   └── FAB.tsx                 # Floating action button
│   ├── quick-log/
│   │   ├── QuickLogSheet.tsx       # Bottom sheet orchestrator
│   │   ├── CategoryGrid.tsx        # 7-category icon grid (step 1)
│   │   ├── SignPicker.tsx          # Scrollable sign chips (step 2)
│   │   └── IntensityStep.tsx       # Intensity + note (step 3)
│   ├── journal/
│   │   ├── JournalWizard.tsx       # Category walk-through orchestrator
│   │   ├── CategoryCard.tsx        # Per-category sign toggles + intensity
│   │   ├── MoodSelector.tsx        # 1-5 emoji scale
│   │   └── ReflectionField.tsx     # Free-text textarea
│   ├── timeline/
│   │   ├── TimelineFeed.tsx        # Date-grouped observation list
│   │   ├── TimelineEntry.tsx       # Single observation card (expandable)
│   │   └── FilterBar.tsx           # Category, parent, date, intensity filters
│   ├── insights/
│   │   ├── FrequencyChart.tsx      # Weekly bar chart by category
│   │   ├── DayHeatmap.tsx          # Day-of-week observation heatmap
│   │   └── TopSigns.tsx            # Most frequently logged signs
│   └── export/
│       ├── ExportControls.tsx      # Date range picker + export buttons
│       └── PDFReport.tsx           # PDF generation logic
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser Supabase client
│   │   ├── server.ts               # Server Supabase client
│   │   ├── middleware.ts            # Auth middleware
│   │   └── realtime.ts             # Realtime subscription hooks
│   ├── data/
│   │   ├── categories.ts           # Category definitions + sign catalogue
│   │   └── types.ts                # TypeScript interfaces
│   ├── hooks/
│   │   ├── useObservations.ts      # CRUD + realtime for observations
│   │   ├── useJournal.ts           # Journal-specific logic
│   │   ├── useReminder.ts          # Reminder state & scheduling
│   │   └── useOfflineQueue.ts      # IndexedDB offline queue
│   └── utils/
│       ├── dates.ts                # Date formatting & grouping helpers
│       ├── export.ts               # PDF & CSV generation
│       └── constants.ts            # App-wide constants
├── sw.ts                           # Service worker (Serwist)
└── middleware.ts                    # Next.js middleware (auth redirect)

public/
├── icons/                          # PWA icons (192, 512, maskable)
└── splash/                         # Apple splash screens
```

---

## 4. Design System Implementation

Implement the full design system as defined in the companion design system document. Below are the critical implementation details.

### 4.1 CSS Custom Properties (`globals.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Brand */
  --color-primary: #0D9488;
  --color-primary-light: #5EEAD4;
  --color-primary-lighter: #CCFBF1;
  --color-primary-dark: #0F766E;

  /* Warm Neutrals */
  --color-bg: #FAFAF7;
  --color-surface: #FFFFFF;
  --color-surface-raised: #F5F3EF;
  --color-border: #E8E4DD;
  --color-border-subtle: #F0EDE7;

  /* Text */
  --color-text-primary: #1C1917;
  --color-text-secondary: #57534E;
  --color-text-tertiary: #A8A29E;
  --color-text-inverse: #FFFFFF;

  /* Semantic */
  --color-success: #16A34A;
  --color-warning: #F59E0B;
  --color-error: #DC7E6B;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(28, 25, 23, 0.05);
  --shadow-md: 0 4px 12px rgba(28, 25, 23, 0.08);
  --shadow-lg: 0 8px 24px rgba(28, 25, 23, 0.12);
  --shadow-sheet: 0 -4px 24px rgba(28, 25, 23, 0.12);

  /* Category Colours */
  --cat-inattention: #6366F1;
  --cat-inattention-light: #E0E7FF;
  --cat-inattention-icon: #4F46E5;

  --cat-hyperactivity: #F97316;
  --cat-hyperactivity-light: #FFF7ED;
  --cat-hyperactivity-icon: #EA580C;

  --cat-impulsivity: #EF4444;
  --cat-impulsivity-light: #FEF2F2;
  --cat-impulsivity-icon: #DC2626;

  --cat-emotional: #EC4899;
  --cat-emotional-light: #FDF2F8;
  --cat-emotional-icon: #DB2777;

  --cat-social: #8B5CF6;
  --cat-social-light: #F5F3FF;
  --cat-social-icon: #7C3AED;

  --cat-school: #0EA5E9;
  --cat-school-light: #F0F9FF;
  --cat-school-icon: #0284C7;

  --cat-lessObvious: #14B8A6;
  --cat-lessObvious-light: #F0FDFA;
  --cat-lessObvious-icon: #0D9488;

  /* Animation */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in: cubic-bezier(0.55, 0, 1, 0.45);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Radii */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-full: 9999px;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text-primary);
  font-family: 'DM Sans', sans-serif;
}
```

### 4.2 Tailwind Config (`tailwind.config.ts`)

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0D9488',
          light: '#5EEAD4',
          lighter: '#CCFBF1',
          dark: '#0F766E',
        },
        surface: { DEFAULT: '#FFFFFF', raised: '#F5F3EF' },
        bg: '#FAFAF7',
        border: { DEFAULT: '#E8E4DD', subtle: '#F0EDE7' },
        'text-primary': '#1C1917',
        'text-secondary': '#57534E',
        'text-tertiary': '#A8A29E',
        success: '#16A34A',
        warning: '#F59E0B',
        error: '#DC7E6B',
        cat: {
          inattention: { DEFAULT: '#6366F1', light: '#E0E7FF', icon: '#4F46E5' },
          hyperactivity: { DEFAULT: '#F97316', light: '#FFF7ED', icon: '#EA580C' },
          impulsivity: { DEFAULT: '#EF4444', light: '#FEF2F2', icon: '#DC2626' },
          emotional: { DEFAULT: '#EC4899', light: '#FDF2F8', icon: '#DB2777' },
          social: { DEFAULT: '#8B5CF6', light: '#F5F3FF', icon: '#7C3AED' },
          school: { DEFAULT: '#0EA5E9', light: '#F0F9FF', icon: '#0284C7' },
          lessObvious: { DEFAULT: '#14B8A6', light: '#F0FDFA', icon: '#0D9488' },
        },
      },
      fontFamily: {
        display: ['Nunito', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
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
  plugins: [],
};

export default config;
```

### 4.3 Fonts (Root Layout `<head>`)

```html
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
```

### 4.4 Typography Scale

| Token | Size | Weight | Font | Tailwind Class |
|-------|------|--------|------|----------------|
| `text-display` | 28px / 1.75rem | 800 | Nunito | `font-display text-[1.75rem] font-extrabold` |
| `text-h1` | 22px / 1.375rem | 700 | Nunito | `font-display text-[1.375rem] font-bold` |
| `text-h2` | 18px / 1.125rem | 700 | Nunito | `font-display text-[1.125rem] font-bold` |
| `text-h3` | 16px / 1rem | 600 | Nunito | `font-display text-base font-semibold` |
| `text-body` | 15px / 0.9375rem | 400 | DM Sans | `font-body text-[0.9375rem]` |
| `text-body-medium` | 15px / 0.9375rem | 500 | DM Sans | `font-body text-[0.9375rem] font-medium` |
| `text-small` | 13px / 0.8125rem | 400 | DM Sans | `font-body text-[0.8125rem]` |
| `text-xs` | 11px / 0.6875rem | 500 | DM Sans | `font-body text-[0.6875rem] font-medium` |
| `text-mono` | 13px / 0.8125rem | 400 | JetBrains Mono | `font-mono text-[0.8125rem]` |

**Line heights:** Headings `leading-[1.3]`, Body `leading-[1.6]`, Compact UI `leading-[1.4]`.

### 4.5 Icon Usage

| Context | Size | Weight | Colour |
|---------|------|--------|--------|
| Tab bar (inactive) | 24px | `regular` | `text-tertiary` |
| Tab bar (active) | 24px | `fill` | `primary` |
| Category grid (quick-log) | 32px | `duotone` | `cat-[category]-icon` |
| Card headers | 22px | `duotone` | `cat-[category]-icon` |
| Inline with body text | 18px | `regular` | Contextual |
| FAB icon | 26px | `bold` | White |
| Action icons (close, back) | 22px | `bold` | `text-secondary` |
| Chip/badge icons | 16px | `bold` | Contextual |

**Duotone opacity:** Set `--ph-duotone-opacity: 0.2` (default), `0.3` in category grid.

**Category → Icon map:**

| Category | Phosphor Icon | Emoji Fallback |
|----------|--------------|----------------|
| Inattention | `EarSlash` | 👂 |
| Hyperactivity | `Lightning` | ⚡ |
| Impulsivity | `Timer` | ⏳ |
| Emotional Regulation | `Heartbeat` | 🌊 |
| Social & Peer | `UsersThree` | 👥 |
| School-Specific | `GraduationCap` | 🏫 |
| Less Obvious Signs | `PuzzlePiece` | 🧩 |

**Tab bar → Icon map:**

| Tab | Phosphor Icon |
|-----|--------------|
| Timeline | `ClockCounterClockwise` |
| Journal | `BookOpen` |
| Insights | `ChartBar` |
| Settings | `GearSix` |

---

## 5. Data Model

### 5.1 Supabase Schema (SQL)

```sql
-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES
-- ============================================
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text not null,
  email text not null,
  reminder_time time,               -- e.g. '20:30:00'
  push_subscription jsonb,          -- Web Push subscription object
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can read own household profiles"
  on profiles for select
  using (true);  -- Both parents can see each other

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- ============================================
-- OBSERVATIONS
-- ============================================
create type observation_source as enum ('quick_log', 'journal');
create type observation_context as enum ('home', 'school', 'social', 'other');
create type category_type as enum (
  'inattention',
  'hyperactivity',
  'impulsivity',
  'emotional',
  'social',
  'school',
  'lessObvious'
);

create table observations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  source observation_source not null,
  journal_id uuid,                   -- Links to parent journal entry (null for quick logs)
  category category_type not null,
  sign_id text not null,             -- References sign key from catalogue (e.g. 'inattention_01')
  sign_label text not null,          -- Human-readable sign label
  intensity smallint not null check (intensity between 1 and 3),
  note text,
  context observation_context default 'home',
  observed_at timestamptz default now(),
  created_at timestamptz default now(),
  synced boolean default true        -- false when created offline
);

alter table observations enable row level security;

create policy "Household can read all observations"
  on observations for select using (true);

create policy "Users can insert own observations"
  on observations for insert
  with check (auth.uid() = user_id);

create policy "Users can update own observations"
  on observations for update
  using (auth.uid() = user_id);

create policy "Users can delete own observations"
  on observations for delete
  using (auth.uid() = user_id);

-- Index for timeline queries
create index idx_observations_observed_at on observations(observed_at desc);
create index idx_observations_category on observations(category);
create index idx_observations_user on observations(user_id);
create index idx_observations_journal on observations(journal_id);

-- ============================================
-- JOURNALS
-- ============================================
create table journals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  journal_date date not null,
  mood smallint check (mood between 1 and 5),    -- 1-5 emoji scale
  energy smallint check (energy between 1 and 5),
  reflection text,
  completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  unique(user_id, journal_date)      -- One journal per parent per day
);

alter table journals enable row level security;

create policy "Household can read all journals"
  on journals for select using (true);

create policy "Users can insert own journals"
  on journals for insert
  with check (auth.uid() = user_id);

create policy "Users can update own journals"
  on journals for update
  using (auth.uid() = user_id);

-- ============================================
-- REALTIME
-- ============================================
-- Enable realtime on observations and journals
alter publication supabase_realtime add table observations;
alter publication supabase_realtime add table journals;
```

### 5.2 TypeScript Types (`lib/data/types.ts`)

```typescript
export type CategoryKey =
  | 'inattention'
  | 'hyperactivity'
  | 'impulsivity'
  | 'emotional'
  | 'social'
  | 'school'
  | 'lessObvious';

export type ObservationSource = 'quick_log' | 'journal';
export type ObservationContext = 'home' | 'school' | 'social' | 'other';
export type Intensity = 1 | 2 | 3;
export type Mood = 1 | 2 | 3 | 4 | 5;

export interface Sign {
  id: string;           // e.g. 'inattention_01'
  category: CategoryKey;
  label: string;        // e.g. "Seems not to listen when spoken to directly"
  description: string;  // Extended description from catalogue
  emoji: string;        // Emoji from catalogue
}

export interface Category {
  key: CategoryKey;
  label: string;
  signs: Sign[];
  color: string;        // CSS variable name, e.g. 'cat-inattention'
  icon: string;         // Phosphor icon name
  emoji: string;        // Fallback emoji
}

export interface Observation {
  id: string;
  user_id: string;
  source: ObservationSource;
  journal_id: string | null;
  category: CategoryKey;
  sign_id: string;
  sign_label: string;
  intensity: Intensity;
  note: string | null;
  context: ObservationContext;
  observed_at: string;  // ISO timestamp
  created_at: string;
  synced: boolean;
  // Joined fields
  profile?: Profile;
}

export interface Journal {
  id: string;
  user_id: string;
  journal_date: string; // YYYY-MM-DD
  mood: Mood | null;
  energy: Mood | null;
  reflection: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
  // Related
  observations?: Observation[];
  profile?: Profile;
}

export interface Profile {
  id: string;
  display_name: string;
  email: string;
  reminder_time: string | null;
  created_at: string;
}
```

### 5.3 Sign Catalogue (`lib/data/categories.ts`)

This file defines all 55 signs across 7 categories. Each sign has a stable ID that is stored in the database. The full content is derived from the reference catalogue document.

```typescript
import { Category, CategoryKey, Sign } from './types';

export const CATEGORIES: Record<CategoryKey, Category> = {
  inattention: {
    key: 'inattention',
    label: 'Inattention',
    icon: 'EarSlash',
    emoji: '👂',
    color: 'cat-inattention',
    signs: [
      {
        id: 'inattention_01',
        category: 'inattention',
        label: "Seems not to listen when spoken to directly",
        description: "You call his name multiple times and he appears to be in his own world, even when there are no obvious distractions.",
        emoji: '👂',
      },
      {
        id: 'inattention_02',
        category: 'inattention',
        label: "Difficulty following multi-step instructions",
        description: "Struggles to complete a sequence like 'put on your shoes, grab your backpack, and meet me at the door.'",
        emoji: '📚',
      },
      {
        id: 'inattention_03',
        category: 'inattention',
        label: "Loses things constantly",
        description: "Jackets, shoes, lunchboxes, toys, school papers — they go missing with remarkable regularity.",
        emoji: '🔍',
      },
      {
        id: 'inattention_04',
        category: 'inattention',
        label: "Difficulty sustaining attention on tasks",
        description: "Worksheets, homework, chores, or even board games become abandoned midway.",
        emoji: '🎯',
      },
      {
        id: 'inattention_05',
        category: 'inattention',
        label: "Easily distracted by irrelevant stimuli",
        description: "A bird outside the window, a distant sound — things other children would filter out pull his focus away instantly.",
        emoji: '💨',
      },
      {
        id: 'inattention_06',
        category: 'inattention',
        label: "Trouble organising tasks and activities",
        description: "Getting ready for school, packing a bag, or tidying up a room feels overwhelming.",
        emoji: '🧩',
      },
      {
        id: 'inattention_07',
        category: 'inattention',
        label: "Makes careless mistakes in schoolwork",
        description: "Skips questions, misreads instructions, writes answers in the wrong place.",
        emoji: '⚠️',
      },
      {
        id: 'inattention_08',
        category: 'inattention',
        label: "Avoids tasks requiring sustained mental effort",
        description: "Homework, reading assignments, or puzzles that require concentration are met with strong resistance.",
        emoji: '🚫',
      },
      {
        id: 'inattention_09',
        category: 'inattention',
        label: "Frequently daydreams or zones out",
        description: "Stares off into space during class or conversation. May appear 'spacey' far more often than peers.",
        emoji: '💭',
      },
      {
        id: 'inattention_10',
        category: 'inattention',
        label: "Forgets daily activities and routines",
        description: "Consistently forgets to brush teeth, put away dishes, or bring items to school.",
        emoji: '🔄',
      },
    ],
  },
  hyperactivity: {
    key: 'hyperactivity',
    label: 'Hyperactivity',
    icon: 'Lightning',
    emoji: '⚡',
    color: 'cat-hyperactivity',
    signs: [
      {
        id: 'hyperactivity_01',
        category: 'hyperactivity',
        label: "Constantly in motion",
        description: "Running, jumping, climbing on furniture, bouncing while walking. Relentless physical energy.",
        emoji: '🏃',
      },
      {
        id: 'hyperactivity_02',
        category: 'hyperactivity',
        label: "Fidgets and squirms when seated",
        description: "Can't stay still at meals, during class, or at the doctor's office.",
        emoji: '🪑',
      },
      {
        id: 'hyperactivity_03',
        category: 'hyperactivity',
        label: "Leaves seat when expected to stay",
        description: "Gets up and wanders during class, meals, church or events.",
        emoji: '💺',
      },
      {
        id: 'hyperactivity_04',
        category: 'hyperactivity',
        label: "Talks excessively",
        description: "A continuous stream of chatter, narration, questions, and commentary.",
        emoji: '🔊',
      },
      {
        id: 'hyperactivity_05',
        category: 'hyperactivity',
        label: "Appears 'driven by a motor'",
        description: "On the go from the moment he wakes up until he crashes at bedtime.",
        emoji: '🔋',
      },
      {
        id: 'hyperactivity_06',
        category: 'hyperactivity',
        label: "Difficulty playing or working quietly",
        description: "Every activity comes with sound effects, humming, tapping, or running commentary.",
        emoji: '🔇',
      },
      {
        id: 'hyperactivity_07',
        category: 'hyperactivity',
        label: "Blurts out sound effects or noises",
        description: "Makes random sounds, hums, clicks, whistles, or provides a soundtrack to everything.",
        emoji: '🗣️',
      },
      {
        id: 'hyperactivity_08',
        category: 'hyperactivity',
        label: "Climbs on things inappropriately",
        description: "Scales bookshelves, stands on chairs, climbs countertops in inappropriate situations.",
        emoji: '🧗',
      },
    ],
  },
  impulsivity: {
    key: 'impulsivity',
    label: 'Impulsivity',
    icon: 'Timer',
    emoji: '⏳',
    color: 'cat-impulsivity',
    signs: [
      {
        id: 'impulsivity_01',
        category: 'impulsivity',
        label: "Blurts out answers before questions are finished",
        description: "Shouts out responses before the question is complete. Can't hold back even when reminded.",
        emoji: '✋',
      },
      {
        id: 'impulsivity_02',
        category: 'impulsivity',
        label: "Extreme difficulty waiting his turn",
        description: "Lines, board games, group activities — waiting is physically uncomfortable.",
        emoji: '⏳',
      },
      {
        id: 'impulsivity_03',
        category: 'impulsivity',
        label: "Interrupts others frequently",
        description: "Cuts into conversations between adults, talks over friends, inserts himself into activities.",
        emoji: '💬',
      },
      {
        id: 'impulsivity_04',
        category: 'impulsivity',
        label: "Acts without thinking about consequences",
        description: "Runs into the street, touches hot things, jumps from heights — action before thought.",
        emoji: '🎲',
      },
      {
        id: 'impulsivity_05',
        category: 'impulsivity',
        label: "Grabs things from others",
        description: "Takes toys, food, or materials from classmates and siblings without asking.",
        emoji: '💥',
      },
      {
        id: 'impulsivity_06',
        category: 'impulsivity',
        label: "Difficulty stopping a behaviour when asked",
        description: "Acknowledges the instruction but continues anyway, as if the brakes don't work.",
        emoji: '🛑',
      },
      {
        id: 'impulsivity_07',
        category: 'impulsivity',
        label: "Makes impulsive choices about food, play, purchases",
        description: "Wants everything immediately. Struggles to delay gratification.",
        emoji: '💸',
      },
    ],
  },
  emotional: {
    key: 'emotional',
    label: 'Emotional Regulation',
    icon: 'Heartbeat',
    emoji: '🌊',
    color: 'cat-emotional',
    signs: [
      {
        id: 'emotional_01',
        category: 'emotional',
        label: "Intense emotional reactions disproportionate to the situation",
        description: "A small setback triggers an explosion of anger, crying, or screaming vastly out of proportion.",
        emoji: '🌋',
      },
      {
        id: 'emotional_02',
        category: 'emotional',
        label: "Low frustration tolerance",
        description: "Gives up quickly on tasks that are even slightly challenging.",
        emoji: '😞',
      },
      {
        id: 'emotional_03',
        category: 'emotional',
        label: "Rapid mood shifts",
        description: "Moves from delighted to furious to giggling within minutes, often with no clear trigger.",
        emoji: '🎢',
      },
      {
        id: 'emotional_04',
        category: 'emotional',
        label: "Difficulty calming down once upset",
        description: "Once the emotional storm starts, it takes a long time to pass.",
        emoji: '😭',
      },
      {
        id: 'emotional_05',
        category: 'emotional',
        label: "Takes criticism or correction very hard",
        description: "Even gentle redirection can feel like a devastating blow.",
        emoji: '💔',
      },
      {
        id: 'emotional_06',
        category: 'emotional',
        label: "Struggles to recognise emotions in self and others",
        description: "May not be able to name what he's feeling or may misread social situations.",
        emoji: '🤔',
      },
      {
        id: 'emotional_07',
        category: 'emotional',
        label: "Strong sense of injustice or unfairness",
        description: "Becomes extremely upset when things feel 'unfair,' even when the situation is reasonable.",
        emoji: '💪',
      },
    ],
  },
  social: {
    key: 'social',
    label: 'Social & Peer',
    icon: 'UsersThree',
    emoji: '👥',
    color: 'cat-social',
    signs: [
      {
        id: 'social_01',
        category: 'social',
        label: "Difficulty making or keeping friends",
        description: "Other children may avoid playing with him because of intensity or inability to share and take turns.",
        emoji: '👥',
      },
      {
        id: 'social_02',
        category: 'social',
        label: "Dominates group play or won't follow rules",
        description: "Insists on being the leader, changes rules mid-game, or quits when things don't go his way.",
        emoji: '🎮',
      },
      {
        id: 'social_03',
        category: 'social',
        label: "Misses social cues and boundaries",
        description: "Stands too close, talks too loudly, doesn't notice when a friend wants to stop playing.",
        emoji: '👋',
      },
      {
        id: 'social_04',
        category: 'social',
        label: "Plays too rough without realising it",
        description: "Hugs too hard, pushes when excited, tackles during tag. Doesn't intend to hurt anyone.",
        emoji: '💢',
      },
      {
        id: 'social_05',
        category: 'social',
        label: "Seems immature compared to peers",
        description: "Emotional and social behaviour may seem like that of a younger child.",
        emoji: '😟',
      },
      {
        id: 'social_06',
        category: 'social',
        label: "Struggles with losing or not being first",
        description: "Not being first or winning triggers intense distress. Sportsmanship is a real challenge.",
        emoji: '🏆',
      },
    ],
  },
  school: {
    key: 'school',
    label: 'School-Specific',
    icon: 'GraduationCap',
    emoji: '🏫',
    color: 'cat-school',
    signs: [
      {
        id: 'school_01',
        category: 'school',
        label: "Inconsistent academic performance",
        description: "Brilliant and engaged one day, completely unfocused the next.",
        emoji: '📝',
      },
      {
        id: 'school_02',
        category: 'school',
        label: "Desk, backpack, and cubby are chaotic",
        description: "Papers crumpled, broken pencils, missing supplies. Organisation is a consistent struggle.",
        emoji: '🗂️',
      },
      {
        id: 'school_03',
        category: 'school',
        label: "Difficulty with transitions between activities",
        description: "Moving from recess to reading creates resistance or disruptive behaviour.",
        emoji: '🚧',
      },
      {
        id: 'school_04',
        category: 'school',
        label: "Doesn't complete classwork in allotted time",
        description: "Still on the first few questions while others finish — not because it's hard, but focus drifted.",
        emoji: '📋',
      },
      {
        id: 'school_05',
        category: 'school',
        label: "Frequent teacher reports about behaviour",
        description: "Notes home, calls, parent-teacher conferences focused on behaviour rather than academics.",
        emoji: '🏫',
      },
      {
        id: 'school_06',
        category: 'school',
        label: "Calls out or disrupts the class",
        description: "Shouts answers, makes jokes at inappropriate times, gets out of seat, distracts classmates.",
        emoji: '🙋',
      },
      {
        id: 'school_07',
        category: 'school',
        label: "Messy handwriting or avoidance of writing tasks",
        description: "Fine motor control and sustained focus combine to make written work especially frustrating.",
        emoji: '✍️',
      },
    ],
  },
  lessObvious: {
    key: 'lessObvious',
    label: 'Less Obvious Signs',
    icon: 'PuzzlePiece',
    emoji: '🧩',
    color: 'cat-lessObvious',
    signs: [
      {
        id: 'lessObvious_01',
        category: 'lessObvious',
        label: "Difficulty falling or staying asleep",
        description: "His brain doesn't seem to have an off switch at bedtime.",
        emoji: '🌙',
      },
      {
        id: 'lessObvious_02',
        category: 'lessObvious',
        label: "Hyper-focuses on preferred activities",
        description: "Hours absorbed in Legos or video games, but can't focus five minutes on homework.",
        emoji: '🎮',
      },
      {
        id: 'lessObvious_03',
        category: 'lessObvious',
        label: "Accident-prone and frequently injured",
        description: "Bumps into things, falls off chairs, trips over his own feet.",
        emoji: '🩹',
      },
      {
        id: 'lessObvious_04',
        category: 'lessObvious',
        label: "Picky eating or eating very quickly",
        description: "May eat impulsively or be extremely selective about food.",
        emoji: '🍽️',
      },
      {
        id: 'lessObvious_05',
        category: 'lessObvious',
        label: "Sensory sensitivities",
        description: "Certain fabrics, tags, loud noises, or bright lights may be intolerable.",
        emoji: '💧',
      },
      {
        id: 'lessObvious_06',
        category: 'lessObvious',
        label: "Poor sense of time",
        description: "Five minutes and an hour feel the same. No internal sense of urgency about time.",
        emoji: '⏱️',
      },
      {
        id: 'lessObvious_07',
        category: 'lessObvious',
        label: "Excessive noise-making (humming, tapping, clicking)",
        description: "A constant low-level stream of sounds, often without being aware of it.",
        emoji: '🎤',
      },
      {
        id: 'lessObvious_08',
        category: 'lessObvious',
        label: "Extraordinary creativity and divergent thinking",
        description: "Wild imagination, inventive play, and ability to think outside the box.",
        emoji: '💡',
      },
      {
        id: 'lessObvious_09',
        category: 'lessObvious',
        label: "Deep empathy and emotional sensitivity",
        description: "Despite outbursts, deeply caring and perceptive about others' feelings.",
        emoji: '❤️',
      },
      {
        id: 'lessObvious_10',
        category: 'lessObvious',
        label: "Seeks intense stimulation",
        description: "Gravitates toward fast-paced, high-stimulation activities and finds calm environments unbearable.",
        emoji: '🧲',
      },
    ],
  },
};

// Flat array of all signs for search/lookup
export const ALL_SIGNS: Sign[] = Object.values(CATEGORIES).flatMap(c => c.signs);

// Ordered category list for consistent rendering
export const CATEGORY_ORDER: CategoryKey[] = [
  'inattention',
  'hyperactivity',
  'impulsivity',
  'emotional',
  'social',
  'school',
  'lessObvious',
];
```

---

## 6. Authentication

### 6.1 Supabase Client Setup

**`lib/supabase/client.ts`** — Browser client:

```typescript
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**`lib/supabase/server.ts`** — Server client (for Server Components and Route Handlers):

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}
```

### 6.2 Login Flow

1. User enters email on `/login`
2. App calls `supabase.auth.signInWithOtp({ email })`
3. User clicks magic link in email → redirected to `/callback`
4. Callback route exchanges code for session
5. On first login, insert row into `profiles` table
6. Redirect to `/timeline`

### 6.3 Middleware (`middleware.ts`)

Protect all `/(app)` routes. Redirect unauthenticated users to `/login`. Refresh session on each request.

### 6.4 Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 7. Feature Specifications

### 7.1 Quick Log

**Entry point:** FAB button (visible on all `/(app)` screens, hidden when bottom sheet is open).

**Flow (3 steps in a bottom sheet):**

**Step 1 — Category Grid:**
- Display 7 categories in a grid (4 columns top row, 3 columns bottom row, centred)
- Each cell: 80×80px, rounded-md, category-light background, duotone icon (32px) centred above label
- Label: `text-xs`, category-icon colour
- Tap → animate to Step 2

**Step 2 — Sign Picker:**
- Header: category icon + label, back arrow to return to Step 1
- Scrollable area of sign chips (wrapping flex layout)
- Each chip: `text-small`, rounded-sm, surface-raised background
- Selected chip: category-light background, category border, category-icon text colour
- Tap sign → show intensity selector inline below the chip area

**Step 3 — Intensity + Note:**
- `IntensitySelector` component: 3 circles, labelled "Mild", "Moderate", "Strong"
- Optional note: single-line `InputField`, placeholder "Add a quick note…"
- Optional context: 4 small chips — Home, School, Social, Other (default: Home)
- "Save" primary button (full width)

**On save:**
1. Insert observation into Supabase `observations` table with `source: 'quick_log'`
2. Bottom sheet slides down (200ms ease-in)
3. Toast appears: "Got it ✓" (1.5s, top of screen, fades in/out)
4. If offline: store in IndexedDB queue, set `synced: false`, sync on reconnect

**Performance target:** 4 taps minimum (FAB → category → sign → save). Under 10 seconds.

### 7.2 Daily Journal

**Entry point:** Journal tab in bottom tab bar.

**State logic:**
- Check if a journal entry exists for today for the current user
- If yes and `completed: true` → show read-only summary with "Edit" button
- If yes and `completed: false` → resume wizard from where they left off
- If no → start new journal wizard
- Journals are editable until midnight (local time). After midnight, read-only.

**Wizard flow:**

1. **Category Cards (×7):** One card per category in `CATEGORY_ORDER`. Each card:
   - Left accent border in category colour (4px)
   - Category icon (duotone, 22px) + label as card header
   - Grid of sign chips for that category (same chip style as quick-log)
   - Tapping a sign chip opens inline: intensity selector + optional note field
   - Multiple signs per category can be selected
   - "Skip" ghost button and "Next" primary button at bottom
   - Card transition: crossfade with 8px horizontal slide (250ms)

2. **Summary Card:**
   - Mood selector: 5 emoji buttons (😫 😕 😐 🙂 😊) in a row, selectable
   - Energy selector: same 5-level scale (🔋 labels: Very Low → Very High)
   - Reflection field: multiline `InputField`, placeholder "Anything else on your mind today?"
   - "Save Journal" primary button

**On save:**
1. Create/update `journals` row with `completed: true`
2. Create one `observations` row per selected sign, all linked via `journal_id`
3. Show confirmation: "Nice work — today's journal is saved."
4. Navigate to timeline

### 7.3 Timeline

**Layout:** Vertically scrolling feed, observations grouped by date (most recent first).

**Date group header:** Sticky, showing formatted date (e.g. "Today", "Yesterday", "Mon 3 Mar"). Font: `text-h3`, `text-secondary`.

**Observation card (collapsed):**
- Left accent: 4px category colour border
- Category chip (small, top-left)
- Sign label: `text-body-medium`
- Intensity indicator: 1–3 filled circles in category colour
- Parent name: `text-small`, `text-tertiary`
- Timestamp: `text-mono`, `text-tertiary`
- Source badge: "Quick Log" or "Journal" in `text-xs`

**Observation card (expanded — on tap):**
- All collapsed content +
- Sign description from catalogue
- Note (if present)
- Context tag
- Edit/delete actions (own entries only)

**Filter bar (top, horizontal scroll):**
- Category filter: 7 category chips + "All" (default selected)
- Parent filter: toggle between "Both", "Me", partner name
- Intensity filter: "Any", "Mild", "Moderate", "Strong"
- The filter bar scrolls horizontally; active filters are visually highlighted

**Realtime:** Subscribe to `observations` table changes. New entries from the other parent animate in from the left (200ms ease-out, scale 0.97→1).

**Empty state:** Illustration + "Nothing here yet. Tap + to log your first observation."

### 7.4 Insights Dashboard

Three visualisation sections, vertically stacked:

**1. Weekly Frequency Chart:**
- Recharts `BarChart`, one bar per category per week
- X-axis: weeks (last 8 weeks)
- Stacked bars, each segment coloured by category
- Tap a bar to see breakdown tooltip

**2. Day-of-Week Heatmap:**
- 7 columns (Mon–Sun), rows = categories
- Cell colour intensity = observation count (white → category colour, 4 levels)
- Helps identify pattern days (e.g. Mondays worse after weekends)

**3. Top Signs:**
- Ranked list of most frequently logged signs (top 10)
- Each row: rank number, sign label, category chip, count, mini bar
- Tap to expand and see breakdown by parent

**Data range:** Default last 30 days. Configurable via date range picker at top.

### 7.5 Settings

**Sections:**

1. **Profile:** Display name (editable), email (read-only)
2. **Reminders:** Time picker for daily journal reminder. Toggle for Web Push notifications.
3. **Export:** Two buttons — "Export PDF Report" and "Export CSV". Date range picker shared between them.
4. **About:** App version, disclaimer text ("This app is not a diagnostic tool…"), link to catalogue reference.
5. **Sign Out:** Ghost button at bottom.

### 7.6 Data Export

**PDF Report (`lib/utils/export.ts`):**
- Generated client-side with jsPDF
- Cover page: "ADHD Observer — Observation Report", date range, generated date
- Grouped by category, each category section:
  - Category heading with colour accent
  - Table of observations: date, sign, intensity, note, parent, context
  - Observation count for category
- Final page: summary statistics (total observations, top 5 signs, observations per parent)
- Footer: "Generated by ADHD Observer. For informational purposes only."

**CSV Export:**
- Papaparse `unparse` with columns: date, time, parent, category, sign, intensity, note, context, source
- Downloaded as `adhd-observer-export-{date}.csv`

### 7.7 Reminder System

**In-app banner:**
- Shown at top of timeline when: current time > reminder_time AND today's journal not completed
- Warm yellow/amber background (`warning` colour at 10% opacity)
- Copy: "How was today? Take a minute to jot down what you noticed."
- Tap → navigate to journal
- Dismiss button (hides for this session)

**Web Push (optional, best-effort):**
- Request permission on Settings page
- Store subscription in `profiles.push_subscription`
- Server-side cron (Supabase Edge Function or Vercel Cron) checks at each parent's reminder time
- If journal incomplete, send push notification
- Notification copy: "Time to capture today's observations"

---

## 8. Realtime Sync

### 8.1 Subscription Setup

```typescript
// lib/supabase/realtime.ts
import { createClient } from './client';
import { useEffect, useState } from 'react';
import type { Observation, Journal } from '../data/types';

export function useRealtimeObservations(initialData: Observation[]) {
  const [observations, setObservations] = useState(initialData);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel('observations-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'observations' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setObservations(prev => [payload.new as Observation, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setObservations(prev =>
              prev.map(o => o.id === (payload.new as Observation).id ? payload.new as Observation : o)
            );
          } else if (payload.eventType === 'DELETE') {
            setObservations(prev =>
              prev.filter(o => o.id !== (payload.old as { id: string }).id)
            );
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return observations;
}
```

### 8.2 Offline Queue

```typescript
// lib/hooks/useOfflineQueue.ts
// Uses IndexedDB (via idb-keyval or raw API) to store observations when offline.
// On reconnect (navigator.onLine event), flush queue to Supabase.
// Set synced: true on each observation after successful insert.
// Conflict resolution: last-write-wins (safe with 2 users).
```

---

## 9. PWA Configuration

### 9.1 Manifest (`app/manifest.ts`)

```typescript
import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ADHD Observer',
    short_name: 'Observer',
    description: 'Track and understand ADHD behaviours together',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAFAF7',
    theme_color: '#0D9488',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
```

### 9.2 iOS Meta Tags (Root Layout `<head>`)

```html
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="Observer" />
<link rel="apple-touch-icon" href="/icons/icon-192.png" />
```

### 9.3 Service Worker

Use Serwist to generate the service worker. Configure precaching of the app shell and static assets. Runtime caching strategy for API requests (network-first with IndexedDB fallback for observations).

### 9.4 iOS Considerations

- Safe area insets: use `env(safe-area-inset-bottom)` on tab bar and FAB positioning
- Bottom tab bar height: `64px + env(safe-area-inset-bottom)`
- FAB position: `fixed bottom-[calc(80px+env(safe-area-inset-bottom))] right-5`
- Max content width: `480px` centred on larger screens
- Safari 50MB storage limit per origin — monitor IndexedDB + cache usage

---

## 10. Component Specifications

### 10.1 FAB (`components/navigation/FAB.tsx`)

```
Props: { onPress: () => void; visible: boolean }
Size: 56×56px
Border-radius: full (9999px)
Background: primary (#0D9488)
Icon: Phosphor Plus, bold, 26px, white
Shadow: shadow-lg
Position: fixed, bottom-right (20px inset, 80px above tab bar + safe area)
Pressed: primary-dark, scale(0.95), 150ms ease-out
Mount animation: scale 0→1, 300ms ease-out
Idle pulse: box-shadow breath every 30s if no observation logged today. Stops after first log.
```

### 10.2 Bottom Sheet (`components/ui/BottomSheet.tsx`)

```
Props: { isOpen: boolean; onClose: () => void; children: ReactNode }
Background: surface (#FFFFFF)
Border-radius: 20px 20px 0 0
Shadow: shadow-sheet
Padding: 20px horizontal, 16px vertical
Max height: 85vh
Handle: 40×4px centred bar, border colour, full radius, 8px top margin
Backdrop: rgba(28,25,23,0.3) + blur(4px)
Open animation: translateY(100%) → 0, 300ms ease-out
Close animation: 0 → translateY(100%), 200ms ease-in
Dismiss: swipe down or tap backdrop or close button
Focus trap: trap focus within sheet when open
```

### 10.3 IntensitySelector (`components/ui/IntensitySelector.tsx`)

```
Props: { value: Intensity | null; onChange: (v: Intensity) => void; category: CategoryKey }
Layout: 3 circles, horizontal row, 12px gap
Circle size: 36px diameter, border-radius full

Level 1 (Mild):
  Default: surface-raised bg, 1px border
  Selected: category-light bg, 2px category border
  Label: "Mild — noticed it, but it passed"

Level 2 (Moderate):
  Selected: category-light bg (higher opacity), 2px category border
  Label: "Moderate — it stood out"

Level 3 (Strong):
  Selected: full category colour fill, white text
  Label: "Strong — it really dominated the moment"

Labels below circles: text-xs, text-tertiary
```

### 10.4 Tab Bar (`components/navigation/TabBar.tsx`)

```
4 tabs: Timeline, Journal, Insights, Settings
Background: surface
Border-top: 1px solid border
Height: 64px + env(safe-area-inset-bottom)
Each tab: icon (24px) + label (text-xs, font-medium), 4px gap
Inactive: text-tertiary colour, regular weight icon
Active: primary colour, fill weight icon
No active indicator line — colour change only
```

### 10.5 Card (`components/ui/Card.tsx`)

```
Props: { children; category?: CategoryKey; onPress?: () => void }
Background: surface
Border: 1px solid border
Border-radius: 12px (radius-md)
Padding: 16px (space-4)
Shadow: shadow-sm
Hover/pressed: shadow-md, border → primary-light
Category variant: border-left 4px solid category colour
```

### 10.6 Chip (`components/ui/Chip.tsx`)

**Category chip (display only):**
```
Background: category-light
Text: category-icon colour
Font: text-xs, font-medium
Padding: 4px 10px
Border-radius: full
```

**Sign chip (selectable):**
```
Default: surface-raised bg, 1px border, text-secondary
Selected: category-light bg, 1.5px category border, category-icon text, font-medium
Padding: 8px 14px
Border-radius: radius-sm (8px)
Transition: 250ms ease-out on selection
```

---

## 11. Microcopy Reference

| Context | Copy |
|---------|------|
| Empty timeline | "Nothing here yet. Tap + to log your first observation." |
| Quick-log saved | "Got it ✓" |
| Journal complete | "Nice work — today's journal is saved." |
| Journal reminder banner | "How was today? Take a minute to jot down what you noticed." |
| Skipping a category | "Nothing to note? No problem — skip ahead." |
| Intensity: mild | "Mild — noticed it, but it passed" |
| Intensity: moderate | "Moderate — it stood out" |
| Intensity: strong | "Strong — it really dominated the moment" |
| Reflection placeholder | "Anything else on your mind today?" |
| Export intro | "Generate a summary you can share with your child's doctor." |
| Error state | "Something didn't save. Tap to try again." |
| Offline indicator | "You're offline — observations will sync when you're back." |

**Words to avoid → prefer:**
- Symptom → Sign, behaviour, observation
- Diagnosis, disorder → Evaluation, assessment
- Problem, issue → Pattern, thing you noticed
- Test, score → Observation, note
- Submit → Save, Log
- Failed → Didn't save, try again

---

## 12. Animations

| Animation | Trigger | Duration | Easing | Details |
|-----------|---------|----------|--------|---------|
| FAB mount | Page load | 300ms | ease-out | scale 0→1 |
| FAB idle pulse | No log today, every 30s | 2s | ease-in-out | box-shadow breath |
| FAB press | Tap | 150ms | ease-out | scale(0.95), primary-dark bg |
| Bottom sheet open | FAB tap | 300ms | ease-out | translateY(100%)→0 |
| Bottom sheet close | Save/dismiss | 200ms | ease-in | 0→translateY(100%) |
| Toast appear | After save | 200ms fade-in | ease-out | Stays 1.5s, then 200ms fade-out |
| Journal card transition | Next category | 250ms | ease-out | Crossfade + 8px horizontal slide |
| Timeline new entry | Realtime insert | 200ms | ease-out | Slide from left, scale 0.97→1 |
| Chip selection | Tap | 250ms | ease-out | Background + border colour change |
| Button press | Tap | 150ms | ease-out | scale(0.98) |

**Respect `prefers-reduced-motion`:** Wrap all animations in a media query check. When reduced motion is preferred, use instant transitions (0ms) with no transforms.

---

## 13. Accessibility

- All interactive elements: minimum 44×44px tap target
- Category colours pass WCAG AA against their light backgrounds
- Never use colour alone to convey meaning — always pair with icon + label
- All icons: `aria-label` describing the action or category
- Bottom sheet and modals: focus trap, dismissible via swipe-down or close button
- Form inputs: visible labels or `aria-label`, visible focus states (1.5px primary border + 3px primary-lighter ring)
- Timeline entries: expandable via tap, `aria-expanded` state
- Screen reader: announce toast messages via `aria-live="polite"` region

---

## 14. Build Phases

Execute in this order. Each phase should produce a deployable increment.

### Phase 1 — Foundation (Week 1–2)

1. Scaffold Next.js project with TypeScript, Tailwind, App Router
2. Implement Tailwind config with all design tokens
3. Set up Supabase project: create tables, RLS policies, enable realtime
4. Implement Supabase client (browser + server)
5. Build auth flow: login page, magic link, callback, middleware
6. Create profile insertion trigger (on first login)
7. Configure PWA: manifest, service worker (Serwist), iOS meta tags
8. Build app shell: root layout, tab bar, FAB (non-functional placeholder)
9. Build all base UI components: Button, Card, Chip, InputField, BottomSheet, IntensitySelector, Toast, EmptyState
10. Set up Google Fonts loading
11. Deploy to Vercel

**Deliverable:** App loads as PWA, user can log in, sees empty timeline with tab bar and FAB.

### Phase 2 — Quick Log (Week 2–3)

1. Build `categories.ts` with full 55-sign catalogue
2. Build CategoryGrid component (7-icon grid)
3. Build SignPicker component (scrollable chip list)
4. Build IntensityStep component (intensity + note + context)
5. Wire QuickLogSheet together: step state machine, animations
6. Implement observation insert (Supabase)
7. Implement save confirmation toast
8. Implement FAB idle pulse logic
9. Test end-to-end: FAB → category → sign → intensity → save → toast
10. Implement offline queue (IndexedDB) and sync-on-reconnect

**Deliverable:** Parents can capture observations in under 10 seconds.

### Phase 3 — Daily Journal (Week 3–4)

1. Build JournalWizard orchestrator (step state, navigation)
2. Build CategoryCard component (sign toggles, intensity, notes per sign)
3. Build MoodSelector (5 emoji buttons)
4. Build ReflectionField
5. Implement journal create/update logic (Supabase)
6. Implement journal date-locking (editable until midnight)
7. Implement journal resume (incomplete journal detection)
8. Wire category card transitions (crossfade + slide animation)
9. Test full journal flow: 7 categories → summary → save

**Deliverable:** Parents can complete structured daily journals.

### Phase 4 — Timeline (Week 4–5)

1. Build TimelineFeed: fetch observations, group by date, sort desc
2. Build TimelineEntry: collapsed and expanded states
3. Build FilterBar: category, parent, intensity filters
4. Implement realtime subscription (live updates from other parent)
5. Implement new-entry animation (slide from left)
6. Implement expand/collapse animation
7. Implement edit/delete for own entries
8. Join profile data for parent names
9. Build reminder banner component

**Deliverable:** Both parents see a live, filterable feed of all observations.

### Phase 5 — Insights & Export (Week 5–7)

1. Build FrequencyChart (Recharts stacked bar chart)
2. Build DayHeatmap (custom grid component)
3. Build TopSigns (ranked list)
4. Implement date range selector for insights
5. Build PDF export (jsPDF): cover page, per-category tables, summary
6. Build CSV export (Papaparse)
7. Build ExportControls with date range picker
8. Build Settings page: profile edit, reminder time, export, about

**Deliverable:** Pattern recognition and clinician-ready reports.

### Phase 6 — Reminders & Polish (Week 7–8)

1. Implement Web Push notification setup (permission request, subscription storage)
2. Build Supabase Edge Function or Vercel Cron for push delivery
3. Implement in-app reminder banner logic
4. Accessibility audit: tap targets, focus management, aria labels, reduced motion
5. Performance audit: Lighthouse PWA score, bundle size, loading states
6. Error states: network failures, save failures, empty states
7. Offline indicator component
8. Final UI polish: spacing, animations, edge cases
9. iOS testing: Safari, home screen, safe areas, storage limits

**Deliverable:** Production-ready PWA.

---

## 15. Environment Setup

### 15.1 Supabase Project

1. Create project at supabase.com
2. Run the SQL schema from §5.1 in the SQL editor
3. Enable Realtime on `observations` and `journals` tables
4. Configure auth: enable Magic Link provider, set redirect URL to `{APP_URL}/callback`
5. Note the project URL and anon key for `.env.local`

### 15.2 Vercel Deployment

1. Connect GitHub repo to Vercel
2. Set environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy — zero config for Next.js

### 15.3 Local Development

```bash
cp .env.example .env.local
# Fill in Supabase URL and anon key
npm run dev
```

---

## 16. Disclaimers

Every screen must include a footer link to the disclaimer. The Settings page must display:

> "ADHD Observer is for informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. If you have concerns about your child, please consult a qualified healthcare provider."

The export PDF must include this disclaimer on both the cover page and final page.

---

*End of implementation spec. Build each phase sequentially. Reference the companion design system document for any visual decisions not covered here. When in doubt, choose the option that is friction-free, calm, colour-coded, and spacious.*
