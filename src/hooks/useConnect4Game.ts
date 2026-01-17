/**
 * Connect4 Game Hook
 * Main game state management
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import type { GameState, Difficulty, GameMode } from '@/types/connect4.types'
import { createInitialGameState, makeMove, isValidMove } from '@/lib/connect4Rules'
import { getAIMove } from '@/lib/aiStrategies'
import { AI_MOVE_DELAY_MS, DISC_DROP_ANIMATION_MS } from '@/lib/constants'

export function useConnect4Game(initialDifficulty: Difficulty = 'medium') {
  const [gameState, setGameState] = useState<GameState>(() =>
    createInitialGameState('pvc', initialDifficulty)
  )
  const [isAnimating, setIsAnimating] = useState(false)
  const aiMoveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const aiMoveScheduledRef = useRef(false)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (aiMoveTimeoutRef.current) {
        clearTimeout(aiMoveTimeoutRef.current)
      }
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [])

  // Handle AI move when it's AI's turn
  useEffect(() => {
    if (
      gameState.currentPlayer === 2 &&
      gameState.status === 'playing' &&
      gameState.mode === 'pvc' &&
      !isAnimating &&
      !aiMoveScheduledRef.current
    ) {
      aiMoveScheduledRef.current = true

      aiMoveTimeoutRef.current = setTimeout(() => {
        try {
          const aiColumn = getAIMove(gameState.board, 2, gameState.difficulty)

          // Execute AI move directly instead of calling handlePlayerMove
          // to avoid circular dependency
          if (isValidMove(gameState.board, aiColumn)) {
            setIsAnimating(true)

            animationTimeoutRef.current = setTimeout(() => {
              setGameState(prevState => {
                try {
                  return makeMove(prevState, aiColumn)
                } catch {
                  // Move failed - return unchanged state
                  return prevState
                }
              })
              setIsAnimating(false)
              animationTimeoutRef.current = null
              // Reset the ref after animation completes to prevent duplicate AI moves
              aiMoveScheduledRef.current = false
            }, DISC_DROP_ANIMATION_MS)
          } else {
            // Move was invalid - reset the ref so AI can retry
            aiMoveScheduledRef.current = false
          }
        } catch {
          // AI move calculation failed - reset ref so it will retry on next render
          aiMoveScheduledRef.current = false
        }
      }, AI_MOVE_DELAY_MS)
    }

    return () => {
      if (aiMoveTimeoutRef.current) {
        clearTimeout(aiMoveTimeoutRef.current)
        aiMoveTimeoutRef.current = null
      }
    }
  }, [
    gameState.currentPlayer,
    gameState.status,
    gameState.mode,
    gameState.board,
    gameState.difficulty,
    isAnimating,
  ])

  const handlePlayerMove = useCallback(
    (column: number) => {
      if (isAnimating || gameState.status !== 'playing') {
        return
      }

      if (!isValidMove(gameState.board, column)) {
        return
      }

      try {
        setIsAnimating(true)

        // Simulate animation delay
        animationTimeoutRef.current = setTimeout(() => {
          setGameState(prevState => {
            try {
              return makeMove(prevState, column)
            } catch {
              // Move failed - return unchanged state
              return prevState
            }
          })
          setIsAnimating(false)
          animationTimeoutRef.current = null
        }, DISC_DROP_ANIMATION_MS)
      } catch {
        // Error during move setup - reset animation state
        setIsAnimating(false)
      }
    },
    [gameState.board, gameState.status, isAnimating]
  )

  const startNewGame = useCallback(
    (mode: GameMode = 'pvc', difficulty?: Difficulty) => {
      // Clear any pending AI moves and animations
      if (aiMoveTimeoutRef.current) {
        clearTimeout(aiMoveTimeoutRef.current)
        aiMoveTimeoutRef.current = null
      }
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
        animationTimeoutRef.current = null
      }
      aiMoveScheduledRef.current = false
      setIsAnimating(false)

      const newDifficulty = difficulty ?? gameState.difficulty
      setGameState(createInitialGameState(mode, newDifficulty))
    },
    [gameState.difficulty]
  )

  const changeDifficulty = useCallback((difficulty: Difficulty) => {
    setGameState(prev => ({
      ...prev,
      difficulty,
    }))
  }, [])

  const resetGame = useCallback(() => {
    startNewGame(gameState.mode, gameState.difficulty)
  }, [startNewGame, gameState.mode, gameState.difficulty])

  return {
    gameState,
    isAnimating,
    handlePlayerMove,
    startNewGame,
    resetGame,
    changeDifficulty,
  }
}
