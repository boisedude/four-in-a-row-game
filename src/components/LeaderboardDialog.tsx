/**
 * Leaderboard Dialog Component
 * Displays player statistics
 */

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
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
          <DialogTitle>Your Record vs {characterName}</DialogTitle>
          <DialogDescription>How well can you beat {characterName}?</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <StatRow label="Total Games" value={stats.totalGames} />
            <StatRow label={`Wins vs ${characterName}`} value={stats.wins} highlight="green" />
            <StatRow label={`Losses to ${characterName}`} value={stats.losses} highlight="red" />
            <StatRow label="Draws" value={stats.draws} />
            <StatRow label="Win Rate" value={`${winRate}%`} />
          </div>

          <div className="border-t pt-4">
            <h3 className="mb-2 text-sm font-semibold">Best Records</h3>
            <div className="space-y-2">
              <StatRow label="Current Win Streak" value={stats.winStreak} />
              <StatRow label="Longest Win Streak" value={stats.longestWinStreak} />
              <StatRow
                label="Fastest Victory"
                value={stats.fastestWin ? `${stats.fastestWin} moves` : 'N/A'}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function StatRow({
  label,
  value,
  highlight,
}: {
  label: string
  value: string | number
  highlight?: 'green' | 'red'
}) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
      <span className="text-sm font-medium">{label}</span>
      <span
        className={`text-lg font-bold ${
          highlight === 'green' ? 'text-green-600' : highlight === 'red' ? 'text-red-600' : ''
        }`}
      >
        {value}
      </span>
    </div>
  )
}
