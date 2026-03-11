'use server';

import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function invitePartner(email: string) {
  if (!email || !email.includes('@')) {
    return { error: 'Please enter a valid email address.' };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be signed in.' };
  }

  if (user.email?.toLowerCase() === email.toLowerCase()) {
    return { error: "That's your own email address." };
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return { error: 'Invite service is not configured. Please contact support.' };
  }

  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Check if partner already has an account
  const { data: existingProfiles } = await admin
    .from('profiles')
    .select('id, email')
    .neq('id', user.id);

  const alreadyJoined = existingProfiles?.find(
    (p) => p.email?.toLowerCase() === email.toLowerCase()
  );

  if (alreadyJoined) {
    return { error: 'This person already has an account.' };
  }

  const profileCount = (existingProfiles?.length ?? 0) + 1;
  if (profileCount >= 2) {
    return { error: 'A partner has already joined. This app supports two parents.' };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { invited_by: user.id },
    redirectTo: `${siteUrl}/callback`,
  });

  if (inviteError) {
    console.error('[invitePartner] invite failed:', inviteError.message, inviteError);
    return { error: `Could not send invite: ${inviteError.message}` };
  }

  return { success: true };
}

export async function getPartnerStatus() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { partner: null };
  }

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, display_name, email')
    .neq('id', user.id);

  if (profiles && profiles.length > 0) {
    return { partner: { displayName: profiles[0].display_name, email: profiles[0].email } };
  }

  return { partner: null };
}
