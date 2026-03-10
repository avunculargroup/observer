'use client';

import { InputField } from '@/components/ui/InputField';

interface ReflectionFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function ReflectionField({ value, onChange }: ReflectionFieldProps) {
  return (
    <InputField
      label="Today's reflections"
      multiline
      rows={4}
      placeholder="Anything else on your mind today?"
      value={value}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
    />
  );
}
