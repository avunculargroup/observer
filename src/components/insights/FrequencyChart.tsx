'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { CATEGORIES } from '@/lib/data/categories';
import type { Observation } from '@/lib/data/types';

interface FrequencyChartProps {
  observations: Observation[];
}

const CATEGORY_HEX: Record<string, string> = {
  inattention: '#6366F1',
  hyperactivity: '#F97316',
  impulsivity: '#EF4444',
  emotional: '#EC4899',
  social: '#8B5CF6',
  school: '#0EA5E9',
  lessObvious: '#14B8A6',
};

function getWeekLabel(date: Date): string {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay());
  return `${start.getDate()}/${start.getMonth() + 1}`;
}

export function FrequencyChart({ observations }: FrequencyChartProps) {
  // Build 8-week data
  const now = new Date();
  const weeks: Map<string, Record<string, number>> = new Map();

  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - i * 7 - weekStart.getDay());
    const label = getWeekLabel(weekStart);
    const data: Record<string, number> = { week: 0 };
    CATEGORIES.forEach((c) => {
      data[c.key] = 0;
    });
    weeks.set(label, data);
  }

  for (const obs of observations) {
    const d = new Date(obs.observed_at);
    const label = getWeekLabel(d);
    const weekData = weeks.get(label);
    if (weekData && weekData[obs.category] !== undefined) {
      weekData[obs.category]++;
    }
  }

  const chartData = Array.from(weeks.entries()).map(([week, data]) => ({
    week,
    ...data,
  }));

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
        Weekly frequency
      </h3>
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 8px 8px',
        }}
      >
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData}>
            <XAxis
              dataKey="week"
              tick={{ fontSize: 10, fill: '#A8A29E' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#A8A29E' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: '#FFFFFF',
                border: '1px solid #E8E4DD',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '10px' }}
              iconType="circle"
              iconSize={8}
            />
            {CATEGORIES.map((cat) => (
              <Bar
                key={cat.key}
                dataKey={cat.key}
                stackId="a"
                fill={CATEGORY_HEX[cat.key]}
                name={cat.label}
                radius={cat.key === 'lessObvious' ? [2, 2, 0, 0] : undefined}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
