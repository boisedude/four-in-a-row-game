/**
 * useBentleyStats Hook
 * Tracks special stats when playing against Bentley
 */

import { useState, useCallback, useEffect } from 'react'

interface BentleyStats {
  gamesPlayed: number
  wins: number
  losses: number
  draws: number
  winStreak: number
  bestWinStreak: number
  totalMoves: number
  fastestWin: number | null // Lowest move count for a win
}

const STORAGE_KEY = 'connect4-bentley-stats'

/**
 * Type guard to validate BentleyStats structure
 * Protects against corrupted or malicious localStorage data
 */
function isValidBentleyStats(data: unknown): data is BentleyStats {
  if (!data || typeof data !== 'object') {
    return false
  }

  const stats = data as Partial<BentleyStats>

  return (
    typeof stats.gamesPlayed === 'number' &&
    stats.gamesPlayed >= 0 &&
    typeof stats.wins === 'number' &&
    stats.wins >= 0 &&
    typeof stats.losses === 'number' &&
    stats.losses >= 0 &&
    typeof stats.draws === 'number' &&
    stats.draws >= 0 &&
    typeof stats.winStreak === 'number' &&
    stats.winStreak >= 0 &&
    typeof stats.bestWinStreak === 'number' &&
    stats.bestWinStreak >= 0 &&
    typeof stats.totalMoves === 'number' &&
    stats.totalMoves >= 0 &&
    (stats.fastestWin === null || (typeof stats.fastestWin === 'number' && stats.fastestWin > 0))
  )
}

function getInitialStats(): BentleyStats {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const data = JSON.parse(stored)

      // Validate data structure before using it
      if (isValidBentleyStats(data)) {
        return data
      } else {
        // Invalid stats data - clear corrupted data and use defaults
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  } catch {
    // Failed to load stats - clear corrupted data
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Ignore errors when trying to clear
    }
  }

  return {
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    winStreak: 0,
    bestWinStreak: 0,
    totalMoves: 0,
    fastestWin: null,
  }
}

export function useBentleyStats() {
  const [stats, setStats] = useState<BentleyStats>(getInitialStats)

  // Save stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
  }, [stats])

  const recordWin = useCallback((moveCount: number) => {
    setStats(prev => {
      const newWinStreak = prev.winStreak + 1
      const newBestWinStreak = Math.max(newWinStreak, prev.bestWinStreak)
      const newFastestWin =
        prev.fastestWin === null ? moveCount : Math.min(prev.fastestWin, moveCount)

      return {
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
        wins: prev.wins + 1,
        winStreak: newWinStreak,
        bestWinStreak: newBestWinStreak,
        totalMoves: prev.totalMoves + moveCount,
        fastestWin: newFastestWin,
      }
    })
  }, [])

  const recordLoss = useCallback(() => {
    setStats(prev => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      losses: prev.losses + 1,
      winStreak: 0, // Reset win streak on loss
    }))
  }, [])

  const recordDraw = useCallback(() => {
    setStats(prev => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      draws: prev.draws + 1,
      winStreak: 0, // Reset win streak on draw
    }))
  }, [])

  const resetStats = useCallback(() => {
    const defaultStats = {
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      winStreak: 0,
      bestWinStreak: 0,
      totalMoves: 0,
      fastestWin: null,
    }
    setStats(defaultStats)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStats))
  }, [])

  return {
    stats,
    recordWin,
    recordLoss,
    recordDraw,
    resetStats,
  }
}
