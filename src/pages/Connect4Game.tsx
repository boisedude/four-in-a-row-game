/**
 * Connect4 Game Page
 * Main game interface
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { Board } from '@/components/Board'
import { GameControls } from '@/components/GameControls'
import { VictoryDialog } from '@/components/VictoryDialog'
import { LeaderboardDialog } from '@/components/LeaderboardDialog'
import { HowToPlayDialog } from '@/components/HowToPlayDialog'
import { KeyboardShortcutsDialog } from '@/components/KeyboardShortcutsDialog'
import { Tutorial } from '@/components/Tutorial'
import { AudioControls } from '@/components/AudioControls'
import { Connect4Logo } from '@/components/graphics'
import { useConnect4Game } from '@/hooks/useConnect4Game'
import { useLeaderboard } from '@/hooks/useLeaderboard'
import { useGameAudio } from '@/hooks/useGameAudio'
import { useCharacterSelection } from '@/hooks/useCharacterSelection'
import { useBentleyStats } from '@/hooks/useBentleyStats'
import { useMainSiteBentleyStats } from '@/hooks/useMainSiteBentleyStats'
import { TUTORIAL_SHOW_DELAY_MS, VICTORY_DIALOG_DELAY_MS } from '@/lib/constants'
import type { Difficulty } from '@/types/connect4.types'
import type { CharacterId } from '@shared/characters'
import { cn } from '@/lib/utils'

export function Connect4Game() {
  // Read character from URL parameter on initial load
  const getInitialCharacter = (): CharacterId => {
    const params = new URLSearchParams(window.location.search)
    const characterParam = params.get('character')
    if (characterParam === 'bella' || characterParam === 'coop' || characterParam === 'bentley') {
      return characterParam
    }
    return 'coop' // default
  }

  const initialCharacter = getInitialCharacter()
  const initialDifficulty: Difficulty = initialCharacter === 'bella' ? 'easy' : initialCharacter === 'coop' ? 'medium' : 'hard'

  const { gameState, isAnimating, handlePlayerMove, startNewGame, changeDifficulty } =
    useConnect4Game(initialDifficulty)
  const { stats, recordWin, recordLoss, recordDraw } = useLeaderboard()
  const { isMuted, toggleMute, playSound } = useGameAudio()
  const { character, selectedCharacterId, selectCharacter } = useCharacterSelection(initialCharacter)
  const bentleyStats = useBentleyStats()
  const mainSiteBentleyStats = useMainSiteBentleyStats()

  const [showVictoryDialog, setShowVictoryDialog] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showHowToPlay, setShowHowToPlay] = useState(false)
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [hasCompletedTutorial, setHasCompletedTutorial] = useState(() => {
    return localStorage.getItem('connect4-tutorial-completed') === 'true'
  })

  // Show tutorial on first visit
  useEffect(() => {
    if (!hasCompletedTutorial) {
      const timer = setTimeout(() => {
        setShowTutorial(true)
      }, TUTORIAL_SHOW_DELAY_MS)
      return () => clearTimeout(timer)
    }
  }, [hasCompletedTutorial])

  // Handle tutorial completion
  const handleTutorialComplete = useCallback(() => {
    setHasCompletedTutorial(true)
    localStorage.setItem('connect4-tutorial-completed', 'true')
  }, [])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle if a dialog is open or typing in an input
      if (
        showVictoryDialog ||
        showLeaderboard ||
        showHowToPlay ||
        showKeyboardShortcuts ||
        showTutorial ||
        (e.target as HTMLElement).tagName === 'INPUT'
      ) {
        return
      }

      // Only handle during active gameplay
      if (gameState.status !== 'playing' || isAnimating || gameState.currentPlayer === 2) {
        return
      }

      // Number keys 1-7 for column selection
      const numKey = parseInt(e.key)
      if (numKey >= 1 && numKey <= 7) {
        e.preventDefault()
        handlePlayerMove(numKey - 1)
        return
      }

      // Other shortcuts
      switch (e.key.toLowerCase()) {
        case 'n':
          e.preventDefault()
          startNewGame('pvc', gameState.difficulty)
          break
        case 'h':
          e.preventDefault()
          setShowHowToPlay(true)
          break
        case 'l':
          e.preventDefault()
          setShowLeaderboard(true)
          break
        case 'm':
          e.preventDefault()
          toggleMute()
          break
        case '?':
          e.preventDefault()
          setShowKeyboardShortcuts(true)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    gameState,
    isAnimating,
    handlePlayerMove,
    startNewGame,
    toggleMute,
    showVictoryDialog,
    showLeaderboard,
    showHowToPlay,
    showKeyboardShortcuts,
    showTutorial,
  ])

  // Play sound on move
  useEffect(() => {
    if (gameState.moveHistory.length > 0 && gameState.status === 'playing') {
      playSound('discDrop')
    }
  }, [gameState.moveHistory.length, gameState.status, playSound])

  // Show victory dialog when game ends
  // Use ref to track if we've already handled the game end to prevent infinite loops
  const gameEndHandledRef = useRef(false)

  useEffect(() => {
    if (gameState.status === 'won' || gameState.status === 'draw') {
      // Only handle once per game
      if (gameEndHandledRef.current) {
        return
      }
      gameEndHandledRef.current = true

      // Play appropriate sound
      if (gameState.status === 'won') {
        if (gameState.winner === 1) {
          playSound('victory')
          recordWin(gameState.moveHistory.length)
          // Track Bentley stats if playing against Bentley
          if (character.id === 'bentley') {
            bentleyStats.recordWin(gameState.moveHistory.length) // Local stats
            mainSiteBentleyStats.recordBentleyLoss() // Main site API (player won, Bentley lost)
          }
        } else {
          playSound('defeat')
          recordLoss()
          // Track Bentley stats if playing against Bentley
          if (character.id === 'bentley') {
            bentleyStats.recordLoss() // Local stats
            mainSiteBentleyStats.recordBentleyWin() // Main site API (Bentley won)
          }
        }
      } else if (gameState.status === 'draw') {
        playSound('draw')
        recordDraw()
        // Track Bentley stats if playing against Bentley
        if (character.id === 'bentley') {
          bentleyStats.recordDraw() // Local stats only (no main site draw tracking yet)
        }
      }

      // Show dialog after a brief delay
      setTimeout(() => {
        setShowVictoryDialog(true)
      }, VICTORY_DIALOG_DELAY_MS)
    } else {
      // Reset the flag when game is playing (new game started)
      gameEndHandledRef.current = false
    }
  }, [
    gameState.status,
    gameState.winner,
    gameState.moveHistory.length,
    playSound,
    recordWin,
    recordLoss,
    recordDraw,
    character.id,
    bentleyStats,
    mainSiteBentleyStats,
  ])

  const handleNewGame = () => {
    setShowVictoryDialog(false)
    startNewGame('pvc', gameState.difficulty)
  }

  const handleCharacterChange = (characterId: CharacterId) => {
    selectCharacter(characterId)
    // Map character to difficulty
    const newDifficulty = characterId === 'bella' ? 'easy' : characterId === 'coop' ? 'medium' : 'hard'
    changeDifficulty(newDifficulty)
    startNewGame('pvc', newDifficulty)

    // Update URL parameter
    const url = new URL(window.location.href)
    url.searchParams.set('character', characterId)
    window.history.pushState({}, '', url.toString())
  }

  const currentPlayerName = gameState.currentPlayer === 1 ? 'Your Turn' : `${character.name}'s Turn`
  const currentPlayerColor = gameState.currentPlayer === 1 ? 'text-red-600' : 'text-yellow-600'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Return to Arcade Button - Fixed position */}
      <nav className="fixed left-4 top-4 z-10" aria-label="Main navigation">
        <a
          href="https://www.mcooper.com/arcade"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
          aria-label="Return to Arcade homepage"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Return to Arcade
        </a>
      </nav>

      {/* Audio Controls - Fixed position */}
      <div className="fixed right-4 top-4 z-10">
        <AudioControls isMuted={isMuted} onToggleMute={toggleMute} />
      </div>

      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center gap-8 p-4">
        {/* Header */}
        <div className="text-center animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="mb-4 flex items-center justify-center gap-4">
            <Connect4Logo
              size={80}
              className="drop-shadow-lg animate-in zoom-in-50 duration-700 delay-100"
            />
            <h1 className="text-5xl font-bold tracking-tight animate-in slide-in-from-right-4 duration-700 delay-200">
              Connect <span className="text-red-600">4</span>
            </h1>
          </div>
          <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 animate-in fade-in duration-700 delay-300">
            Challenge {character.name} • Can you beat them?
          </p>
          <p className="mt-1 text-sm text-muted-foreground animate-in fade-in duration-700 delay-400">
            Connect four in a row to win
          </p>
        </div>

        {/* Game Status */}
        {gameState.status === 'playing' && (
          <div
            className="text-center animate-in fade-in duration-300"
            role="status"
            aria-live="polite"
            aria-label={`Current turn: ${currentPlayerName}`}
          >
            <div className="flex items-center justify-center gap-3">
              {/* Player indicator disc */}
              <div
                className={cn(
                  'h-6 w-6 rounded-full shadow-md animate-turn-pulse',
                  gameState.currentPlayer === 1
                    ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/50'
                    : 'bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-yellow-500/50'
                )}
              >
                <div className="absolute h-full w-full rounded-full bg-white/30 blur-sm animate-turn-pulse" />
              </div>
              <p
                className={cn(
                  'text-xl font-semibold transition-colors duration-300',
                  currentPlayerColor
                )}
              >
                {currentPlayerName}
              </p>
            </div>
            {isAnimating && (
              <p className="mt-2 text-sm text-muted-foreground animate-in fade-in duration-200">
                Dropping disc...
              </p>
            )}
          </div>
        )}

        {/* Game Board */}
        <Board
          board={gameState.board}
          winningCells={gameState.winningCells}
          lastMove={gameState.lastMove}
          onColumnClick={handlePlayerMove}
          disabled={isAnimating || gameState.status !== 'playing' || gameState.currentPlayer === 2}
          currentPlayer={gameState.currentPlayer}
        />

        {/* Game Controls */}
        <GameControls
          onNewGame={handleNewGame}
          onShowLeaderboard={() => setShowLeaderboard(true)}
          onShowHelp={() => setShowHowToPlay(true)}
          onShowKeyboardShortcuts={() => setShowKeyboardShortcuts(true)}
          disabled={isAnimating}
          gameMode={gameState.mode}
          selectedCharacterId={selectedCharacterId}
          onCharacterChange={handleCharacterChange}
        />

        {/* Move Counter */}
        <div
          className="text-center text-sm text-muted-foreground"
          aria-label={`Total moves played: ${gameState.moveHistory.length}`}
        >
          Moves: {gameState.moveHistory.length}
        </div>

        {/* Victory Dialog */}
        <VictoryDialog
          open={showVictoryDialog}
          winner={gameState.winner}
          moveCount={gameState.moveHistory.length}
          onNewGame={handleNewGame}
          onClose={() => setShowVictoryDialog(false)}
          isDraw={gameState.status === 'draw'}
          character={character}
        />

        {/* Leaderboard Dialog */}
        <LeaderboardDialog
          open={showLeaderboard}
          onClose={() => setShowLeaderboard(false)}
          stats={stats}
        />

        {/* How to Play Dialog */}
        <HowToPlayDialog open={showHowToPlay} onClose={() => setShowHowToPlay(false)} />

        {/* Keyboard Shortcuts Dialog */}
        <KeyboardShortcutsDialog
          open={showKeyboardShortcuts}
          onClose={() => setShowKeyboardShortcuts(false)}
        />

        {/* Tutorial */}
        <Tutorial
          open={showTutorial}
          onClose={() => setShowTutorial(false)}
          onComplete={handleTutorialComplete}
        />
      </div>
    </div>
  )
}
