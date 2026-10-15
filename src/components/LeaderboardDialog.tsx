/**
 * Leaderboard Dialog Component
 * Displays player statistics
 */

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import type { LeaderboardEntry } from '@/types/connect4.types'

interface LeaderboardDialogProps {
  open: boolean
  onClose: () => void
  stats: LeaderboardEntry
  characterName?: string
}

export function LeaderboardDialog({ open, onClose, stats, characterName = 'Coop' }: LeaderboardDialogProps) {
  const winRate = stats.totalGames > 0 ? ((stats.wins / stats.totalGames) * 100).toFixed(1) : '0.0'

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Your stats</DialogTitle>
          <DialogDescription>Record against {characterName}.</DialogDescription>
        </DialogHeader>

        <dl className="divide-y text-sm">
          <StatRow label="Games" value={stats.totalGames} />
          <StatRow label="Wins" value={stats.wins} />
          <StatRow label="Losses" value={stats.losses} />
          <StatRow label="Draws" value={stats.draws} />
          <StatRow label="Win rate" value={`${winRate}%`} />
          <StatRow label="Current win streak" value={stats.winStreak} />
          <StatRow label="Longest win streak" value={stats.longestWinStreak} />
          <StatRow
            label="Fastest win"
            value={stats.fastestWin ? `${stats.fastestWin} moves` : 'None yet'}
          />
        </dl>

        <DialogFooter>
          <Button onClick={onClose} variant="outline" className="h-11 w-full sm:w-auto">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between py-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  )
}
