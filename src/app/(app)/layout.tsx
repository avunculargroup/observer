'use client';

import { useState, type ReactNode } from 'react';
import { TabBar } from '@/components/navigation/TabBar';
import { FAB } from '@/components/navigation/FAB';
import { BottomSheet } from '@/components/ui/BottomSheet';

export default function AppLayout({ children }: { children: ReactNode }) {
  const [quickLogOpen, setQuickLogOpen] = useState(false);

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'var(--color-bg)',
        paddingBottom: 'calc(64px + env(safe-area-inset-bottom))',
      }}
    >
      <div
        style={{
          maxWidth: '480px',
          margin: '0 auto',
          padding: '0 20px',
        }}
      >
        {children}
      </div>

      <FAB onClick={() => setQuickLogOpen(true)} />
      <TabBar />

      <BottomSheet
        open={quickLogOpen}
        onClose={() => setQuickLogOpen(false)}
        title="Add an observation"
      >
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
          Quick log will be available soon.
        </p>
      </BottomSheet>
    </div>
  );
}
