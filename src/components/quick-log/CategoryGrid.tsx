'use client';

import {
  EarSlash,
  Lightning,
  Timer,
  Heartbeat,
  UsersThree,
  GraduationCap,
  PuzzlePiece,
} from '@phosphor-icons/react';
import { CATEGORIES } from '@/lib/data/categories';
import type { CategoryKey } from '@/lib/data/types';
import type { ComponentType } from 'react';

const iconMap: Record<string, ComponentType<{ size: number; weight: 'duotone'; color: string; style?: React.CSSProperties }>> = {
  EarSlash,
  Lightning,
  Timer,
  Heartbeat,
  UsersThree,
  GraduationCap,
  PuzzlePiece,
};

interface CategoryGridProps {
  onSelect: (categoryKey: CategoryKey) => void;
}

export function CategoryGrid({ onSelect }: CategoryGridProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        padding: '8px 0',
      }}
    >
      {CATEGORIES.map((cat) => {
        const Icon = iconMap[cat.icon];
        return (
          <button
            key={cat.key}
            type="button"
            onClick={() => onSelect(cat.key)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              aspectRatio: '1',
              maxWidth: '80px',
              maxHeight: '80px',
              margin: '0 auto',
              borderRadius: 'var(--radius-md)',
              background: `var(--cat-${cat.key}-light)`,
              border: 'none',
              cursor: 'pointer',
              transition: `transform var(--duration-fast) var(--ease-out)`,
              minHeight: '44px',
              minWidth: '44px',
            }}
            aria-label={cat.label}
          >
            {Icon && (
              <Icon
                size={32}
                weight="duotone"
                color={`var(--cat-${cat.key}-icon)`}
                style={{ '--ph-duotone-opacity': 0.3 } as React.CSSProperties}
              />
            )}
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 500,
                color: `var(--cat-${cat.key}-icon)`,
                fontFamily: 'var(--font-body)',
                lineHeight: 1,
              }}
            >
              {cat.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
