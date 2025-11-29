/**
 * DiscGraphic Component
 * Realistic disc graphics with multiple visual styles and MC branding
 * Designed by M. Cooper for www.mcooper.com
 */

import { useId } from 'react'

interface DiscGraphicProps {
  style: 'smooth' | 'textured' | 'gem' | 'glossy' | 'metallic'
  color: 'red' | 'yellow'
  size?: number
  className?: string
  showBranding?: boolean
}

export function DiscGraphic({
  style,
  color,
  size = 60,
  className,
  showBranding = true,
}: DiscGraphicProps) {
  const uniqueId = useId()
  const isRed = color === 'red'
  const discId = `disc-${style}-${color}-${uniqueId}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={`${color} ${style} disc by MC`}
    >
      <defs>
        {/* Smooth style gradients */}
        {style === 'smooth' && (
          <radialGradient id={`${discId}-smooth`} cx="35%" cy="35%">
            <stop
              offset="0%"
              style={{ stopColor: isRed ? '#fca5a5' : '#fde047', stopOpacity: 1 }}
            />
            <stop
              offset="40%"
              style={{ stopColor: isRed ? '#ef4444' : '#eab308', stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: isRed ? '#dc2626' : '#ca8a04', stopOpacity: 1 }}
            />
          </radialGradient>
        )}

        {/* Textured style with noise pattern */}
        {style === 'textured' && (
          <>
            <radialGradient id={`${discId}-textured`} cx="35%" cy="35%">
              <stop
                offset="0%"
                style={{ stopColor: isRed ? '#fca5a5' : '#fde047', stopOpacity: 1 }}
              />
              <stop
                offset="40%"
                style={{ stopColor: isRed ? '#ef4444' : '#eab308', stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: isRed ? '#b91c1c' : '#a16207', stopOpacity: 1 }}
              />
            </radialGradient>
            <filter id={`${discId}-noise`}>
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
              <feColorMatrix type="saturate" values="0" />
              <feBlend in="SourceGraphic" mode="multiply" />
            </filter>
          </>
        )}

        {/* Gem style with faceted look */}
        {style === 'gem' && (
          <>
            <radialGradient id={`${discId}-gem`} cx="40%" cy="40%">
              <stop
                offset="0%"
                style={{ stopColor: isRed ? '#fecaca' : '#fef08a', stopOpacity: 1 }}
              />
              <stop
                offset="30%"
                style={{ stopColor: isRed ? '#f87171' : '#facc15', stopOpacity: 1 }}
              />
              <stop
                offset="70%"
                style={{ stopColor: isRed ? '#dc2626' : '#ca8a04', stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: isRed ? '#991b1b' : '#854d0e', stopOpacity: 1 }}
              />
            </radialGradient>
          </>
        )}

        {/* Glossy style with strong highlights */}
        {style === 'glossy' && (
          <>
            <radialGradient id={`${discId}-glossy`} cx="35%" cy="35%">
              <stop
                offset="0%"
                style={{ stopColor: isRed ? '#fecaca' : '#fef3c7', stopOpacity: 1 }}
              />
              <stop
                offset="25%"
                style={{ stopColor: isRed ? '#f87171' : '#fde047', stopOpacity: 1 }}
              />
              <stop
                offset="60%"
                style={{ stopColor: isRed ? '#dc2626' : '#ca8a04', stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: isRed ? '#991b1b' : '#78350f', stopOpacity: 1 }}
              />
            </radialGradient>
            <radialGradient id={`${discId}-glossy-shine`} cx="30%" cy="30%">
              <stop offset="0%" style={{ stopColor: 'white', stopOpacity: 0.8 }} />
              <stop offset="50%" style={{ stopColor: 'white', stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: 'white', stopOpacity: 0 }} />
            </radialGradient>
          </>
        )}

        {/* Metallic style with sheen */}
        {style === 'metallic' && (
          <>
            <linearGradient id={`${discId}-metallic`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop
                offset="0%"
                style={{ stopColor: isRed ? '#fca5a5' : '#fde047', stopOpacity: 1 }}
              />
              <stop
                offset="25%"
                style={{ stopColor: isRed ? '#ef4444' : '#facc15', stopOpacity: 1 }}
              />
              <stop
                offset="50%"
                style={{ stopColor: isRed ? '#dc2626' : '#eab308', stopOpacity: 1 }}
              />
              <stop
                offset="75%"
                style={{ stopColor: isRed ? '#b91c1c' : '#a16207', stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: isRed ? '#7f1d1d' : '#713f12', stopOpacity: 1 }}
              />
            </linearGradient>
          </>
        )}

        {/* MC branding gradient */}
        <linearGradient id={`${discId}-mc`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#1e40af', stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 0.3 }} />
        </linearGradient>
      </defs>

      {/* Main disc body */}
      <circle
        cx="50"
        cy="50"
        r="45"
        fill={`url(#${discId}-${style})`}
        filter={style === 'textured' ? `url(#${discId}-noise)` : undefined}
      />

      {/* Outer rim shadow */}
      <circle cx="50" cy="50" r="45" fill="none" stroke="black" strokeWidth="1" opacity="0.3" />

      {/* Inner rim for depth */}
      <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="0.5" opacity="0.2" />

      {/* Style-specific details */}
      {style === 'smooth' && (
        <>
          {/* Main highlight */}
          <ellipse cx="35" cy="35" rx="15" ry="20" fill="white" opacity="0.4" />
        </>
      )}

      {style === 'textured' && (
        <>
          {/* Subtle highlight */}
          <ellipse cx="38" cy="38" rx="12" ry="16" fill="white" opacity="0.25" />
        </>
      )}

      {style === 'gem' && (
        <>
          {/* Facet highlights */}
          <path
            d="M 50 10 L 65 35 L 50 30 Z"
            fill="white"
            opacity="0.5"
            transform="rotate(-15 50 50)"
          />
          <path
            d="M 50 10 L 35 35 L 50 30 Z"
            fill="white"
            opacity="0.3"
            transform="rotate(-15 50 50)"
          />
          <circle cx="40" cy="38" r="8" fill="white" opacity="0.4" />
        </>
      )}

      {style === 'glossy' && (
        <>
          {/* Strong glossy highlight */}
          <circle cx="35" cy="35" r="18" fill={`url(#${discId}-glossy-shine)`} />
        </>
      )}

      {style === 'metallic' && (
        <>
          {/* Metallic sheen bands */}
          <ellipse cx="50" cy="30" rx="35" ry="8" fill="white" opacity="0.3" />
          <ellipse cx="50" cy="50" rx="35" ry="6" fill="white" opacity="0.15" />
          <ellipse cx="50" cy="70" rx="30" ry="5" fill="black" opacity="0.2" />
        </>
      )}

      {/* MC branding on disc surface */}
      {showBranding && (
        <g opacity="0.15">
          <text
            x="50"
            y="58"
            fontSize="14"
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
            fill={`url(#${discId}-mc)`}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            MC
          </text>
        </g>
      )}

      {/* Bottom shadow for depth */}
      <ellipse cx="50" cy="88" rx="35" ry="4" fill="black" opacity="0.15" />
    </svg>
  )
}
