/**
 * Shared Disc Styles
 * Centralized disc gradient and shadow styles for consistency across components
 */

import type { Player } from '@/types/connect4.types'

export interface DiscStyle {
  background: string
  boxShadow: string
}

/**
 * Preview disc styles (used in Column hover preview)
 * These have slightly different shadow values optimized for preview appearance
 */
export const previewDiscStyles: Record<Player, DiscStyle> = {
  1: {
    background: `
      radial-gradient(circle at 35% 25%, rgba(255,255,255,0.5) 0%, transparent 40%),
      radial-gradient(circle at 50% 50%, #ef4444 0%, #dc2626 50%, #b91c1c 100%)
    `,
    boxShadow: `
      0 4px 15px rgba(220, 38, 38, 0.5),
      0 2px 4px rgba(0, 0, 0, 0.2),
      inset 0 -3px 6px rgba(0, 0, 0, 0.3),
      inset 0 3px 6px rgba(255, 255, 255, 0.2)
    `,
  },
  2: {
    background: `
      radial-gradient(circle at 35% 25%, rgba(255,255,255,0.6) 0%, transparent 40%),
      radial-gradient(circle at 50% 50%, #fbbf24 0%, #f59e0b 50%, #d97706 100%)
    `,
    boxShadow: `
      0 4px 15px rgba(245, 158, 11, 0.5),
      0 2px 4px rgba(0, 0, 0, 0.2),
      inset 0 -3px 6px rgba(0, 0, 0, 0.25),
      inset 0 3px 6px rgba(255, 255, 255, 0.3)
    `,
  },
}

/**
 * Get disc styles for board cells
 * These styles support winning state with enhanced glow effects
 */
export function getDiscStyles(player: Player, isWinning: boolean): DiscStyle {
  if (player === 1) {
    return {
      // Red disc - rich cherry red plastic
      background: `
        radial-gradient(circle at 35% 25%, rgba(255,255,255,0.4) 0%, transparent 40%),
        radial-gradient(circle at 50% 50%, #ef4444 0%, #dc2626 50%, #b91c1c 100%)
      `,
      boxShadow: isWinning
        ? `
          0 4px 12px rgba(220, 38, 38, 0.6),
          0 2px 4px rgba(0, 0, 0, 0.3),
          inset 0 -4px 8px rgba(0, 0, 0, 0.3),
          inset 0 4px 8px rgba(255, 255, 255, 0.2),
          0 0 30px rgba(239, 68, 68, 0.5)
        `
        : `
          0 4px 12px rgba(220, 38, 38, 0.5),
          0 2px 4px rgba(0, 0, 0, 0.3),
          inset 0 -4px 8px rgba(0, 0, 0, 0.3),
          inset 0 4px 8px rgba(255, 255, 255, 0.2)
        `,
    }
  }

  return {
    // Yellow disc - bright golden yellow plastic
    background: `
      radial-gradient(circle at 35% 25%, rgba(255,255,255,0.5) 0%, transparent 40%),
      radial-gradient(circle at 50% 50%, #fbbf24 0%, #f59e0b 50%, #d97706 100%)
    `,
    boxShadow: isWinning
      ? `
        0 4px 12px rgba(245, 158, 11, 0.6),
        0 2px 4px rgba(0, 0, 0, 0.25),
        inset 0 -4px 8px rgba(0, 0, 0, 0.25),
        inset 0 4px 8px rgba(255, 255, 255, 0.3),
        0 0 30px rgba(251, 191, 36, 0.5)
      `
      : `
        0 4px 12px rgba(245, 158, 11, 0.5),
        0 2px 4px rgba(0, 0, 0, 0.25),
        inset 0 -4px 8px rgba(0, 0, 0, 0.25),
        inset 0 4px 8px rgba(255, 255, 255, 0.3)
      `,
  }
}

/**
 * Get glow color for a player's disc
 */
export function getDiscGlowColor(player: Player): string {
  return player === 1
    ? 'rgba(239,68,68,0.6)'
    : 'rgba(251,191,36,0.6)'
}

/**
 * Get disc color hex value
 */
export function getDiscColor(player: Player): string {
  return player === 1 ? '#ef4444' : '#fbbf24'
}
