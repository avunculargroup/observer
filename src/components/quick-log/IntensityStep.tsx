'use client';

import { IntensitySelector } from '@/components/ui/IntensitySelector';
import { InputField } from '@/components/ui/InputField';
import type { CategoryKey, Intensity, ObservationContext } from '@/lib/data/types';
import { CONTEXT_OPTIONS } from '@/lib/utils/constants';

interface IntensityStepProps {
  category: CategoryKey;
  intensity: Intensity | null;
  onIntensityChange: (intensity: Intensity) => void;
  note: string;
  onNoteChange: (note: string) => void;
  context: ObservationContext | null;
  onContextChange: (context: ObservationContext | null) => void;
}

export function IntensityStep({
  category,
  intensity,
  onIntensityChange,
  note,
  onNoteChange,
  context,
  onContextChange,
}: IntensityStepProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <p
          style={{
            fontSize: '0.8125rem',
            color: 'var(--color-text-tertiary)',
            marginBottom: '12px',
            textAlign: 'center',
          }}
        >
          How noticeable was it?
        </p>
        <IntensitySelector
          value={intensity}
          onChange={onIntensityChange}
          category={category}
        />
      </div>

      <div>
        <p
          style={{
            fontSize: '0.8125rem',
            color: 'var(--color-text-tertiary)',
            marginBottom: '8px',
          }}
        >
          Where did it happen?
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {CONTEXT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() =>
                onContextChange(context === opt.value ? null : opt.value)
              }
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8125rem',
                fontFamily: 'var(--font-body)',
                border: context === opt.value
                  ? `1.5px solid var(--cat-${category})`
                  : '1px solid var(--color-border)',
                background: context === opt.value
                  ? `var(--cat-${category}-light)`
                  : 'var(--color-surface-raised)',
                color: context === opt.value
                  ? `var(--cat-${category}-icon)`
                  : 'var(--color-text-secondary)',
                cursor: 'pointer',
                transition: `all var(--duration-fast) var(--ease-out)`,
                minHeight: '44px',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <InputField
        label="Any details? (optional)"
        multiline
        rows={2}
        placeholder="What was happening at the time..."
        value={note}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onNoteChange(e.target.value)}
      />
    </div>
  );
}
