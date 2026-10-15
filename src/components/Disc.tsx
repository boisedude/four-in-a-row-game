/**
 * Disc Component
 * A flat, matte disc. The winning four get a sagebrush ring.
 */

import { memo } from 'react'
import { cn } from '@/lib/utils'
import type { Player } from '@/types/connect4.types'
import { getDiscStyle } from '@/lib/discStyles'

interface DiscProps {
  player: Player | null
  isWinning?: boolean
  isLast?: boolean
  className?: string
}

export const Disc = memo(function Disc({ player, isWinning = false, isLast = false, className }: DiscProps) {
  if (!player) {
    return <div className={cn('h-full w-full rounded-full', className)} />
  }

  const style = getDiscStyle(player)

  return (
    <div
      className={cn(
        'h-full w-full rounded-full',
        isLast && 'animate-disc-drop',
        className
      )}
      style={
        isWinning
          ? {
              ...style,
              boxShadow: `${style.boxShadow}, 0 0 0 2px #0f1a24, 0 0 0 5px hsl(var(--primary))`,
            }
          : style
      }
      data-winning={isWinning || undefined}
    />
  )
})
