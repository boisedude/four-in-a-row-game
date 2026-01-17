/**
 * Game Constants
 * Centralized configuration values for the Connect4 game
 */

// ===========================================
// AI Configuration
// ===========================================

/** Delay in milliseconds before AI makes a move */
export const AI_MOVE_DELAY_MS = 500

/** Search depth for minimax algorithm in hard mode */
export const AI_MINIMAX_DEPTH = 6

// ===========================================
// Animation Timings (in milliseconds)
// ===========================================

/** Duration of disc drop animation */
export const DISC_DROP_ANIMATION_MS = 100

/** Delay before showing victory dialog after game ends */
export const VICTORY_DIALOG_DELAY_MS = 800

/** Delay before showing tutorial on first visit */
export const TUTORIAL_SHOW_DELAY_MS = 500

/** Duration for confetti particles */
export const CONFETTI_MIN_DURATION_S = 1.5

/** Additional random duration for confetti particles */
export const CONFETTI_DURATION_VARIANCE_S = 1

// ===========================================
// Board Scoring Values (for AI evaluation)
// ===========================================

/** Score for winning position */
export const SCORE_WIN = 10000

/** Score multiplier for four in a row */
export const SCORE_FOUR_IN_ROW = 100

/** Score for three in a row with empty space */
export const SCORE_THREE_IN_ROW = 5

/** Score for two in a row with two empty spaces */
export const SCORE_TWO_IN_ROW = 2

/** Penalty for opponent having three in a row */
export const SCORE_OPPONENT_THREE = 4

/** Penalty for opponent having two in a row */
export const SCORE_OPPONENT_TWO = 1

/** Bonus per disc in center column */
export const SCORE_CENTER_COLUMN_BONUS = 3

// ===========================================
// Board Dimensions
// ===========================================

/** Center column index (0-indexed) */
export const CENTER_COLUMN = 3

/** Number of discs needed to win */
export const WIN_LENGTH = 4

// ===========================================
// Audio Frequencies (in Hz)
// ===========================================

export const AUDIO = {
  discDrop: {
    startFrequency: 400,
    endFrequency: 100,
  },
  victory: {
    notes: [262, 330, 392, 523], // C, E, G, C (major chord)
  },
  defeat: {
    startFrequency: 300,
    endFrequency: 100,
  },
  draw: {
    frequencies: [220, 330],
  },
  click: {
    startFrequency: 800,
    endFrequency: 400,
  },
  hover: {
    frequency: 600,
  },
} as const

// ===========================================
// UI Configuration
// ===========================================

/** Default confetti particle count for victory celebration */
export const CONFETTI_PARTICLE_COUNT = 50

/** Animation delay multiplier for sequential win animations */
export const WIN_ANIMATION_DELAY_MS = 100
