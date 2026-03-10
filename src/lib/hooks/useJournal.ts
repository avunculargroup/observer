'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ensureProfile } from '@/lib/supabase/ensure-profile';
import type { Journal, Mood } from '@/lib/data/types';
import { getTodayDateString } from '@/lib/utils/dates';

interface CreateJournalParams {
  overall_mood: Mood | null;
  reflection: string | null;
}

export function useJournal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getTodayJournal(): Promise<Journal | null> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
      .from('journals')
      .select('*')
      .eq('user_id', user.id)
      .eq('journal_date', getTodayDateString())
      .single();

    return data as Journal | null;
  }

  async function createJournal(params: CreateJournalParams): Promise<Journal | null> {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError('Not authenticated');
      setLoading(false);
      return null;
    }

    const profileOk = await ensureProfile(supabase, user);
    if (!profileOk) {
      setError('Could not create user profile');
      setLoading(false);
      return null;
    }

    const today = getTodayDateString();

    // Check if journal already exists for today
    const { data: existing } = await supabase
      .from('journals')
      .select('*')
      .eq('user_id', user.id)
      .eq('journal_date', today)
      .single();

    if (existing) {
      // Update existing
      const { data, error: updateError } = await supabase
        .from('journals')
        .update({
          overall_mood: params.overall_mood,
          reflection: params.reflection,
          completed_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      setLoading(false);
      if (updateError) {
        setError(updateError.message);
        return null;
      }
      return data as Journal;
    }

    // Create new
    const { data, error: insertError } = await supabase
      .from('journals')
      .insert({
        user_id: user.id,
        journal_date: today,
        overall_mood: params.overall_mood,
        reflection: params.reflection,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return null;
    }

    return data as Journal;
  }

  return {
    loading,
    error,
    getTodayJournal,
    createJournal,
  };
}
