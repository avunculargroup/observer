'use client';

import { CategoryChip } from '@/components/ui/Chip';
import { getCategoryByKey } from '@/lib/data/categories';
import type { Observation } from '@/lib/data/types';

interface TopSignsProps {
  observations: Observation[];
}

const CATEGORY_HEX: Record<string, string> = {
  inattention: '#6366F1',
  hyperactivity: '#F97316',
  impulsivity: '#EF4444',
  emotional: '#EC4899',
  social: '#8B5CF6',
  school: '#0EA5E9',
  lessObvious: '#14B8A6',
};

export function TopSigns({ observations }: TopSignsProps) {
  // Count sign occurrences
  const signCounts = new Map<string, { label: string; category: string; count: number }>();

  for (const obs of observations) {
    const existing = signCounts.get(obs.sign_id);
    if (existing) {
      existing.count++;
    } else {
      signCounts.set(obs.sign_id, {
        label: obs.sign_label,
        category: obs.category,
        count: 1,
      });
    }
  }

  const sorted = Array.from(signCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const maxCount = sorted.length > 0 ? sorted[0].count : 1;

  if (sorted.length === 0) return null;

  return (
    <div style={{ marginBottom: '24px' }}>
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1rem',
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          marginBottom: '12px',
        }}
      >
        Most noticed signs
      </h3>
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
        }}
      >
        {sorted.map((item, i) => {
          const cat = getCategoryByKey(item.category as import('@/lib/data/types').CategoryKey);
          return (
            <div
              key={`${item.category}-${item.label}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 0',
                borderBottom:
                  i < sorted.length - 1
                    ? '1px solid var(--color-border-subtle)'
                    : undefined,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8125rem',
                  color: 'var(--color-text-tertiary)',
                  width: '20px',
                  textAlign: 'right',
                }}
              >
                {i + 1}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: '0.9375rem',
                    fontWeight: 500,
                    color: 'var(--color-text-primary)',
                    margin: '0 0 4px',
                  }}
                >
                  {item.label}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CategoryChip category={cat.key} label={cat.label} />
                  <div
                    style={{
                      flex: 1,
                      height: '4px',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--color-surface-raised)',
                    }}
                  >
                    <div
                      style={{
                        width: `${(item.count / maxCount) * 100}%`,
                        height: '100%',
                        borderRadius: 'var(--radius-full)',
                        background: CATEGORY_HEX[item.category] ?? 'var(--color-primary)',
                        transition: `width var(--duration-normal) var(--ease-out)`,
                      }}
                    />
                  </div>
                </div>
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: 'var(--color-text-secondary)',
                }}
              >
                {item.count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
