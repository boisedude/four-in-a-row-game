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

function getInitialStats(): BentleyStats {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      // If parsing fails, return default stats
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
