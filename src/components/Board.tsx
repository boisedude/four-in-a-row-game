/**
 * Board Component
 * Main Connect4 game board with realistic plastic frame design
 */

import { useState, memo } from 'react'
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
  const hasWinner = winningCells.length > 0

  // Transpose board for column-based rendering
  const columns = Array.from({ length: COLUMNS }, (_, colIndex) => board.map(row => row[colIndex]))

  return (
    <div
      className="relative animate-in fade-in zoom-in-95 duration-700 delay-100 w-full flex justify-center px-2 sm:px-4"
      role="grid"
      aria-label="Connect 4 game board with 7 columns and 6 rows"
    >
      {/* Outer frame - creates depth illusion */}
      <div
        className={cn(
          'relative',
          'rounded-2xl sm:rounded-3xl',
          'p-1 sm:p-1.5 md:p-2',
          // Outer plastic frame gradient
          'bg-gradient-to-b from-blue-400 via-blue-500 to-blue-700',
          // Deep shadow for 3D effect
          'shadow-[0_8px_32px_rgba(30,64,175,0.4),0_4px_16px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]',
          'transition-all duration-500',
          hasWinner && 'shadow-[0_0_60px_rgba(255,215,0,0.4),0_8px_32px_rgba(30,64,175,0.4)]'
        )}
      >
        {/* Inner board container */}
        <div
          className={cn(
            'relative flex',
            'gap-0.5 sm:gap-1 md:gap-1.5 lg:gap-2',
            'rounded-xl sm:rounded-2xl',
            // Main board plastic gradient - realistic blue plastic look
            'bg-gradient-to-b from-blue-500 via-blue-600 to-blue-700',
            // Inner frame styling with beveled edge effect
            'p-2 sm:p-3 md:p-4 lg:p-5',
            // Multiple layered shadows for depth
            'shadow-[inset_0_2px_4px_rgba(255,255,255,0.15),inset_0_-4px_8px_rgba(0,0,0,0.2)]',
            // Border for edge definition
            'border border-blue-800/50',
            'transition-all duration-300'
          )}
          style={{
            // Subtle plastic texture effect
            backgroundImage: `
              linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.1) 100%),
              linear-gradient(to bottom, #3b82f6, #2563eb, #1d4ed8)
            `,
          }}
        >
          {/* Decorative pattern overlay */}
          <BoardPattern opacity={0.06} className="pointer-events-none" />

          {/* Top edge highlight for plastic shine */}
          <div
            className="absolute top-0 left-4 right-4 h-1 rounded-full opacity-30"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
            }}
          />

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
              isHovered={hoveredColumn === colIndex || selectedColumn === colIndex}
              onMouseEnter={() => setHoveredColumn(colIndex)}
              onMouseLeave={() => setHoveredColumn(null)}
              currentPlayer={currentPlayer}
            />
          ))}

          {/* Bottom edge shadow for depth */}
          <div
            className="absolute bottom-0 left-4 right-4 h-2 rounded-full opacity-20"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.4), transparent)',
            }}
          />
        </div>

        {/* Side reflections for 3D plastic look */}
        <div
          className="absolute top-2 bottom-2 left-0 w-1 rounded-l-2xl opacity-40"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent, rgba(0,0,0,0.2))',
          }}
        />
        <div
          className="absolute top-2 bottom-2 right-0 w-1 rounded-r-2xl opacity-30"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.2), transparent, rgba(0,0,0,0.3))',
          }}
        />
      </div>
    </div>
  )
})
