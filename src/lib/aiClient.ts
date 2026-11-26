/**
 * Promise wrapper around the opponent worker. Lazily creates the worker; if
 * Workers are unavailable or fail, searches run on the main thread with a much
 * smaller budget so the page stays responsive.
 */

import { getAIMove } from '@/lib/aiStrategies'
import { createAIWorker } from '@/lib/createAIWorker'
import type { Board, Player, Difficulty } from '@/types/connect4.types'

/** Budget for a search on the main thread when no worker is available. */
export const SYNC_FALLBACK_MS = 150

type AIArgs = Parameters<typeof getAIMove>

interface Pending {
  args: AIArgs
  resolve: (move: number) => void
  reject: (e: unknown) => void
}

let worker: Worker | null = null
let workerBroken = false
let nextId = 1
const pending = new Map<number, Pending>()

function runSync(p: Pending): void {
  const [board, player, difficulty, timeMs] = p.args
  try {
    p.resolve(getAIMove(board, player, difficulty, Math.min(timeMs ?? SYNC_FALLBACK_MS, SYNC_FALLBACK_MS)))
  } catch (e) {
    p.reject(e)
  }
}

/** Worker failed: answer everything outstanding on the main thread and stop using it. */
function failOver(): void {
  workerBroken = true
  if (worker) {
    worker.terminate()
    worker = null
  }
  const waiting = [...pending.values()]
  pending.clear()
  waiting.forEach(runSync)
}

function getWorker(): Worker | null {
  if (workerBroken) return null
  if (worker) return worker
  if (typeof Worker === 'undefined') {
    workerBroken = true
    return null
  }
  try {
    const w = createAIWorker()
    w.onmessage = (e: MessageEvent<{ id: number; move?: number; error?: string }>) => {
      const p = pending.get(e.data.id)
      if (!p) return
      pending.delete(e.data.id)
      if (typeof e.data.move === 'number') p.resolve(e.data.move)
      else p.reject(new Error(e.data.error ?? 'Search failed'))
    }
    w.onerror = () => failOver()
    w.onmessageerror = () => failOver()
    worker = w
    return w
  } catch {
    workerBroken = true
    return null
  }
}

/** Asks for the opponent's column (or a hint, with difficulty 'hard' and a budget). */
export function requestAIMove(
  board: Board,
  player: Player,
  difficulty: Difficulty,
  timeMs?: number
): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    const entry: Pending = { args: [board, player, difficulty, timeMs], resolve, reject }
    const w = getWorker()
    if (!w) {
      runSync(entry)
      return
    }
    const id = nextId++
    pending.set(id, entry)
    try {
      w.postMessage({ id, args: entry.args })
    } catch {
      pending.delete(id)
      failOver()
      runSync(entry)
    }
  })
}
