/**
 * Column Component
 * Represents a clickable column in the Connect4 board with enhanced hover effects
 */

import { memo } from 'react'
import { cn } from '@/lib/utils'
import { Cell } from './Cell'
import type { Player } from '@/types/connect4.types'
import { ROWS } from '@/types/connect4.types'
import { previewDiscStyles, getDiscGlowColor, getDiscColor } from '@/lib/discStyles'

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

  const handleClick = () => {
    if (!disabled && !isColumnFull) {
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
    <div className="flex flex-col gap-1 sm:gap-2">
      {/* Enhanced hover indicator with preview disc */}
      <div className="flex h-10 sm:h-12 md:h-14 items-center justify-center">
        {isHovered && !disabled && !isColumnFull && (
          <div className="relative h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full animate-preview-appear">
            {/* Drop arrow indicator */}
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 opacity-70"
              style={{
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: `8px solid ${getDiscColor(currentPlayer)}`,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
              }}
            />

            {/* Preview disc with realistic styling */}
            <div
              className="relative h-full w-full rounded-full animate-preview-float"
              style={previewDiscStyles[currentPlayer]}
            >
              {/* Primary shine highlight */}
              <div
                className="absolute rounded-full left-[15%] top-[12%] h-[35%] w-[35%]"
                style={{
                  background: 'radial-gradient(circle at 40% 40%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 50%, transparent 70%)',
                }}
              />

              {/* Secondary bright spot */}
              <div
                className="absolute rounded-full left-[20%] top-[18%] h-[15%] w-[15%]"
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
                }}
              />

              {/* Rim highlight */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.15) 100%)',
                }}
              />
            </div>

            {/* Glow effect under preview disc */}
            <div
              className="absolute inset-0 rounded-full blur-md opacity-50 -z-10 animate-preview-float"
              style={{
                background: `radial-gradient(circle, ${getDiscGlowColor(currentPlayer)}, transparent 70%)`,
              }}
            />
          </div>
        )}
      </div>

      {/* Column cells with enhanced hover highlight */}
      <button
        onClick={handleClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        disabled={disabled || isColumnFull}
        className={cn(
          'relative flex flex-col gap-1 sm:gap-2 rounded-xl p-1 sm:p-1.5 md:p-2 transition-all duration-300',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600',
          !disabled && !isColumnFull && 'cursor-pointer',
          disabled && 'cursor-not-allowed opacity-70',
          isColumnFull && 'cursor-not-allowed'
        )}
        style={{
          // Column highlight effect on hover
          background: isHovered && !disabled && !isColumnFull
            ? 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.05) 70%, rgba(255,255,255,0.15) 100%)'
            : 'transparent',
          boxShadow: isHovered && !disabled && !isColumnFull
            ? 'inset 0 0 30px rgba(255,255,255,0.1), 0 0 15px rgba(59,130,246,0.2)'
            : 'none',
          transform: isHovered && !disabled && !isColumnFull ? 'scale(1.02)' : 'scale(1)',
        }}
        aria-label={getColumnAriaLabel()}
        aria-disabled={disabled || isColumnFull}
      >
        {/* Top glow bar when hovered */}
        {isHovered && !disabled && !isColumnFull && (
          <div
            className="absolute top-0 left-1 right-1 h-1 rounded-full animate-column-glow"
            style={{
              background: `linear-gradient(90deg, transparent, ${getDiscGlowColor(currentPlayer)}, transparent)`,
            }}
          />
        )}

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

        {/* Bottom glow bar when hovered */}
        {isHovered && !disabled && !isColumnFull && (
          <div
            className="absolute bottom-0 left-1 right-1 h-1 rounded-full animate-column-glow"
            style={{
              background: `linear-gradient(90deg, transparent, ${getDiscGlowColor(currentPlayer)}, transparent)`,
              animationDelay: '0.5s',
            }}
          />
        )}
      </button>
    </div>
  )
})
