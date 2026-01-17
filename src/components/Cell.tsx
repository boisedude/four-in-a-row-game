/**
 * Cell Component
 * Represents a single cell in the Connect4 board
 */

import { cn } from '@/lib/utils'
import { Disc } from './Disc'
import type { Player } from '@/types/connect4.types'

interface CellProps {
  player: Player | null
  isWinning?: boolean
  isLast?: boolean
  row: number
  col: number
  winningIndex?: number
}

export function Cell({
  player,
  isWinning = false,
  isLast = false,
  row,
  col,
  winningIndex,
}: CellProps) {
  const getCellLabel = (): string => {
    if (!player) return `Empty cell at row ${row + 1}, column ${col + 1}`
    const playerName = player === 1 ? 'Red' : 'Yellow'
    const winningText = isWinning ? ', part of winning line' : ''
    return `${playerName} disc at row ${row + 1}, column ${col + 1}${winningText}`
  }

  return (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-full',
        'h-9 w-9 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 xl:h-20 xl:w-20',
        'p-1 sm:p-1.5 md:p-2',
        'bg-blue-600 shadow-inner transition-all'
      )}
      role="gridcell"
      aria-label={getCellLabel()}
    >
      <Disc
        player={player}
        isWinning={isWinning}
        isLast={isLast}
        winningIndex={winningIndex}
      />
    </div>
  )
}
