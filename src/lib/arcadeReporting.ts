/**
 * Reports a finished game to the arcade-wide Bentley record.
 * Only decisive human-vs-AI games against Bentley count.
 */

import { recordPlayerBeatBentley, recordBentleyBeatPlayer } from '@shared/arcadeRecord'
import type { GameMode, GameStatus } from '@/types/connect4.types'

export function reportArcadeResult(
  characterId: string,
  mode: GameMode,
  status: GameStatus,
  winner: number | null
): void {
  if (mode !== 'pvc' || characterId !== 'bentley' || status !== 'won') return
  if (winner === 1) void recordPlayerBeatBentley()
  else if (winner === 2) void recordBentleyBeatPlayer()
}
