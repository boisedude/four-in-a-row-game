/**
 * BoardPattern Component
 * Wood grain texture with subtle MC watermark for board background
 * Designed by M. Cooper for www.mcooper.com
 */

interface BoardPatternProps {
  opacity?: number
  className?: string
}

export function BoardPattern({ opacity = 0.1, className }: BoardPatternProps) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ position: 'absolute', inset: 0, opacity }}
      aria-hidden="true"
    >
      <defs>
        {/* Wood grain pattern */}
        <pattern id="woodGrain" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          {/* Base wood color variations */}
          <rect width="100" height="100" fill="#8b4513" opacity="0.1" />

          {/* Wood grain lines - vertical with slight curves */}
          {Array.from({ length: 8 }).map((_, i) => {
            const x = i * 12.5 + 5
            const offset = Math.sin(i) * 3
            return (
              <path
                key={`grain-${i}`}
                d={`M ${x} 0 Q ${x + offset} 25, ${x} 50 T ${x} 100`}
                stroke="#654321"
                strokeWidth="0.5"
                opacity="0.3"
                fill="none"
              />
            )
          })}

          {/* Wood knots (circles) */}
          <circle cx="20" cy="30" r="3" fill="#5d3a1a" opacity="0.2" />
          <circle cx="70" cy="70" r="4" fill="#5d3a1a" opacity="0.15" />
          <circle cx="45" cy="85" r="2.5" fill="#5d3a1a" opacity="0.25" />

          {/* Grain detail lines */}
          {Array.from({ length: 15 }).map((_, i) => {
            const y = i * 7
            const wobble = Math.sin(i * 0.5) * 2
            return (
              <line
                key={`detail-${i}`}
                x1="0"
                y1={y}
                x2="100"
                y2={y + wobble}
                stroke="#654321"
                strokeWidth="0.3"
                opacity="0.15"
              />
            )
          })}
        </pattern>

        {/* Circle pattern for decorative elements */}
        <pattern
          id="circlePattern"
          x="0"
          y="0"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="20" cy="20" r="2" fill="#2563eb" opacity="0.15" />
          <circle cx="20" cy="20" r="1" fill="#3b82f6" opacity="0.25" />
        </pattern>

        {/* MC watermark gradient */}
        <linearGradient id="mcWatermarkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#1e40af', stopOpacity: 0.08 }} />
          <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0.05 }} />
        </linearGradient>
      </defs>

      {/* Wood grain overlay */}
      <rect width="400" height="300" fill="url(#woodGrain)" />

      {/* Circle pattern in corners */}
      <rect x="0" y="0" width="80" height="80" fill="url(#circlePattern)" opacity="0.5" />
      <rect x="320" y="0" width="80" height="80" fill="url(#circlePattern)" opacity="0.5" />
      <rect x="0" y="220" width="80" height="80" fill="url(#circlePattern)" opacity="0.5" />
      <rect x="320" y="220" width="80" height="80" fill="url(#circlePattern)" opacity="0.5" />

      {/* Subtle diagonal stripes */}
      {Array.from({ length: 20 }).map((_, i) => {
        const x = i * 40 - 100
        return (
          <line
            key={`stripe-${i}`}
            x1={x}
            y1="0"
            x2={x + 200}
            y2="300"
            stroke="#1e3a8a"
            strokeWidth="1"
            opacity="0.03"
          />
        )
      })}

      {/* Very subtle MC watermark in center */}
      <g transform="translate(200, 150)" opacity="0.08">
        {/* Large MC letters */}
        <text
          x="0"
          y="0"
          fontSize="80"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
          fill="url(#mcWatermarkGradient)"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ letterSpacing: '4px' }}
        >
          MC
        </text>

        {/* Circular border around MC */}
        <circle
          cx="0"
          cy="0"
          r="70"
          fill="none"
          stroke="url(#mcWatermarkGradient)"
          strokeWidth="2"
        />
        <circle
          cx="0"
          cy="0"
          r="75"
          fill="none"
          stroke="url(#mcWatermarkGradient)"
          strokeWidth="1"
          opacity="0.5"
        />
      </g>

      {/* Corner accent marks - very subtle */}
      <g opacity="0.1">
        {/* Top left */}
        <path d="M 10 10 L 30 10 M 10 10 L 10 30" stroke="#1e40af" strokeWidth="3" />
        {/* Top right */}
        <path d="M 390 10 L 370 10 M 390 10 L 390 30" stroke="#1e40af" strokeWidth="3" />
        {/* Bottom left */}
        <path d="M 10 290 L 30 290 M 10 290 L 10 270" stroke="#1e40af" strokeWidth="3" />
        {/* Bottom right */}
        <path d="M 390 290 L 370 290 M 390 290 L 390 270" stroke="#1e40af" strokeWidth="3" />
      </g>
    </svg>
  )
}
