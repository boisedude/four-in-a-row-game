import { renderHook, act } from '@testing-library/react'
import { useConnect4Game } from '@/hooks/useConnect4Game'

describe('useConnect4Game opponent change', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it('startNewGame with a difficulty discards the game in progress', () => {
    const { result } = renderHook(() => useConnect4Game('easy'))
    act(() => result.current.handlePlayerMove(3))
    act(() => {
      jest.advanceTimersByTime(5000)
    })
    expect(result.current.gameState.moveHistory.length).toBeGreaterThan(0)

    act(() => result.current.startNewGame('pvc', 'hard'))

    expect(result.current.gameState.difficulty).toBe('hard')
    expect(result.current.gameState.moveHistory).toHaveLength(0)
    expect(result.current.gameState.board.flat().every(c => c === null)).toBe(true)
  })

  it('AI replies after the player move', () => {
    const { result } = renderHook(() => useConnect4Game('easy'))
    act(() => result.current.handlePlayerMove(3))
    for (let i = 0; i < 6; i++) act(() => void jest.advanceTimersByTime(1000))
    expect(result.current.gameState.moveHistory.map(m => m.player)).toEqual([1, 2])
  })
})
