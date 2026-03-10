import type { SupabaseClient, User } from '@supabase/supabase-js';

/**
 * Guarantees a row exists in `profiles` for the given user.
 * The profile should normally be created by the DB trigger on auth.users INSERT.
 * This is a fallback for users who existed before the trigger was added.
 */
export async function ensureProfile(supabase: SupabaseClient, user: User): Promise<boolean> {
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single();

  if (data) return true;

  // Profile missing — try to create it. Refresh the session first
  // so the JWT sent to PostgREST is current.
  await supabase.auth.refreshSession();

  const { error } = await supabase.from('profiles').insert({
    id: user.id,
    display_name: user.email?.split('@')[0] ?? 'Parent',
    email: user.email ?? '',
  });

  if (error) {
    console.error('[ensureProfile] failed:', error.message, error);
    return false;
  }

  return true;
}
