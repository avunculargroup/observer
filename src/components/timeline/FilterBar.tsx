'use client';

import { CATEGORIES } from '@/lib/data/categories';
import type { CategoryKey, Intensity } from '@/lib/data/types';

interface FilterBarProps {
  selectedCategories: CategoryKey[];
  onToggleCategory: (key: CategoryKey) => void;
  selectedIntensity: Intensity | null;
  onToggleIntensity: (intensity: Intensity | null) => void;
}

export function FilterBar({
  selectedCategories,
  onToggleCategory,
  selectedIntensity,
  onToggleIntensity,
}: FilterBarProps) {
  const intensityLevels: { value: Intensity; label: string }[] = [
    { value: 1, label: 'Mild' },
    { value: 2, label: 'Moderate' },
    { value: 3, label: 'Strong' },
  ];

  return (
    <div
      style={{
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        marginBottom: '16px',
        paddingBottom: '4px',
      }}
    >
      <div style={{ display: 'flex', gap: '6px', minWidth: 'max-content' }}>
        {CATEGORIES.map((cat) => {
          const active = selectedCategories.includes(cat.key);
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => onToggleCategory(cat.key)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.6875rem',
                fontWeight: 500,
                fontFamily: 'var(--font-body)',
                border: active
                  ? `1.5px solid var(--cat-${cat.key})`
                  : '1px solid var(--color-border)',
                background: active
                  ? `var(--cat-${cat.key}-light)`
                  : 'var(--color-surface)',
                color: active
                  ? `var(--cat-${cat.key}-icon)`
                  : 'var(--color-text-tertiary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: `all var(--duration-fast) var(--ease-out)`,
                minHeight: '44px',
              }}
            >
              {cat.emoji} {cat.label}
            </button>
          );
        })}

        <div
          style={{
            width: '1px',
            background: 'var(--color-border)',
            margin: '4px 4px',
            alignSelf: 'stretch',
          }}
        />

        {intensityLevels.map(({ value, label }) => {
          const active = selectedIntensity === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onToggleIntensity(active ? null : value)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.6875rem',
                fontWeight: 500,
                fontFamily: 'var(--font-body)',
                border: active
                  ? '1.5px solid var(--color-primary)'
                  : '1px solid var(--color-border)',
                background: active
                  ? 'var(--color-primary-lighter)'
                  : 'var(--color-surface)',
                color: active
                  ? 'var(--color-primary-dark)'
                  : 'var(--color-text-tertiary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: `all var(--duration-fast) var(--ease-out)`,
                minHeight: '44px',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
