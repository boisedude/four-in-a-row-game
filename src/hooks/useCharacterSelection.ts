/**
 * useCharacterSelection Hook
 * Manages character selection for Connect4 game
 */

import { useState, useCallback } from 'react'
import type { Character, CharacterId } from '@shared/characters'
import { getCharacterById } from '@shared/characters'

export function useCharacterSelection(initialCharacterId: CharacterId = 'coop') {
  const [selectedCharacterId, setSelectedCharacterId] = useState<CharacterId>(initialCharacterId)
  const [character, setCharacter] = useState<Character>(() => getCharacterById(initialCharacterId))

  const selectCharacter = useCallback((characterId: CharacterId) => {
    setSelectedCharacterId(characterId)
    setCharacter(getCharacterById(characterId))
  }, [])

  return {
    character,
    selectedCharacterId,
    selectCharacter,
  }
}
