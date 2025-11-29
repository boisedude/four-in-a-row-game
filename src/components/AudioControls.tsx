/**
 * AudioControls Component
 * Sound toggle control for game audio
 * Designed by M. Cooper for www.mcooper.com
 */

import { Button } from './ui/button'

interface AudioControlsProps {
  isMuted: boolean
  onToggleMute: () => void
  className?: string
}

export function AudioControls({ isMuted, onToggleMute, className }: AudioControlsProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggleMute}
      className={className}
      title={isMuted ? 'Unmute sound' : 'Mute sound'}
      aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
    >
      {isMuted ? <span className="text-2xl">🔇</span> : <span className="text-2xl">🔊</span>}
    </Button>
  )
}
