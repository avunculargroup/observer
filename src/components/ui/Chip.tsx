'use client';

import type { CategoryKey } from '@/lib/data/types';

interface CategoryChipProps {
  category: CategoryKey;
  label: string;
}

export function CategoryChip({ category, label }: CategoryChipProps) {
  return (
    <span
      style={{
        background: `var(--cat-${category}-light)`,
        color: `var(--cat-${category}-icon)`,
        fontSize: '0.6875rem',
        fontWeight: 500,
        padding: '4px 10px',
        borderRadius: 'var(--radius-full)',
        display: 'inline-flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}

interface SignChipProps {
  label: string;
  selected: boolean;
  category: CategoryKey;
  onToggle: () => void;
}

export function SignChip({ label, selected, category, onToggle }: SignChipProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        background: selected
          ? `var(--cat-${category}-light)`
          : 'var(--color-surface-raised)',
        border: selected
          ? `1.5px solid var(--cat-${category})`
          : '1px solid var(--color-border)',
        color: selected
          ? `var(--cat-${category}-icon)`
          : 'var(--color-text-secondary)',
        fontWeight: selected ? 500 : 400,
        fontSize: '0.9375rem',
        fontFamily: 'var(--font-body)',
        padding: '8px 14px',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        transition: `all var(--duration-normal) var(--ease-out)`,
        minHeight: '44px',
      }}
    >
      {label}
    </button>
  );
}
