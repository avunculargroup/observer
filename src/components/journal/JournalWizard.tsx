'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { CategoryCard } from '@/components/journal/CategoryCard';
import { MoodSelector } from '@/components/journal/MoodSelector';
import { ReflectionField } from '@/components/journal/ReflectionField';
import { CATEGORIES } from '@/lib/data/categories';
import { useObservations } from '@/lib/hooks/useObservations';
import { useJournal } from '@/lib/hooks/useJournal';
import type { CategoryKey, Intensity, Mood } from '@/lib/data/types';
import { CaretLeft, CaretRight, SkipForward } from '@phosphor-icons/react';

interface SignEntry {
  signId: string;
  intensity: Intensity;
}

type CategoryData = Record<CategoryKey, SignEntry[]>;

export function JournalWizard() {
  const [step, setStep] = useState(0); // 0-6 = categories, 7 = summary
  const [categoryData, setCategoryData] = useState<CategoryData>(() => {
    const initial = {} as CategoryData;
    CATEGORIES.forEach((c) => {
      initial[c.key] = [];
    });
    return initial;
  });
  const [mood, setMood] = useState<Mood | null>(null);
  const [reflection, setReflection] = useState('');
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { insertMultipleObservations, loading: obsLoading } = useObservations();
  const { createJournal, loading: journalLoading } = useJournal();

  const totalSteps = CATEGORIES.length + 1; // 7 categories + summary
  const isLastCategory = step === CATEGORIES.length - 1;
  const isSummary = step === CATEGORIES.length;
  const currentCategory = !isSummary ? CATEGORIES[step] : null;

  const handleToggleSign = useCallback(
    (signId: string) => {
      if (!currentCategory) return;
      setCategoryData((prev) => {
        const current = prev[currentCategory.key];
        const exists = current.find((s) => s.signId === signId);
        return {
          ...prev,
          [currentCategory.key]: exists
            ? current.filter((s) => s.signId !== signId)
            : [...current, { signId, intensity: 2 as Intensity }],
        };
      });
    },
    [currentCategory]
  );

  const handleIntensityChange = useCallback(
    (signId: string, intensity: Intensity) => {
      if (!currentCategory) return;
      setCategoryData((prev) => ({
        ...prev,
        [currentCategory.key]: prev[currentCategory.key].map((s) =>
          s.signId === signId ? { ...s, intensity } : s
        ),
      }));
    },
    [currentCategory]
  );

  async function handleSubmit() {
    setSaveError(null);

    const journal = await createJournal({
      overall_mood: mood,
      reflection: reflection || null,
    });

    if (!journal) {
      setSaveError('Could not save journal. Please try again.');
      return;
    }

    const allObservations = CATEGORIES.flatMap((cat) =>
      categoryData[cat.key].map((entry) => {
        const sign = cat.signs.find((s) => s.id === entry.signId);
        return {
          category: cat.key,
          sign_id: entry.signId,
          sign_label: sign?.label ?? '',
          intensity: entry.intensity,
          source: 'journal' as const,
          journal_id: journal.id,
        };
      })
    );

    if (allObservations.length > 0) {
      const result = await insertMultipleObservations(allObservations);
      if (!result) {
        setSaveError('Journal saved but observations failed to save. Please try again.');
        return;
      }
    }

    setSaved(true);
    window.dispatchEvent(new CustomEvent('observations-updated'));
  }

  const totalSignsSelected = Object.values(categoryData).reduce(
    (sum, signs) => sum + signs.length,
    0
  );

  if (saved) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✨</div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.375rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            marginBottom: '8px',
          }}
        >
          Nice work — today&apos;s journal is saved.
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
          You logged {totalSignsSelected} observation{totalSignsSelected !== 1 ? 's' : ''} today.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Progress bar */}
      <div style={{ display: 'flex', gap: '3px', marginBottom: '20px' }}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: '3px',
              borderRadius: 'var(--radius-full)',
              background: i <= step ? 'var(--color-primary)' : 'var(--color-border)',
              transition: `background var(--duration-fast) var(--ease-out)`,
            }}
          />
        ))}
      </div>

      {/* Category steps */}
      {currentCategory && (
        <div
          key={currentCategory.key}
          style={{
            animation: 'fade-in 250ms var(--ease-out)',
          }}
        >
          <CategoryCard
            category={currentCategory.key}
            selectedSigns={categoryData[currentCategory.key]}
            onToggleSign={handleToggleSign}
            onIntensityChange={handleIntensityChange}
          />
        </div>
      )}

      {/* Summary step */}
      {isSummary && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fade-in 250ms var(--ease-out)' }}>
          <MoodSelector
            label="How was the overall mood today?"
            value={mood}
            onChange={setMood}
          />
          <ReflectionField value={reflection} onChange={setReflection} />

          <div
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-surface-raised)',
              fontSize: '0.8125rem',
              color: 'var(--color-text-secondary)',
            }}
          >
            {totalSignsSelected} observation{totalSignsSelected !== 1 ? 's' : ''} across{' '}
            {Object.values(categoryData).filter((s) => s.length > 0).length} categories
          </div>

          {saveError && (
            <p
              role="alert"
              style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-error-light, #FEF2F2)',
                color: 'var(--color-error)',
                fontSize: '0.8125rem',
                fontFamily: 'var(--font-body)',
              }}
            >
              {saveError}
            </p>
          )}
        </div>
      )}

      {/* Navigation */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '20px',
          gap: '12px',
        }}
      >
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'none',
            border: 'none',
            color: step === 0 ? 'var(--color-text-tertiary)' : 'var(--color-text-secondary)',
            cursor: step === 0 ? 'default' : 'pointer',
            fontSize: '0.9375rem',
            fontFamily: 'var(--font-body)',
            minHeight: '44px',
            padding: '8px',
          }}
          aria-label="Previous category"
        >
          <CaretLeft size={18} weight="bold" />
          Back
        </button>

        {!isSummary && (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              color: 'var(--color-text-tertiary)',
              cursor: 'pointer',
              fontSize: '0.8125rem',
              fontFamily: 'var(--font-body)',
              minHeight: '44px',
              padding: '8px',
            }}
            aria-label="Skip category"
          >
            Skip
            <SkipForward size={16} weight="bold" />
          </button>
        )}

        {!isSummary ? (
          <Button onClick={() => setStep((s) => s + 1)}>
            {isLastCategory ? 'Review' : 'Next'}
            <CaretRight size={16} weight="bold" style={{ marginLeft: '4px' }} />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            loading={obsLoading || journalLoading}
            disabled={!mood}
          >
            Save journal
          </Button>
        )}
      </div>
    </div>
  );
}
