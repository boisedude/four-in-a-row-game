/**
 * BoardCorner Component
 * Decorative corner embellishments with MC styling
 * Designed by M. Cooper for www.mcooper.com
 */

interface BoardCornerProps {
  position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  size?: number
  className?: string
}

export function BoardCorner({ position, size = 40, className }: BoardCornerProps) {
  // Calculate rotation based on position
  const rotations = {
    topLeft: 0,
    topRight: 90,
    bottomRight: 180,
    bottomLeft: 270,
  }

  const rotation = rotations[position]

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        position: 'absolute',
        ...(position === 'topLeft' && { top: 0, left: 0 }),
        ...(position === 'topRight' && { top: 0, right: 0 }),
        ...(position === 'bottomLeft' && { bottom: 0, left: 0 }),
        ...(position === 'bottomRight' && { bottom: 0, right: 0 }),
        transform: `rotate(${rotation}deg)`,
      }}
      aria-hidden="true"
    >
      <defs>
        {/* Gradient for ornamental design */}
        <linearGradient id={`cornerGradient-${position}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.8 }} />
          <stop offset="100%" style={{ stopColor: '#1e40af', stopOpacity: 0.6 }} />
        </linearGradient>

        {/* Gold accent gradient */}
        <linearGradient id={`goldAccent-${position}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#fbbf24', stopOpacity: 0.9 }} />
          <stop offset="100%" style={{ stopColor: '#f59e0b', stopOpacity: 0.8 }} />
        </linearGradient>
      </defs>

      {/* Main corner L-shape border */}
      <path
        d="M 5 5 L 5 25 M 5 5 L 25 5"
        stroke={`url(#cornerGradient-${position})`}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Outer decorative L-shape */}
      <path
        d="M 2 2 L 2 30 M 2 2 L 30 2"
        stroke={`url(#cornerGradient-${position})`}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Ornamental curves */}
      <path
        d="M 5 25 Q 5 15, 10 10 Q 15 5, 25 5"
        stroke={`url(#goldAccent-${position})`}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Small decorative circles at corner */}
      <circle cx="5" cy="5" r="2" fill={`url(#cornerGradient-${position})`} opacity="0.8" />
      <circle
        cx="5"
        cy="5"
        r="4"
        fill="none"
        stroke={`url(#goldAccent-${position})`}
        strokeWidth="0.5"
      />

      {/* Decorative dots along the lines */}
      <circle cx="5" cy="15" r="1.5" fill={`url(#goldAccent-${position})`} opacity="0.7" />
      <circle cx="15" cy="5" r="1.5" fill={`url(#goldAccent-${position})`} opacity="0.7" />

      {/* Connect 4 themed disc decoration */}
      <circle cx="5" cy="25" r="2.5" fill={`url(#cornerGradient-${position})`} opacity="0.6" />
      <circle cx="25" cy="5" r="2.5" fill={`url(#cornerGradient-${position})`} opacity="0.6" />

      {/* Small Connect 4 disc pattern */}
      <g opacity="0.5">
        <circle cx="12" cy="12" r="1.5" fill="#ef4444" />
        <circle cx="17" cy="12" r="1.5" fill="#eab308" />
        <circle cx="12" cy="17" r="1.5" fill="#eab308" />
        <circle cx="17" cy="17" r="1.5" fill="#ef4444" />
      </g>

      {/* Subtle MC monogram */}
      <text
        x="20"
        y="24"
        fontSize="6"
        fontWeight="bold"
        fontFamily="serif"
        fill={`url(#cornerGradient-${position})`}
        opacity="0.4"
        style={{ letterSpacing: '0.5px' }}
      >
        MC
      </text>

      {/* Decorative flourish curves */}
      <path
        d="M 8 5 Q 8 8, 5 8"
        stroke={`url(#goldAccent-${position})`}
        strokeWidth="0.5"
        fill="none"
        opacity="0.6"
      />

      {/* Star accent */}
      <path
        d="M 28 28 L 29 30 L 31 30 L 29.5 31.5 L 30 33 L 28 32 L 26 33 L 26.5 31.5 L 25 30 L 27 30 Z"
        fill={`url(#goldAccent-${position})`}
        opacity="0.5"
      />
    </svg>
  )
}
