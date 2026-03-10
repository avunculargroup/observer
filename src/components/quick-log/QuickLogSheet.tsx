'use client';

import { useState, useCallback } from 'react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { CategoryGrid } from '@/components/quick-log/CategoryGrid';
import { SignPicker } from '@/components/quick-log/SignPicker';
import { IntensityStep } from '@/components/quick-log/IntensityStep';
import { getCategoryByKey } from '@/lib/data/categories';
import { useObservations } from '@/lib/hooks/useObservations';
import type { CategoryKey, Intensity, ObservationContext } from '@/lib/data/types';
import { CaretLeft } from '@phosphor-icons/react';

type Step = 'category' | 'signs' | 'intensity';

interface QuickLogSheetProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function QuickLogSheet({ open, onClose, onSaved }: QuickLogSheetProps) {
  const [step, setStep] = useState<Step>('category');
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);
  const [selectedSignIds, setSelectedSignIds] = useState<string[]>([]);
  const [intensity, setIntensity] = useState<Intensity | null>(null);
  const [note, setNote] = useState('');
  const [context, setContext] = useState<ObservationContext | null>(null);

  const { insertObservation, loading } = useObservations();

  const reset = useCallback(() => {
    setStep('category');
    setSelectedCategory(null);
    setSelectedSignIds([]);
    setIntensity(null);
    setNote('');
    setContext(null);
  }, []);

  function handleClose() {
    reset();
    onClose();
  }

  function handleCategorySelect(key: CategoryKey) {
    setSelectedCategory(key);
    setStep('signs');
  }

  function handleSignToggle(signId: string) {
    setSelectedSignIds((prev) =>
      prev.includes(signId) ? prev.filter((id) => id !== signId) : [...prev, signId]
    );
  }

  function handleNext() {
    if (step === 'signs' && selectedSignIds.length > 0) {
      setStep('intensity');
    }
  }

  function handleBack() {
    if (step === 'intensity') {
      setStep('signs');
    } else if (step === 'signs') {
      setStep('category');
      setSelectedSignIds([]);
    }
  }

  async function handleSave() {
    if (!selectedCategory || selectedSignIds.length === 0 || !intensity) return;

    const category = getCategoryByKey(selectedCategory);

    for (const signId of selectedSignIds) {
      const sign = category.signs.find((s) => s.id === signId);
      if (!sign) continue;

      await insertObservation({
        category: selectedCategory,
        sign_id: signId,
        sign_label: sign.label,
        intensity,
        note: note || null,
        context,
        source: 'quick_log',
      });
    }

    reset();
    onSaved();
  }

  const stepTitle = (() => {
    if (step === 'category') return 'Add an observation';
    if (step === 'signs' && selectedCategory) {
      return getCategoryByKey(selectedCategory).label;
    }
    return 'Details';
  })();

  const stepNumber = step === 'category' ? 1 : step === 'signs' ? 2 : 3;

  return (
    <BottomSheet open={open} onClose={handleClose} title={stepTitle}>
      {/* Progress indicator */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            style={{
              flex: 1,
              height: '3px',
              borderRadius: 'var(--radius-full)',
              background: n <= stepNumber ? 'var(--color-primary)' : 'var(--color-border)',
              transition: `background var(--duration-fast) var(--ease-out)`,
            }}
          />
        ))}
      </div>

      {/* Back button */}
      {step !== 'category' && (
        <button
          type="button"
          onClick={handleBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'none',
            border: 'none',
            color: 'var(--color-text-secondary)',
            fontSize: '0.8125rem',
            fontFamily: 'var(--font-body)',
            cursor: 'pointer',
            padding: '4px 0',
            marginBottom: '12px',
            minHeight: '44px',
          }}
          aria-label="Go back"
        >
          <CaretLeft size={18} weight="bold" />
          Back
        </button>
      )}

      {/* Steps */}
      {step === 'category' && (
        <CategoryGrid onSelect={handleCategorySelect} />
      )}

      {step === 'signs' && selectedCategory && (
        <>
          <SignPicker
            category={selectedCategory}
            selectedSignIds={selectedSignIds}
            onToggle={handleSignToggle}
          />
          <div style={{ marginTop: '20px' }}>
            <Button
              fullWidth
              disabled={selectedSignIds.length === 0}
              onClick={handleNext}
            >
              Next ({selectedSignIds.length} selected)
            </Button>
          </div>
        </>
      )}

      {step === 'intensity' && selectedCategory && (
        <>
          <IntensityStep
            category={selectedCategory}
            intensity={intensity}
            onIntensityChange={setIntensity}
            note={note}
            onNoteChange={setNote}
            context={context}
            onContextChange={setContext}
          />
          <div style={{ marginTop: '20px' }}>
            <Button
              fullWidth
              disabled={!intensity}
              loading={loading}
              onClick={handleSave}
            >
              Log it
            </Button>
          </div>
        </>
      )}
    </BottomSheet>
  );
}
