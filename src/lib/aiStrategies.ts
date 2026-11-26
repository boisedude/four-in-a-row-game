/**
 * Connect 4 opponents
 * - Bella (easy): a random legal column.
 * - Coop (medium): the engine at a shallow fixed depth, choosing at random among
 *   moves close to his best, so he is tactically sound but strategically loose.
 * - Bentley (hard): the full engine in its time budget (see engine.ts).
 */

import type { Board, Player, Difficulty } from '@/types/connect4.types'
import { getValidMoves } from './connect4Rules'
import { searchBestMove } from './engine'

/** Bentley's thinking budget per move in the worker. */
export const BENTLEY_TIME_MS = 700
/** Budget for a hint on the player's turn. */
export const HINT_TIME_MS = 400
/** Coop's fixed search depth and his slack (evaluation points) among near-equal moves. */
export const COOP_DEPTH = 6
export const COOP_SLACK = 6

/**
 * Gets the opponent's column for `player` on `board`.
 * `timeMs` overrides Bentley's budget (the synchronous fallback passes a small one).
 */
export function getAIMove(board: Board, player: Player, difficulty: Difficulty, timeMs?: number): number {
  const validMoves = getValidMoves(board)

  if (validMoves.length === 0) {
    throw new Error('No valid moves available')
  }

  switch (difficulty) {
    case 'medium':
      return searchBestMove(board, player, {
        maxDepth: COOP_DEPTH,
        solve: false,
        variety: COOP_SLACK,
        timeMs: Math.min(timeMs ?? 300, 300),
      }).column
    case 'hard':
      return searchBestMove(board, player, { timeMs: timeMs ?? BENTLEY_TIME_MS }).column
    case 'easy':
    default:
      return validMoves[Math.floor(Math.random() * validMoves.length)]
  }
}
