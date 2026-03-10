import type { CategoryKey } from '@/lib/data/types';
import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  categoryAccent?: CategoryKey;
}

export function Card({ children, categoryAccent, style, ...props }: CardProps) {
  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        boxShadow: 'var(--shadow-sm)',
        borderLeft: categoryAccent
          ? `4px solid var(--cat-${categoryAccent})`
          : undefined,
        transition: `box-shadow var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out)`,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
