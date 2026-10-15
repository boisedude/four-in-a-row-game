/**
 * Cell Component
 * One hole in the board: a dark circle with a single hairline edge.
 */

import { memo } from 'react'
import { Disc } from './Disc'
import type { Player } from '@/types/connect4.types'
import { getDiscColor } from '@/lib/discStyles'

interface CellProps {
  player: Player | null
  isWinning?: boolean
  isLast?: boolean
  row: number
  col: number
  /** Translucent preview of the disc the player would drop here */
  previewPlayer?: Player | null
}

export const Cell = memo(function Cell({
  player,
  isWinning = false,
  isLast = false,
  row,
  col,
  previewPlayer = null,
}: CellProps) {
  const getCellLabel = (): string => {
    if (!player) return `Empty cell at row ${row + 1}, column ${col + 1}`
    const playerName = player === 1 ? 'Red' : 'Yellow'
    const winningText = isWinning ? ', part of winning line' : ''
    return `${playerName} disc at row ${row + 1}, column ${col + 1}${winningText}`
  }

  return (
    <div
      className="relative aspect-square w-full rounded-full bg-[#0f1a24] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
      role="gridcell"
      aria-label={getCellLabel()}
    >
      <Disc player={player} isWinning={isWinning} isLast={isLast} />
      {!player && previewPlayer && (
        <div
          className="absolute inset-0 rounded-full opacity-55"
          style={{ backgroundColor: getDiscColor(previewPlayer) }}
          aria-hidden="true"
        />
      )}
    </div>
  )
})
