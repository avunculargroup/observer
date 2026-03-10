'use client';

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { generateCSV, generatePDF } from '@/lib/utils/export';
import type { Observation } from '@/lib/data/types';
import { FilePdf, FileCsv } from '@phosphor-icons/react';

export function ExportControls() {
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(false);

  const fetchObservations = useCallback(async (): Promise<Observation[]> => {
    const supabase = createClient();
    const since = new Date();
    since.setDate(since.getDate() - days);

    const { data } = await supabase
      .from('observations')
      .select('*, profile:profiles(id, display_name)')
      .gte('observed_at', since.toISOString())
      .order('observed_at', { ascending: false });

    return (data ?? []) as unknown as Observation[];
  }, [days]);

  async function handlePDF() {
    setLoading(true);
    const obs = await fetchObservations();
    const from = new Date();
    from.setDate(from.getDate() - days);
    await generatePDF(obs, { from, to: new Date() });
    setLoading(false);
  }

  async function handleCSV() {
    setLoading(true);
    const obs = await fetchObservations();
    await generateCSV(obs);
    setLoading(false);
  }

  const rangeOptions = [
    { value: 7, label: '7 days' },
    { value: 30, label: '30 days' },
    { value: 90, label: '90 days' },
    { value: 365, label: 'All' },
  ];

  return (
    <div>
      <p
        style={{
          fontSize: '0.8125rem',
          color: 'var(--color-text-secondary)',
          marginBottom: '12px',
        }}
      >
        Generate a summary you can share with your child&apos;s doctor.
      </p>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
        {rangeOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setDays(opt.value)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.6875rem',
              fontWeight: 500,
              fontFamily: 'var(--font-body)',
              border: days === opt.value
                ? '1.5px solid var(--color-primary)'
                : '1px solid var(--color-border)',
              background: days === opt.value
                ? 'var(--color-primary-lighter)'
                : 'var(--color-surface)',
              color: days === opt.value
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

      <div style={{ display: 'flex', gap: '12px' }}>
        <Button variant="secondary" onClick={handlePDF} loading={loading} fullWidth>
          <FilePdf size={18} weight="bold" style={{ marginRight: '6px' }} />
          Export PDF
        </Button>
        <Button variant="secondary" onClick={handleCSV} loading={loading} fullWidth>
          <FileCsv size={18} weight="bold" style={{ marginRight: '6px' }} />
          Export CSV
        </Button>
      </div>
    </div>
  );
}
