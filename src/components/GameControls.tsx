/**
 * Game Controls Component
 * One primary button, the rest outline or ghost
 */

import { Button } from './ui/button'

interface GameControlsProps {
  onNewGame: () => void
  onShowLeaderboard: () => void
  onShowHelp?: () => void
  onShowKeyboardShortcuts?: () => void
  disabled?: boolean
}

function KeyboardIcon() {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M7 15h10" />
    </svg>
  )
}

export function GameControls({
  onNewGame,
  onShowLeaderboard,
  onShowHelp,
  onShowKeyboardShortcuts,
  disabled = false,
}: GameControlsProps) {
  return (
    <div className="arcade-controls">
      <Button onClick={onNewGame} disabled={disabled} className="h-11 px-4">
        New game
      </Button>

      <Button onClick={onShowLeaderboard} disabled={disabled} variant="outline" className="h-11 px-4">
        Stats
      </Button>

      {onShowHelp && (
        <Button onClick={onShowHelp} variant="outline" className="h-11 px-4">
          How to play
        </Button>
      )}

      {onShowKeyboardShortcuts && (
        <Button
          onClick={onShowKeyboardShortcuts}
          variant="ghost"
          size="icon"
          className="h-11 w-11"
          title="Keyboard shortcuts"
          aria-label="Keyboard shortcuts"
        >
          <KeyboardIcon />
        </Button>
      )}
    </div>
  )
}
