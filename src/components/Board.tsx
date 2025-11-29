/**
 * Board Component
 * Main Connect4 game board with MC graphics
 */

import { useState } from 'react'
import { Column } from './Column'
import { BoardPattern, BoardCorner } from './graphics'
import type { Board as BoardType, Player } from '@/types/connect4.types'
import { COLUMNS } from '@/types/connect4.types'
import { cn } from '@/lib/utils'

interface BoardProps {
  board: BoardType
  winningCells?: Array<{ row: number; col: number }>
  lastMove?: { row: number; col: number }
  onColumnClick: (col: number) => void
  disabled: boolean
  currentPlayer: Player
}

export function Board({
  board,
  winningCells = [],
  lastMove,
  onColumnClick,
  disabled,
  currentPlayer,
}: BoardProps) {
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null)

  // Transpose board for column-based rendering
  const columns = Array.from({ length: COLUMNS }, (_, colIndex) => board.map(row => row[colIndex]))

  return (
    <div className="relative animate-in fade-in zoom-in-95 duration-700 delay-100 w-full flex justify-center px-2 sm:px-4">
      <div
        className={cn(
          'relative flex',
          'gap-0.5 sm:gap-1 md:gap-1.5 lg:gap-2',
          'rounded-xl sm:rounded-2xl',
          'bg-gradient-to-b from-blue-500 to-blue-600',
          'p-1.5 sm:p-3 md:p-4',
          'shadow-2xl border-2 sm:border-4 border-blue-700',
          'transition-all duration-300 hover:shadow-blue-500/20'
        )}
      >
        {/* Decorative pattern overlay */}
        <BoardPattern opacity={0.08} className="pointer-events-none" />

        {/* Decorative corners */}
        <BoardCorner position="topLeft" size={32} />
        <BoardCorner position="topRight" size={32} />
        <BoardCorner position="bottomLeft" size={32} />
        <BoardCorner position="bottomRight" size={32} />

        {/* Game columns */}
        {columns.map((cells, colIndex) => (
          <Column
            key={colIndex}
            colIndex={colIndex}
            cells={cells}
            winningCells={winningCells}
            lastMove={lastMove}
            onColumnClick={onColumnClick}
            disabled={disabled}
            isHovered={hoveredColumn === colIndex}
            onMouseEnter={() => setHoveredColumn(colIndex)}
            onMouseLeave={() => setHoveredColumn(null)}
            currentPlayer={currentPlayer}
          />
        ))}
      </div>
    </div>
  )
}
