/**
 * CelebrationBurst Component
 * Radial burst effect for special moments with MC branding
 * Designed by M. Cooper for www.mcooper.com
 */

interface CelebrationBurstProps {
  size?: number
  color?: 'gold' | 'red' | 'yellow' | 'blue'
  className?: string
}

export function CelebrationBurst({ size = 200, color = 'gold', className }: CelebrationBurstProps) {
  const colorMap = {
    gold: {
      primary: '#fbbf24',
      secondary: '#f59e0b',
      tertiary: '#d97706',
      light: '#fef3c7',
    },
    red: {
      primary: '#ef4444',
      secondary: '#dc2626',
      tertiary: '#b91c1c',
      light: '#fca5a5',
    },
    yellow: {
      primary: '#eab308',
      secondary: '#ca8a04',
      tertiary: '#a16207',
      light: '#fde047',
    },
    blue: {
      primary: '#3b82f6',
      secondary: '#2563eb',
      tertiary: '#1d4ed8',
      light: '#93c5fd',
    },
  }

  const colors = colorMap[color]

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Celebration Burst by MC"
    >
      <defs>
        {/* Burst gradient */}
        <radialGradient id={`burstGradient-${color}`}>
          <stop offset="0%" style={{ stopColor: colors.light, stopOpacity: 1 }} />
          <stop offset="40%" style={{ stopColor: colors.primary, stopOpacity: 0.8 }} />
          <stop offset="70%" style={{ stopColor: colors.secondary, stopOpacity: 0.5 }} />
          <stop offset="100%" style={{ stopColor: colors.tertiary, stopOpacity: 0 }} />
        </radialGradient>

        {/* Particle gradient */}
        <radialGradient id={`particleGradient-${color}`}>
          <stop offset="0%" style={{ stopColor: colors.light, stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: colors.primary, stopOpacity: 0 }} />
        </radialGradient>

        {/* MC gradient */}
        <linearGradient id={`mcBurstGradient-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#1e40af', stopOpacity: 0.8 }} />
          <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0.8 }} />
        </linearGradient>
      </defs>

      <style>
        {`
          @keyframes expand {
            from {
              transform: scale(0.3);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
          @keyframes explode {
            0% {
              transform: scale(0.5) rotate(0deg);
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
            100% {
              transform: scale(1.5) rotate(180deg);
              opacity: 0;
            }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes particle-shoot {
            0% {
              transform: translate(0, 0) scale(1);
              opacity: 1;
            }
            100% {
              transform: translate(var(--tx), var(--ty)) scale(0);
              opacity: 0;
            }
          }
          .expanding {
            animation: expand 0.5s ease-out;
            transform-origin: center;
          }
          .exploding {
            animation: explode 1.2s ease-out forwards;
            transform-origin: center;
          }
          .spinning {
            animation: spin 3s linear infinite;
            transform-origin: center;
          }
          .particle {
            animation: particle-shoot 1s ease-out forwards;
          }
        `}
      </style>

      {/* Central burst circle */}
      <g className="expanding">
        <circle cx="100" cy="100" r="80" fill={`url(#burstGradient-${color})`} opacity="0.6" />
      </g>

      {/* Burst rays */}
      <g className="exploding" transform="translate(100, 100)">
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 360) / 16
          const radians = (angle * Math.PI) / 180
          const length = 70
          const x = Math.cos(radians) * length
          const y = Math.sin(radians) * length
          const thickness = i % 2 === 0 ? 4 : 2

          return (
            <line
              key={`ray-${i}`}
              x1="0"
              y1="0"
              x2={x}
              y2={y}
              stroke={colors.primary}
              strokeWidth={thickness}
              strokeLinecap="round"
              opacity="0.7"
            />
          )
        })}
      </g>

      {/* Star shapes */}
      <g className="spinning" transform="translate(100, 100)">
        {[0, 60, 120, 180, 240, 300].map(angle => {
          const radians = (angle * Math.PI) / 180
          const distance = 60
          const x = Math.cos(radians) * distance
          const y = Math.sin(radians) * distance

          return (
            <path
              key={`star-${angle}`}
              d="M 0,-6 L 1.5,-1.5 L 6,0 L 1.5,1.5 L 0,6 L -1.5,1.5 L -6,0 L -1.5,-1.5 Z"
              transform={`translate(${x}, ${y})`}
              fill={colors.light}
              opacity="0.8"
            />
          )
        })}
      </g>

      {/* Shooting particles */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 360) / 24
        const radians = (angle * Math.PI) / 180
        const distance = 90
        const tx = Math.cos(radians) * distance
        const ty = Math.sin(radians) * distance
        const size = 2 + (i % 3)
        const delay = (i % 6) * 0.1

        return (
          <circle
            key={`particle-${i}`}
            cx="100"
            cy="100"
            r={size}
            fill={`url(#particleGradient-${color})`}
            className="particle"
            style={
              {
                '--tx': `${tx}px`,
                '--ty': `${ty}px`,
                animationDelay: `${delay}s`,
              } as React.CSSProperties
            }
          />
        )
      })}

      {/* MC signature in center */}
      <g opacity="0.9">
        <circle cx="100" cy="100" r="22" fill="white" opacity="0.95" />
        <circle cx="100" cy="100" r="20" fill={`url(#mcBurstGradient-${color})`} />
        <text
          x="100"
          y="107"
          fontSize="16"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
          fill="white"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          MC
        </text>
      </g>

      {/* Confetti pieces */}
      <g className="exploding">
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 360) / 12 + 15
          const radians = (angle * Math.PI) / 180
          const distance = 55 + (i % 3) * 10
          const x = 100 + Math.cos(radians) * distance
          const y = 100 + Math.sin(radians) * distance
          const rotation = i * 30

          return (
            <rect
              key={`confetti-${i}`}
              x={x - 2}
              y={y - 4}
              width="4"
              height="8"
              rx="1"
              fill={i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.secondary : colors.light}
              transform={`rotate(${rotation} ${x} ${y})`}
              opacity="0.8"
            />
          )
        })}
      </g>
    </svg>
  )
}
