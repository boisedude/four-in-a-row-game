/**
 * Column Component
 * Represents a clickable column in the Connect4 board
 */

import { cn } from '@/lib/utils'
import { Cell } from './Cell'
import type { Player } from '@/types/connect4.types'
import { ROWS } from '@/types/connect4.types'

interface ColumnProps {
  colIndex: number
  cells: (Player | null)[]
  winningCells?: Array<{ row: number; col: number }>
  lastMove?: { row: number; col: number }
  onColumnClick: (col: number) => void
  disabled: boolean
  isHovered: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  currentPlayer: Player
}

export function Column({
  colIndex,
  cells,
  winningCells = [],
  lastMove,
  onColumnClick,
  disabled,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  currentPlayer,
}: ColumnProps) {
  const isColumnFull = cells[0] !== null

  const handleClick = () => {
    if (!disabled && !isColumnFull) {
      onColumnClick(colIndex)
    }
  }

  return (
    <div className="flex flex-col gap-1 sm:gap-2">
      {/* Hover indicator with enhanced preview disc */}
      <div className="flex h-10 sm:h-12 items-center justify-center">
        {isHovered && !disabled && !isColumnFull && (
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full animate-preview-appear">
            <div
              className={cn(
                'relative h-full w-full rounded-full shadow-lg animate-preview-float',
                currentPlayer === 1
                  ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/50'
                  : 'bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-yellow-500/50'
              )}
            >
              {/* Shine effect on preview disc */}
              <div className="absolute left-1/4 top-1/4 h-1/3 w-1/3 rounded-full bg-white/40" />
            </div>
          </div>
        )}
      </div>

      {/* Column cells */}
      <button
        onClick={handleClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        disabled={disabled || isColumnFull}
        className={cn(
          'flex flex-col gap-1 sm:gap-2 rounded-lg p-1 sm:p-2 transition-all duration-300',
          !disabled && !isColumnFull && 'cursor-pointer hover:bg-blue-700/20 hover:scale-105',
          disabled && 'cursor-not-allowed opacity-70',
          isColumnFull && 'cursor-not-allowed',
          isHovered && !disabled && !isColumnFull && 'bg-blue-600/10 scale-102'
        )}
        aria-label={`Column ${colIndex + 1}`}
      >
        {Array.from({ length: ROWS }).map((_, rowIndex) => {
          const player = cells[rowIndex]
          const winningCellIndex = winningCells.findIndex(
            cell => cell.row === rowIndex && cell.col === colIndex
          )
          const isWinning = winningCellIndex !== -1
          const isLast = lastMove?.row === rowIndex && lastMove?.col === colIndex

          return (
            <Cell
              key={rowIndex}
              player={player}
              isWinning={isWinning}
              isLast={isLast}
              row={rowIndex}
              col={colIndex}
              winningIndex={isWinning ? winningCellIndex : undefined}
            />
          )
        })}
      </button>
    </div>
  )
}
