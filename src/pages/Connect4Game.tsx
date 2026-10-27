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
import { OpponentChip } from '@/components/OpponentChip'
import { ConfirmOpponentDialog } from '@/components/ConfirmOpponentDialog'
import { getCharacterById } from '@shared/characters'
import { Button } from '@/components/ui/button'
import { useConnect4Game } from '@/hooks/useConnect4Game'
import { useLeaderboard } from '@/hooks/useLeaderboard'
import { useGameAudio } from '@/hooks/useGameAudio'
import { useCharacterSelection } from '@/hooks/useCharacterSelection'
import { useBentleyStats } from '@/hooks/useBentleyStats'
import { TUTORIAL_SHOW_DELAY_MS, VICTORY_DIALOG_DELAY_MS, ARCADE_URL, STORAGE_KEY_TUTORIAL_COMPLETED } from '@/lib/constants'
import type { Difficulty } from '@/types/connect4.types'
import type { CharacterId } from '@shared/characters'
import { ArrowLeftIcon, VolumeIcon, VolumeOffIcon, HelpIcon } from '@shared/icons'

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
  const { character, selectCharacter } = useCharacterSelection(initialCharacter)
  const bentleyStats = useBentleyStats()

  const [showVictoryDialog, setShowVictoryDialog] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showHowToPlay, setShowHowToPlay] = useState(false)
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [pendingCharacter, setPendingCharacter] = useState<CharacterId | null>(null)
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null)
  const [hasCompletedTutorial, setHasCompletedTutorial] = useState(() => {
    // Arriving from the arcade with a character means the player is ready to play
    if (new URLSearchParams(window.location.search).has('character')) return true
    try {
      return localStorage.getItem(STORAGE_KEY_TUTORIAL_COMPLETED) === 'true'
    } catch {
      return false
    }
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
    try {
      localStorage.setItem(STORAGE_KEY_TUTORIAL_COMPLETED, 'true')
    } catch {
      // localStorage may be unavailable or full - tutorial will show again on next visit
    }
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
        pendingCharacter !== null ||
        (e.target as HTMLElement).tagName === 'INPUT'
      ) {
        return
      }

      // Global shortcuts (work even when not player's turn)
      switch (e.key.toLowerCase()) {
        case 'n':
          e.preventDefault()
          startNewGame('pvc', gameState.difficulty)
          return
        case 'h':
          e.preventDefault()
          setShowHowToPlay(true)
          return
        case 'l':
          e.preventDefault()
          setShowLeaderboard(true)
          return
        case 'm':
          e.preventDefault()
          toggleMute()
          return
        case '?':
          e.preventDefault()
          setShowKeyboardShortcuts(true)
          return
      }

      // Only handle gameplay keys during active gameplay and player's turn
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

      // Arrow key navigation for column selection
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          setSelectedColumn(prev => {
            if (prev === null) return 3 // Start in middle
            return prev > 0 ? prev - 1 : 6 // Wrap around
          })
          break
        case 'ArrowRight':
          e.preventDefault()
          setSelectedColumn(prev => {
            if (prev === null) return 3 // Start in middle
            return prev < 6 ? prev + 1 : 0 // Wrap around
          })
          break
        case 'Enter':
        case ' ':
          e.preventDefault()
          if (selectedColumn !== null) {
            handlePlayerMove(selectedColumn)
          }
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
    pendingCharacter,
    selectedColumn,
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
          }
        } else {
          playSound('defeat')
          recordLoss()
          // Track Bentley stats if playing against Bentley
          if (character.id === 'bentley') {
            bentleyStats.recordLoss() // Local stats
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
  ])

  const handleNewGame = () => {
    setShowVictoryDialog(false)
    startNewGame('pvc', gameState.difficulty)
  }

  const applyCharacterChange = (characterId: CharacterId) => {
    selectCharacter(characterId)
    // Map character to difficulty
    const newDifficulty = characterId === 'bella' ? 'easy' : characterId === 'coop' ? 'medium' : 'hard'
    changeDifficulty(newDifficulty)
    // Changing opponent always starts a fresh game, so a game in progress
    // can never be finished (and recorded) against a different opponent.
    setShowVictoryDialog(false)
    startNewGame('pvc', newDifficulty)

    // Update URL parameter
    const url = new URL(window.location.href)
    url.searchParams.set('character', characterId)
    window.history.pushState({}, '', url.toString())
  }

  const handleCharacterChange = (characterId: CharacterId) => {
    if (characterId === character.id) return
    const inProgress = gameState.status === 'playing' && gameState.moveHistory.length > 0
    if (inProgress) {
      setPendingCharacter(characterId)
    } else {
      applyCharacterChange(characterId)
    }
  }

  const opponent = character.name
  const turnText =
    gameState.status === 'won'
      ? gameState.winner === 1
        ? 'You won'
        : `${opponent} won`
      : gameState.status === 'draw'
        ? 'Draw'
        : gameState.currentPlayer === 1
          ? 'Your turn'
          : `${opponent} is thinking`
  const turnActive =
    gameState.status !== 'playing' ? 'over' : gameState.currentPlayer === 1 ? 'you' : 'opponent'

  return (
    <div className="arcade-page">
      <a
        href="#game-board"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:text-foreground"
      >
        Skip to game board
      </a>

      <header className="arcade-topbar">
        <div className="flex flex-1 items-center">
          <a
            href={ARCADE_URL + '/'}
            className="inline-flex min-h-11 items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeftIcon size={18} />
            Arcade
          </a>
        </div>
        <h1 className="arcade-display sr-only text-xl sm:not-sr-only">Connect 4</h1>
        <div className="flex flex-1 items-center justify-end gap-1">
          <OpponentChip character={character} onCharacterChange={handleCharacterChange} />
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 shrink-0"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
          >
            {isMuted ? <VolumeOffIcon /> : <VolumeIcon />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 shrink-0"
            onClick={() => setShowHowToPlay(true)}
            aria-label="How to play"
          >
            <HelpIcon />
          </Button>
        </div>
      </header>

      <main className="arcade-stage">
        <div className="arcade-score" aria-live="polite">
          <div>
            <strong>{stats.wins}</strong>
            You
          </div>
          <div className="arcade-turn" data-active={turnActive}>
            {turnText}
          </div>
          <div>
            <strong>{stats.losses}</strong>
            {opponent}
          </div>
        </div>

        <div id="game-board" className="flex w-full justify-center">
          <Board
            board={gameState.board}
            winningCells={gameState.winningCells}
            lastMove={gameState.lastMove}
            onColumnClick={handlePlayerMove}
            disabled={isAnimating || gameState.status !== 'playing' || gameState.currentPlayer === 2}
            currentPlayer={gameState.currentPlayer}
            selectedColumn={gameState.status === 'playing' && gameState.currentPlayer === 1 ? selectedColumn : null}
          />
        </div>

        <GameControls
          onNewGame={handleNewGame}
          onShowLeaderboard={() => setShowLeaderboard(true)}
          onShowHelp={() => setShowHowToPlay(true)}
          onShowKeyboardShortcuts={() => setShowKeyboardShortcuts(true)}
          disabled={isAnimating}
        />
      </main>

      <ConfirmOpponentDialog
        open={pendingCharacter !== null}
        opponentName={pendingCharacter ? getCharacterById(pendingCharacter).name : ''}
        onCancel={() => setPendingCharacter(null)}
        onConfirm={() => {
          if (pendingCharacter) applyCharacterChange(pendingCharacter)
          setPendingCharacter(null)
        }}
      />

      {/* Victory Dialog */}
      <VictoryDialog
        open={showVictoryDialog}
        winner={gameState.winner}
        moveCount={gameState.moveHistory.length}
        onNewGame={handleNewGame}
        onClose={() => setShowVictoryDialog(false)}
        isDraw={gameState.status === 'draw'}
        character={character}
        stats={stats}
      />

      {/* Leaderboard Dialog */}
      <LeaderboardDialog
        open={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        stats={stats}
        characterName={character.name}
      />

      {/* How to Play Dialog */}
      <HowToPlayDialog open={showHowToPlay} opponentName={opponent} onClose={() => setShowHowToPlay(false)} />

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcutsDialog
        open={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
      />

      {/* Tutorial */}
      <Tutorial
        open={showTutorial}
        opponentName={opponent}
        onClose={() => setShowTutorial(false)}
        onComplete={handleTutorialComplete}
      />
    </div>
  )
}
