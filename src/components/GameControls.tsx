/**
 * Game Controls Component
 * Controls for difficulty selection, new game, help, etc.
 */

import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import type { Difficulty, GameMode } from '@/types/connect4.types'
import type { CharacterId } from '@shared/characters'

interface GameControlsProps {
  difficulty: Difficulty
  onDifficultyChange: (difficulty: Difficulty) => void
  onNewGame: () => void
  onShowLeaderboard: () => void
  onShowHelp?: () => void
  onShowKeyboardShortcuts?: () => void
  disabled?: boolean
  gameMode: GameMode
  selectedCharacterId?: CharacterId
  onCharacterChange?: (characterId: CharacterId) => void
}

export function GameControls({
  difficulty: _difficulty,
  onDifficultyChange: _onDifficultyChange,
  onNewGame,
  onShowLeaderboard,
  onShowHelp,
  onShowKeyboardShortcuts,
  disabled = false,
  gameMode,
  selectedCharacterId,
  onCharacterChange,
}: GameControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
      {gameMode === 'pvc' && onCharacterChange && selectedCharacterId && (
        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-4 duration-500">
          <label htmlFor="character" className="text-sm font-medium">
            Your Opponent:
          </label>
          <Select
            value={selectedCharacterId}
            onValueChange={value => onCharacterChange(value as CharacterId)}
          >
            <SelectTrigger id="character" className="w-56 transition-all hover:scale-105">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bella">🐕 Bella - Playful Pup</SelectItem>
              <SelectItem value="coop">🎮 Coop - Casual Challenger</SelectItem>
              <SelectItem value="bentley">🐺 Bentley - The Mastermind</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <Button
        onClick={onNewGame}
        disabled={disabled}
        variant="default"
        className="transition-all hover:scale-105 active:animate-button-press"
      >
        New Game
      </Button>

      <Button
        onClick={onShowLeaderboard}
        disabled={disabled}
        variant="outline"
        className="transition-all hover:scale-105 active:animate-button-press"
      >
        📊 Stats
      </Button>

      {onShowHelp && (
        <Button
          onClick={onShowHelp}
          disabled={disabled}
          variant="outline"
          className="transition-all hover:scale-105 active:animate-button-press"
        >
          ❓ How to Play
        </Button>
      )}

      {onShowKeyboardShortcuts && (
        <Button
          onClick={onShowKeyboardShortcuts}
          disabled={disabled}
          variant="outline"
          size="icon"
          title="Keyboard Shortcuts"
          className="transition-all hover:scale-110 hover:rotate-6 active:animate-button-press"
        >
          ⌨️
        </Button>
      )}
    </div>
  )
}
