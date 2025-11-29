/**
 * Connect4 Game Type Definitions
 */

// Player identifiers
export type Player = 1 | 2
export type CellValue = Player | null

// Game board: 7 columns x 6 rows
export const COLUMNS = 7
export const ROWS = 6

// Board state
export type Board = CellValue[][]

// Game status
export type GameStatus = 'playing' | 'won' | 'draw'

// Game mode
export type GameMode = 'pvp' | 'pvc' // Player vs Player or Player vs Computer

// AI difficulty levels
export type Difficulty = 'easy' | 'medium' | 'hard'

// Move representation
export interface Move {
  column: number // 0-6
  player: Player
}

// Win detection result
export interface WinResult {
  winner: Player | null
  winningCells?: Array<{ row: number; col: number }>
}

// Complete game state
export interface GameState {
  board: Board
  currentPlayer: Player
  status: GameStatus
  winner: Player | null
  winningCells?: Array<{ row: number; col: number }>
  mode: GameMode
  difficulty: Difficulty
  moveHistory: Move[]
  lastMove?: { row: number; col: number }
}

// Leaderboard entry
export interface LeaderboardEntry {
  playerName: string
  wins: number
  losses: number
  draws: number
  winStreak: number
  longestWinStreak: number
  fastestWin: number | null // moves to win
  totalGames: number
}

// Achievement
export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  unlocked: boolean
  unlockedAt?: number
}

// Achievement progress
export interface AchievementProgress {
  firstVictory: boolean
  perfectColumn: boolean // Win with 4 in same column
  diagonalMaster: boolean // Win with diagonal
  speedster: boolean // Win in under 10 moves
  unstoppable: boolean // 5 win streak
  legendary: boolean // 10 win streak
  comebackKing: boolean // Win after being one move from losing
  tactician: boolean // Beat hard AI
  perfectGame: boolean // Win without opponent getting more than 2 in a row
}

// Saved game state
export interface SavedGame extends GameState {
  savedAt: number
}
