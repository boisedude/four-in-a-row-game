/**
 * useGameAudio Hook
 * Manages game sound effects using Web Audio API
 * Designed by M. Cooper for www.mcooper.com
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { AUDIO } from '@/lib/constants'

type SoundEffect = 'discDrop' | 'victory' | 'defeat' | 'draw' | 'click' | 'hover'

// Type declaration for webkit compatibility
type WebkitWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext
  }

export function useGameAudio() {
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('connect4-audio-muted') === 'true'
  })

  const audioContextRef = useRef<AudioContext | null>(null)

  // Initialize Audio Context
  useEffect(() => {
    if (typeof window !== 'undefined' && !audioContextRef.current) {
      try {
        const AudioContextClass = window.AudioContext || (window as WebkitWindow).webkitAudioContext
        if (AudioContextClass) {
          audioContextRef.current = new AudioContextClass()
        }
      } catch {
        // Web Audio API not supported - audio will be disabled
      }
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  // Toggle mute
  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newValue = !prev
      localStorage.setItem('connect4-audio-muted', String(newValue))
      return newValue
    })
  }, [])

  // Play disc drop sound (bouncy thump)
  const playDiscDrop = useCallback(() => {
    if (isMuted || !audioContextRef.current) return

    const ctx = audioContextRef.current
    const now = ctx.currentTime

    // Create oscillator for bounce effect
    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()

    osc.connect(gainNode)
    gainNode.connect(ctx.destination)

    // Frequency envelope: starts high, drops quickly (bounce effect)
    osc.frequency.setValueAtTime(AUDIO.discDrop.startFrequency, now)
    osc.frequency.exponentialRampToValueAtTime(AUDIO.discDrop.endFrequency, now + 0.1)

    // Volume envelope: quick attack, medium decay
    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15)

    osc.type = 'sine'
    osc.start(now)
    osc.stop(now + 0.15)
  }, [isMuted])

  // Play victory sound (triumphant fanfare)
  const playVictory = useCallback(() => {
    if (isMuted || !audioContextRef.current) return

    const ctx = audioContextRef.current
    const now = ctx.currentTime

    // Play a sequence of ascending notes (C, E, G, C major chord)
    AUDIO.victory.notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()

      osc.connect(gainNode)
      gainNode.connect(ctx.destination)

      const startTime = now + i * 0.15
      osc.frequency.setValueAtTime(freq, startTime)

      gainNode.gain.setValueAtTime(0, startTime)
      gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.05)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3)

      osc.type = 'triangle'
      osc.start(startTime)
      osc.stop(startTime + 0.3)
    })
  }, [isMuted])

  // Play defeat sound (sad descending tone)
  const playDefeat = useCallback(() => {
    if (isMuted || !audioContextRef.current) return

    const ctx = audioContextRef.current
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()

    osc.connect(gainNode)
    gainNode.connect(ctx.destination)

    // Descending frequency (sad trombone effect)
    osc.frequency.setValueAtTime(AUDIO.defeat.startFrequency, now)
    osc.frequency.exponentialRampToValueAtTime(AUDIO.defeat.endFrequency, now + 0.5)

    // Fade in and out
    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.05)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5)

    osc.type = 'sawtooth'
    osc.start(now)
    osc.stop(now + 0.5)
  }, [isMuted])

  // Play draw sound (neutral tone)
  const playDraw = useCallback(() => {
    if (isMuted || !audioContextRef.current) return

    const ctx = audioContextRef.current
    const now = ctx.currentTime

    // Play two tones simultaneously
    AUDIO.draw.frequencies.forEach(freq => {
      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()

      osc.connect(gainNode)
      gainNode.connect(ctx.destination)

      osc.frequency.setValueAtTime(freq, now)

      gainNode.gain.setValueAtTime(0, now)
      gainNode.gain.linearRampToValueAtTime(0.15, now + 0.05)
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3)

      osc.type = 'sine'
      osc.start(now)
      osc.stop(now + 0.3)
    })
  }, [isMuted])

  // Play click sound (UI feedback)
  const playClick = useCallback(() => {
    if (isMuted || !audioContextRef.current) return

    const ctx = audioContextRef.current
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()

    osc.connect(gainNode)
    gainNode.connect(ctx.destination)

    osc.frequency.setValueAtTime(AUDIO.click.startFrequency, now)
    osc.frequency.exponentialRampToValueAtTime(AUDIO.click.endFrequency, now + 0.05)

    gainNode.gain.setValueAtTime(0.1, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05)

    osc.type = 'square'
    osc.start(now)
    osc.stop(now + 0.05)
  }, [isMuted])

  // Play hover sound (subtle UI feedback)
  const playHover = useCallback(() => {
    if (isMuted || !audioContextRef.current) return

    const ctx = audioContextRef.current
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()

    osc.connect(gainNode)
    gainNode.connect(ctx.destination)

    osc.frequency.setValueAtTime(AUDIO.hover.frequency, now)

    gainNode.gain.setValueAtTime(0.05, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.03)

    osc.type = 'sine'
    osc.start(now)
    osc.stop(now + 0.03)
  }, [isMuted])

  // Play any sound effect
  const playSound = useCallback(
    (effect: SoundEffect) => {
      switch (effect) {
        case 'discDrop':
          playDiscDrop()
          break
        case 'victory':
          playVictory()
          break
        case 'defeat':
          playDefeat()
          break
        case 'draw':
          playDraw()
          break
        case 'click':
          playClick()
          break
        case 'hover':
          playHover()
          break
      }
    },
    [playDiscDrop, playVictory, playDefeat, playDraw, playClick, playHover]
  )

  return {
    isMuted,
    toggleMute,
    playSound,
    playDiscDrop,
    playVictory,
    playDefeat,
    playDraw,
    playClick,
    playHover,
  }
}
