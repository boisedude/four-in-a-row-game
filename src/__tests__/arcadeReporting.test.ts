import { reportArcadeResult } from '@/lib/arcadeReporting'
import { recordPlayerBeatBentley, recordBentleyBeatPlayer } from '@shared/arcadeRecord'

jest.mock('@shared/arcadeRecord', () => ({
  recordPlayerBeatBentley: jest.fn().mockResolvedValue(undefined),
  recordBentleyBeatPlayer: jest.fn().mockResolvedValue(undefined),
}))

describe('reportArcadeResult', () => {
  beforeEach(() => jest.clearAllMocks())

  it('records a player win against Bentley', () => {
    reportArcadeResult('bentley', 'pvc', 'won', 1)
    expect(recordPlayerBeatBentley).toHaveBeenCalledTimes(1)
    expect(recordBentleyBeatPlayer).not.toHaveBeenCalled()
  })

  it('records a Bentley win', () => {
    reportArcadeResult('bentley', 'pvc', 'won', 2)
    expect(recordBentleyBeatPlayer).toHaveBeenCalledTimes(1)
    expect(recordPlayerBeatBentley).not.toHaveBeenCalled()
  })

  it('ignores draws, other opponents, and player-vs-player', () => {
    reportArcadeResult('bentley', 'pvc', 'draw', null)
    reportArcadeResult('bella', 'pvc', 'won', 1)
    reportArcadeResult('coop', 'pvc', 'won', 2)
    reportArcadeResult('bentley', 'pvp', 'won', 1)
    expect(recordPlayerBeatBentley).not.toHaveBeenCalled()
    expect(recordBentleyBeatPlayer).not.toHaveBeenCalled()
  })
})
