/**
 * Disc Component
 * Represents a single game disc (red or yellow)
 */

import { cn } from '@/lib/utils'
import type { Player } from '@/types/connect4.types'

interface DiscProps {
  player: Player | null
  isWinning?: boolean
  isLast?: boolean
  className?: string
  winningIndex?: number
}

export function Disc({
  player,
  isWinning = false,
  isLast = false,
  className,
  winningIndex,
}: DiscProps) {
  if (!player) {
    return <div className={cn('h-full w-full rounded-full bg-slate-100/50', className)} />
  }

  const colors = {
    1: 'bg-gradient-to-br from-red-500 to-red-600',
    2: 'bg-gradient-to-br from-yellow-400 to-yellow-500',
  }

  const glowColors = {
    1: 'shadow-red-500/50',
    2: 'shadow-yellow-500/50',
  }

  // Calculate animation delay for sequential win animation
  const sequentialDelay = winningIndex !== undefined ? `${winningIndex * 100}ms` : '0ms'

  return (
    <div
      className={cn(
        'relative h-full w-full rounded-full transition-all duration-300',
        colors[player],
        isLast && 'animate-disc-drop',
        isWinning && 'animate-win-pulse ring-4 ring-white ring-offset-2 ring-offset-blue-600',
        !isWinning && 'shadow-md',
        isWinning && glowColors[player],
        className
      )}
      style={
        isWinning && winningIndex !== undefined
          ? { animationDelay: sequentialDelay }
          : undefined
      }
    >
      {/* Shine effect */}
      <div
        className={cn(
          'absolute left-1/4 top-1/4 h-1/3 w-1/3 rounded-full bg-white/30 transition-all',
          isWinning && 'animate-win-glow bg-white/50'
        )}
        style={
          isWinning && winningIndex !== undefined
            ? { animationDelay: sequentialDelay }
            : undefined
        }
      />

      {/* Enhanced glow for winning disc */}
      {isWinning && (
        <div
          className="animate-win-pulse absolute inset-0 rounded-full bg-white/20"
          style={winningIndex !== undefined ? { animationDelay: sequentialDelay } : undefined}
        />
      )}

      {/* Particle burst effect for winning discs */}
      {isWinning && winningIndex !== undefined && (
        <div
          className="absolute inset-0 rounded-full opacity-0 animate-win-sequence"
          style={{ animationDelay: sequentialDelay }}
        />
      )}
    </div>
  )
}
