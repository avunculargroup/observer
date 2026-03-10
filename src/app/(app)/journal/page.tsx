'use client';

import { JournalWizard } from '@/components/journal/JournalWizard';

export default function JournalPage() {
  return (
    <div style={{ paddingTop: '24px', paddingBottom: '24px' }}>
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.375rem',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          marginBottom: '20px',
        }}
      >
        Daily Journal
      </h1>
      <JournalWizard />
    </div>
  );
}
