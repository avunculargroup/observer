'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/callback`,
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-5" style={{ background: 'var(--color-bg)' }}>
      <div className="w-full max-w-[360px]">
        <div className="mb-8 text-center">
          <h1
            className="font-[var(--font-display)] text-[1.75rem] font-extrabold leading-[1.3]"
            style={{ color: 'var(--color-text-primary)' }}
          >
            ADHD Observer
          </h1>
          <p
            className="mt-2 text-[0.9375rem] leading-[1.6]"
            style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)' }}
          >
            Track observations together, one moment at a time.
          </p>
        </div>

        {sent ? (
          <div
            className="rounded-[var(--radius-md)] p-6 text-center"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
          >
            <p
              className="text-[0.9375rem] font-medium leading-[1.6]"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Check your email
            </p>
            <p
              className="mt-2 text-[0.8125rem] leading-[1.4]"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              We sent a magic link to <strong>{email}</strong>. Click it to sign in.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div
              className="rounded-[var(--radius-md)] p-6"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            >
              <label
                htmlFor="email"
                className="mb-2 block text-[0.8125rem] font-medium"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-[var(--radius-sm)] px-[14px] py-3 text-[0.9375rem] outline-none transition-all"
                style={{
                  background: 'var(--color-surface-raised)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-primary)';
                  e.target.style.boxShadow = '0 0 0 3px var(--color-primary-lighter)';
                  e.target.style.background = 'var(--color-surface)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--color-border)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = 'var(--color-surface-raised)';
                }}
              />

              {error && (
                <p className="mt-2 text-[0.8125rem]" style={{ color: 'var(--color-error)' }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full rounded-[var(--radius-md)] px-6 py-3 text-[0.9375rem] font-medium transition-all"
                style={{
                  background: loading ? 'var(--color-primary-light)' : 'var(--color-primary)',
                  color: 'var(--color-text-inverse)',
                  boxShadow: 'var(--shadow-sm)',
                  minHeight: '44px',
                }}
              >
                {loading ? 'Sending link...' : 'Send magic link'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
