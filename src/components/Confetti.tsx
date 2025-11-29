/**
 * Confetti Component
 * Animated confetti particles for victory celebrations
 */

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

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

export function Confetti({ active = true, particleCount = 50 }: ConfettiProps) {
  const [particles, setParticles] = useState<ConfettiParticle[]>([])

  useEffect(() => {
    if (!active) return

    const colors = [
      '#FFD700', // Gold
      '#FF6B6B', // Red
      '#4ECDC4', // Cyan
      '#45B7D1', // Blue
      '#FFA07A', // Light Salmon
      '#98D8C8', // Mint
      '#F7DC6F', // Yellow
      '#BB8FCE', // Purple
    ]

    const newParticles: ConfettiParticle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 1.5 + Math.random() * 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 720,
      size: 6 + Math.random() * 8,
    }))

    setParticles(newParticles)
  }, [active, particleCount])

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
