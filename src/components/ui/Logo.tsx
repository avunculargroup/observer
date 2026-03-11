interface LogoProps {
  variant?: 'mark' | 'wordmark' | 'full';
  size?: number;
  className?: string;
}

function LogoMark({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="logo-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#14B8A6" />
          <stop offset="100%" stopColor="#0D9488" />
        </linearGradient>
      </defs>
      {/* Background */}
      <rect width="512" height="512" rx="115" fill="url(#logo-bg)" />
      {/* Upper eyelid arc */}
      <path
        d="M96 256 Q256 118 416 256"
        fill="none"
        stroke="white"
        strokeWidth="30"
        strokeLinecap="round"
      />
      {/* Lower eyelid arc */}
      <path
        d="M96 256 Q256 394 416 256"
        fill="none"
        stroke="white"
        strokeWidth="30"
        strokeLinecap="round"
      />
      {/* Iris ring */}
      <circle cx="256" cy="256" r="82" fill="none" stroke="white" strokeWidth="30" />
      {/* Pupil */}
      <circle cx="256" cy="256" r="38" fill="white" />
      {/* Catchlight */}
      <circle cx="228" cy="228" r="15" fill="white" opacity="0.55" />
    </svg>
  );
}

export function Logo({ variant = 'mark', size = 40, className }: LogoProps) {
  if (variant === 'mark') {
    return (
      <span className={className} aria-label="ADHD Observer">
        <LogoMark size={size} />
      </span>
    );
  }

  if (variant === 'wordmark') {
    return (
      <span
        className={className}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}
        aria-label="ADHD Observer"
      >
        <LogoMark size={size} />
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: `${size * 0.6}px`,
            color: 'var(--color-primary)',
            letterSpacing: '-0.01em',
            lineHeight: 1,
          }}
        >
          Observer
        </span>
      </span>
    );
  }

  // variant === 'full'
  return (
    <div
      className={className}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}
    >
      <LogoMark size={size} />
      <div style={{ textAlign: 'center' }}>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '1.75rem',
            color: 'var(--color-primary)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          ADHD Observer
        </p>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9375rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.5,
            marginTop: '4px',
          }}
        >
          Track observations together, one moment at a time.
        </p>
      </div>
    </div>
  );
}
