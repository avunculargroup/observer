'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { FrequencyChart } from '@/components/insights/FrequencyChart';
import { DayHeatmap } from '@/components/insights/DayHeatmap';
import { TopSigns } from '@/components/insights/TopSigns';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Observation } from '@/lib/data/types';

export default function InsightsPage() {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(30);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const since = new Date();
    since.setDate(since.getDate() - dateRange);

    const { data } = await supabase
      .from('observations')
      .select('*')
      .gte('observed_at', since.toISOString())
      .order('observed_at', { ascending: false });

    if (data) {
      setObservations(data as unknown as Observation[]);
    }
    setLoading(false);
  }, [dateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const rangeOptions = [
    { value: 7, label: '7 days' },
    { value: 30, label: '30 days' },
    { value: 90, label: '90 days' },
  ];

  return (
    <div style={{ paddingTop: '24px', paddingBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.375rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
          }}
        >
          Insights
        </h1>
        <div style={{ display: 'flex', gap: '4px' }}>
          {rangeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setDateRange(opt.value)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.6875rem',
                fontWeight: 500,
                fontFamily: 'var(--font-body)',
                border: dateRange === opt.value
                  ? '1.5px solid var(--color-primary)'
                  : '1px solid var(--color-border)',
                background: dateRange === opt.value
                  ? 'var(--color-primary-lighter)'
                  : 'var(--color-surface)',
                color: dateRange === opt.value
                  ? 'var(--color-primary-dark)'
                  : 'var(--color-text-tertiary)',
                cursor: 'pointer',
                minHeight: '44px',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p style={{ color: 'var(--color-text-tertiary)', textAlign: 'center', padding: '48px 0' }}>
          Loading insights...
        </p>
      ) : observations.length === 0 ? (
        <EmptyState message="Patterns and trends will show up here once you start logging observations." />
      ) : (
        <>
          <FrequencyChart observations={observations} />
          <DayHeatmap observations={observations} />
          <TopSigns observations={observations} />
        </>
      )}
    </div>
  );
}
