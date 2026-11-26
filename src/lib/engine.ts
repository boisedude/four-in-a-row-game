/**
 * Connect 4 engine (7 columns x 6 rows).
 *
 * Representation: the standard 7-bits-per-column bitboard (6 cells plus one
 * empty sentinel bit per column, 49 bits). JavaScript bitwise operators work on
 * 32 bits, so every board is held as two halves: L carries columns 0-3
 * (bits 0-27) and H carries columns 4-6 (bits 0-20, global bits 28-48).
 * A position is (cur, mask): the stones of the side to move and all stones.
 *
 * Search:
 * - Exact solver (strong): negamax with alpha-beta on the exact score scale,
 *   null-window probes, a transposition table holding upper and lower bounds,
 *   moves that hand the opponent a win directly above are never generated,
 *   forced blocks are the only move generated, and moves are ordered by the
 *   number of threats they create, centre first on ties.
 * - Heuristic search (positions too young to solve in the budget): iterative
 *   deepening principal variation search with the same move generation, a
 *   transposition table (best move first), history ordering, and an
 *   evaluation built from open threats with odd/even row parity, stacked
 *   threats and the classic cell table.
 *
 * Scores are distance-aware: a sooner win scores higher, a later loss
 * scores higher than an early one.
 */

import type { Board, Player } from '@/types/connect4.types'
import { COLUMNS, ROWS } from '@/types/connect4.types'

// ---------------------------------------------------------------------------
// Bitboard basics
// ---------------------------------------------------------------------------

const M28 = 0x0fffffff
const M21 = 0x001fffff
const CELLS = COLUMNS * ROWS // 42

/** Column masks (6 playable bits) inside the half that holds the column. */
const COL_MASK = new Int32Array(COLUMNS)
/** Bottom cell of each column inside its half. */
const COL_BOTTOM = new Int32Array(COLUMNS)
for (let c = 0; c < COLUMNS; c++) {
  const shift = (c < 4 ? c : c - 4) * 7
  COL_MASK[c] = 0x3f << shift
  COL_BOTTOM[c] = 1 << shift
}
const BOTTOM_L = COL_BOTTOM[0] | COL_BOTTOM[1] | COL_BOTTOM[2] | COL_BOTTOM[3]
const BOTTOM_H = COL_BOTTOM[4] | COL_BOTTOM[5] | COL_BOTTOM[6]
const BOARD_L = COL_MASK[0] | COL_MASK[1] | COL_MASK[2] | COL_MASK[3]
const BOARD_H = COL_MASK[4] | COL_MASK[5] | COL_MASK[6]
/** Rows 1, 3, 5 counted from the bottom (0-based rows 0, 2, 4). */
const ODD_L = BOTTOM_L * 0b10101
const ODD_H = BOTTOM_H * 0b10101
const EVEN_L = BOTTOM_L * 0b101010
const EVEN_H = BOTTOM_H * 0b101010

const COLUMN_ORDER = [3, 2, 4, 1, 5, 0, 6]

function pop(x: number): number {
  x = x - ((x >>> 1) & 0x55555555)
  x = (x & 0x33333333) + ((x >>> 2) & 0x33333333)
  return Math.imul((x + (x >>> 4)) & 0x0f0f0f0f, 0x01010101) >>> 24
}

// Results of winningCells(): empty cells that would complete four.
let WL = 0
let WH = 0
// Scratch accumulators for dir().
let gL = 0
let gH = 0

function dir(pL: number, pH: number, d: number): void {
  const d2 = d + d
  const d3 = d2 + d
  const l1L = (pL << d) & M28
  const l1H = ((pH << d) | (pL >>> (28 - d))) & M21
  const l2L = (pL << d2) & M28
  const l2H = ((pH << d2) | (pL >>> (28 - d2))) & M21
  const l3L = (pL << d3) & M28
  const l3H = ((pH << d3) | (pL >>> (28 - d3))) & M21
  const r1L = ((pL >>> d) | (pH << (28 - d))) & M28
  const r1H = pH >>> d
  const r2L = ((pL >>> d2) | (pH << (28 - d2))) & M28
  const r2H = pH >>> d2
  const r3L = ((pL >>> d3) | (pH << (28 - d3))) & M28
  const r3H = pH >>> d3
  let aL = l1L & l2L
  let aH = l1H & l2H
  gL |= aL & (l3L | r1L)
  gH |= aH & (l3H | r1H)
  aL = r1L & r2L
  aH = r1H & r2H
  gL |= aL & (l1L | r3L)
  gH |= aH & (l1H | r3H)
}

/** Sets WL/WH to the empty cells where stones p would complete four. */
function winningCells(pL: number, pH: number, mL: number, mH: number): void {
  // Vertical: a column's sentinel bit is never a stone, so no wrap between halves.
  gL = (pL << 1) & (pL << 2) & (pL << 3)
  gH = (pH << 1) & (pH << 2) & (pH << 3)
  dir(pL, pH, 7) // horizontal
  dir(pL, pH, 6) // diagonal
  dir(pL, pH, 8) // anti-diagonal
  WL = gL & (BOARD_L ^ mL)
  WH = gH & (BOARD_H ^ mH)
}

function hasFour(pL: number, pH: number): boolean {
  // Used only at the boundary; plain loops over the shifted halves.
  const shifts = [1, 7, 6, 8]
  for (const d of shifts) {
    // (p & p>>d) & (that >> 2d)
    const aL = pL & (((pL >>> d) | (pH << (28 - d))) & M28)
    const aH = pH & (pH >>> d)
    const bL = aL & (((aL >>> (2 * d)) | (aH << (28 - 2 * d))) & M28)
    const bH = aH & (aH >>> (2 * d))
    if (bL | bH) return true
  }
  return false
}

// ---------------------------------------------------------------------------
// Position conversion
// ---------------------------------------------------------------------------

export interface EnginePosition {
  curL: number
  curH: number
  maskL: number
  maskH: number
  /** Stones on the board. */
  moves: number
}

function bitOf(col: number, rowFromBottom: number): number {
  return 1 << ((col < 4 ? col : col - 4) * 7 + rowFromBottom)
}

/** Converts the UI board (row 0 at the top) into an engine position for `player` to move. */
export function encodeBoard(board: Board, player: Player): EnginePosition {
  let curL = 0
  let curH = 0
  let maskL = 0
  let maskH = 0
  let moves = 0
  for (let col = 0; col < COLUMNS; col++) {
    for (let r = 0; r < ROWS; r++) {
      const cell = board[ROWS - 1 - r][col]
      if (cell === null) continue
      const b = bitOf(col, r)
      moves++
      if (col < 4) {
        maskL |= b
        if (cell === player) curL |= b
      } else {
        maskH |= b
        if (cell === player) curH |= b
      }
    }
  }
  return { curL, curH, maskL, maskH, moves }
}

/** Columns the engine considers playable. */
export function engineLegalColumns(pos: EnginePosition): number[] {
  const pL = (pos.maskL + BOTTOM_L) & BOARD_L
  const pH = (pos.maskH + BOTTOM_H) & BOARD_H
  const out: number[] = []
  for (let c = 0; c < COLUMNS; c++) {
    if ((c < 4 ? pL : pH) & COL_MASK[c]) out.push(c)
  }
  return out
}

/** Columns where the side to move wins at once. */
export function engineWinningColumns(pos: EnginePosition): number[] {
  const pL = (pos.maskL + BOTTOM_L) & BOARD_L
  const pH = (pos.maskH + BOTTOM_H) & BOARD_H
  winningCells(pos.curL, pos.curH, pos.maskL, pos.maskH)
  const wL = WL & pL
  const wH = WH & pH
  const out: number[] = []
  for (let c = 0; c < COLUMNS; c++) {
    if ((c < 4 ? wL : wH) & COL_MASK[c]) out.push(c)
  }
  return out
}

/** True if either side already has four in a row. */
export function engineHasWinner(pos: EnginePosition): boolean {
  const oL = pos.curL ^ pos.maskL
  const oH = pos.curH ^ pos.maskH
  return hasFour(pos.curL, pos.curH) || hasFour(oL, oH)
}

// ---------------------------------------------------------------------------
// Move generation shared by both searches
// ---------------------------------------------------------------------------

// Result of nonLosing(): candidate move bits.
let NL = 0
let NH = 0

/**
 * Moves for the side to move that do not lose at once: if the opponent
 * threatens to win, only the block (none if there are two threats), and never
 * a move directly under an opponent's winning cell.
 */
function nonLosing(cL: number, cH: number, mL: number, mH: number): void {
  let pL = (mL + BOTTOM_L) & BOARD_L
  let pH = (mH + BOTTOM_H) & BOARD_H
  winningCells(cL ^ mL, cH ^ mH, mL, mH)
  const oL = WL
  const oH = WH
  const fL = pL & oL
  const fH = pH & oH
  if (fL | fH) {
    if (fL & (fL - 1) || fH & (fH - 1) || (fL && fH)) {
      NL = 0
      NH = 0
      return
    }
    pL = fL
    pH = fH
  }
  NL = pL & ~(oL >>> 1)
  NH = pH & ~(oH >>> 1)
}

// ---------------------------------------------------------------------------
// Transposition tables
// ---------------------------------------------------------------------------

const SOLVE_TT_BITS = 21
const SOLVE_TT_SIZE = 1 << SOLVE_TT_BITS
const HEUR_TT_BITS = 20
const HEUR_TT_SIZE = 1 << HEUR_TT_BITS

let sKeyL: Uint32Array | null = null
let sKeyHV: Uint32Array | null = null // key high (21 bits) | value << 21

let hKeyL: Uint32Array | null = null
let hKeyH: Uint32Array | null = null
let hScore: Int32Array | null = null
let hMeta: Uint16Array | null = null // depth (6 bits) | flag (2 bits) << 6 | move+1 (4 bits) << 8

function ensureTables(): void {
  if (!sKeyL) {
    sKeyL = new Uint32Array(SOLVE_TT_SIZE)
    sKeyHV = new Uint32Array(SOLVE_TT_SIZE)
    hKeyL = new Uint32Array(HEUR_TT_SIZE)
    hKeyH = new Uint32Array(HEUR_TT_SIZE)
    hScore = new Int32Array(HEUR_TT_SIZE)
    hMeta = new Uint16Array(HEUR_TT_SIZE)
  }
}

/** Clears both transposition tables (tests use this for repeatable results). */
export function resetEngine(): void {
  ensureTables()
  sKeyL!.fill(0)
  sKeyHV!.fill(0)
  hKeyL!.fill(0)
  hKeyH!.fill(0)
  hScore!.fill(0)
  hMeta!.fill(0)
  history.fill(0)
}

function hashIndex(kL: number, kH: number, bits: number): number {
  return Math.imul(kL ^ Math.imul(kH + 0x632be5ab, 0x9e3779b1), 0x85ebca6b) >>> (32 - bits)
}

// ---------------------------------------------------------------------------
// Search state
// ---------------------------------------------------------------------------

class Timeout extends Error {}
const TIMEOUT = new Timeout('search timeout')

const now: () => number =
  typeof performance !== 'undefined' && typeof performance.now === 'function'
    ? () => performance.now()
    : () => Date.now()

let nodes = 0
let deadline = Infinity
let nextCheck = 0

function tick(): void {
  if (++nodes >= nextCheck) {
    nextCheck = nodes + 4096
    if (now() > deadline) throw TIMEOUT
  }
}

const MAX_PLY = 44
const listCol = new Int8Array(MAX_PLY * 8)
const listScore = new Int32Array(MAX_PLY * 8)
/** History heuristic per (side parity, cell). */
const history = new Int32Array(2 * 64)

// ---------------------------------------------------------------------------
// Exact solver
// ---------------------------------------------------------------------------

const MIN_SCORE = -(CELLS / 2) + 3 // -18
const S_MAX = ((CELLS + 1) >> 1) - 3 // 18
const LOWER_OFFSET = S_MAX - 2 * MIN_SCORE + 2

let rootCut = -1

function solve(
  cL: number,
  cH: number,
  mL: number,
  mH: number,
  nb: number,
  alpha: number,
  beta: number,
  ply: number
): number {
  tick()
  nonLosing(cL, cH, mL, mH)
  const nL = NL
  const nH = NH
  if ((nL | nH) === 0) return -((CELLS - nb) >> 1)
  if (nb >= CELLS - 2) return 0

  let min = -((CELLS - 2 - nb) >> 1)
  if (alpha < min) {
    alpha = min
    if (alpha >= beta) return alpha
  }
  let max = (CELLS - 1 - nb) >> 1
  if (beta > max) {
    beta = max
    if (alpha >= beta) return beta
  }

  const kL = (cL + mL) >>> 0
  const kH = cH + mH
  const idx = hashIndex(kL, kH, SOLVE_TT_BITS)
  const hv = sKeyHV![idx]
  if (hv !== 0 && sKeyL![idx] === kL && (hv & M21) === kH) {
    const val = hv >>> 21
    if (val > S_MAX - MIN_SCORE + 1) {
      min = val + 2 * MIN_SCORE - S_MAX - 2
      if (alpha < min) {
        alpha = min
        if (alpha >= beta) return alpha
      }
    } else {
      max = val + MIN_SCORE - 1
      if (beta > max) {
        beta = max
        if (alpha >= beta) return beta
      }
    }
  }

  // Order moves by threats created, centre first on ties.
  const base = ply * 8
  let n = 0
  for (let i = 0; i < COLUMNS; i++) {
    const c = COLUMN_ORDER[i]
    if (c < 4) {
      const b = nL & COL_MASK[c]
      if (!b) continue
      winningCells(cL | b, cH, mL, mH)
    } else {
      const b = nH & COL_MASK[c]
      if (!b) continue
      winningCells(cL, cH | b, mL, mH)
    }
    const s = pop(WL) + pop(WH)
    let j = n++
    while (j > 0 && listScore[base + j - 1] < s) {
      listScore[base + j] = listScore[base + j - 1]
      listCol[base + j] = listCol[base + j - 1]
      j--
    }
    listScore[base + j] = s
    listCol[base + j] = c
  }

  const oL = cL ^ mL
  const oH = cH ^ mH
  for (let i = 0; i < n; i++) {
    const c = listCol[base + i]
    let score: number
    if (c < 4) {
      score = -solve(oL, oH, mL | (nL & COL_MASK[c]), mH, nb + 1, -beta, -alpha, ply + 1)
    } else {
      score = -solve(oL, oH, mL, mH | (nH & COL_MASK[c]), nb + 1, -beta, -alpha, ply + 1)
    }
    if (score >= beta) {
      sKeyL![idx] = kL
      sKeyHV![idx] = (kH | ((score + LOWER_OFFSET) << 21)) >>> 0
      if (ply === 0) rootCut = c
      return score
    }
    if (score > alpha) alpha = score
  }
  sKeyL![idx] = kL
  sKeyHV![idx] = (kH | ((alpha - MIN_SCORE + 1) << 21)) >>> 0
  return alpha
}

/** Exact score of a child reached by playing column c, from the mover's point of view, via a null-window test. */
function childAtLeast(pos: EnginePosition, c: number, target: number): boolean {
  const { curL, curH, maskL, maskH, moves } = pos
  const oL = curL ^ maskL
  const oH = curH ^ maskH
  let mL = maskL
  let mH = maskH
  if (c < 4) mL = maskL | ((maskL + COL_BOTTOM[c]) & COL_MASK[c])
  else mH = maskH | ((maskH + COL_BOTTOM[c]) & COL_MASK[c])
  // mover's score >= target  <=>  child score <= -target
  const r = solve(oL, oH, mL, mH, moves + 1, -target, -target + 1, 1)
  return r <= -target
}

// ---------------------------------------------------------------------------
// Heuristic search
// ---------------------------------------------------------------------------

/** Win at stone count n scores WIN - n for the winner. */
const WIN = 100000
const PROVEN = WIN - 100
const INF = 1 << 30

const FLAG_EXACT = 1
const FLAG_LOWER = 2
const FLAG_UPPER = 3

// Cell weights: number of four-lines through each cell.
const CELL_TABLE = [
  [3, 4, 5, 7, 5, 4, 3],
  [4, 6, 8, 10, 8, 6, 4],
  [5, 8, 11, 13, 11, 8, 5],
  [5, 8, 11, 13, 11, 8, 5],
  [4, 6, 8, 10, 8, 6, 4],
  [3, 4, 5, 7, 5, 4, 3],
]
const WEIGHT_VALUES: number[] = []
const WEIGHT_L: number[] = []
const WEIGHT_H: number[] = []
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLUMNS; c++) {
    const w = CELL_TABLE[r][c]
    let k = WEIGHT_VALUES.indexOf(w)
    if (k < 0) {
      k = WEIGHT_VALUES.length
      WEIGHT_VALUES.push(w)
      WEIGHT_L.push(0)
      WEIGHT_H.push(0)
    }
    if (c < 4) WEIGHT_L[k] |= bitOf(c, r)
    else WEIGHT_H[k] |= bitOf(c, r)
  }
}
const WEIGHT_COUNT = WEIGHT_VALUES.length

/**
 * Static evaluation for the side to move. Open threats count most: a threat
 * on a row whose parity suits its owner (odd rows for the first player, even
 * rows for the second) is the classic endgame winning plan; two threats one
 * above the other in a column usually decide the game. Threats sitting
 * directly above an opponent threat are worth little.
 */
function evaluate(cL: number, cH: number, mL: number, mH: number, nb: number): number {
  const oL = cL ^ mL
  const oH = cH ^ mH
  let score = 0
  for (let k = 0; k < WEIGHT_COUNT; k++) {
    score +=
      WEIGHT_VALUES[k] *
      (pop(cL & WEIGHT_L[k]) + pop(cH & WEIGHT_H[k]) - pop(oL & WEIGHT_L[k]) - pop(oH & WEIGHT_H[k]))
  }
  winningCells(cL, cH, mL, mH)
  const tmL = WL
  const tmH = WH
  winningCells(oL, oH, mL, mH)
  const toL = WL
  const toH = WH
  // Threats directly above an opponent threat are mostly dead.
  const meL = tmL & ~(toL << 1)
  const meH = tmH & ~(toH << 1)
  const opL = toL & ~(tmL << 1)
  const opH = toH & ~(tmH << 1)
  const meFirst = (nb & 1) === 0
  const meGoodL = meFirst ? ODD_L : EVEN_L
  const meGoodH = meFirst ? ODD_H : EVEN_H
  const opGoodL = meFirst ? EVEN_L : ODD_L
  const opGoodH = meFirst ? EVEN_H : ODD_H
  score += 24 * (pop(meL) + pop(meH) - pop(opL) - pop(opH))
  score += 40 * (pop(meL & meGoodL) + pop(meH & meGoodH) - pop(opL & opGoodL) - pop(opH & opGoodH))
  score += 70 * (pop(tmL & (tmL << 1)) + pop(tmH & (tmH << 1)) - pop(toL & (toL << 1)) - pop(toH & (toH << 1)))
  return score
}

function searchH(
  cL: number,
  cH: number,
  mL: number,
  mH: number,
  nb: number,
  depth: number,
  alpha: number,
  beta: number,
  ply: number
): number {
  tick()
  nonLosing(cL, cH, mL, mH)
  const nL = NL
  const nH = NH
  // Precondition: the side to move cannot win at once (the parent never allows it).
  if ((nL | nH) === 0) return -(WIN - (nb + 2))
  if (nb >= CELLS - 2) return 0

  // Distance bounds: we cannot win before stone nb+3, nor lose before nb+4.
  const maxS = WIN - (nb + 3)
  if (beta > maxS) {
    beta = maxS
    if (alpha >= beta) return beta
  }
  const minS = -(WIN - (nb + 4))
  if (alpha < minS) {
    alpha = minS
    if (alpha >= beta) return alpha
  }

  if (depth <= 0) return evaluate(cL, cH, mL, mH, nb)

  const kL = (cL + mL) >>> 0
  const kH = cH + mH
  const idx = hashIndex(kL, kH, HEUR_TT_BITS)
  let ttMove = -1
  const meta = hMeta![idx]
  if (meta !== 0 && hKeyL![idx] === kL && hKeyH![idx] === kH) {
    ttMove = (meta >>> 8) - 1
    const d = meta & 63
    if (d >= depth) {
      const flag = (meta >>> 6) & 3
      const s = hScore![idx]
      if (flag === FLAG_EXACT) return s
      if (flag === FLAG_LOWER && s >= beta) return s
      if (flag === FLAG_UPPER && s <= alpha) return s
    }
  }

  const base = ply * 8
  const side = (nb & 1) << 6
  let n = 0
  for (let i = 0; i < COLUMNS; i++) {
    const c = COLUMN_ORDER[i]
    let cell: number
    if (c < 4) {
      const b = nL & COL_MASK[c]
      if (!b) continue
      winningCells(cL | b, cH, mL, mH)
      cell = 31 - Math.clz32(b)
    } else {
      const b = nH & COL_MASK[c]
      if (!b) continue
      winningCells(cL, cH | b, mL, mH)
      cell = 28 + 31 - Math.clz32(b)
    }
    let s = (pop(WL) + pop(WH)) * 4096 + Math.min(history[side + cell], 4095)
    if (c === ttMove) s = 1 << 28
    let j = n++
    while (j > 0 && listScore[base + j - 1] < s) {
      listScore[base + j] = listScore[base + j - 1]
      listCol[base + j] = listCol[base + j - 1]
      j--
    }
    listScore[base + j] = s
    listCol[base + j] = c
  }

  const oL = cL ^ mL
  const oH = cH ^ mH
  const alpha0 = alpha
  let best = -INF
  let bestMove = listCol[base]
  for (let i = 0; i < n; i++) {
    const c = listCol[base + i]
    const cmL = c < 4 ? mL | (nL & COL_MASK[c]) : mL
    const cmH = c < 4 ? mH : mH | (nH & COL_MASK[c])
    let score: number
    if (i === 0) {
      score = -searchH(oL, oH, cmL, cmH, nb + 1, depth - 1, -beta, -alpha, ply + 1)
    } else {
      score = -searchH(oL, oH, cmL, cmH, nb + 1, depth - 1, -alpha - 1, -alpha, ply + 1)
      if (score > alpha && score < beta) {
        score = -searchH(oL, oH, cmL, cmH, nb + 1, depth - 1, -beta, -alpha, ply + 1)
      }
    }
    if (score > best) {
      best = score
      bestMove = c
      if (score > alpha) {
        alpha = score
        if (alpha >= beta) {
          const b = c < 4 ? nL & COL_MASK[c] : nH & COL_MASK[c]
          const cell = (c < 4 ? 0 : 28) + 31 - Math.clz32(b)
          history[side + cell] += depth * depth
          break
        }
      }
    }
  }

  const flag = best >= beta ? FLAG_LOWER : best > alpha0 ? FLAG_EXACT : FLAG_UPPER
  if (depth >= (hMeta![idx] & 63) || hKeyL![idx] !== kL || hKeyH![idx] !== kH) {
    hKeyL![idx] = kL
    hKeyH![idx] = kH
    hScore![idx] = best
    hMeta![idx] = Math.min(depth, 63) | (flag << 6) | ((bestMove + 1) << 8)
  }
  return best
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export interface EngineOptions {
  /** Wall-clock budget in milliseconds (default 700). */
  timeMs?: number
  /** Highest heuristic depth to search; tests and Coop use this for fixed-depth play. */
  maxDepth?: number
  /** Try to solve the position exactly (default true). */
  solve?: boolean
  /** Fewest stones on the board before an exact solve is attempted (default 10). */
  solveFrom?: number
  /**
   * Evaluation margin for random choice among near-equal moves in the heuristic
   * search. Default: 2 in the first 6 stones, otherwise 0 (proven-equal only).
   */
  variety?: number
  /** Random source in [0, 1); pass a seeded one for repeatable tests. */
  random?: () => number
}

export interface EngineResult {
  column: number
  /** Heuristic score, or a win/loss score when proven (see `exact`). */
  score: number
  /** Last fully searched heuristic depth (0 when the solver decided the move). */
  depth: number
  /** True when the move comes from an exact solve of the position. */
  exact: boolean
  /**
   * Solver score when exact: positive means the side to move wins, and the
   * larger it is the sooner (it counts the winner's stones left unplayed).
   */
  solvedScore?: number
  nodes: number
  elapsedMs: number
}

function pick<T>(items: T[], random: () => number): T {
  return items[Math.min(items.length - 1, Math.floor(random() * items.length))]
}

function columnsOf(bL: number, bH: number): number[] {
  const out: number[] = []
  for (const c of COLUMN_ORDER) if ((c < 4 ? bL : bH) & COL_MASK[c]) out.push(c)
  return out
}

/**
 * Best column for `player` on `board`. Always returns a legal column when one
 * exists; throws only when the board has no legal move.
 */
export function searchBestMove(board: Board, player: Player, options: EngineOptions = {}): EngineResult {
  const started = now()
  const budget = options.timeMs ?? 700
  const random = options.random ?? Math.random
  const pos = encodeBoard(board, player)
  const { curL, curH, maskL, maskH, moves } = pos
  ensureTables()
  nodes = 0
  nextCheck = 0

  const legal = engineLegalColumns(pos)
  if (legal.length === 0) throw new Error('No valid moves available')
  const done = (column: number, score: number, depth: number, exact: boolean, solvedScore?: number) => ({
    column,
    score,
    depth,
    exact,
    solvedScore,
    nodes,
    elapsedMs: now() - started,
  })

  // 1. Win at once.
  const wins = engineWinningColumns(pos)
  if (wins.length > 0) return done(pick(wins, random), WIN - (moves + 1), 1, true, (CELLS + 1 - moves) >> 1)

  // 2. Moves that do not lose at once.
  nonLosing(curL, curH, maskL, maskH)
  const safe = columnsOf(NL, NH)
  if (safe.length === 0) {
    // Every move loses: block one threat if possible, else anything.
    const pL = (maskL + BOTTOM_L) & BOARD_L
    const pH = (maskH + BOTTOM_H) & BOARD_H
    winningCells(curL ^ maskL, curH ^ maskH, maskL, maskH)
    const blocks = columnsOf(pL & WL, pH & WH)
    const column = blocks.length > 0 ? blocks[0] : columnsOf(pL, pH)[0]
    return done(column, -(WIN - (moves + 2)), 1, true, -((CELLS - moves) >> 1))
  }
  if (safe.length === 1) return done(safe[0], 0, 1, false)

  const solveFrom = options.solveFrom ?? 10
  const maxDepth = Math.min(options.maxDepth ?? 64, CELLS - moves)
  const variety = options.variety ?? (moves < 6 ? 2 : 0)
  const canSolve = (options.solve ?? true) && moves >= solveFrom

  // 3. Late positions: the solver nearly always finishes, so it goes first.
  if (canSolve && moves >= 16) {
    const r = trySolve(pos, safe, started + budget * 0.85, started + budget * 0.95, random)
    if (r) return done(r.column, r.score, 0, r.exact, r.solvedScore)
    const h = heuristic(pos, safe, started, budget, maxDepth, variety, random)
    return done(h.column, h.score, h.depth, false)
  }

  // 4. Middle positions: a quick heuristic search first, then the solver with the rest.
  if (canSolve) {
    const h = heuristic(pos, safe, started, budget * 0.3, maxDepth, variety, random)
    if (Math.abs(h.score) >= PROVEN) return done(h.column, h.score, h.depth, false)
    const r = trySolve(pos, safe, started + budget * 0.95, started + budget * 0.97, random)
    if (r) return done(r.column, r.score, h.depth, r.exact, r.solvedScore)
    return done(h.column, h.score, h.depth, false)
  }

  // 5. Early positions: heuristic search only.
  const h = heuristic(pos, safe, started, budget, maxDepth, variety, random)
  return done(h.column, h.score, h.depth, false)
}

interface SolveOutcome {
  column: number
  score: number
  exact: boolean
  solvedScore: number
}

/**
 * Solves the position (weak first, then exact) until `solveDeadline`. Returns
 * a move only when it is proven to keep the best result found: an exact
 * score, or at least a proven win.
 */
function trySolve(
  pos: EnginePosition,
  safe: number[],
  solveDeadline: number,
  candidateDeadline: number,
  random: () => number
): SolveOutcome | null {
  const { curL, curH, maskL, maskH, moves } = pos
  deadline = solveDeadline
  let lo = -((CELLS - moves) >> 1)
  let hi = (CELLS + 1 - moves) >> 1
  let loMove = -1
  try {
    let probes = 0
    while (lo < hi) {
      let med: number
      if (probes === 0) med = 0
      else if (probes === 1 && hi <= 0) med = -1
      else {
        med = lo + Math.floor((hi - lo) / 2)
        if (med <= 0 && Math.floor(lo / 2) < med) med = Math.floor(lo / 2)
        else if (med >= 0 && Math.floor(hi / 2) > med) med = Math.floor(hi / 2)
      }
      if (med < lo) med = lo
      if (med >= hi) med = hi - 1
      probes++
      rootCut = -1
      const r = solve(curL, curH, maskL, maskH, moves, med, med + 1, 0)
      if (r <= med) hi = r
      else {
        lo = r
        if (rootCut >= 0) loMove = rootCut
      }
    }
  } catch (e) {
    if (!(e instanceof Timeout)) throw e
  }
  const exact = lo === hi
  if (!exact && lo <= 0) return null

  // Every move that keeps the proven score is a candidate, for variety.
  const candidates: number[] = loMove >= 0 ? [loMove] : []
  deadline = Math.max(solveDeadline, candidateDeadline)
  try {
    for (const c of safe) {
      if (c === loMove) continue
      if (childAtLeast(pos, c, lo)) candidates.push(c)
    }
  } catch (e) {
    if (!(e instanceof Timeout)) throw e
  }
  if (candidates.length === 0) return null
  const score = lo > 0 ? WIN - (CELLS + 1 - 2 * lo) : lo < 0 ? -(WIN - (CELLS + 2 + 2 * lo)) : 0
  return { column: pick(candidates, random), score, exact, solvedScore: lo }
}

interface HeuristicOutcome {
  column: number
  score: number
  depth: number
}

/** Iterative deepening; the answer is the last fully searched depth's choice. */
function heuristic(
  pos: EnginePosition,
  safe: number[],
  started: number,
  budget: number,
  maxDepth: number,
  variety: number,
  random: () => number
): HeuristicOutcome {
  const { curL, curH, maskL, maskH, moves } = pos
  const oL = curL ^ maskL
  const oH = curH ^ maskH
  let order = safe.slice()
  let bestColumn = order[0]
  let bestScore = 0
  let completed = 0
  let candidates: number[] = [bestColumn]

  for (let depth = 1; depth <= maxDepth; depth++) {
    // Depth 1 always completes.
    deadline = depth === 1 ? Infinity : started + budget
    try {
      let best = -INF
      let bestC = order[0]
      const scores = new Map<number, number>()
      for (let i = 0; i < order.length; i++) {
        const c = order[i]
        const cmL = c < 4 ? maskL | ((maskL + COL_BOTTOM[c]) & COL_MASK[c]) : maskL
        const cmH = c < 4 ? maskH : maskH | ((maskH + COL_BOTTOM[c]) & COL_MASK[c])
        let score: number
        if (i === 0) {
          score = -searchH(oL, oH, cmL, cmH, moves + 1, depth - 1, -INF, INF, 1)
          scores.set(c, score)
        } else {
          // Moves within `variety` of the best get exact scores; the rest only need to fail low.
          const floor = best - variety - 1
          score = -searchH(oL, oH, cmL, cmH, moves + 1, depth - 1, -floor - 1, -floor, 1)
          if (score > floor) {
            score = -searchH(oL, oH, cmL, cmH, moves + 1, depth - 1, -INF, -floor, 1)
            scores.set(c, score)
          }
        }
        if (score > best) {
          best = score
          bestC = c
        }
      }
      completed = depth
      bestScore = best
      bestColumn = bestC
      // Proven results keep only the best; otherwise anything within the margin.
      const margin = Math.abs(best) >= PROVEN ? 0 : variety
      candidates = [...scores.entries()].filter(([, s]) => s >= best - margin).map(([c]) => c)
      order = [
        bestC,
        ...order.filter(c => c !== bestC).sort((a, b) => (scores.get(b) ?? -INF) - (scores.get(a) ?? -INF)),
      ]
      if (Math.abs(best) >= PROVEN) break
      // The next iteration would most likely not finish.
      if (depth >= 2 && now() - started > budget * 0.55) break
    } catch (e) {
      if (!(e instanceof Timeout)) throw e
      break
    }
  }

  const column = candidates.length > 1 ? pick(candidates, random) : bestColumn
  return { column, score: bestScore, depth: completed }
}

/**
 * Exact score of the position for `player` to move, or null if the solve does
 * not finish in `timeMs`. Positive: the side to move wins; larger is sooner.
 */
export function solvePosition(board: Board, player: Player, timeMs = 700): number | null {
  ensureTables()
  const pos = encodeBoard(board, player)
  const { curL, curH, maskL, maskH, moves } = pos
  if (engineWinningColumns(pos).length > 0) return (CELLS + 1 - moves) >> 1
  if (moves >= CELLS) return 0
  nodes = 0
  nextCheck = 0
  deadline = now() + timeMs
  let lo = -((CELLS - moves) >> 1)
  let hi = (CELLS + 1 - moves) >> 1
  try {
    while (lo < hi) {
      let med = lo + Math.floor((hi - lo) / 2)
      if (med <= 0 && Math.floor(lo / 2) < med) med = Math.floor(lo / 2)
      else if (med >= 0 && Math.floor(hi / 2) > med) med = Math.floor(hi / 2)
      const r = solve(curL, curH, maskL, maskH, moves, med, med + 1, 1)
      if (r <= med) hi = r
      else lo = r
    }
  } catch (e) {
    if (e instanceof Timeout) return null
    throw e
  }
  return lo
}
