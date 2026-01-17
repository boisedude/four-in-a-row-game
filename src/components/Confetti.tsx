/**
 * Confetti Component
 * Animated confetti particles for victory celebrations
 */

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { CONFETTI_MIN_DURATION_S, CONFETTI_DURATION_VARIANCE_S, CONFETTI_PARTICLE_COUNT } from '@/lib/constants'

const CONFETTI_COLORS = [
  '#FFD700', // Gold
  '#FF6B6B', // Red
  '#4ECDC4', // Cyan
  '#45B7D1', // Blue
  '#FFA07A', // Light Salmon
  '#98D8C8', // Mint
  '#F7DC6F', // Yellow
  '#BB8FCE', // Purple
]

interface ConfettiParticle {
  id: number
  left: number
  delay: number
  duration: number
  color: string
  rotation: number
  size: number
}

interface ConfettiProps {
  active?: boolean
  particleCount?: number
}

/**
 * Generates confetti particles with random properties
 */
function generateParticles(count: number): ConfettiParticle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: CONFETTI_MIN_DURATION_S + Math.random() * CONFETTI_DURATION_VARIANCE_S,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    rotation: Math.random() * 720,
    size: 6 + Math.random() * 8,
  }))
}

export function Confetti({ active = true, particleCount = CONFETTI_PARTICLE_COUNT }: ConfettiProps) {
  // Generate particles once when component mounts or count changes
  // Using useMemo instead of useEffect + setState to avoid the ESLint warning
  const particles = useMemo(
    () => (active ? generateParticles(particleCount) : []),
    [active, particleCount]
  )

  if (!active) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute top-0 animate-confetti-burst"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        >
          <div
            className={cn('rounded-sm shadow-lg')}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              transform: `rotate(${particle.rotation}deg)`,
            }}
          />
        </div>
      ))}
    </div>
  )
}
