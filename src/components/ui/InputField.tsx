'use client';

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';

interface BaseInputProps {
  label?: string;
  multiline?: boolean;
  rows?: number;
}

type InputFieldProps = BaseInputProps &
  (InputHTMLAttributes<HTMLInputElement> | TextareaHTMLAttributes<HTMLTextAreaElement>);

const inputStyles: React.CSSProperties = {
  width: '100%',
  background: 'var(--color-surface-raised)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  padding: '12px 14px',
  fontSize: '0.9375rem',
  fontFamily: 'var(--font-body)',
  color: 'var(--color-text-primary)',
  outline: 'none',
  transition: `border-color var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out)`,
  resize: 'vertical',
};

export const InputField = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputFieldProps>(
  ({ label, multiline, rows = 3, ...props }, ref) => {
    function handleFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
      e.target.style.borderColor = 'var(--color-primary)';
      e.target.style.boxShadow = '0 0 0 3px var(--color-primary-lighter)';
      e.target.style.background = 'var(--color-surface)';
    }

    function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
      e.target.style.borderColor = 'var(--color-border)';
      e.target.style.boxShadow = 'none';
      e.target.style.background = 'var(--color-surface-raised)';
    }

    return (
      <div>
        {label && (
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: 'var(--color-text-secondary)',
            }}
          >
            {label}
          </label>
        )}
        {multiline ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            rows={rows}
            style={inputStyles}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            style={inputStyles}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...(props as InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';
