/**
 * Board Component
 * Matte navy frame with seven columns of holes.
 */

import { useState, memo } from 'react'
import { Column } from './Column'
import type { Board as BoardType, Player } from '@/types/connect4.types'
import { COLUMNS } from '@/types/connect4.types'

interface BoardProps {
  board: BoardType
  winningCells?: Array<{ row: number; col: number }>
  lastMove?: { row: number; col: number }
  onColumnClick: (col: number) => void
  disabled: boolean
  currentPlayer: Player
  selectedColumn?: number | null
}

export const Board = memo(function Board({
  board,
  winningCells = [],
  lastMove,
  onColumnClick,
  disabled,
  currentPlayer,
  selectedColumn,
}: BoardProps) {
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null)

  // Transpose board for column-based rendering
  const columns = Array.from({ length: COLUMNS }, (_, colIndex) => board.map(row => row[colIndex]))

  return (
    <div
      className="arcade-board grid grid-cols-7 gap-0.5 bg-[#1d3557] p-1.5 sm:gap-1 sm:p-3"
      role="grid"
      aria-label="Connect 4 board with 7 columns and 6 rows"
    >
      {columns.map((cells, colIndex) => (
        <Column
          key={colIndex}
          colIndex={colIndex}
          cells={cells}
          winningCells={winningCells}
          lastMove={lastMove}
          onColumnClick={onColumnClick}
          disabled={disabled}
          isHovered={hoveredColumn === colIndex || selectedColumn === colIndex}
          onMouseEnter={() => setHoveredColumn(colIndex)}
          onMouseLeave={() => setHoveredColumn(null)}
          currentPlayer={currentPlayer}
        />
      ))}
    </div>
  )
})
