/**
 * Connect4 Game Hook
 * Main game state management
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import type { GameState, Difficulty, GameMode } from '@/types/connect4.types'
import { createInitialGameState, makeMove, isValidMove } from '@/lib/connect4Rules'
import { requestAIMove } from '@/lib/aiClient'
import { AI_MOVE_DELAY_MS, DISC_DROP_ANIMATION_MS } from '@/lib/constants'

export function useConnect4Game(initialDifficulty: Difficulty = 'medium') {
  const [gameState, setGameState] = useState<GameState>(() =>
    createInitialGameState('pvc', initialDifficulty)
  )
  const [isAnimating, setIsAnimating] = useState(false)
  const aiMoveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const aiMoveScheduledRef = useRef(false)
  // Bumped whenever a pending search must be ignored (new game, undo, effect re-run).
  const aiGenerationRef = useRef(0)

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

  // Handle AI move when it's AI's turn. The search runs in a worker; the reply
  // still waits at least AI_MOVE_DELAY_MS so it never lands instantly.
  useEffect(() => {
    if (
      gameState.currentPlayer !== 2 ||
      gameState.status !== 'playing' ||
      gameState.mode !== 'pvc' ||
      isAnimating ||
      aiMoveScheduledRef.current
    ) {
      return
    }
    aiMoveScheduledRef.current = true
    const generation = ++aiGenerationRef.current
    const startedAt = Date.now()
    const board = gameState.board
    let cancelled = false
    const stale = () => cancelled || generation !== aiGenerationRef.current

    requestAIMove(board, 2, gameState.difficulty)
      .then(aiColumn => {
        if (stale()) return
        if (!isValidMove(board, aiColumn)) {
          aiMoveScheduledRef.current = false
          return
        }
        const wait = Math.max(0, AI_MOVE_DELAY_MS - (Date.now() - startedAt))
        aiMoveTimeoutRef.current = setTimeout(() => {
          aiMoveTimeoutRef.current = null
          if (stale()) return
          setIsAnimating(true)
          animationTimeoutRef.current = setTimeout(() => {
            setGameState(prevState => {
              try {
                return makeMove(prevState, aiColumn)
              } catch {
                return prevState
              }
            })
            setIsAnimating(false)
            animationTimeoutRef.current = null
            // Reset after the animation so the same turn cannot be played twice
            aiMoveScheduledRef.current = false
          }, DISC_DROP_ANIMATION_MS)
        }, wait)
      })
      .catch(() => {
        // Search failed: free the flag so the next render retries
        if (!stale()) aiMoveScheduledRef.current = false
      })

    return () => {
      // Once the disc is falling the move stands; before that, a re-run (StrictMode,
      // new game) discards this search and schedules a fresh one.
      if (animationTimeoutRef.current) return
      cancelled = true
      if (aiMoveTimeoutRef.current) {
        clearTimeout(aiMoveTimeoutRef.current)
        aiMoveTimeoutRef.current = null
      }
      aiMoveScheduledRef.current = false
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
      aiGenerationRef.current++
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

  // Undo goes back to the player's previous turn: against an opponent that is
  // the player's move and the reply; with two players, the last move.
  const undoCount = gameState.mode === 'pvc' ? 2 : 1
  const canUndo =
    gameState.status === 'playing' &&
    !isAnimating &&
    (gameState.mode !== 'pvc' || gameState.currentPlayer === 1) &&
    gameState.moveHistory.length >= undoCount

  const undo = useCallback(() => {
    if (!canUndo) return
    aiGenerationRef.current++
    aiMoveScheduledRef.current = false
    setGameState(prev => {
      const kept = prev.moveHistory.slice(0, prev.moveHistory.length - undoCount)
      let state = createInitialGameState(prev.mode, prev.difficulty)
      for (const move of kept) state = makeMove(state, move.column)
      return state
    })
  }, [canUndo, undoCount])

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
    canUndo,
    undo,
  }
}
