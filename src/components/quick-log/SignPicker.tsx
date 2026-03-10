'use client';

import { SignChip } from '@/components/ui/Chip';
import { getCategoryByKey } from '@/lib/data/categories';
import type { CategoryKey } from '@/lib/data/types';

interface SignPickerProps {
  category: CategoryKey;
  selectedSignIds: string[];
  onToggle: (signId: string) => void;
}

export function SignPicker({ category, selectedSignIds, onToggle }: SignPickerProps) {
  const cat = getCategoryByKey(category);

  return (
    <div>
      <p
        style={{
          fontSize: '0.8125rem',
          color: 'var(--color-text-tertiary)',
          marginBottom: '12px',
        }}
      >
        What did you notice? Select one or more.
      </p>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        {cat.signs.map((sign) => (
          <SignChip
            key={sign.id}
            label={sign.label}
            selected={selectedSignIds.includes(sign.id)}
            category={category}
            onToggle={() => onToggle(sign.id)}
          />
        ))}
      </div>
    </div>
  );
}
