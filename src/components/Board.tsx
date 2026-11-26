/**
 * Board Component
 * The upright rack: a lacquered blue front panel with 42 holes cut through it,
 * standing on two feet. Discs sit behind the panel and fall down their column
 * when played. Above the rack, the disc you are about to drop hovers over the
 * column under the pointer.
 *
 * Everything is laid out in one coordinate space (the SVG viewBox units below)
 * and placed with percentages, so the whole rack scales with the column.
 */

import { memo, useState } from 'react'
import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import { Disc } from './Disc'
import type { Board as BoardType, Player } from '@/types/connect4.types'
import { COLUMNS, ROWS } from '@/types/connect4.types'

// Geometry, in viewBox units
const PITCH = 100 // distance between hole centres
const FRAME = 26 // panel edge around the holes
const ZONE = 104 // band above the rack where the next disc hovers
const FEET = 40 // feet below the rack
const HOLE_R = 40
const DISC_R = 42 // a little larger than the hole, so the panel overlaps the disc's edge
const W = COLUMNS * PITCH + 2 * FRAME // 752
const RACK_H = ROWS * PITCH + 2 * FRAME // 652
const H = ZONE + RACK_H + FEET // 796
const RACK_TOP = ZONE

const cx = (col: number) => FRAME + PITCH / 2 + col * PITCH
const cy = (row: number) => RACK_TOP + FRAME + PITCH / 2 + row * PITCH
const ZONE_CY = ZONE / 2

/** A circle of radius r centred on (x, y), as percentages of the board box */
function place(x: number, y: number, r: number): CSSProperties {
  return {
    left: `${((x - r) / W) * 100}%`,
    top: `${((y - r) / H) * 100}%`,
    width: `${((2 * r) / W) * 100}%`,
    height: `${((2 * r) / H) * 100}%`,
  }
}

/** Fall time grows with the distance: 250 ms for one row, 450 ms for six. */
function fallStyle(row: number): CSSProperties {
  const from = ((cy(row) - ZONE_CY) / (2 * DISC_R)) * 100
  return {
    '--c4-fall-from': `-${from.toFixed(2)}%`,
    animationDuration: `${250 + row * 40}ms`,
  } as CSSProperties
}

/** Panel outline with every hole cut out (even-odd fill) */
const PANEL_PATH = (() => {
  const r = 18
  let d = `M${r},${RACK_TOP} H${W - r} Q${W},${RACK_TOP} ${W},${RACK_TOP + r} V${RACK_TOP + RACK_H - r} Q${W},${RACK_TOP + RACK_H} ${W - r},${RACK_TOP + RACK_H} H${r} Q0,${RACK_TOP + RACK_H} 0,${RACK_TOP + RACK_H - r} V${RACK_TOP + r} Q0,${RACK_TOP} ${r},${RACK_TOP} Z`
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      const x = cx(col)
      const y = cy(row)
      d += ` M${x - HOLE_R},${y} a${HOLE_R},${HOLE_R} 0 1,0 ${2 * HOLE_R},0 a${HOLE_R},${HOLE_R} 0 1,0 ${-2 * HOLE_R},0 Z`
    }
  }
  return d
})()

const HOLES = Array.from({ length: ROWS * COLUMNS }, (_, i) => ({
  row: Math.floor(i / COLUMNS),
  col: i % COLUMNS,
}))

/** One foot: a block that widens towards the table */
function footPath(x: number, flip: boolean): string {
  const top = RACK_TOP + RACK_H - 6
  const bottom = H - 4
  const s = flip ? -1 : 1
  const at = (dx: number) => x + s * dx
  return `M${at(0)},${top} L${at(70)},${top} L${at(80)},${bottom - 4} Q${at(80)},${bottom} ${at(76)},${bottom} L${at(-6)},${bottom} Q${at(-10)},${bottom} ${at(-10)},${bottom - 4} Z`
}

interface BoardProps {
  board: BoardType
  winningCells?: Array<{ row: number; col: number }>
  lastMove?: { row: number; col: number }
  /** Number of moves played; a rise means a disc was just dropped */
  moveCount: number
  onColumnClick: (col: number) => void
  disabled: boolean
  currentPlayer: Player
  selectedColumn?: number | null
  /** Column suggested by a hint, marked with a static brass ring */
  hintColumn?: number | null
  gameOver?: boolean
}

export const Board = memo(function Board({
  board,
  winningCells = [],
  lastMove,
  moveCount,
  onColumnClick,
  disabled,
  currentPlayer,
  selectedColumn = null,
  hintColumn = null,
  gameOver = false,
}: BoardProps) {
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null)

  // Only a new disc falls; undo and new game redraw without motion.
  const [prevCount, setPrevCount] = useState(moveCount)
  const [dropping, setDropping] = useState(false)
  if (moveCount !== prevCount) {
    setPrevCount(moveCount)
    setDropping(moveCount > prevCount)
  }

  const landingRow = (col: number): number => {
    for (let r = ROWS - 1; r >= 0; r--) if (board[r][col] === null) return r
    return -1
  }

  const isWinning = (row: number, col: number) => winningCells.some(c => c.row === row && c.col === col)
  const hasWinLine = gameOver && winningCells.length > 0

  const targetColumn = hoveredColumn ?? selectedColumn
  const ghostColumn = !disabled && targetColumn !== null && landingRow(targetColumn) >= 0 ? targetColumn : null
  const ghostRow = ghostColumn !== null ? landingRow(ghostColumn) : -1
  const hintRow = hintColumn !== null ? landingRow(hintColumn) : -1

  const ariaLabel = (col: number): string => {
    const row = landingRow(col)
    if (row < 0) return `Column ${col + 1}, full`
    if (disabled) return `Column ${col + 1}`
    return `Drop disc in column ${col + 1}${hintColumn === col ? ', suggested by hint' : ''}`
  }

  return (
    <div
      className="c4-board"
      role="group"
      aria-label="Connect 4 board, 7 columns and 6 rows"
      onPointerMove={e => {
        if (e.pointerType !== 'mouse') return
        const rect = e.currentTarget.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * W
        const y = ((e.clientY - rect.top) / rect.height) * H
        const col = y > RACK_TOP + RACK_H ? null : Math.min(COLUMNS - 1, Math.max(0, Math.floor((x - FRAME) / PITCH)))
        setHoveredColumn(current => (current === col ? current : col))
      }}
      onPointerLeave={() => setHoveredColumn(null)}
    >
      {/* Behind everything: the shadow on the table, the feet, and the table seen through the holes */}
      <svg className="c4-layer" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id="c4-contact" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.55)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
          <linearGradient id="c4-foot" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1d3b73" />
            <stop offset="100%" stopColor="#132a55" />
          </linearGradient>
          <linearGradient id="c4-well" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(0,8,5,0.34)" />
            <stop offset="100%" stopColor="rgba(0,8,5,0.16)" />
          </linearGradient>
        </defs>
        <ellipse cx={W / 2} cy={H - 4} rx={W / 2 + 6} ry="14" fill="url(#c4-contact)" />
        <path d={footPath(14, false)} fill="url(#c4-foot)" />
        <path d={footPath(W - 14, true)} fill="url(#c4-foot)" />
        <rect x={FRAME - 4} y={RACK_TOP + FRAME - 4} width={W - 2 * FRAME + 8} height={RACK_H - 2 * FRAME + 8} fill="url(#c4-well)" />
      </svg>

      {/* Discs, behind the panel */}
      {HOLES.map(({ row, col }) => {
        const player = board[row][col]
        if (player === null) return null
        const last = lastMove?.row === row && lastMove?.col === col
        const falling = last && dropping
        return (
          <div
            key={`${row}-${col}${falling ? `-${moveCount}` : ''}`}
            className={cn('c4-disc', falling && 'c4-disc-fall', hasWinLine && !isWinning(row, col) && 'c4-disc-dim')}
            style={{ ...place(cx(col), cy(row), DISC_R), ...(falling ? fallStyle(row) : null) }}
            role="img"
            aria-label={`${player === 1 ? 'Your' : 'Opponent'} disc, column ${col + 1}, row ${ROWS - row}${isWinning(row, col) ? ', winning line' : ''}`}
          >
            <Disc player={player} isLast={last} className="h-full w-full" />
          </div>
        )
      })}


      {/* The front panel, with real holes, bevelled edges and a heavier frame */}
      <svg className="c4-layer c4-panel" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="c4-lacquer" x1="0" y1="0" x2="0.35" y2="1">
            <stop offset="0%" stopColor="#24478a" />
            <stop offset="55%" stopColor="#1f3f7a" />
            <stop offset="100%" stopColor="#1a3569" />
          </linearGradient>
          <linearGradient id="c4-bevel" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(160,190,240,0.55)" />
            <stop offset="42%" stopColor="rgba(160,190,240,0)" />
            <stop offset="58%" stopColor="rgba(4,12,34,0)" />
            <stop offset="100%" stopColor="rgba(4,12,34,0.75)" />
          </linearGradient>
        </defs>
        <path d={PANEL_PATH} fill="url(#c4-lacquer)" fillRule="evenodd" />
        {/* Frame: a darker, thicker edge, a hairline where it meets the face, and light along the top */}
        <rect x="5" y={RACK_TOP + 5} width={W - 10} height={RACK_H - 10} rx="14" fill="none" stroke="#152d5a" strokeWidth="10" />
        <rect x="11" y={RACK_TOP + 11} width={W - 22} height={RACK_H - 22} rx="9" fill="none" stroke="rgba(4,12,34,0.5)" strokeWidth="1.5" />
        <path d={`M18,${RACK_TOP + 1.5} H${W - 18}`} stroke="rgba(190,210,250,0.28)" strokeWidth="2" />
        {HOLES.map(({ row, col }) => (
          <g key={`${row}-${col}`}>
            <circle cx={cx(col)} cy={cy(row)} r={HOLE_R + 2} fill="none" stroke="url(#c4-bevel)" strokeWidth="4" />
            <circle cx={cx(col)} cy={cy(row)} r={HOLE_R} fill="none" stroke="rgba(4,12,34,0.6)" strokeWidth="1.2" />
          </g>
        ))}
      </svg>

      {/* Marks on top of the panel */}
      {ghostColumn !== null && ghostRow >= 0 && ghostColumn !== hintColumn && (
        <div className="c4-landing" style={place(cx(ghostColumn), cy(ghostRow), HOLE_R - 3)} aria-hidden="true" />
      )}
      {hasWinLine &&
        winningCells.map(({ row, col }) => (
          <div key={`win-${row}-${col}`} className="c4-win-ring" style={place(cx(col), cy(row), HOLE_R + 6)} aria-hidden="true" />
        ))}


      {/* The disc you are about to drop, hovering over the column */}
      {ghostColumn !== null && (
        <div className="c4-ghost" style={place(cx(ghostColumn), ZONE_CY, DISC_R)} aria-hidden="true">
          <Disc player={currentPlayer} className="h-full w-full" />
        </div>
      )}

      {/* Hint: a brass ring over the hover spot of the suggested column and on its landing hole */}
      {hintColumn !== null && hintRow >= 0 && (
        <>
          <div className="c4-hint-ring" style={place(cx(hintColumn), ZONE_CY, DISC_R + 7)} aria-hidden="true" />
          <div className="c4-hint-ring" style={place(cx(hintColumn), cy(hintRow), HOLE_R)} aria-hidden="true" />
        </>
      )}

      {/* Click targets: each whole column, from the hover band down to the bottom of the rack */}
      {Array.from({ length: COLUMNS }, (_, col) => {
        const left = col === 0 ? 0 : FRAME + col * PITCH
        const right = col === COLUMNS - 1 ? W : FRAME + (col + 1) * PITCH
        const playable = !disabled && landingRow(col) >= 0
        return (
          <button
            key={col}
            type="button"
            className="c4-column"
            style={{
              left: `${(left / W) * 100}%`,
              width: `${((right - left) / W) * 100}%`,
              height: `${((RACK_TOP + RACK_H) / H) * 100}%`,
            }}
            // Not the disabled attribute: a disabled button swallows pointer events,
            // which would leave the hover ghost behind on the wrong column.
            aria-disabled={!playable}
            tabIndex={playable ? 0 : -1}
            data-playable={playable || undefined}
            aria-label={ariaLabel(col)}
            onClick={() => {
              if (playable) onColumnClick(col)
            }}
          />
        )
      })}
    </div>
  )
})
