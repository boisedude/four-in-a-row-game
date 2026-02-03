// Unit tests for Connect4 game rules engine

import {
  createEmptyBoard,
  createInitialGameState,
  isColumnFull,
  getLowestAvailableRow,
  isValidMove,
  getValidMoves,
  executeMove,
  checkWinner,
  isBoardFull,
  evaluateGameState,
  makeMove,
  simulateMove,
  countConsecutive,
  hasNInARow,
  boardToString,
} from '@/lib/connect4Rules'
import { ROWS, COLUMNS } from '@/types/connect4.types'
import type { Player } from '@/types/connect4.types'

describe('connect4Rules', () => {
  describe('createEmptyBoard', () => {
    it('should create a 6x7 empty grid', () => {
      const board = createEmptyBoard()

      expect(board.length).toBe(ROWS) // 6 rows
      expect(board[0].length).toBe(COLUMNS) // 7 columns
    })

    it('should initialize all cells to null', () => {
      const board = createEmptyBoard()

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLUMNS; col++) {
          expect(board[row][col]).toBeNull()
        }
      }
    })

    it('should create independent row arrays (no shared references)', () => {
      const board = createEmptyBoard()

      // Modify one row
      board[0][0] = 1

      // Other rows should not be affected
      expect(board[1][0]).toBeNull()
      expect(board[2][0]).toBeNull()
    })
  })

  describe('createInitialGameState', () => {
    it('should create default game state with pvc mode and medium difficulty', () => {
      const state = createInitialGameState()

      expect(state.mode).toBe('pvc')
      expect(state.difficulty).toBe('medium')
      expect(state.currentPlayer).toBe(1)
      expect(state.status).toBe('playing')
      expect(state.winner).toBeNull()
      expect(state.moveHistory).toEqual([])
    })

    it('should create game state with specified mode and difficulty', () => {
      const state = createInitialGameState('pvp', 'hard')

      expect(state.mode).toBe('pvp')
      expect(state.difficulty).toBe('hard')
    })

    it('should include an empty board', () => {
      const state = createInitialGameState()

      expect(state.board.length).toBe(ROWS)
      expect(state.board[0].length).toBe(COLUMNS)
      expect(state.board.every(row => row.every(cell => cell === null))).toBe(true)
    })
  })

  describe('isColumnFull', () => {
    it('should return false for empty column', () => {
      const board = createEmptyBoard()

      expect(isColumnFull(board, 0)).toBe(false)
      expect(isColumnFull(board, 3)).toBe(false)
      expect(isColumnFull(board, 6)).toBe(false)
    })

    it('should return false for partially filled column', () => {
      const board = createEmptyBoard()
      board[5][0] = 1
      board[4][0] = 2
      board[3][0] = 1

      expect(isColumnFull(board, 0)).toBe(false)
    })

    it('should return true for full column', () => {
      const board = createEmptyBoard()
      // Fill column 3
      for (let row = 0; row < ROWS; row++) {
        board[row][3] = (row % 2 === 0 ? 1 : 2) as Player
      }

      expect(isColumnFull(board, 3)).toBe(true)
    })
  })

  describe('getLowestAvailableRow', () => {
    it('should return bottom row (5) for empty column', () => {
      const board = createEmptyBoard()

      expect(getLowestAvailableRow(board, 0)).toBe(5)
      expect(getLowestAvailableRow(board, 3)).toBe(5)
    })

    it('should return correct row for partially filled column', () => {
      const board = createEmptyBoard()
      board[5][0] = 1
      board[4][0] = 2

      expect(getLowestAvailableRow(board, 0)).toBe(3)
    })

    it('should return null for full column', () => {
      const board = createEmptyBoard()
      // Fill column 3
      for (let row = 0; row < ROWS; row++) {
        board[row][3] = 1
      }

      expect(getLowestAvailableRow(board, 3)).toBeNull()
    })
  })

  describe('isValidMove', () => {
    it('should return true for valid column in empty board', () => {
      const board = createEmptyBoard()

      for (let col = 0; col < COLUMNS; col++) {
        expect(isValidMove(board, col)).toBe(true)
      }
    })

    it('should return false for column out of bounds (negative)', () => {
      const board = createEmptyBoard()

      expect(isValidMove(board, -1)).toBe(false)
      expect(isValidMove(board, -100)).toBe(false)
    })

    it('should return false for column out of bounds (too large)', () => {
      const board = createEmptyBoard()

      expect(isValidMove(board, 7)).toBe(false)
      expect(isValidMove(board, 100)).toBe(false)
    })

    it('should return false for full column', () => {
      const board = createEmptyBoard()
      // Fill column 0
      for (let row = 0; row < ROWS; row++) {
        board[row][0] = 1
      }

      expect(isValidMove(board, 0)).toBe(false)
    })

    it('should return true for partially filled column', () => {
      const board = createEmptyBoard()
      board[5][0] = 1
      board[4][0] = 2

      expect(isValidMove(board, 0)).toBe(true)
    })
  })

  describe('getValidMoves', () => {
    it('should return all columns for empty board', () => {
      const board = createEmptyBoard()

      const validMoves = getValidMoves(board)

      expect(validMoves).toEqual([0, 1, 2, 3, 4, 5, 6])
    })

    it('should exclude full columns', () => {
      const board = createEmptyBoard()
      // Fill columns 0 and 3
      for (let row = 0; row < ROWS; row++) {
        board[row][0] = 1
        board[row][3] = 2
      }

      const validMoves = getValidMoves(board)

      expect(validMoves).toEqual([1, 2, 4, 5, 6])
      expect(validMoves).not.toContain(0)
      expect(validMoves).not.toContain(3)
    })

    it('should return empty array for full board', () => {
      const board = createEmptyBoard()
      // Fill entire board
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLUMNS; col++) {
          board[row][col] = ((row + col) % 2 === 0 ? 1 : 2) as Player
        }
      }

      const validMoves = getValidMoves(board)

      expect(validMoves).toEqual([])
    })
  })

  describe('executeMove', () => {
    it('should drop piece to the lowest empty row', () => {
      const board = createEmptyBoard()

      const newBoard = executeMove(board, 3, 1)

      expect(newBoard[5][3]).toBe(1) // Bottom row
    })

    it('should stack pieces correctly', () => {
      let board = createEmptyBoard()

      board = executeMove(board, 3, 1)
      board = executeMove(board, 3, 2)
      board = executeMove(board, 3, 1)

      expect(board[5][3]).toBe(1) // Bottom
      expect(board[4][3]).toBe(2) // Middle
      expect(board[3][3]).toBe(1) // Top
    })

    it('should not mutate the original board', () => {
      const board = createEmptyBoard()
      const originalBoard = board.map(row => [...row])

      executeMove(board, 3, 1)

      // Original board should be unchanged
      expect(board).toEqual(originalBoard)
    })

    it('should throw error when column is full', () => {
      const board = createEmptyBoard()
      // Fill column 3
      for (let row = 0; row < ROWS; row++) {
        board[row][3] = 1
      }

      expect(() => executeMove(board, 3, 2)).toThrow('Invalid move: column is full')
    })
  })

  describe('checkWinner - horizontal wins', () => {
    it('should detect horizontal win on bottom row', () => {
      const board = createEmptyBoard()
      // Player 1 has 4 in a row horizontally on bottom
      board[5][0] = 1
      board[5][1] = 1
      board[5][2] = 1
      board[5][3] = 1

      const result = checkWinner(board)

      expect(result.winner).toBe(1)
      expect(result.winningCells).toHaveLength(4)
      expect(result.winningCells).toContainEqual({ row: 5, col: 0 })
      expect(result.winningCells).toContainEqual({ row: 5, col: 3 })
    })

    it('should detect horizontal win in middle of row', () => {
      const board = createEmptyBoard()
      // Player 2 has 4 in a row starting at column 2
      board[5][2] = 2
      board[5][3] = 2
      board[5][4] = 2
      board[5][5] = 2

      const result = checkWinner(board)

      expect(result.winner).toBe(2)
    })

    it('should detect horizontal win on right edge', () => {
      const board = createEmptyBoard()
      // 4 in a row at columns 3-6
      board[5][3] = 1
      board[5][4] = 1
      board[5][5] = 1
      board[5][6] = 1

      const result = checkWinner(board)

      expect(result.winner).toBe(1)
    })
  })

  describe('checkWinner - vertical wins', () => {
    it('should detect vertical win', () => {
      const board = createEmptyBoard()
      // Player 1 has 4 in a row vertically
      board[5][0] = 1
      board[4][0] = 1
      board[3][0] = 1
      board[2][0] = 1

      const result = checkWinner(board)

      expect(result.winner).toBe(1)
      expect(result.winningCells).toHaveLength(4)
    })

    it('should detect vertical win at top of column', () => {
      const board = createEmptyBoard()
      // Fill bottom with alternating, then 4 in row at top
      board[5][3] = 2
      board[4][3] = 2
      board[3][3] = 1
      board[2][3] = 1
      board[1][3] = 1
      board[0][3] = 1

      const result = checkWinner(board)

      expect(result.winner).toBe(1)
    })
  })

  describe('checkWinner - diagonal wins (down-right)', () => {
    it('should detect diagonal win going down-right', () => {
      const board = createEmptyBoard()
      // Diagonal from (2,0) to (5,3)
      board[2][0] = 1
      board[3][1] = 1
      board[4][2] = 1
      board[5][3] = 1

      const result = checkWinner(board)

      expect(result.winner).toBe(1)
      expect(result.winningCells).toHaveLength(4)
    })

    it('should detect diagonal win in corner', () => {
      const board = createEmptyBoard()
      // Diagonal from (0,0) to (3,3)
      board[0][0] = 2
      board[1][1] = 2
      board[2][2] = 2
      board[3][3] = 2

      const result = checkWinner(board)

      expect(result.winner).toBe(2)
    })
  })

  describe('checkWinner - diagonal wins (down-left)', () => {
    it('should detect diagonal win going down-left', () => {
      const board = createEmptyBoard()
      // Diagonal from (2,6) to (5,3)
      board[2][6] = 1
      board[3][5] = 1
      board[4][4] = 1
      board[5][3] = 1

      const result = checkWinner(board)

      expect(result.winner).toBe(1)
    })

    it('should detect diagonal win from top-right corner', () => {
      const board = createEmptyBoard()
      // Diagonal from (0,6) to (3,3)
      board[0][6] = 2
      board[1][5] = 2
      board[2][4] = 2
      board[3][3] = 2

      const result = checkWinner(board)

      expect(result.winner).toBe(2)
    })
  })

  describe('checkWinner - no winner', () => {
    it('should return null winner for empty board', () => {
      const board = createEmptyBoard()

      const result = checkWinner(board)

      expect(result.winner).toBeNull()
    })

    it('should return null when no four in a row exists', () => {
      const board = createEmptyBoard()
      // Only 3 in a row
      board[5][0] = 1
      board[5][1] = 1
      board[5][2] = 1
      board[5][3] = 2

      const result = checkWinner(board)

      expect(result.winner).toBeNull()
    })

    it('should not detect win with broken sequence', () => {
      const board = createEmptyBoard()
      // 2 + gap + 2
      board[5][0] = 1
      board[5][1] = 1
      board[5][2] = 2
      board[5][3] = 1
      board[5][4] = 1

      const result = checkWinner(board)

      expect(result.winner).toBeNull()
    })
  })

  describe('isBoardFull', () => {
    it('should return false for empty board', () => {
      const board = createEmptyBoard()

      expect(isBoardFull(board)).toBe(false)
    })

    it('should return false for partially filled board', () => {
      const board = createEmptyBoard()
      board[5][0] = 1
      board[4][0] = 2

      expect(isBoardFull(board)).toBe(false)
    })

    it('should return true for completely full board', () => {
      const board = createEmptyBoard()
      // Fill entire board (no winner pattern)
      const pattern = [
        [1, 2, 1, 2, 1, 2, 1],
        [1, 2, 1, 2, 1, 2, 1],
        [2, 1, 2, 1, 2, 1, 2],
        [2, 1, 2, 1, 2, 1, 2],
        [1, 2, 1, 2, 1, 2, 1],
        [1, 2, 1, 2, 1, 2, 1],
      ]
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLUMNS; col++) {
          board[row][col] = pattern[row][col] as Player
        }
      }

      expect(isBoardFull(board)).toBe(true)
    })
  })

  describe('evaluateGameState', () => {
    it('should return playing status for ongoing game', () => {
      const board = createEmptyBoard()
      board[5][3] = 1

      const result = evaluateGameState(board)

      expect(result.status).toBe('playing')
      expect(result.winner).toBeNull()
    })

    it('should return won status with winner when four in a row', () => {
      const board = createEmptyBoard()
      board[5][0] = 1
      board[5][1] = 1
      board[5][2] = 1
      board[5][3] = 1

      const result = evaluateGameState(board)

      expect(result.status).toBe('won')
      expect(result.winner).toBe(1)
      expect(result.winningCells).toHaveLength(4)
    })

    it('should return draw status for full board with no winner', () => {
      const board = createEmptyBoard()
      // Fill board without creating four in a row
      const drawPattern = [
        [1, 2, 1, 2, 1, 2, 1],
        [1, 2, 1, 2, 1, 2, 1],
        [2, 1, 2, 1, 2, 1, 2],
        [2, 1, 2, 1, 2, 1, 2],
        [1, 2, 1, 2, 1, 2, 1],
        [1, 2, 1, 2, 1, 2, 1],
      ]
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLUMNS; col++) {
          board[row][col] = drawPattern[row][col] as Player
        }
      }

      const result = evaluateGameState(board)

      expect(result.status).toBe('draw')
      expect(result.winner).toBeNull()
    })
  })

  describe('makeMove', () => {
    it('should execute valid move and update state', () => {
      const state = createInitialGameState()

      const newState = makeMove(state, 3)

      expect(newState.board[5][3]).toBe(1)
      expect(newState.currentPlayer).toBe(2)
      expect(newState.moveHistory).toHaveLength(1)
      expect(newState.moveHistory[0]).toEqual({ column: 3, player: 1 })
      expect(newState.lastMove).toEqual({ row: 5, col: 3 })
    })

    it('should switch players after move', () => {
      let state = createInitialGameState()

      state = makeMove(state, 0)
      expect(state.currentPlayer).toBe(2)

      state = makeMove(state, 1)
      expect(state.currentPlayer).toBe(1)
    })

    it('should detect winning move', () => {
      let state = createInitialGameState()

      // Set up 3 in a row for player 1
      state = makeMove(state, 0) // P1
      state = makeMove(state, 6) // P2
      state = makeMove(state, 1) // P1
      state = makeMove(state, 6) // P2
      state = makeMove(state, 2) // P1
      state = makeMove(state, 6) // P2

      // Winning move
      state = makeMove(state, 3) // P1 wins

      expect(state.status).toBe('won')
      expect(state.winner).toBe(1)
      expect(state.currentPlayer).toBe(1) // Winner stays current
    })

    it('should throw error for invalid column', () => {
      const state = createInitialGameState()

      expect(() => makeMove(state, -1)).toThrow('Invalid move')
      expect(() => makeMove(state, 7)).toThrow('Invalid move')
    })

    it('should throw error when game is over', () => {
      const state = createInitialGameState()
      state.status = 'won'
      state.winner = 1

      expect(() => makeMove(state, 3)).toThrow('Game is already over')
    })

    it('should update lastMove correctly', () => {
      let state = createInitialGameState()

      state = makeMove(state, 3)
      expect(state.lastMove).toEqual({ row: 5, col: 3 })

      state = makeMove(state, 3)
      expect(state.lastMove).toEqual({ row: 4, col: 3 })
    })
  })

  describe('simulateMove', () => {
    it('should return new board with move applied', () => {
      const board = createEmptyBoard()

      const newBoard = simulateMove(board, 3, 1)

      expect(newBoard[5][3]).toBe(1)
    })

    it('should not mutate original board', () => {
      const board = createEmptyBoard()
      const originalBoard = board.map(row => [...row])

      simulateMove(board, 3, 1)

      expect(board).toEqual(originalBoard)
    })
  })

  describe('countConsecutive', () => {
    it('should count consecutive pieces horizontally', () => {
      const board = createEmptyBoard()
      board[5][0] = 1
      board[5][1] = 1
      board[5][2] = 1

      expect(countConsecutive(board, 5, 0, 0, 1, 1)).toBe(3)
    })

    it('should count consecutive pieces vertically', () => {
      const board = createEmptyBoard()
      board[5][0] = 1
      board[4][0] = 1
      board[3][0] = 1
      board[2][0] = 1

      expect(countConsecutive(board, 5, 0, -1, 0, 1)).toBe(4)
    })

    it('should stop at different player piece', () => {
      const board = createEmptyBoard()
      board[5][0] = 1
      board[5][1] = 1
      board[5][2] = 2

      expect(countConsecutive(board, 5, 0, 0, 1, 1)).toBe(2)
    })

    it('should stop at board edge', () => {
      const board = createEmptyBoard()
      board[5][5] = 1
      board[5][6] = 1

      expect(countConsecutive(board, 5, 5, 0, 1, 1)).toBe(2)
    })
  })

  describe('hasNInARow', () => {
    it('should detect 4 in a row', () => {
      const board = createEmptyBoard()
      board[5][0] = 1
      board[5][1] = 1
      board[5][2] = 1
      board[5][3] = 1

      expect(hasNInARow(board, 1, 4)).toBe(true)
      expect(hasNInARow(board, 2, 4)).toBe(false)
    })

    it('should detect 3 in a row', () => {
      const board = createEmptyBoard()
      board[5][0] = 2
      board[5][1] = 2
      board[5][2] = 2

      expect(hasNInARow(board, 2, 3)).toBe(true)
      expect(hasNInARow(board, 2, 4)).toBe(false)
    })

    it('should detect diagonal n in a row', () => {
      const board = createEmptyBoard()
      board[5][0] = 1
      board[4][1] = 1
      board[3][2] = 1
      board[2][3] = 1

      expect(hasNInARow(board, 1, 4)).toBe(true)
    })
  })

  describe('boardToString', () => {
    it('should return formatted string representation', () => {
      const board = createEmptyBoard()
      board[5][3] = 1
      board[4][3] = 2

      const str = boardToString(board)

      expect(str).toContain('0 1 2 3 4 5 6') // Header
      expect(str).toContain('1') // Player 1 piece
      expect(str).toContain('2') // Player 2 piece
      expect(str).toContain('.') // Empty cells
    })
  })

  describe('edge cases', () => {
    it('should handle full board draw scenario', () => {
      const board = createEmptyBoard()
      // Create a draw pattern (no 4 in a row)
      const drawPattern = [
        [1, 2, 1, 2, 1, 2, 1],
        [1, 2, 1, 2, 1, 2, 1],
        [2, 1, 2, 1, 2, 1, 2],
        [2, 1, 2, 1, 2, 1, 2],
        [1, 2, 1, 2, 1, 2, 1],
        [1, 2, 1, 2, 1, 2, 1],
      ]

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLUMNS; col++) {
          board[row][col] = drawPattern[row][col] as Player
        }
      }

      expect(isBoardFull(board)).toBe(true)
      expect(checkWinner(board).winner).toBeNull()
      expect(evaluateGameState(board).status).toBe('draw')
    })

    it('should detect winning on last possible move', () => {
      const board = createEmptyBoard()
      // Fill board except top-left, set up win condition
      const almostFullPattern = [
        [null, 2, 1, 2, 1, 2, 1],
        [1, 2, 1, 2, 1, 2, 1],
        [2, 1, 2, 1, 2, 1, 2],
        [2, 1, 2, 1, 2, 1, 2],
        [1, 2, 1, 2, 1, 2, 1],
        [1, 2, 1, 2, 1, 2, 1],
      ]

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLUMNS; col++) {
          board[row][col] = almostFullPattern[row][col] as Player | null
        }
      }

      // Set up vertical win for player 1 in column 0
      board[3][0] = 1
      board[2][0] = 1
      board[1][0] = 1

      // Make the winning move
      const newBoard = executeMove(board, 0, 1)

      expect(checkWinner(newBoard).winner).toBe(1)
    })

    it('should handle game with multiple potential wins (first found wins)', () => {
      const board = createEmptyBoard()
      // Player 1 has two four-in-a-rows
      board[5][0] = 1
      board[5][1] = 1
      board[5][2] = 1
      board[5][3] = 1

      board[4][0] = 1
      board[3][0] = 1
      board[2][0] = 1

      const result = checkWinner(board)

      expect(result.winner).toBe(1)
      expect(result.winningCells).toHaveLength(4)
    })
  })
})
