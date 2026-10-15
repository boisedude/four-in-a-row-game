/**
 * Column Component
 * A clickable column. Hovering shows a translucent disc where it would land.
 */

import { memo } from 'react'
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

export const Column = memo(function Column({
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
  const canDrop = !disabled && !isColumnFull

  // The lowest empty row is where a dropped disc would land
  let landingRow = -1
  for (let r = ROWS - 1; r >= 0; r--) {
    if (cells[r] === null) {
      landingRow = r
      break
    }
  }

  const handleClick = () => {
    if (canDrop) {
      onColumnClick(colIndex)
    }
  }

  const getColumnAriaLabel = (): string => {
    if (isColumnFull) {
      return `Column ${colIndex + 1}, full`
    }
    if (disabled) {
      return `Column ${colIndex + 1}, waiting for opponent`
    }
    return `Drop disc in column ${colIndex + 1}`
  }

  return (
    <button
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      disabled={disabled || isColumnFull}
      className={cn(
        'flex min-w-0 flex-col gap-1 rounded-md p-0.5 sm:gap-2 sm:p-1',
        'focus-visible:outline-2 focus-visible:outline-primary',
        canDrop ? 'cursor-pointer' : 'cursor-default',
        canDrop && isHovered && 'bg-white/5'
      )}
      aria-label={getColumnAriaLabel()}
      aria-disabled={disabled || isColumnFull}
    >
      {Array.from({ length: ROWS }).map((_, rowIndex) => {
        const winning = winningCells.some(cell => cell.row === rowIndex && cell.col === colIndex)
        const isLast = lastMove?.row === rowIndex && lastMove?.col === colIndex

        return (
          <Cell
            key={rowIndex}
            player={cells[rowIndex]}
            isWinning={winning}
            isLast={isLast}
            row={rowIndex}
            col={colIndex}
            previewPlayer={canDrop && isHovered && rowIndex === landingRow ? currentPlayer : null}
          />
        )
      })}
    </button>
  )
})
