import { createEmptyBoard, getValidMoves, simulateMove, checkWinner, isBoardFull } from '@/lib/connect4Rules'
import {
  encodeBoard,
  engineLegalColumns,
  engineWinningColumns,
  engineHasWinner,
  searchBestMove,
  solvePosition,
  resetEngine,
} from '@/lib/engine'
import type { Board, Player } from '@/types/connect4.types'

function seeded(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (Math.imul(s, 1103515245) + 12345) >>> 0
    return s / 4294967296
  }
}

const other = (p: Player): Player => (p === 1 ? 2 : 1)

/** Plays random legal moves; stops before a move that would end the game. */
function randomPosition(random: () => number, stones: number): { board: Board; player: Player } {
  let board = createEmptyBoard()
  let player: Player = 1
  for (let i = 0; i < stones; i++) {
    const moves = getValidMoves(board).filter(c => {
      const next = simulateMove(board, c, player)
      return !checkWinner(next).winner && !isBoardFull(next)
    })
    if (moves.length === 0) break
    board = simulateMove(board, moves[Math.floor(random() * moves.length)], player)
    player = other(player)
  }
  return { board, player }
}

/** Builds a board from rows written top to bottom, '.' empty, '1'/'2' stones. */
function boardFrom(rows: string[]): Board {
  return rows.map(r => r.split('').map(ch => (ch === '.' ? null : (Number(ch) as Player))))
}

/** Exact score by plain negamax over the rules module (same scale as the solver). */
const memo = new Map<string, number>()
function bruteScore(board: Board, player: Player, stones: number): number {
  const key = board.map(r => r.map(c => c ?? 0).join('')).join('') + player
  const known = memo.get(key)
  if (known !== undefined) return known
  let best = -100
  for (const c of getValidMoves(board)) {
    const next = simulateMove(board, c, player)
    let s: number
    if (checkWinner(next).winner === player) s = Math.floor((43 - stones) / 2)
    else if (isBoardFull(next)) s = 0
    else s = -bruteScore(next, other(player), stones + 1)
    if (s > best) best = s
  }
  memo.set(key, best)
  return best
}

const stonesOn = (board: Board) => board.flat().filter(c => c !== null).length

beforeAll(() => resetEngine())

describe('engine agrees with the rules module', () => {
  it('on legal moves, immediate wins and finished boards in random positions', () => {
    const random = seeded(1)
    for (let i = 0; i < 400; i++) {
      const { board, player } = randomPosition(random, Math.floor(random() * 42))
      const pos = encodeBoard(board, player)
      expect(engineLegalColumns(pos)).toEqual(getValidMoves(board))
      const wins = getValidMoves(board).filter(c => checkWinner(simulateMove(board, c, player)).winner === player)
      expect(engineWinningColumns(pos)).toEqual(wins)
      expect(engineHasWinner(pos)).toBe(false)
    }
  })

  it('on boards that already have four in a row', () => {
    const random = seeded(2)
    let checked = 0
    for (let i = 0; i < 300; i++) {
      let board = createEmptyBoard()
      let player: Player = 1
      while (!checkWinner(board).winner && !isBoardFull(board)) {
        const moves = getValidMoves(board)
        board = simulateMove(board, moves[Math.floor(random() * moves.length)], player)
        player = other(player)
      }
      expect(engineHasWinner(encodeBoard(board, player))).toBe(checkWinner(board).winner !== null)
      checked++
    }
    expect(checked).toBe(300)
  })
})

describe('exact solver', () => {
  it('matches a brute-force negamax on late positions', () => {
    const random = seeded(3)
    for (let i = 0; i < 12; i++) {
      const { board, player } = randomPosition(random, 33)
      const stones = stonesOn(board)
      expect(solvePosition(board, player, 10000)).toBe(bruteScore(board, player, stones))
    }
  })

  it('plays a move that keeps the exact score', () => {
    const random = seeded(4)
    for (let i = 0; i < 12; i++) {
      const { board, player } = randomPosition(random, 32)
      const stones = stonesOn(board)
      const best = bruteScore(board, player, stones)
      const r = searchBestMove(board, player, { timeMs: 10000, solveFrom: 0, random })
      const next = simulateMove(board, r.column, player)
      const got =
        checkWinner(next).winner === player
          ? Math.floor((43 - stones) / 2)
          : isBoardFull(next)
            ? 0
            : -bruteScore(next, other(player), stones + 1)
      expect(got).toBe(best)
    }
  })
})

describe('tactics', () => {
  const opts = { timeMs: 60000, maxDepth: 8, random: seeded(5) }

  it('wins at once instead of blocking', () => {
    const board = boardFrom(['.......', '.......', '.......', '1......', '1......', '1.222..'])
    expect([1, 5]).toContain(searchBestMove(board, 2, opts).column)
  })

  it('blocks the only threat', () => {
    const board = boardFrom(['.......', '.......', '.......', '.......', '.......', '2111..2'])
    expect(searchBestMove(board, 2, opts).column).toBe(4)
  })

  it('finds the double threat (a win with its next two moves)', () => {
    const board = boardFrom(['.......', '.......', '.......', '.......', '..11...', '..22..1'])
    const r = searchBestMove(board, 2, opts)
    expect([1, 4]).toContain(r.column)
    expect(r.score).toBeGreaterThan(90000)
  })

  it('stops the opponent making a double threat', () => {
    const board = boardFrom(['.......', '.......', '.......', '.......', '.......', '..11..2'])
    expect([1, 4]).toContain(searchBestMove(board, 2, opts).column)
  })

  it('never plays directly under an opponent winning cell', () => {
    // 1 wins on the second row in columns 0 and 4; filling either bottom cell loses.
    const board = boardFrom(['.......', '.......', '.......', '.......', '.111...', '.212..2'])
    for (let i = 0; i < 5; i++) {
      expect([0, 4]).not.toContain(searchBestMove(board, 2, { ...opts, maxDepth: 1 + i }).column)
    }
  })

  it('finds a forced win on the exact scale', () => {
    // Late position solved by brute force; the engine must keep the win.
    const random = seeded(6)
    let found = 0
    for (let i = 0; i < 40 && found < 4; i++) {
      const { board, player } = randomPosition(random, 31)
      const stones = stonesOn(board)
      if (stones < 31) continue
      const best = bruteScore(board, player, stones)
      if (best <= 0) continue
      found++
      const r = searchBestMove(board, player, { timeMs: 10000, random })
      const next = simulateMove(board, r.column, player)
      const kept =
        checkWinner(next).winner === player
          ? Math.floor((43 - stones) / 2)
          : -bruteScore(next, other(player), stones + 1)
      expect(kept).toBe(best)
      // An exact result must report the true score; a non-exact one carries no claim.
      expect(r.exact ? r.solvedScore : best).toBe(best)
    }
    expect(found).toBeGreaterThan(0)
  })
})

describe('never returns an illegal move', () => {
  it('under tiny budgets and depths', () => {
    const random = seeded(7)
    for (let i = 0; i < 150; i++) {
      const { board, player } = randomPosition(random, Math.floor(random() * 42))
      if (getValidMoves(board).length === 0) continue
      const r = searchBestMove(board, player, {
        timeMs: 1 + Math.floor(random() * 5),
        maxDepth: 1 + Math.floor(random() * 4),
        random,
      })
      expect(getValidMoves(board)).toContain(r.column)
    }
  })

  it('throws only when the board is full', () => {
    const full = boardFrom(['1212121', '2121212', '1212121', '1212121', '2121212', '1212121'])
    expect(() => searchBestMove(full, 1)).toThrow('No valid moves available')
  })
})
