import type { ObservationContext } from '@/lib/data/types';

export const APP_NAME = 'ADHD Observer';
export const MAX_CONTENT_WIDTH = 480;

export const INTENSITY_LABELS = {
  1: { short: 'Mild', long: 'Mild — noticed it, but it passed' },
  2: { short: 'Moderate', long: 'Moderate — it stood out' },
  3: { short: 'Strong', long: 'Strong — it really dominated the moment' },
} as const;

export const MOOD_EMOJIS = ['😟', '😕', '😐', '🙂', '😊'] as const;

export const CONTEXT_OPTIONS: { value: ObservationContext; label: string }[] = [
  { value: 'home', label: 'Home' },
  { value: 'school', label: 'School' },
  { value: 'social', label: 'Social' },
  { value: 'bedtime', label: 'Bedtime' },
  { value: 'morning', label: 'Morning' },
  { value: 'other', label: 'Other' },
];

export const CATEGORY_COLORS: Record<string, { primary: string; light: string; icon: string }> = {
  inattention: { primary: 'var(--cat-inattention)', light: 'var(--cat-inattention-light)', icon: 'var(--cat-inattention-icon)' },
  hyperactivity: { primary: 'var(--cat-hyperactivity)', light: 'var(--cat-hyperactivity-light)', icon: 'var(--cat-hyperactivity-icon)' },
  impulsivity: { primary: 'var(--cat-impulsivity)', light: 'var(--cat-impulsivity-light)', icon: 'var(--cat-impulsivity-icon)' },
  emotional: { primary: 'var(--cat-emotional)', light: 'var(--cat-emotional-light)', icon: 'var(--cat-emotional-icon)' },
  social: { primary: 'var(--cat-social)', light: 'var(--cat-social-light)', icon: 'var(--cat-social-icon)' },
  school: { primary: 'var(--cat-school)', light: 'var(--cat-school-light)', icon: 'var(--cat-school-icon)' },
  lessObvious: { primary: 'var(--cat-lessObvious)', light: 'var(--cat-lessObvious-light)', icon: 'var(--cat-lessObvious-icon)' },
};
