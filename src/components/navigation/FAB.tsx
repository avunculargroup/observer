'use client';

import { Plus } from '@phosphor-icons/react';

interface FABProps {
  onClick: () => void;
}

export function FAB({ onClick }: FABProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Add an observation"
      style={{
        position: 'fixed',
        bottom: `calc(80px + env(safe-area-inset-bottom))`,
        right: '20px',
        width: '56px',
        height: '56px',
        borderRadius: 'var(--radius-full)',
        background: 'var(--color-primary)',
        border: 'none',
        boxShadow: 'var(--shadow-lg)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 45,
        transition: `background var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out)`,
        animation: 'scale-in 300ms var(--ease-out)',
      }}
      onMouseDown={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'var(--color-primary-dark)';
        (e.currentTarget as HTMLElement).style.transform = 'scale(0.95)';
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'var(--color-primary)';
        (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'var(--color-primary)';
        (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
      }}
    >
      <Plus size={26} weight="bold" color="white" />
    </button>
  );
}
