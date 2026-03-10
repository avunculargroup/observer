'use client';

import { CATEGORIES } from '@/lib/data/categories';
import type { Observation } from '@/lib/data/types';

interface DayHeatmapProps {
  observations: Observation[];
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const CATEGORY_HEX: Record<string, string> = {
  inattention: '#6366F1',
  hyperactivity: '#F97316',
  impulsivity: '#EF4444',
  emotional: '#EC4899',
  social: '#8B5CF6',
  school: '#0EA5E9',
  lessObvious: '#14B8A6',
};

function getOpacity(count: number, max: number): number {
  if (max === 0 || count === 0) return 0.05;
  return 0.15 + (count / max) * 0.85;
}

export function DayHeatmap({ observations }: DayHeatmapProps) {
  // Build grid: category × day of week
  const grid: Record<string, number[]> = {};
  let maxCount = 0;

  CATEGORIES.forEach((cat) => {
    grid[cat.key] = [0, 0, 0, 0, 0, 0, 0];
  });

  for (const obs of observations) {
    const d = new Date(obs.observed_at);
    const day = (d.getDay() + 6) % 7; // Mon=0
    grid[obs.category][day]++;
    if (grid[obs.category][day] > maxCount) {
      maxCount = grid[obs.category][day];
    }
  }

  return (
    <div style={{ marginBottom: '24px' }}>
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1rem',
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          marginBottom: '12px',
        }}
      >
        Day of week patterns
      </h3>
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          overflowX: 'auto',
        }}
      >
        {/* Day headers */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '80px repeat(7, 1fr)',
            gap: '4px',
            marginBottom: '4px',
          }}
        >
          <div />
          {DAYS.map((day) => (
            <div
              key={day}
              style={{
                textAlign: 'center',
                fontSize: '0.6875rem',
                fontWeight: 500,
                color: 'var(--color-text-tertiary)',
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Category rows */}
        {CATEGORIES.map((cat) => (
          <div
            key={cat.key}
            style={{
              display: 'grid',
              gridTemplateColumns: '80px repeat(7, 1fr)',
              gap: '4px',
              marginBottom: '4px',
            }}
          >
            <div
              style={{
                fontSize: '0.6875rem',
                fontWeight: 500,
                color: 'var(--color-text-secondary)',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {cat.emoji} {cat.label}
            </div>
            {grid[cat.key].map((count, dayIdx) => (
              <div
                key={dayIdx}
                title={`${cat.label} on ${DAYS[dayIdx]}: ${count}`}
                style={{
                  aspectRatio: '1',
                  borderRadius: '4px',
                  background: CATEGORY_HEX[cat.key],
                  opacity: getOpacity(count, maxCount),
                  minHeight: '20px',
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
