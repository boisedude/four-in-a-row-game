// Unit tests for Connect4 AI strategies

import { getAIMove } from '@/lib/aiStrategies'
import {
  createEmptyBoard,
  getValidMoves,
  checkWinner,
  simulateMove,
} from '@/lib/connect4Rules'
import { ROWS, COLUMNS } from '@/types/connect4.types'
import type { Player, Difficulty } from '@/types/connect4.types'

describe('aiStrategies', () => {
  describe('getAIMove', () => {
    describe('returns valid moves', () => {
      it('should return valid column for easy difficulty', () => {
        const board = createEmptyBoard()
        const move = getAIMove(board, 2, 'easy')

        const validMoves = getValidMoves(board)
        expect(validMoves).toContain(move)
      })

      it('should return valid column for medium difficulty', () => {
        const board = createEmptyBoard()
        const move = getAIMove(board, 2, 'medium')

        const validMoves = getValidMoves(board)
        expect(validMoves).toContain(move)
      })

      it('should return valid column for hard difficulty', () => {
        const board = createEmptyBoard()
        const move = getAIMove(board, 2, 'hard')

        const validMoves = getValidMoves(board)
        expect(validMoves).toContain(move)
      })

      it('should work for player 1 as AI', () => {
        const board = createEmptyBoard()
        const move = getAIMove(board, 1, 'hard')

        const validMoves = getValidMoves(board)
        expect(validMoves).toContain(move)
      })
    })

    describe('Easy AI (random moves)', () => {
      it('should make valid random moves', () => {
        const board = createEmptyBoard()
        const moves = new Set<number>()

        // Run multiple times to test randomness
        for (let i = 0; i < 30; i++) {
          const move = getAIMove(board, 2, 'easy')
          moves.add(move)
          expect(getValidMoves(board)).toContain(move)
        }

        // Should show variety (with 7 columns available, very likely to get > 1)
        expect(moves.size).toBeGreaterThan(1)
      })

      it('should handle limited move options', () => {
        const board = createEmptyBoard()
        // Fill all columns except column 3
        for (let col = 0; col < COLUMNS; col++) {
          if (col !== 3) {
            for (let row = 0; row < ROWS; row++) {
              board[row][col] = ((row + col) % 2 === 0 ? 1 : 2) as Player
            }
          }
        }

        const move = getAIMove(board, 2, 'easy')
        expect(move).toBe(3)
      })
    })

    describe('Medium AI (greedy)', () => {
      it('should take winning move when available', () => {
        const board = createEmptyBoard()
        // Set up 3 in a row for AI (player 2)
        board[5][0] = 2
        board[5][1] = 2
        board[5][2] = 2
        // Player 1 pieces to block pattern detection issues
        board[4][0] = 1
        board[4][1] = 1

        const move = getAIMove(board, 2, 'medium')

        // Should play column 3 to win
        expect(move).toBe(3)
      })

      it('should block opponent winning move', () => {
        const board = createEmptyBoard()
        // Set up 3 in a row for opponent (player 1)
        board[5][0] = 1
        board[5][1] = 1
        board[5][2] = 1
        // AI pieces to establish its presence
        board[4][0] = 2

        const move = getAIMove(board, 2, 'medium')

        // Should block column 3
        expect(move).toBe(3)
      })

      it('should prefer center columns when no immediate threat/win', () => {
        const board = createEmptyBoard()

        // Run multiple times - should consistently choose center-ish
        const moves = new Set<number>()
        for (let i = 0; i < 10; i++) {
          moves.add(getAIMove(board, 2, 'medium'))
        }

        // Medium AI should prefer center (columns 2, 3, 4), especially column 3
        expect(moves.has(3)).toBe(true)
      })

      it('should block immediate vertical threat', () => {
        const board = createEmptyBoard()
        // Player 1 has 3 vertical
        board[5][3] = 1
        board[4][3] = 1
        board[3][3] = 1

        const move = getAIMove(board, 2, 'medium')

        // Should block at column 3
        expect(move).toBe(3)
      })

      it('should block diagonal threat', () => {
        const board = createEmptyBoard()
        // Set up diagonal threat for player 1: needs one more at (2,3)
        // Diagonal from (5,0) going up-right
        board[5][0] = 1
        board[4][1] = 1
        board[3][2] = 1
        // Support pieces to make column 3 reachable at row 2
        board[5][1] = 2
        board[5][2] = 2
        board[4][2] = 2
        board[5][3] = 2
        board[4][3] = 2
        board[3][3] = 2

        const move = getAIMove(board, 2, 'medium')

        // Should block at column 3 (row 2) to prevent diagonal win
        expect(move).toBe(3)
      })
    })

    describe('Hard AI (minimax)', () => {
      it('should find winning move', () => {
        const board = createEmptyBoard()
        // Set up 3 in a row for AI (player 2)
        board[5][0] = 2
        board[5][1] = 2
        board[5][2] = 2

        const move = getAIMove(board, 2, 'hard')

        // Should play column 3 to win
        expect(move).toBe(3)
      })

      it('should block opponent winning move', () => {
        const board = createEmptyBoard()
        // Set up 3 in a row for opponent (player 1)
        board[5][0] = 1
        board[5][1] = 1
        board[5][2] = 1

        const move = getAIMove(board, 2, 'hard')

        // Should block column 3
        expect(move).toBe(3)
      })

      it('should be deterministic for same position', () => {
        const board = createEmptyBoard()

        const move1 = getAIMove(board, 2, 'hard')
        const move2 = getAIMove(board, 2, 'hard')
        const move3 = getAIMove(board, 2, 'hard')

        // Minimax is deterministic
        expect(move1).toBe(move2)
        expect(move2).toBe(move3)
      })

      it('should prioritize winning over blocking', () => {
        const board = createEmptyBoard()
        // AI (player 2) can win at column 3
        board[5][0] = 2
        board[5][1] = 2
        board[5][2] = 2

        // But opponent also threatens at column 6
        board[4][4] = 1
        board[4][5] = 1
        board[4][6] = 1

        const move = getAIMove(board, 2, 'hard')

        // Should take the win rather than block
        expect(move).toBe(3)

        // Verify it's actually a win
        const newBoard = simulateMove(board, move, 2)
        expect(checkWinner(newBoard).winner).toBe(2)
      })

      it('should not set up opponent win', () => {
        const board = createEmptyBoard()
        // Position where certain moves would give opponent the win

        board[5][3] = 1
        board[4][3] = 2
        board[3][3] = 1
        board[5][2] = 2
        board[5][4] = 2

        const move = getAIMove(board, 2, 'hard')
        const newBoard = simulateMove(board, move, 2)

        // After AI move, opponent shouldn't have immediate win
        const validOpponentMoves = getValidMoves(newBoard)
        let opponentCanWin = false
        for (const opponentMove of validOpponentMoves) {
          const afterOpponent = simulateMove(newBoard, opponentMove, 1)
          if (checkWinner(afterOpponent).winner === 1) {
            opponentCanWin = true
            break
          }
        }

        // AI shouldn't make a move that gives opponent immediate win
        // (unless there's no way to prevent it)
        expect(opponentCanWin).toBe(false)
      })
    })

    describe('AI on near-full board', () => {
      it('should not crash with only one valid move', () => {
        const board = createEmptyBoard()
        // Fill all but one cell
        for (let row = 0; row < ROWS; row++) {
          for (let col = 0; col < COLUMNS; col++) {
            if (row === 0 && col === 3) continue // Leave one cell
            board[row][col] = ((row + col) % 2 === 0 ? 1 : 2) as Player
          }
        }

        const difficulties: Difficulty[] = ['easy', 'medium', 'hard']
        for (const difficulty of difficulties) {
          const move = getAIMove(board, 2, difficulty)
          expect(move).toBe(3)
        }
      })

      it('should not crash on almost full board', () => {
        const board = createEmptyBoard()
        // Fill most of the board
        for (let row = 1; row < ROWS; row++) {
          for (let col = 0; col < COLUMNS; col++) {
            board[row][col] = ((row + col) % 2 === 0 ? 1 : 2) as Player
          }
        }
        // Leave top row partially empty
        board[0][0] = 1
        board[0][1] = 2
        board[0][2] = 1

        const difficulties: Difficulty[] = ['easy', 'medium', 'hard']
        for (const difficulty of difficulties) {
          const move = getAIMove(board, 2, difficulty)
          expect(getValidMoves(board)).toContain(move)
        }
      })

      it('should throw when no valid moves', () => {
        const board = createEmptyBoard()
        // Fill entire board
        for (let row = 0; row < ROWS; row++) {
          for (let col = 0; col < COLUMNS; col++) {
            board[row][col] = ((row + col) % 2 === 0 ? 1 : 2) as Player
          }
        }

        expect(() => getAIMove(board, 2, 'easy')).toThrow('No valid moves available')
        expect(() => getAIMove(board, 2, 'medium')).toThrow('No valid moves available')
        expect(() => getAIMove(board, 2, 'hard')).toThrow('No valid moves available')
      })
    })

    describe('strategic scenarios', () => {
      it('hard AI should prefer center column on empty board', () => {
        const board = createEmptyBoard()

        const move = getAIMove(board, 2, 'hard')

        // Center column (3) is strategically optimal
        expect(move).toBe(3)
      })

      it('should handle fork detection', () => {
        const board = createEmptyBoard()
        // Position where AI needs to create or block a fork
        board[5][2] = 2
        board[5][4] = 2
        board[5][3] = 1

        const move = getAIMove(board, 2, 'hard')

        // Move should be valid
        expect(getValidMoves(board)).toContain(move)
      })

      it('medium AI should prefer center when no immediate threats', () => {
        const board = createEmptyBoard()
        // A few scattered pieces, no immediate wins or threats
        board[5][0] = 1
        board[5][6] = 2
        board[5][1] = 1

        const move = getAIMove(board, 2, 'medium')

        // Should prefer center region (columns 2, 3, 4)
        expect([2, 3, 4]).toContain(move)
      })
    })

    describe('performance', () => {
      it('hard AI should complete in reasonable time for empty board', () => {
        const board = createEmptyBoard()
        const startTime = Date.now()

        getAIMove(board, 2, 'hard')

        const elapsed = Date.now() - startTime
        // With alpha-beta pruning and depth 6, should be fast
        expect(elapsed).toBeLessThan(2000)
      })

      it('hard AI should complete in reasonable time for mid-game', () => {
        const board = createEmptyBoard()
        // Set up mid-game position
        board[5][3] = 1
        board[5][2] = 2
        board[4][3] = 1
        board[5][4] = 2
        board[4][2] = 1
        board[3][3] = 2

        const startTime = Date.now()

        getAIMove(board, 2, 'hard')

        const elapsed = Date.now() - startTime
        expect(elapsed).toBeLessThan(2000)
      })

      it('easy and medium AI should be fast', () => {
        const board = createEmptyBoard()

        const easyStart = Date.now()
        getAIMove(board, 2, 'easy')
        expect(Date.now() - easyStart).toBeLessThan(100)

        const mediumStart = Date.now()
        getAIMove(board, 2, 'medium')
        expect(Date.now() - mediumStart).toBeLessThan(100)
      })
    })

    describe('all difficulties handle edge positions', () => {
      const difficulties: Difficulty[] = ['easy', 'medium', 'hard']

      it('should handle board with pieces only in corners', () => {
        const board = createEmptyBoard()
        board[5][0] = 1
        board[5][6] = 2

        for (const difficulty of difficulties) {
          const move = getAIMove(board, 2, difficulty)
          expect(getValidMoves(board)).toContain(move)
        }
      })

      it('should handle tall stacks', () => {
        const board = createEmptyBoard()
        // Build tall stack in center
        for (let row = ROWS - 1; row >= 2; row--) {
          board[row][3] = ((ROWS - row) % 2 === 0 ? 1 : 2) as Player
        }

        for (const difficulty of difficulties) {
          const move = getAIMove(board, 2, difficulty)
          expect(getValidMoves(board)).toContain(move)
        }
      })

      it('should work when only edge columns available', () => {
        const board = createEmptyBoard()
        // Fill middle columns
        for (let row = 0; row < ROWS; row++) {
          for (let col = 1; col < 6; col++) {
            board[row][col] = ((row + col) % 2 === 0 ? 1 : 2) as Player
          }
        }

        for (const difficulty of difficulties) {
          const move = getAIMove(board, 2, difficulty)
          expect([0, 6]).toContain(move)
        }
      })
    })
  })
})
