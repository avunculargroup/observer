'use client';

import { Card } from '@/components/ui/Card';
import { SignChip } from '@/components/ui/Chip';
import { IntensitySelector } from '@/components/ui/IntensitySelector';
import { getCategoryByKey } from '@/lib/data/categories';
import type { CategoryKey, Intensity } from '@/lib/data/types';

interface SignEntry {
  signId: string;
  intensity: Intensity;
}

interface CategoryCardProps {
  category: CategoryKey;
  selectedSigns: SignEntry[];
  onToggleSign: (signId: string) => void;
  onIntensityChange: (signId: string, intensity: Intensity) => void;
}

export function CategoryCard({
  category,
  selectedSigns,
  onToggleSign,
  onIntensityChange,
}: CategoryCardProps) {
  const cat = getCategoryByKey(category);
  const selectedIds = selectedSigns.map((s) => s.signId);

  return (
    <Card categoryAccent={category}>
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.125rem',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          marginBottom: '4px',
        }}
      >
        {cat.emoji} {cat.label}
      </h3>
      <p
        style={{
          fontSize: '0.8125rem',
          color: 'var(--color-text-tertiary)',
          marginBottom: '16px',
        }}
      >
        Tap any signs you noticed today.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        {cat.signs.map((sign) => (
          <SignChip
            key={sign.id}
            label={sign.label}
            selected={selectedIds.includes(sign.id)}
            category={category}
            onToggle={() => onToggleSign(sign.id)}
          />
        ))}
      </div>

      {selectedSigns.map((entry) => {
        const sign = cat.signs.find((s) => s.id === entry.signId);
        if (!sign) return null;
        return (
          <div
            key={entry.signId}
            style={{
              padding: '12px 0',
              borderTop: '1px solid var(--color-border-subtle)',
            }}
          >
            <p
              style={{
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: 'var(--color-text-primary)',
                marginBottom: '8px',
              }}
            >
              {sign.label}
            </p>
            <IntensitySelector
              value={entry.intensity}
              onChange={(i) => onIntensityChange(entry.signId, i)}
              category={category}
            />
          </div>
        );
      })}
    </Card>
  );
}
