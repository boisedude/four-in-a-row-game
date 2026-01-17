/**
 * Victory Dialog Component
 * Shows game result and statistics with MC graphics
 */

import { useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import { Confetti } from './Confetti'
import { cn } from '@/lib/utils'
import type { Player } from '@/types/connect4.types'
import type { Character } from '@shared/characters'

/**
 * Selects a random item from an array
 * Extracted as a utility to avoid calling Math.random during render
 */
function selectRandomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

interface VictoryDialogProps {
  open: boolean
  winner: Player | null
  moveCount: number
  onNewGame: () => void
  onClose: () => void
  isDraw: boolean
  character: Character
}

export function VictoryDialog({
  open,
  winner,
  moveCount,
  onNewGame,
  onClose,
  isDraw,
  character,
}: VictoryDialogProps) {
  // Memoize the victory message to avoid re-randomizing on each render
  // The message should only change when the dialog opens with new game results
  const victoryMessage = useMemo(() => {
    if (isDraw) {
      const drawMessages = [
        'The board is full! No one wins this time.',
        `${character.name} respects the stalemate. Rematch?`,
      ]
      return selectRandomItem(drawMessages)
    }

    if (winner === 1) {
      return selectRandomItem(character.catchphrases.playerWins)
    } else {
      return selectRandomItem(character.catchphrases.characterWins)
    }
  }, [isDraw, winner, character.name, character.catchphrases.playerWins, character.catchphrases.characterWins])

  // Get appropriate character image
  const getCharacterImage = () => {
    if (isDraw) {
      return character.avatar
    }
    if (winner === 1) {
      // Player won, show character lose image
      return character.loseImage
    } else {
      // Character won, show character win image
      return character.winImage
    }
  }

  // Get dialog title
  const getDialogTitle = () => {
    if (isDraw) {
      return '🤝 Draw!'
    }
    if (winner === 1) {
      return `You Beat ${character.name}!`
    } else {
      return `${character.name} Wins!`
    }
  }

  return (
    <>
      {/* Confetti for player victory */}
      {winner === 1 && <Confetti active={open} particleCount={60} />}

      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle
            className={cn(
              'text-center text-2xl animate-in fade-in slide-in-from-top-2 duration-500',
              winner === 1 &&
                'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-victory-shimmer'
            )}
          >
            {getDialogTitle()}
          </DialogTitle>
          <DialogDescription className="text-center text-base animate-in fade-in slide-in-from-top-2 duration-500 delay-100">
            {victoryMessage}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {/* Character Image */}
          <div className="relative mx-auto w-full max-w-[200px] h-[200px] overflow-visible flex items-center justify-center">
            <img
              src={getCharacterImage()}
              alt={character.name}
              className="w-full h-full object-contain animate-character-entrance"
              onError={(e) => {
                // Fallback to graphics if image fails to load
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          </div>

          {/* Stats with animation */}
          <div className="flex items-center justify-between rounded-lg bg-muted p-4 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
            <span className="text-sm font-medium">Total Moves:</span>
            <span className="text-lg font-bold animate-in zoom-in duration-300 delay-500">
              {moveCount}
            </span>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            onClick={onNewGame}
            className="w-full sm:w-auto animate-in fade-in slide-in-from-bottom-2 duration-500 delay-500 hover:scale-105 active:animate-button-press transition-transform"
          >
            Play Again
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full sm:w-auto animate-in fade-in slide-in-from-bottom-2 duration-500 delay-600 hover:scale-105 active:animate-button-press transition-transform"
          >
            Close
          </Button>
        </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
