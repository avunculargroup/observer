'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRealtimeSubscription } from '@/lib/supabase/realtime';
import { TimelineEntry } from '@/components/timeline/TimelineEntry';
import { FilterBar } from '@/components/timeline/FilterBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { useObservations } from '@/lib/hooks/useObservations';
import { formatDateHeading, groupByDate } from '@/lib/utils/dates';
import type { Observation, CategoryKey, Intensity } from '@/lib/data/types';

export function TimelineFeed() {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<CategoryKey[]>([]);
  const [selectedIntensity, setSelectedIntensity] = useState<Intensity | null>(null);

  const { deleteObservation } = useObservations();

  const fetchObservations = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id ?? null);

    const { data, error } = await supabase
      .from('observations')
      .select('*, profile:profiles(id, display_name)')
      .order('observed_at', { ascending: false })
      .limit(200);

    if (!error && data) {
      setObservations(data as unknown as Observation[]);
    }
    setLoadingData(false);
  }, []);

  useEffect(() => {
    fetchObservations();
  }, [fetchObservations]);

  useRealtimeSubscription('observations', useCallback(() => {
    fetchObservations();
  }, [fetchObservations]));

  function handleToggleCategory(key: CategoryKey) {
    setSelectedCategories((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  function handleToggleIntensity(intensity: Intensity | null) {
    setSelectedIntensity(intensity);
  }

  async function handleDelete(id: string) {
    const success = await deleteObservation(id);
    if (success) {
      setObservations((prev) => prev.filter((o) => o.id !== id));
    }
  }

  // Apply filters
  let filtered = observations;
  if (selectedCategories.length > 0) {
    filtered = filtered.filter((o) => selectedCategories.includes(o.category));
  }
  if (selectedIntensity !== null) {
    filtered = filtered.filter((o) => o.intensity === selectedIntensity);
  }

  const grouped = groupByDate(filtered);
  const dateKeys = Array.from(grouped.keys()).sort((a, b) => b.localeCompare(a));

  if (loadingData) {
    return (
      <div style={{ padding: '48px 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-tertiary)', fontSize: '0.9375rem' }}>
          Loading observations...
        </p>
      </div>
    );
  }

  return (
    <div>
      <FilterBar
        selectedCategories={selectedCategories}
        onToggleCategory={handleToggleCategory}
        selectedIntensity={selectedIntensity}
        onToggleIntensity={handleToggleIntensity}
      />

      {dateKeys.length === 0 ? (
        <EmptyState message="Nothing here yet. Tap + to log your first observation." />
      ) : (
        dateKeys.map((dateKey) => {
          const entries = grouped.get(dateKey) ?? [];
          return (
            <div key={dateKey} style={{ marginBottom: '24px' }}>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: 'var(--color-text-tertiary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '8px',
                }}
              >
                {formatDateHeading(dateKey)}
              </h3>
              {entries.map((obs) => (
                <TimelineEntry
                  key={obs.id}
                  observation={obs}
                  isOwn={obs.user_id === currentUserId}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          );
        })
      )}
    </div>
  );
}
