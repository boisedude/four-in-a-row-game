/**
 * AchievementBadge Component
 * Four-tier achievement badges with MC branding
 * Designed by M. Cooper for www.mcooper.com
 */

import { useId } from 'react'

interface AchievementBadgeProps {
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  icon?: string
  locked?: boolean
  size?: number
  className?: string
}

export function AchievementBadge({
  tier,
  icon = '★',
  locked = false,
  size = 80,
  className,
}: AchievementBadgeProps) {
  const uniqueId = useId()
  const tierColors = {
    bronze: {
      primary: '#cd7f32',
      secondary: '#a0522d',
      tertiary: '#8b4513',
      light: '#d2a67a',
      glow: '#cd7f32',
    },
    silver: {
      primary: '#c0c0c0',
      secondary: '#a8a8a8',
      tertiary: '#808080',
      light: '#e8e8e8',
      glow: '#c0c0c0',
    },
    gold: {
      primary: '#fbbf24',
      secondary: '#f59e0b',
      tertiary: '#d97706',
      light: '#fef3c7',
      glow: '#fbbf24',
    },
    platinum: {
      primary: '#e5e7eb',
      secondary: '#d1d5db',
      tertiary: '#9ca3af',
      light: '#f9fafb',
      glow: '#a78bfa',
    },
  }

  const colors = tierColors[tier]
  const badgeId = `badge-${tier}-${uniqueId}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={`${tier} achievement badge by MC ${locked ? '(locked)' : ''}`}
    >
      <defs>
        {/* Badge gradient */}
        <radialGradient id={`${badgeId}-gradient`} cx="40%" cy="40%">
          <stop offset="0%" style={{ stopColor: colors.light, stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: colors.primary, stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: colors.tertiary, stopOpacity: 1 }} />
        </radialGradient>

        {/* Rim gradient */}
        <linearGradient id={`${badgeId}-rim`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: colors.primary, stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: colors.light, stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: colors.secondary, stopOpacity: 1 }} />
        </linearGradient>

        {/* MC brand gradient */}
        <linearGradient id={`${badgeId}-mc`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#1e40af', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
        </linearGradient>

        {/* Glow filter */}
        <filter id={`${badgeId}-glow`}>
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Lock pattern */}
        <pattern
          id={`${badgeId}-lock-pattern`}
          x="0"
          y="0"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <line x1="0" y1="0" x2="10" y2="10" stroke="#9ca3af" strokeWidth="1" opacity="0.3" />
        </pattern>
      </defs>

      <style>
        {`
          @keyframes shine {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.8; }
          }
          @keyframes pulse-glow {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .shining {
            animation: shine 2s ease-in-out infinite;
          }
          .pulsing-glow {
            animation: pulse-glow 2s ease-in-out infinite;
          }
          .rotating-slow {
            animation: rotate 20s linear infinite;
            transform-origin: center;
          }
        `}
      </style>

      {/* Outer glow (if unlocked) */}
      {!locked && (
        <circle
          cx="60"
          cy="60"
          r="55"
          fill={colors.glow}
          opacity="0.2"
          filter={`url(#${badgeId}-glow)`}
          className="pulsing-glow"
        />
      )}

      {/* Star-shaped badge background */}
      <g transform="translate(60, 60)">
        {/* Outer star points */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 360) / 8 - 90
          const radians = (angle * Math.PI) / 180
          const outerX = Math.cos(radians) * 50
          const outerY = Math.sin(radians) * 50
          const innerAngle = angle + 22.5
          const innerRadians = (innerAngle * Math.PI) / 180
          const innerX = Math.cos(innerRadians) * 35
          const innerY = Math.sin(innerRadians) * 35

          return (
            <path
              key={`point-${i}`}
              d={`M 0 0 L ${outerX} ${outerY} L ${innerX} ${innerY} Z`}
              fill={`url(#${badgeId}-gradient)`}
              stroke={`url(#${badgeId}-rim)`}
              strokeWidth="1.5"
            />
          )
        })}

        {/* Center circle */}
        <circle cx="0" cy="0" r="38" fill={`url(#${badgeId}-gradient)`} />
        <circle cx="0" cy="0" r="38" fill="none" stroke={`url(#${badgeId}-rim)`} strokeWidth="3" />

        {/* Inner decorative ring */}
        <circle
          cx="0"
          cy="0"
          r="32"
          fill="none"
          stroke={colors.light}
          strokeWidth="1"
          opacity="0.5"
        />

        {/* Shine effect */}
        {!locked && (
          <ellipse
            cx="-10"
            cy="-10"
            rx="15"
            ry="20"
            fill="white"
            className="shining"
            opacity="0.4"
          />
        )}
      </g>

      {/* Icon in center */}
      {!locked ? (
        <text
          x="60"
          y="68"
          fontSize="32"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ userSelect: 'none' }}
        >
          {icon}
        </text>
      ) : (
        /* Lock icon when locked */
        <g transform="translate(60, 60)">
          <rect x="-8" y="-2" width="16" height="12" rx="2" fill="#6b7280" />
          <path
            d="M -6 -2 L -6 -6 Q -6 -12, 0 -12 Q 6 -12, 6 -6 L 6 -2"
            fill="none"
            stroke="#6b7280"
            strokeWidth="3"
          />
          <circle cx="0" cy="3" r="2" fill="#9ca3af" />
        </g>
      )}

      {/* MC signature at bottom */}
      <g transform="translate(60, 100)">
        <rect
          x="-12"
          y="-6"
          width="24"
          height="12"
          rx="2"
          fill={`url(#${badgeId}-mc)`}
          opacity="0.9"
        />
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

      {/* Tier label at top */}
      <text
        x="60"
        y="15"
        fontSize="9"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
        fill={locked ? '#9ca3af' : colors.tertiary}
        textAnchor="middle"
        style={{ textTransform: 'uppercase', letterSpacing: '1px' }}
      >
        {tier}
      </text>

      {/* Lock overlay pattern */}
      {locked && (
        <circle cx="60" cy="60" r="50" fill={`url(#${badgeId}-lock-pattern)`} opacity="0.7" />
      )}
    </svg>
  )
}
