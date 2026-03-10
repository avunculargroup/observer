'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { CategoryChip } from '@/components/ui/Chip';
import { getCategoryByKey } from '@/lib/data/categories';
import { formatTime } from '@/lib/utils/dates';
import { INTENSITY_LABELS } from '@/lib/utils/constants';
import type { Observation, Intensity } from '@/lib/data/types';
import { CaretDown, CaretUp, Trash, Pencil } from '@phosphor-icons/react';

interface TimelineEntryProps {
  observation: Observation;
  isOwn: boolean;
  onEdit?: (observation: Observation) => void;
  onDelete?: (id: string) => void;
}

export function TimelineEntry({ observation, isOwn, onEdit, onDelete }: TimelineEntryProps) {
  const [expanded, setExpanded] = useState(false);
  const cat = getCategoryByKey(observation.category);

  return (
    <Card categoryAccent={observation.category} style={{ marginBottom: '8px' }}>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          textAlign: 'left',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <CategoryChip category={observation.category} label={cat.label} />
            <span
              style={{
                fontSize: '0.6875rem',
                color: 'var(--color-text-tertiary)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {formatTime(observation.observed_at)}
            </span>
          </div>
          <p
            style={{
              fontSize: '0.9375rem',
              fontWeight: 500,
              color: 'var(--color-text-primary)',
              margin: 0,
            }}
          >
            {observation.sign_label}
          </p>
          <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
            {[1, 2, 3].map((level) => (
              <div
                key={level}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: 'var(--radius-full)',
                  background:
                    level <= observation.intensity
                      ? `var(--cat-${observation.category})`
                      : 'var(--color-border)',
                }}
              />
            ))}
            <span
              style={{
                fontSize: '0.6875rem',
                color: 'var(--color-text-tertiary)',
                marginLeft: '4px',
              }}
            >
              {INTENSITY_LABELS[observation.intensity as Intensity].short}
            </span>
          </div>
        </div>

        {expanded ? (
          <CaretUp size={18} weight="bold" color="var(--color-text-tertiary)" />
        ) : (
          <CaretDown size={18} weight="bold" color="var(--color-text-tertiary)" />
        )}
      </button>

      {expanded && (
        <div style={{ marginTop: '12px', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '12px' }}>
          {observation.note && (
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
              {observation.note}
            </p>
          )}

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '0.6875rem', color: 'var(--color-text-tertiary)' }}>
            {observation.context && (
              <span>📍 {observation.context}</span>
            )}
            <span>
              {observation.source === 'quick_log' ? '⚡ Quick log' : '📓 Journal'}
            </span>
            {observation.profile && (
              <span>👤 {observation.profile.display_name}</span>
            )}
          </div>

          {isOwn && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              {onEdit && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onEdit(observation); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    fontSize: '0.8125rem',
                    fontFamily: 'var(--font-body)',
                    padding: '8px',
                    minHeight: '44px',
                  }}
                  aria-label="Edit observation"
                >
                  <Pencil size={16} weight="bold" /> Edit
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onDelete(observation.id); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-error)',
                    cursor: 'pointer',
                    fontSize: '0.8125rem',
                    fontFamily: 'var(--font-body)',
                    padding: '8px',
                    minHeight: '44px',
                  }}
                  aria-label="Delete observation"
                >
                  <Trash size={16} weight="bold" /> Delete
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
