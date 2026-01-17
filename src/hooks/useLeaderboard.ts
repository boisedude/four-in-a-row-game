/**
 * Leaderboard Hook
 * Manages player statistics and leaderboard
 */

import { useState, useEffect, useCallback } from 'react'
import type { LeaderboardEntry } from '@/types/connect4.types'

const STORAGE_KEY = 'connect4-leaderboard'
const DEFAULT_PLAYER_NAME = 'Player'

/**
 * Type guard to validate LeaderboardEntry structure
 * Protects against corrupted or malicious localStorage data
 */
function isValidLeaderboard(data: unknown): data is LeaderboardEntry {
  if (!data || typeof data !== 'object') {
    return false
  }

  const entry = data as Partial<LeaderboardEntry>

  return (
    typeof entry.playerName === 'string' &&
    typeof entry.wins === 'number' &&
    entry.wins >= 0 &&
    typeof entry.losses === 'number' &&
    entry.losses >= 0 &&
    typeof entry.draws === 'number' &&
    entry.draws >= 0 &&
    typeof entry.winStreak === 'number' &&
    entry.winStreak >= 0 &&
    typeof entry.longestWinStreak === 'number' &&
    entry.longestWinStreak >= 0 &&
    (entry.fastestWin === null || (typeof entry.fastestWin === 'number' && entry.fastestWin > 0)) &&
    typeof entry.totalGames === 'number' &&
    entry.totalGames >= 0
  )
}

function getInitialLeaderboard(): LeaderboardEntry {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const data = JSON.parse(stored)

      // Validate data structure before using it
      if (isValidLeaderboard(data)) {
        return data
      } else {
        // Invalid leaderboard data - clear corrupted data and use defaults
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  } catch {
    // Failed to load leaderboard - clear corrupted data
    // Clear corrupted data
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Ignore errors when trying to clear
    }
  }

  return {
    playerName: DEFAULT_PLAYER_NAME,
    wins: 0,
    losses: 0,
    draws: 0,
    winStreak: 0,
    longestWinStreak: 0,
    fastestWin: null,
    totalGames: 0,
  }
}

export function useLeaderboard() {
  const [stats, setStats] = useState<LeaderboardEntry>(getInitialLeaderboard)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
    } catch {
      // Failed to save leaderboard - localStorage may be full or disabled
    }
  }, [stats])

  const recordWin = useCallback((moveCount: number) => {
    setStats(prev => {
      const newWinStreak = prev.winStreak + 1
      const newLongestStreak = Math.max(newWinStreak, prev.longestWinStreak)
      const newFastestWin =
        prev.fastestWin === null ? moveCount : Math.min(prev.fastestWin, moveCount)

      return {
        ...prev,
        wins: prev.wins + 1,
        winStreak: newWinStreak,
        longestWinStreak: newLongestStreak,
        fastestWin: newFastestWin,
        totalGames: prev.totalGames + 1,
      }
    })
  }, [])

  const recordLoss = useCallback(() => {
    setStats(prev => ({
      ...prev,
      losses: prev.losses + 1,
      winStreak: 0,
      totalGames: prev.totalGames + 1,
    }))
  }, [])

  const recordDraw = useCallback(() => {
    setStats(prev => ({
      ...prev,
      draws: prev.draws + 1,
      winStreak: 0,
      totalGames: prev.totalGames + 1,
    }))
  }, [])

  const updatePlayerName = useCallback((name: string) => {
    setStats(prev => ({
      ...prev,
      playerName: name || DEFAULT_PLAYER_NAME,
    }))
  }, [])

  const resetStats = useCallback(() => {
    setStats({
      playerName: stats.playerName,
      wins: 0,
      losses: 0,
      draws: 0,
      winStreak: 0,
      longestWinStreak: 0,
      fastestWin: null,
      totalGames: 0,
    })
  }, [stats.playerName])

  return {
    stats,
    recordWin,
    recordLoss,
    recordDraw,
    updatePlayerName,
    resetStats,
  }
}
