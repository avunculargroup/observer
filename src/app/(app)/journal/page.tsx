import { EmptyState } from '@/components/ui/EmptyState';

export default function JournalPage() {
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
        Journal
      </h1>
      <EmptyState message="Your daily journal will appear here. Come back to reflect on the day." />
    </div>
  );
}
