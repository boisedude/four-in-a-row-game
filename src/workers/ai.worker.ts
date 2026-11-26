/**
 * Opponent search worker. Runs getAIMove off the main thread.
 * Protocol: { id, args: [board, player, difficulty, timeMs] } -> { id, move } or { id, error }.
 */

import { getAIMove } from '@/lib/aiStrategies'

type AIArgs = Parameters<typeof getAIMove>

interface AIRequest {
  id: number
  args: AIArgs
}

const ctx = self as unknown as {
  onmessage: ((e: MessageEvent<AIRequest>) => void) | null
  postMessage: (message: { id: number; move?: number; error?: string }) => void
}

ctx.onmessage = (e: MessageEvent<AIRequest>) => {
  const { id, args } = e.data
  try {
    ctx.postMessage({ id, move: getAIMove(...args) })
  } catch (error) {
    ctx.postMessage({ id, error: error instanceof Error ? error.message : String(error) })
  }
}
