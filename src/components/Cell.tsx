/**
 * Cell Component
 * Represents a single cell in the Connect4 board with realistic circular cutout
 */

import { memo } from 'react'
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

export const Cell = memo(function Cell({
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
        'transition-all duration-200'
      )}
      style={{
        // Realistic circular cutout with depth
        background: `
          radial-gradient(circle at 50% 30%, rgba(0,0,0,0.1) 0%, transparent 60%),
          linear-gradient(to bottom, #1e40af, #1e3a8a)
        `,
        // Multi-layered shadow for deep hole effect
        boxShadow: `
          inset 0 4px 8px rgba(0, 0, 0, 0.5),
          inset 0 2px 4px rgba(0, 0, 0, 0.3),
          inset 0 -2px 4px rgba(255, 255, 255, 0.1),
          inset 0 0 0 2px rgba(0, 0, 0, 0.2),
          0 1px 0 rgba(255, 255, 255, 0.1)
        `,
      }}
      role="gridcell"
      aria-label={getCellLabel()}
    >
      {/* Inner rim highlight for depth perception */}
      <div
        className="absolute inset-0.5 sm:inset-1 rounded-full pointer-events-none"
        style={{
          background: 'transparent',
          boxShadow: `
            inset 0 2px 4px rgba(0, 0, 0, 0.4),
            inset 0 -1px 2px rgba(255, 255, 255, 0.05)
          `,
        }}
      />

      {/* Bottom light reflection (simulates light hitting the back of the hole) */}
      {!player && (
        <div
          className="absolute bottom-1 sm:bottom-1.5 left-1/4 right-1/4 h-1/4 rounded-full pointer-events-none opacity-30"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(147, 197, 253, 0.4), transparent)',
          }}
        />
      )}

      <Disc
        player={player}
        isWinning={isWinning}
        isLast={isLast}
        winningIndex={winningIndex}
      />
    </div>
  )
})
