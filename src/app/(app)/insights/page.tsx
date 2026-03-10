import { EmptyState } from '@/components/ui/EmptyState';

export default function InsightsPage() {
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
        Insights
      </h1>
      <EmptyState message="Patterns and trends will show up here once you start logging observations." />
    </div>
  );
}
