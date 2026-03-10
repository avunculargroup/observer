'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

export function Toast({ message, visible, onHide, duration = 1500 }: ToastProps) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (visible) {
      setExiting(false);
      const timer = setTimeout(() => {
        setExiting(true);
        setTimeout(onHide, 200);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onHide]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: '60px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        background: 'var(--color-text-primary)',
        color: 'var(--color-text-inverse)',
        padding: '10px 20px',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.9375rem',
        fontWeight: 500,
        fontFamily: 'var(--font-body)',
        boxShadow: 'var(--shadow-lg)',
        animation: exiting
          ? 'toast-out 200ms var(--ease-in) forwards'
          : 'toast-in 200ms var(--ease-out)',
      }}
    >
      {message}
    </div>
  );
}
