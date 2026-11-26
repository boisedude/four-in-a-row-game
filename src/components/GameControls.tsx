/**
 * Game Controls Component
 *
 * One row: New game (the only primary button), Undo, Hint, and a More menu
 * that holds everything else.
 */

import { Button } from './ui/button'
import { MoreMenu } from '@shared/MoreMenu'

interface GameControlsProps {
  onNewGame: () => void
  onHint: () => void
  hintDisabled: boolean
  onUndo: () => void
  undoDisabled: boolean
  onShowLeaderboard: () => void
  onShowHelp: () => void
  onShowKeyboardShortcuts: () => void
  playing: boolean
}

export function GameControls({
  onNewGame,
  onHint,
  hintDisabled,
  onUndo,
  undoDisabled,
  onShowLeaderboard,
  onShowHelp,
  onShowKeyboardShortcuts,
  playing,
}: GameControlsProps) {
  return (
    <div className="arcade-controls">
      <Button onClick={onNewGame} className="h-11 px-3.5 sm:px-5">
        New game
      </Button>

      {playing && (
        <Button onClick={onUndo} disabled={undoDisabled} variant="outline" className="h-11 px-3.5 sm:px-5">
          Undo
        </Button>
      )}

      {playing && (
        <Button
          onClick={onHint}
          disabled={hintDisabled}
          variant="outline"
          className="h-11 px-3.5 sm:px-5"
          title="Show a suggested column"
        >
          Hint
        </Button>
      )}

      <MoreMenu
        items={[
          { label: 'How to play', onSelect: onShowHelp },
          { label: 'Stats', onSelect: onShowLeaderboard },
          { label: 'Keyboard shortcuts', onSelect: onShowKeyboardShortcuts },
        ]}
      />
    </div>
  )
}
