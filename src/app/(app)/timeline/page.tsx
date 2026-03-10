'use client';

import { TimelineFeed } from '@/components/timeline/TimelineFeed';

export default function TimelinePage() {
  return (
    <div style={{ paddingTop: '24px' }}>
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.375rem',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          marginBottom: '16px',
        }}
      >
        Timeline
      </h1>
      <TimelineFeed />
    </div>
  );
}
