'use client';

import { useState, useCallback, type ReactNode } from 'react';
import { TabBar } from '@/components/navigation/TabBar';
import { FAB } from '@/components/navigation/FAB';
import { QuickLogSheet } from '@/components/quick-log/QuickLogSheet';
import { Toast } from '@/components/ui/Toast';
import { InstallPrompt } from '@/components/ui/InstallPrompt';
import { Logo } from '@/components/ui/Logo';

export default function AppLayout({ children }: { children: ReactNode }) {
  const [quickLogOpen, setQuickLogOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const handleSaved = useCallback(() => {
    setQuickLogOpen(false);
    setToastVisible(true);
  }, []);

  const handleToastHide = useCallback(() => {
    setToastVisible(false);
  }, []);

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'var(--color-bg)',
        paddingBottom: 'calc(64px + env(safe-area-inset-bottom))',
      }}
    >
      {/* App header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          background: 'var(--color-bg)',
          borderBottom: '1px solid var(--color-border-subtle)',
        }}
      >
        <div
          style={{
            maxWidth: '480px',
            margin: '0 auto',
            padding: '0 20px',
            height: '52px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Logo variant="wordmark" size={32} />
        </div>
      </header>

      <div
        style={{
          maxWidth: '480px',
          margin: '0 auto',
          padding: '0 20px',
        }}
      >
        {children}
      </div>

      {!quickLogOpen && <FAB onClick={() => setQuickLogOpen(true)} />}
      <TabBar />

      <QuickLogSheet
        open={quickLogOpen}
        onClose={() => setQuickLogOpen(false)}
        onSaved={handleSaved}
      />

      <Toast
        message="Got it ✓"
        visible={toastVisible}
        onHide={handleToastHide}
      />

      <InstallPrompt />
    </div>
  );
}
