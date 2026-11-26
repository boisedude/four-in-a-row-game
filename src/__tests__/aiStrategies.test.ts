import { getAIMove } from '@/lib/aiStrategies'
import { createEmptyBoard, getValidMoves, simulateMove, checkWinner, isBoardFull } from '@/lib/connect4Rules'
import type { Board, Player } from '@/types/connect4.types'

function randomBoard(stones: number): { board: Board; player: Player } {
  let board = createEmptyBoard()
  let player: Player = 1
  for (let i = 0; i < stones; i++) {
    const moves = getValidMoves(board).filter(c => {
      const next = simulateMove(board, c, player)
      return !checkWinner(next).winner && !isBoardFull(next)
    })
    if (moves.length === 0) break
    board = simulateMove(board, moves[Math.floor(Math.random() * moves.length)], player)
    player = player === 1 ? 2 : 1
  }
  return { board, player }
}

describe('getAIMove', () => {
  it('Bella and Coop return legal moves', () => {
    for (let i = 0; i < 60; i++) {
      const { board, player } = randomBoard(Math.floor(Math.random() * 40))
      expect(getValidMoves(board)).toContain(getAIMove(board, player, 'easy'))
      expect(getValidMoves(board)).toContain(getAIMove(board, player, 'medium'))
    }
  })

  it('Bentley returns a legal move with a small budget', () => {
    for (let i = 0; i < 20; i++) {
      const { board, player } = randomBoard(Math.floor(Math.random() * 40))
      expect(getValidMoves(board)).toContain(getAIMove(board, player, 'hard', 20))
    }
  })

  it('Coop takes a win and blocks a threat', () => {
    const win: Board = createEmptyBoard()
    win[5][0] = 2
    win[5][1] = 2
    win[5][2] = 2
    win[5][6] = 1
    win[4][6] = 1
    win[3][6] = 1
    win[2][5] = 1
    // 2 to move wins in column 3 (1 also threatens column 6)
    expect(getAIMove(win, 2, 'medium')).toBe(3)

    const block: Board = createEmptyBoard()
    block[5][6] = 1
    block[4][6] = 1
    block[3][6] = 1
    block[5][0] = 2
    block[5][3] = 2
    expect(getAIMove(block, 2, 'medium')).toBe(6)
  })

  it('throws when the board is full', () => {
    const full: Board = Array.from({ length: 6 }, (_, r) =>
      Array.from({ length: 7 }, (_, c) => (((r >> 1) + c) % 2 === 0 ? 1 : 2) as Player)
    )
    expect(() => getAIMove(full, 1, 'easy')).toThrow('No valid moves available')
  })
})
