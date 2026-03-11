'use client';

import { useEffect, useState } from 'react';
import { Export, X } from '@phosphor-icons/react';

const DISMISSED_KEY = 'install-prompt-dismissed';
const SHOW_DELAY_MS = 3000;

export function InstallPrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as { standalone?: boolean }).standalone === true;
    const isDismissed = localStorage.getItem(DISMISSED_KEY) === 'true';

    if (!isIos || isStandalone || isDismissed) return;

    const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, 'true');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="banner"
      aria-label="Install app prompt"
      style={{
        position: 'fixed',
        bottom: 'calc(64px + env(safe-area-inset-bottom) + 8px)',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: '448px',
        zIndex: 40,
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sheet)',
        border: '1px solid var(--color-border)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        animation: 'slide-up 300ms var(--ease-out)',
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: '36px',
          height: '36px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--color-primary-lighter)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Export size={20} weight="bold" color="var(--color-primary)" />
      </div>

      <p
        style={{
          flex: 1,
          fontFamily: 'var(--font-body)',
          fontSize: '0.875rem',
          lineHeight: 1.4,
          color: 'var(--color-text-primary)',
          margin: 0,
        }}
      >
        Tap <Export size={14} weight="bold" style={{ verticalAlign: 'middle', margin: '0 1px' }} /> then{' '}
        <strong style={{ fontWeight: 600 }}>Add to Home Screen</strong> for the best experience.
      </p>

      <button
        onClick={dismiss}
        aria-label="Dismiss install prompt"
        style={{
          flexShrink: 0,
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'none',
          border: 'none',
          borderRadius: 'var(--radius-full)',
          cursor: 'pointer',
          color: 'var(--color-text-tertiary)',
          padding: 0,
        }}
      >
        <X size={18} weight="bold" />
      </button>
    </div>
  );
}
