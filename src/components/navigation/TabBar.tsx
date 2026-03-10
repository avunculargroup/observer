'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  ClockCounterClockwise,
  BookOpen,
  ChartBar,
  GearSix,
} from '@phosphor-icons/react';

const tabs = [
  { href: '/timeline', label: 'Timeline', Icon: ClockCounterClockwise },
  { href: '/journal', label: 'Journal', Icon: BookOpen },
  { href: '/insights', label: 'Insights', Icon: ChartBar },
  { href: '/settings', label: 'Settings', Icon: GearSix },
] as const;

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          height: '64px',
          maxWidth: '480px',
          margin: '0 auto',
        }}
      >
        {tabs.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                textDecoration: 'none',
                color: active ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
                minWidth: '44px',
                minHeight: '44px',
                justifyContent: 'center',
              }}
              aria-label={label}
            >
              <Icon size={24} weight={active ? 'fill' : 'regular'} />
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 500,
                  fontFamily: 'var(--font-body)',
                }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
