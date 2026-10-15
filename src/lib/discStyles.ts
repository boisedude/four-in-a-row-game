/**
 * Disc styles: matte flat colour with one subtle inner shadow.
 */

import type { Player } from '@/types/connect4.types'

export const DISC_COLORS: Record<Player, string> = {
  1: '#d64541',
  2: '#e8b62c',
}

export function getDiscColor(player: Player): string {
  return DISC_COLORS[player]
}

export function getDiscStyle(player: Player): { backgroundColor: string; boxShadow: string } {
  return {
    backgroundColor: DISC_COLORS[player],
    boxShadow: 'inset 0 -3px 5px rgba(0, 0, 0, 0.22)',
  }
}
