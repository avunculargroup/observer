import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Insert profile on first login
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .single();

      if (!existingProfile) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          display_name: data.user.email?.split('@')[0] ?? 'Parent',
          email: data.user.email,
        });
      }

      return NextResponse.redirect(`${origin}/timeline`);
    }
  }

  return NextResponse.redirect(`${origin}/login`);
}
