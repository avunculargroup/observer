'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { CategoryKey, Intensity, ObservationContext, ObservationSource } from '@/lib/data/types';

interface InsertObservationParams {
  category: CategoryKey;
  sign_id: string;
  sign_label: string;
  intensity: Intensity;
  note?: string | null;
  context?: ObservationContext | null;
  source: ObservationSource;
  journal_id?: string | null;
}

export function useObservations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function insertObservation(params: InsertObservationParams) {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError('Not authenticated');
      setLoading(false);
      return null;
    }

    const { data, error: insertError } = await supabase
      .from('observations')
      .insert({
        user_id: user.id,
        observed_at: new Date().toISOString(),
        source: params.source,
        category: params.category,
        sign_id: params.sign_id,
        sign_label: params.sign_label,
        intensity: params.intensity,
        note: params.note ?? null,
        context: params.context ?? null,
        journal_id: params.journal_id ?? null,
      })
      .select()
      .single();

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return null;
    }

    return data;
  }

  async function insertMultipleObservations(observations: InsertObservationParams[]) {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError('Not authenticated');
      setLoading(false);
      return null;
    }

    const rows = observations.map((params) => ({
      user_id: user.id,
      observed_at: new Date().toISOString(),
      source: params.source,
      category: params.category,
      sign_id: params.sign_id,
      sign_label: params.sign_label,
      intensity: params.intensity,
      note: params.note ?? null,
      context: params.context ?? null,
      journal_id: params.journal_id ?? null,
    }));

    const { data, error: insertError } = await supabase
      .from('observations')
      .insert(rows)
      .select();

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return null;
    }

    return data;
  }

  async function updateObservation(id: string, updates: Partial<InsertObservationParams>) {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: updateError } = await supabase
      .from('observations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return null;
    }

    return data;
  }

  async function deleteObservation(id: string) {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: deleteError } = await supabase
      .from('observations')
      .delete()
      .eq('id', id);

    setLoading(false);

    if (deleteError) {
      setError(deleteError.message);
      return false;
    }

    return true;
  }

  return {
    loading,
    error,
    insertObservation,
    insertMultipleObservations,
    updateObservation,
    deleteObservation,
  };
}
