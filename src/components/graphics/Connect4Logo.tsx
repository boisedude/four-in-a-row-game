/**
 * Connect4 Logo Component
 * Custom SVG logo for Connect4 game with MC branding
 * Designed by M. Cooper for www.mcooper.com
 */

interface Connect4LogoProps {
  className?: string
  size?: number
}

export function Connect4Logo({ className, size = 100 }: Connect4LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Connect 4 Logo by M. Cooper"
    >
      <defs>
        {/* Board gradient */}
        <linearGradient id="boardGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#2563eb', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#1d4ed8', stopOpacity: 1 }} />
        </linearGradient>

        {/* Red disc gradient */}
        <radialGradient id="redGradient" cx="30%" cy="30%">
          <stop offset="0%" style={{ stopColor: '#fca5a5', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#ef4444', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#dc2626', stopOpacity: 1 }} />
        </radialGradient>

        {/* Yellow disc gradient */}
        <radialGradient id="yellowGradient" cx="30%" cy="30%">
          <stop offset="0%" style={{ stopColor: '#fde047', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#eab308', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#ca8a04', stopOpacity: 1 }} />
        </radialGradient>

        {/* MC brand gradient */}
        <linearGradient id="mcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#1e40af', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Outer glow */}
      <rect x="8" y="8" width="104" height="104" rx="12" fill="url(#boardGradient)" opacity="0.2" />

      {/* Board background */}
      <rect x="10" y="10" width="100" height="100" rx="10" fill="url(#boardGradient)" />

      {/* Board shadow */}
      <rect x="10" y="10" width="100" height="100" rx="10" fill="black" opacity="0.1" />

      {/* Grid pattern - 4x4 */}
      {/* Row 1 */}
      <circle cx="27" cy="27" r="7" fill="#dbeafe" opacity="0.8" />
      <circle cx="47" cy="27" r="7" fill="#dbeafe" opacity="0.8" />
      <circle cx="67" cy="27" r="7" fill="#dbeafe" opacity="0.8" />
      <circle cx="87" cy="27" r="7" fill="#dbeafe" opacity="0.8" />

      {/* Row 2 */}
      <circle cx="27" cy="47" r="7" fill="#dbeafe" opacity="0.8" />
      <circle cx="47" cy="47" r="7" fill="url(#redGradient)" />
      <circle cx="67" cy="47" r="7" fill="url(#redGradient)" />
      <circle cx="87" cy="47" r="7" fill="url(#redGradient)" />

      {/* Row 3 */}
      <circle cx="27" cy="67" r="7" fill="url(#yellowGradient)" />
      <circle cx="47" cy="67" r="7" fill="url(#redGradient)" />
      <circle cx="67" cy="67" r="7" fill="#dbeafe" opacity="0.8" />
      <circle cx="87" cy="67" r="7" fill="url(#yellowGradient)" />

      {/* Row 4 */}
      <circle cx="27" cy="87" r="7" fill="url(#yellowGradient)" />
      <circle cx="47" cy="87" r="7" fill="url(#yellowGradient)" />
      <circle cx="67" cy="87" r="7" fill="url(#yellowGradient)" />
      <circle cx="87" cy="87" r="7" fill="url(#redGradient)" />

      {/* Highlights on discs */}
      <circle cx="49" cy="45" r="2.5" fill="white" opacity="0.7" />
      <circle cx="69" cy="45" r="2.5" fill="white" opacity="0.7" />
      <circle cx="89" cy="45" r="2.5" fill="white" opacity="0.7" />

      {/* MC Signature badge at bottom */}
      <g transform="translate(60, 100)">
        <rect x="-10" y="-6" width="20" height="12" rx="2" fill="url(#mcGradient)" />
        <text
          x="0"
          y="2"
          fontSize="8"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
          fill="white"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          MC
        </text>
      </g>
    </svg>
  )
}
