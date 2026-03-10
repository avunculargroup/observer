'use client';

import type { CategoryKey, Intensity } from '@/lib/data/types';
import { INTENSITY_LABELS } from '@/lib/utils/constants';

interface IntensitySelectorProps {
  value: Intensity | null;
  onChange: (intensity: Intensity) => void;
  category: CategoryKey;
}

const levels: Intensity[] = [1, 2, 3];

export function IntensitySelector({ value, onChange, category }: IntensitySelectorProps) {
  return (
    <div>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        {levels.map((level) => {
          const selected = value === level;
          const isStrong = level === 3 && selected;

          return (
            <button
              key={level}
              type="button"
              onClick={() => onChange(level)}
              aria-label={INTENSITY_LABELS[level].long}
              aria-pressed={selected}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-full)',
                border: selected
                  ? `2px solid var(--cat-${category})`
                  : '1px solid var(--color-border)',
                background: isStrong
                  ? `var(--cat-${category})`
                  : selected
                    ? `var(--cat-${category}-light)`
                    : 'var(--color-surface-raised)',
                color: isStrong ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8125rem',
                fontWeight: 600,
                transition: `all var(--duration-fast) var(--ease-out)`,
                minWidth: '44px',
                minHeight: '44px',
              }}
            >
              {level}
            </button>
          );
        })}
      </div>
      {value && (
        <p
          style={{
            textAlign: 'center',
            marginTop: '8px',
            fontSize: '0.8125rem',
            color: 'var(--color-text-tertiary)',
          }}
        >
          {INTENSITY_LABELS[value].long}
        </p>
      )}
    </div>
  );
}
