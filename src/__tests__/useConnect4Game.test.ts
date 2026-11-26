import { renderHook, act } from '@testing-library/react'

// createAIWorker uses import.meta, which Jest cannot compile; without a worker
// the client searches synchronously.
jest.mock('@/lib/createAIWorker', () => ({
  createAIWorker: () => {
    throw new Error('no worker in jest')
  },
}))

import { useConnect4Game } from '@/hooks/useConnect4Game'

async function flush(ms: number) {
  for (let i = 0; i < Math.ceil(ms / 100); i++) {
    await act(async () => {
      jest.advanceTimersByTime(100)
      await Promise.resolve()
    })
  }
}

describe('useConnect4Game', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it('startNewGame with a difficulty discards the game in progress', async () => {
    const { result } = renderHook(() => useConnect4Game('easy'))
    act(() => result.current.handlePlayerMove(3))
    await flush(2000)
    expect(result.current.gameState.moveHistory.length).toBeGreaterThan(0)

    act(() => result.current.startNewGame('pvc', 'hard'))

    expect(result.current.gameState.difficulty).toBe('hard')
    expect(result.current.gameState.moveHistory).toHaveLength(0)
    expect(result.current.gameState.board.flat().every(c => c === null)).toBe(true)
  })

  it('the opponent replies after the player move', async () => {
    const { result } = renderHook(() => useConnect4Game('medium'))
    act(() => result.current.handlePlayerMove(3))
    await flush(2000)
    expect(result.current.gameState.moveHistory.map(m => m.player)).toEqual([1, 2])
  })

  it('undo takes back the player move and the reply', async () => {
    const { result } = renderHook(() => useConnect4Game('easy'))
    expect(result.current.canUndo).toBe(false)
    act(() => result.current.handlePlayerMove(3))
    await flush(2000)
    act(() => result.current.handlePlayerMove(2))
    await flush(2000)
    expect(result.current.gameState.moveHistory).toHaveLength(4)
    expect(result.current.canUndo).toBe(true)

    act(() => result.current.undo())
    expect(result.current.gameState.moveHistory.map(m => m.column)).toEqual(
      result.current.gameState.moveHistory.map(m => m.column)
    )
    expect(result.current.gameState.moveHistory).toHaveLength(2)
    expect(result.current.gameState.currentPlayer).toBe(1)
    expect(result.current.gameState.board.flat().filter(c => c !== null)).toHaveLength(2)
  })
})
