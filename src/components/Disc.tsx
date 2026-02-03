/**
 * Disc Component
 * Represents a single game disc with realistic shiny plastic effect
 */

import { memo } from 'react'
import { cn } from '@/lib/utils'
import type { Player } from '@/types/connect4.types'
import { WIN_ANIMATION_DELAY_MS } from '@/lib/constants'
import { getDiscStyles } from '@/lib/discStyles'

interface DiscProps {
  player: Player | null
  isWinning?: boolean
  isLast?: boolean
  className?: string
  winningIndex?: number
}

export const Disc = memo(function Disc({
  player,
  isWinning = false,
  isLast = false,
  className,
  winningIndex,
}: DiscProps) {
  if (!player) {
    // Empty cell - shows the "hole" background
    return (
      <div
        className={cn('h-full w-full rounded-full', className)}
        style={{
          background: 'radial-gradient(circle at 50% 60%, rgba(147, 197, 253, 0.15), transparent 70%)',
        }}
      />
    )
  }

  // Calculate animation delay for sequential win animation
  const sequentialDelay = winningIndex !== undefined ? `${winningIndex * WIN_ANIMATION_DELAY_MS}ms` : '0ms'

  // Get disc styles from shared module
  const discStyles = getDiscStyles(player, isWinning)

  return (
    <div
      className={cn(
        'relative h-full w-full rounded-full transition-all duration-300',
        isLast && 'animate-disc-drop',
        isWinning && 'animate-win-pulse ring-4 ring-white/80 ring-offset-2 ring-offset-blue-700',
        isWinning && 'animate-victory-bounce',
        className
      )}
      style={{
        ...discStyles,
        animationDelay: isWinning && winningIndex !== undefined ? sequentialDelay : undefined,
      }}
    >
      {/* Primary shine highlight - top left */}
      <div
        className={cn(
          'absolute rounded-full transition-all duration-300',
          'left-[15%] top-[12%] h-[35%] w-[35%]',
          isWinning && 'animate-win-glow'
        )}
        style={{
          background: 'radial-gradient(circle at 40% 40%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 50%, transparent 70%)',
          animationDelay: isWinning && winningIndex !== undefined ? sequentialDelay : undefined,
        }}
      />

      {/* Secondary shine - smaller, brighter */}
      <div
        className="absolute rounded-full left-[20%] top-[18%] h-[15%] w-[15%]"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
        }}
      />

      {/* Rim highlight - edge shine */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: `
            linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.2) 100%)
          `,
        }}
      />

      {/* Bottom reflection */}
      <div
        className="absolute bottom-[10%] left-[25%] right-[25%] h-[15%] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.4), transparent)',
        }}
      />

      {/* Animated shine sweep for winning discs */}
      {isWinning && (
        <div
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{ animationDelay: sequentialDelay }}
        >
          <div
            className="absolute inset-0 animate-shine-sweep"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
              width: '50%',
            }}
          />
        </div>
      )}

      {/* Enhanced glow ring for winning disc */}
      {isWinning && (
        <div
          className="animate-win-pulse absolute -inset-1 rounded-full pointer-events-none"
          style={{
            background: 'transparent',
            boxShadow: player === 1
              ? '0 0 20px 8px rgba(239, 68, 68, 0.4)'
              : '0 0 20px 8px rgba(251, 191, 36, 0.4)',
            animationDelay: winningIndex !== undefined ? sequentialDelay : undefined,
          }}
        />
      )}

      {/* Particle burst effect for winning discs */}
      {isWinning && winningIndex !== undefined && (
        <div
          className="absolute inset-0 rounded-full animate-win-sequence"
          style={{
            animationDelay: sequentialDelay,
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
          }}
        />
      )}

      {/* Starburst effect for victory celebration */}
      {isWinning && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none animate-victory-starburst opacity-0"
          style={{
            animationDelay: sequentialDelay,
            background: `conic-gradient(from 0deg, transparent, ${player === 1 ? 'rgba(239,68,68,0.3)' : 'rgba(251,191,36,0.3)'}, transparent, ${player === 1 ? 'rgba(239,68,68,0.3)' : 'rgba(251,191,36,0.3)'}, transparent)`,
          }}
        />
      )}
    </div>
  )
})
