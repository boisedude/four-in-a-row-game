/**
 * Connect4 Game Rules Engine
 * Handles game logic, move validation, win detection
 */

import type {
  Board,
  Player,
  Move,
  WinResult,
  GameState,
  GameMode,
  Difficulty,
} from '@/types/connect4.types'
import { COLUMNS, ROWS } from '@/types/connect4.types'

/**
 * Creates an empty Connect4 board
 */
export function createEmptyBoard(): Board {
  return Array(ROWS)
    .fill(null)
    .map(() => Array(COLUMNS).fill(null))
}

/**
 * Creates initial game state
 */
export function createInitialGameState(
  mode: GameMode = 'pvc',
  difficulty: Difficulty = 'medium'
): GameState {
  return {
    board: createEmptyBoard(),
    currentPlayer: 1,
    status: 'playing',
    winner: null,
    mode,
    difficulty,
    moveHistory: [],
  }
}

/**
 * Checks if a column is full
 */
export function isColumnFull(board: Board, column: number): boolean {
  return board[0][column] !== null
}

/**
 * Gets the lowest available row in a column
 */
export function getLowestAvailableRow(board: Board, column: number): number | null {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row][column] === null) {
      return row
    }
  }
  return null
}

/**
 * Validates if a move is legal
 */
export function isValidMove(board: Board, column: number): boolean {
  if (column < 0 || column >= COLUMNS) return false
  return !isColumnFull(board, column)
}

/**
 * Gets all valid moves for current board state
 */
export function getValidMoves(board: Board): number[] {
  const validMoves: number[] = []
  for (let col = 0; col < COLUMNS; col++) {
    if (isValidMove(board, col)) {
      validMoves.push(col)
    }
  }
  return validMoves
}

/**
 * Executes a move and returns new board state
 * Does not mutate the original board
 */
export function executeMove(board: Board, column: number, player: Player): Board {
  const newBoard = board.map(row => [...row])
  const row = getLowestAvailableRow(board, column)

  if (row === null) {
    throw new Error('Invalid move: column is full')
  }

  newBoard[row][column] = player
  return newBoard
}

/**
 * Checks for four in a row starting from a position in a given direction
 */
function checkDirection(
  board: Board,
  row: number,
  col: number,
  rowDir: number,
  colDir: number,
  player: Player
): Array<{ row: number; col: number }> | null {
  const cells: Array<{ row: number; col: number }> = []

  for (let i = 0; i < 4; i++) {
    const r = row + i * rowDir
    const c = col + i * colDir

    if (r < 0 || r >= ROWS || c < 0 || c >= COLUMNS) {
      return null
    }

    if (board[r][c] !== player) {
      return null
    }

    cells.push({ row: r, col: c })
  }

  return cells
}

/**
 * Checks if there's a winner and returns winning cells
 */
export function checkWinner(board: Board): WinResult {
  // Check all positions for all directions
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      const cell = board[row][col]
      if (cell === null) continue

      const player = cell as Player

      // Check horizontal (right)
      const horizontal = checkDirection(board, row, col, 0, 1, player)
      if (horizontal) {
        return { winner: player, winningCells: horizontal }
      }

      // Check vertical (down)
      const vertical = checkDirection(board, row, col, 1, 0, player)
      if (vertical) {
        return { winner: player, winningCells: vertical }
      }

      // Check diagonal down-right
      const diagDownRight = checkDirection(board, row, col, 1, 1, player)
      if (diagDownRight) {
        return { winner: player, winningCells: diagDownRight }
      }

      // Check diagonal down-left
      const diagDownLeft = checkDirection(board, row, col, 1, -1, player)
      if (diagDownLeft) {
        return { winner: player, winningCells: diagDownLeft }
      }
    }
  }

  return { winner: null }
}

/**
 * Checks if the board is full (draw condition)
 */
export function isBoardFull(board: Board): boolean {
  return board[0].every(cell => cell !== null)
}

/**
 * Evaluates the board state and returns updated game state
 */
export function evaluateGameState(
  board: Board
): Pick<GameState, 'status' | 'winner' | 'winningCells'> {
  const winResult = checkWinner(board)

  if (winResult.winner) {
    return {
      status: 'won',
      winner: winResult.winner,
      winningCells: winResult.winningCells,
    }
  }

  if (isBoardFull(board)) {
    return {
      status: 'draw',
      winner: null,
    }
  }

  return {
    status: 'playing',
    winner: null,
  }
}

/**
 * Makes a move and returns complete updated game state
 */
export function makeMove(state: GameState, column: number): GameState {
  if (state.status !== 'playing') {
    throw new Error('Game is already over')
  }

  if (!isValidMove(state.board, column)) {
    throw new Error('Invalid move')
  }

  const row = getLowestAvailableRow(state.board, column)
  if (row === null) {
    throw new Error('Column is full')
  }

  const newBoard = executeMove(state.board, column, state.currentPlayer)
  const move: Move = { column, player: state.currentPlayer }

  const evaluation = evaluateGameState(newBoard)

  return {
    ...state,
    board: newBoard,
    currentPlayer:
      evaluation.status === 'playing' ? (state.currentPlayer === 1 ? 2 : 1) : state.currentPlayer,
    status: evaluation.status,
    winner: evaluation.winner,
    winningCells: evaluation.winningCells,
    moveHistory: [...state.moveHistory, move],
    lastMove: { row, col: column },
  }
}

/**
 * Simulates a move without modifying state (for AI lookahead)
 */
export function simulateMove(board: Board, column: number, player: Player): Board {
  return executeMove(board, column, player)
}

/**
 * Counts consecutive pieces in a line for a player
 */
export function countConsecutive(
  board: Board,
  row: number,
  col: number,
  rowDir: number,
  colDir: number,
  player: Player
): number {
  let count = 0
  let r = row
  let c = col

  while (r >= 0 && r < ROWS && c >= 0 && c < COLUMNS && board[r][c] === player) {
    count++
    r += rowDir
    c += colDir
  }

  return count
}

/**
 * Checks if a player has N in a row anywhere on the board
 */
export function hasNInARow(board: Board, player: Player, n: number): boolean {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      if (board[row][col] !== player) continue

      // Check all 4 directions
      const directions = [
        [0, 1], // horizontal
        [1, 0], // vertical
        [1, 1], // diagonal down-right
        [1, -1], // diagonal down-left
      ]

      for (const [rowDir, colDir] of directions) {
        if (countConsecutive(board, row, col, rowDir, colDir, player) >= n) {
          return true
        }
      }
    }
  }

  return false
}

/**
 * Pretty prints the board for debugging (development only)
 */
export function printBoard(board: Board): void {
  // Only log in development mode - this will be tree-shaken out of production builds
  if (import.meta.env.DEV) {
    console.log('\n  0 1 2 3 4 5 6')
    board.forEach((row, i) => {
      const rowStr = row.map(cell => (cell === null ? '.' : cell)).join(' ')
      console.log(`${i} ${rowStr}`)
    })
    console.log()
  }
}
