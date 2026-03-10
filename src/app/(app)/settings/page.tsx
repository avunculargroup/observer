'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';
import { Card } from '@/components/ui/Card';
import { ExportControls } from '@/components/export/ExportControls';
import { useRouter } from 'next/navigation';
import { SignOut, User, Bell, Download, Info } from '@phosphor-icons/react';

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [reminderTime, setReminderTime] = useState('20:00');
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setEmail(user.email ?? '');

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setDisplayName(profile.display_name ?? '');
        setReminderTime(profile.reminder_time ?? '20:00');
      }
      setLoaded(true);
    }
    load();
  }, []);

  async function handleSaveProfile() {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({ display_name: displayName, reminder_time: reminderTime })
        .eq('id', user.id);
    }
    setSaving(false);
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  }

  if (!loaded) {
    return (
      <div style={{ paddingTop: '24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-tertiary)' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '24px', paddingBottom: '24px' }}>
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.375rem',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          marginBottom: '20px',
        }}
      >
        Settings
      </h1>

      {/* Profile */}
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <User size={22} weight="duotone" color="var(--color-primary)" />
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
            }}
          >
            Profile
          </h2>
        </div>
        <InputField
          label="Display name"
          value={displayName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value)}
        />
        <div style={{ marginTop: '12px' }}>
          <p
            style={{
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: 'var(--color-text-secondary)',
              marginBottom: '4px',
            }}
          >
            Email
          </p>
          <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-tertiary)' }}>
            {email}
          </p>
        </div>
        <div style={{ marginTop: '16px' }}>
          <Button onClick={handleSaveProfile} loading={saving}>
            Save
          </Button>
        </div>
      </Card>

      {/* Reminders */}
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Bell size={22} weight="duotone" color="var(--color-warning)" />
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
            }}
          >
            Reminder
          </h2>
        </div>
        <InputField
          label="Journal reminder time"
          type="time"
          value={reminderTime}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReminderTime(e.target.value)}
        />
      </Card>

      {/* Export */}
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Download size={22} weight="duotone" color="var(--color-primary)" />
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
            }}
          >
            Export
          </h2>
        </div>
        <ExportControls />
      </Card>

      {/* About */}
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Info size={22} weight="duotone" color="var(--color-text-tertiary)" />
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
            }}
          >
            About
          </h2>
        </div>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
          ADHD Observer v1.0
        </p>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-tertiary)', lineHeight: 1.6 }}>
          This app is an observation tool — not a diagnostic instrument. It is designed to help you
          record and share behavioural observations with your child&apos;s healthcare provider. Always
          consult a qualified professional for evaluation.
        </p>
      </Card>

      {/* Sign Out */}
      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <Button variant="ghost" onClick={handleSignOut}>
          <SignOut size={18} weight="bold" style={{ marginRight: '6px' }} />
          Sign out
        </Button>
      </div>
    </div>
  );
}
