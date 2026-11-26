/**
 * Disc Component
 * One playing disc drawn in SVG so it scales with the board: a darker rim, a
 * body lit from the top left, and an embossed inner ring. The opponent's disc
 * also carries an embossed star, so the two sides differ without colour.
 */

import { memo, useId } from 'react'
import type { Player } from '@/types/connect4.types'

interface DiscPalette {
  rim: string
  hi: string
  base: string
  lo: string
  light: string
  dark: string
  mark: string
}

const DISC_PALETTE: Record<Player, DiscPalette> = {
  // Oxblood
  1: {
    rim: '#45090e',
    hi: '#c4463f',
    base: '#8e1d22',
    lo: '#5c1015',
    light: 'rgba(255, 196, 184, 0.42)',
    dark: 'rgba(36, 0, 4, 0.6)',
    mark: '#861b21',
  },
  // Lemon yellow, brighter and cleaner than the brass of the interface
  2: {
    rim: '#9a6f06',
    hi: '#fff6b8',
    base: '#f4cc1c',
    lo: '#cf9d0b',
    light: 'rgba(255, 255, 236, 0.85)',
    dark: 'rgba(120, 78, 0, 0.6)',
    mark: '#e9bd14',
  },
}

/** A five-point star centred on (50, 50), outer radius 15. */
const STAR = (() => {
  const points: string[] = []
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? 15 : 6.4
    const a = -Math.PI / 2 + (i * Math.PI) / 5
    points.push(`${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`)
  }
  return points.join(' ')
})()

interface DiscProps {
  player: Player
  /** The last disc played carries a small dot */
  isLast?: boolean
  className?: string
}

export const Disc = memo(function Disc({ player, isLast = false, className }: DiscProps) {
  const id = useId()
  const c = DISC_PALETTE[player]
  const body = `${id}-body`

  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={body} cx="36%" cy="30%" r="75%">
          <stop offset="0%" stopColor={c.hi} />
          <stop offset="45%" stopColor={c.base} />
          <stop offset="100%" stopColor={c.lo} />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill={c.rim} />
      <circle cx="50" cy="50" r="44" fill={`url(#${body})`} />
      {/* A thin lit edge on the top left of the rim */}
      <circle cx="50" cy="50" r="47" fill="none" stroke={c.light} strokeWidth="1.2" strokeDasharray="70 300" transform="rotate(185 50 50)" />

      {/* Embossed ring: shadow below right, light above left, the face on top */}
      <circle cx="51.2" cy="51.2" r="30" fill="none" stroke={c.dark} strokeWidth="4" />
      <circle cx="48.8" cy="48.8" r="30" fill="none" stroke={c.light} strokeWidth="4" />
      <circle cx="50" cy="50" r="30" fill="none" stroke={c.mark} strokeWidth="4" />

      {player === 2 && (
        <>
          <polygon points={STAR} fill={c.dark} transform="translate(1.2 1.2)" />
          <polygon points={STAR} fill={c.light} transform="translate(-1.2 -1.2)" />
          <polygon points={STAR} fill={c.mark} />
        </>
      )}

      {isLast &&
        (player === 1 ? (
          <circle cx="50" cy="50" r="7" fill="hsl(var(--primary))" stroke="#2a0507" strokeWidth="2" />
        ) : (
          <circle cx="50" cy="50" r="5.5" fill="#3b2803" />
        ))}
    </svg>
  )
})
