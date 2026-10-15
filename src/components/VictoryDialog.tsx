/**
 * Victory Dialog Component
 * Character art, a one-line result, one catchphrase, and the record
 */

import { useState, useEffect } from 'react'
import type React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import type { LeaderboardEntry, Player } from '@/types/connect4.types'
import type { Character } from '@shared/characters'

interface VictoryDialogProps {
  open: boolean
  winner: Player | null
  moveCount: number
  onNewGame: () => void
  onClose: () => void
  isDraw: boolean
  character: Character
  stats: LeaderboardEntry
}

const DRAW_LINES = [
  'The board is full and nobody wins.',
  'A stalemate. One more game?',
  'Dead even. Rematch?',
]

export function VictoryDialog({
  open,
  winner,
  moveCount,
  onNewGame,
  onClose,
  isDraw,
  character,
  stats,
}: VictoryDialogProps) {
  const [catchphrase, setCatchphrase] = useState('')

  // Math.random() runs in an effect, not during render, to keep render pure
  useEffect(() => {
    if (!open) return
    const lines = isDraw
      ? DRAW_LINES
      : winner === 1
        ? character.catchphrases.playerWins
        : character.catchphrases.characterWins
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCatchphrase(lines[Math.floor(Math.random() * lines.length)])
  }, [open, isDraw, winner, character])

  const art = isDraw ? character.playAgainImage : winner === 1 ? character.loseImage : character.winImage

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm" hideClose>
        <DialogHeader className="items-center text-center sm:text-center">
          <img
            src={art}
            alt={character.name}
            className="mb-2 max-h-44 w-auto object-contain"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.src = character.avatar
            }}
          />
          <DialogTitle className="text-xl">
            {isDraw ? 'Draw' : winner === 1 ? `You beat ${character.name}` : `${character.name} won`}
          </DialogTitle>
          <DialogDescription>{catchphrase}</DialogDescription>
        </DialogHeader>

        <p className="text-center text-sm text-muted-foreground">
          {moveCount} moves. {stats.wins} {stats.wins === 1 ? 'win' : 'wins'}, {stats.losses}{' '}
          {stats.losses === 1 ? 'loss' : 'losses'}, {stats.draws} {stats.draws === 1 ? 'draw' : 'draws'}
        </p>

        <DialogFooter className="gap-2 sm:justify-center sm:space-x-0">
          <Button onClick={onNewGame} className="h-11">
            Play again
          </Button>
          <Button onClick={onClose} variant="ghost" className="h-11">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
