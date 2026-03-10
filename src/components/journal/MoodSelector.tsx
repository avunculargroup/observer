'use client';

import type { Mood } from '@/lib/data/types';
import { MOOD_EMOJIS } from '@/lib/utils/constants';

interface MoodSelectorProps {
  label: string;
  value: Mood | null;
  onChange: (mood: Mood) => void;
}

export function MoodSelector({ label, value, onChange }: MoodSelectorProps) {
  return (
    <div>
      <p
        style={{
          fontSize: '0.9375rem',
          fontWeight: 500,
          color: 'var(--color-text-primary)',
          marginBottom: '12px',
        }}
      >
        {label}
      </p>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
        {MOOD_EMOJIS.map((emoji, i) => {
          const mood = (i + 1) as Mood;
          const selected = value === mood;
          return (
            <button
              key={mood}
              type="button"
              onClick={() => onChange(mood)}
              aria-label={`Mood ${mood} of 5`}
              aria-pressed={selected}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-full)',
                border: selected
                  ? '2px solid var(--color-primary)'
                  : '1px solid var(--color-border)',
                background: selected
                  ? 'var(--color-primary-lighter)'
                  : 'var(--color-surface)',
                fontSize: '24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: `all var(--duration-fast) var(--ease-out)`,
                minHeight: '44px',
                minWidth: '44px',
              }}
            >
              {emoji}
            </button>
          );
        })}
      </div>
    </div>
  );
}
