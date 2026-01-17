/**
 * Connect4 AI Strategies
 * Implements different difficulty levels for the computer opponent
 */

import type { Board, Player, Difficulty } from '@/types/connect4.types'
import { ROWS, COLUMNS } from '@/types/connect4.types'
import { getValidMoves, simulateMove, checkWinner, isBoardFull } from './connect4Rules'
import {
  AI_MINIMAX_DEPTH,
  SCORE_WIN,
  SCORE_FOUR_IN_ROW,
  SCORE_THREE_IN_ROW,
  SCORE_TWO_IN_ROW,
  SCORE_OPPONENT_THREE,
  SCORE_OPPONENT_TWO,
  SCORE_CENTER_COLUMN_BONUS,
  CENTER_COLUMN,
  WIN_LENGTH,
} from './constants'

/**
 * Gets the AI's move based on difficulty level
 */
export function getAIMove(board: Board, player: Player, difficulty: Difficulty): number {
  const validMoves = getValidMoves(board)

  if (validMoves.length === 0) {
    throw new Error('No valid moves available')
  }

  switch (difficulty) {
    case 'easy':
      return getRandomMove(validMoves)
    case 'medium':
      return getGreedyMove(board, player, validMoves)
    case 'hard':
      return getMinimaxMove(board, player)
    default:
      return getRandomMove(validMoves)
  }
}

/**
 * Easy AI: Random valid move
 */
function getRandomMove(validMoves: number[]): number {
  return validMoves[Math.floor(Math.random() * validMoves.length)]
}

/**
 * Medium AI: Greedy strategy
 * Priority:
 * 1. Win if possible
 * 2. Block opponent's winning move
 * 3. Prefer center columns
 * 4. Create threats (3 in a row)
 */
function getGreedyMove(board: Board, player: Player, validMoves: number[]): number {
  const opponent: Player = player === 1 ? 2 : 1

  // 1. Check for winning move
  for (const col of validMoves) {
    const newBoard = simulateMove(board, col, player)
    const result = checkWinner(newBoard)
    if (result.winner === player) {
      return col
    }
  }

  // 2. Block opponent's winning move
  for (const col of validMoves) {
    const newBoard = simulateMove(board, col, opponent)
    const result = checkWinner(newBoard)
    if (result.winner === opponent) {
      return col
    }
  }

  // 3. Prefer center columns (they offer more winning possibilities)
  const centerMoves = validMoves.filter(col => col >= 2 && col <= 4)
  if (centerMoves.length > 0) {
    // Among center moves, prefer the actual center
    if (centerMoves.includes(3)) return 3
    return centerMoves[Math.floor(Math.random() * centerMoves.length)]
  }

  // 4. Fallback to random valid move
  return getRandomMove(validMoves)
}

/**
 * Hard AI: Minimax with alpha-beta pruning
 */
function getMinimaxMove(board: Board, player: Player): number {
  let bestMove = -1
  let bestScore = -Infinity

  const validMoves = getValidMoves(board)

  // Try moves in center-first order for better pruning
  const orderedMoves = orderMovesByPreference(validMoves)

  for (const col of orderedMoves) {
    const newBoard = simulateMove(board, col, player)
    const score = minimax(newBoard, AI_MINIMAX_DEPTH - 1, -Infinity, Infinity, false, player)

    if (score > bestScore) {
      bestScore = score
      bestMove = col
    }
  }

  return bestMove !== -1 ? bestMove : validMoves[0]
}

/**
 * Minimax algorithm with alpha-beta pruning
 */
function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  aiPlayer: Player
): number {
  const opponent: Player = aiPlayer === 1 ? 2 : 1
  const winner = checkWinner(board).winner

  // Terminal states
  if (winner === aiPlayer) return SCORE_WIN + depth // Prefer faster wins
  if (winner === opponent) return -SCORE_WIN - depth // Avoid faster losses
  if (isBoardFull(board)) return 0 // Draw

  // Depth limit reached
  if (depth === 0) {
    return evaluateBoard(board, aiPlayer)
  }

  const validMoves = getValidMoves(board)
  const orderedMoves = orderMovesByPreference(validMoves)

  if (isMaximizing) {
    let maxScore = -Infinity

    for (const col of orderedMoves) {
      const newBoard = simulateMove(board, col, aiPlayer)
      const score = minimax(newBoard, depth - 1, alpha, beta, false, aiPlayer)
      maxScore = Math.max(maxScore, score)
      alpha = Math.max(alpha, score)

      if (beta <= alpha) break // Beta cutoff
    }

    return maxScore
  } else {
    let minScore = Infinity

    for (const col of orderedMoves) {
      const newBoard = simulateMove(board, col, opponent)
      const score = minimax(newBoard, depth - 1, alpha, beta, true, aiPlayer)
      minScore = Math.min(minScore, score)
      beta = Math.min(beta, score)

      if (beta <= alpha) break // Alpha cutoff
    }

    return minScore
  }
}

/**
 * Evaluation function for board state
 * Returns positive score for AI advantage, negative for opponent advantage
 */
function evaluateBoard(board: Board, player: Player): number {
  const opponent: Player = player === 1 ? 2 : 1

  let score = 0

  // Evaluate all possible 4-cell windows
  // Horizontal
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col <= COLUMNS - WIN_LENGTH; col++) {
      const window = [
        board[row][col],
        board[row][col + 1],
        board[row][col + 2],
        board[row][col + 3],
      ]
      score += evaluateWindow(window, player, opponent)
    }
  }

  // Vertical
  for (let col = 0; col < COLUMNS; col++) {
    for (let row = 0; row <= ROWS - WIN_LENGTH; row++) {
      const window = [
        board[row][col],
        board[row + 1][col],
        board[row + 2][col],
        board[row + 3][col],
      ]
      score += evaluateWindow(window, player, opponent)
    }
  }

  // Diagonal (down-right)
  for (let row = 0; row <= ROWS - WIN_LENGTH; row++) {
    for (let col = 0; col <= COLUMNS - WIN_LENGTH; col++) {
      const window = [
        board[row][col],
        board[row + 1][col + 1],
        board[row + 2][col + 2],
        board[row + 3][col + 3],
      ]
      score += evaluateWindow(window, player, opponent)
    }
  }

  // Diagonal (down-left)
  for (let row = 0; row <= ROWS - WIN_LENGTH; row++) {
    for (let col = WIN_LENGTH - 1; col < COLUMNS; col++) {
      const window = [
        board[row][col],
        board[row + 1][col - 1],
        board[row + 2][col - 2],
        board[row + 3][col - 3],
      ]
      score += evaluateWindow(window, player, opponent)
    }
  }

  // Center column preference
  const centerCount = board.filter(row => row[CENTER_COLUMN] === player).length
  score += centerCount * SCORE_CENTER_COLUMN_BONUS

  return score
}

/**
 * Evaluates a 4-cell window
 */
function evaluateWindow(window: (Player | null)[], player: Player, opponent: Player): number {
  let score = 0

  const playerCount = window.filter(cell => cell === player).length
  const opponentCount = window.filter(cell => cell === opponent).length
  const emptyCount = window.filter(cell => cell === null).length

  // Scoring based on patterns
  if (playerCount === WIN_LENGTH) score += SCORE_FOUR_IN_ROW
  else if (playerCount === 3 && emptyCount === 1) score += SCORE_THREE_IN_ROW
  else if (playerCount === 2 && emptyCount === 2) score += SCORE_TWO_IN_ROW

  if (opponentCount === 3 && emptyCount === 1)
    score -= SCORE_OPPONENT_THREE // Block opponent threats
  else if (opponentCount === 2 && emptyCount === 2) score -= SCORE_OPPONENT_TWO

  return score
}

/**
 * Orders moves by strategic preference (center first)
 * Helps with alpha-beta pruning efficiency
 */
function orderMovesByPreference(moves: number[]): number[] {
  const centerDistance = (col: number) => Math.abs(col - CENTER_COLUMN)
  return [...moves].sort((a, b) => centerDistance(a) - centerDistance(b))
}
