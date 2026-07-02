export function Logo({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M17 7 L10 10.5 L5 17.5 L10 21 L13 18.5 L13 40 L35 40 L35 18.5 L38 21 L43 17.5 L38 10.5 L31 7 Q28 11 24 11 Q20 11 17 7 Z"
        stroke="var(--color-charcoal)"
        strokeWidth="2.4"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="var(--color-white)"
      />
      <path
        d="M24 29 C24 25.5 20.8 23.5 18.4 25.1 C16.4 26.4 16.1 29.2 17.8 30.9 L24 37 L30.2 30.9 C31.9 29.2 31.6 26.4 29.6 25.1 C27.2 23.5 24 25.5 24 29 Z"
        fill="var(--color-coral)"
      />
    </svg>
  )
}
