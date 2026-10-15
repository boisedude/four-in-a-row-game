/**
 * Opponent chip: avatar ringed in the character colour, name beside it.
 * It is the trigger of the opponent select.
 */

import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select'
import type { Character, CharacterId } from '@shared/characters'

interface OpponentChipProps {
  character: Character
  onCharacterChange: (characterId: CharacterId) => void
}

const OPTIONS: { value: CharacterId; name: string; level: string }[] = [
  { value: 'bella', name: 'Bella', level: 'Easy' },
  { value: 'coop', name: 'Coop', level: 'Medium' },
  { value: 'bentley', name: 'Bentley', level: 'Hard' },
]

export function OpponentChip({ character, onCharacterChange }: OpponentChipProps) {
  return (
    <Select value={character.id} onValueChange={(value) => onCharacterChange(value as CharacterId)}>
      <SelectTrigger
        className="arcade-chip w-auto shrink-0 gap-2 [&>span]:line-clamp-none"
        style={{ minHeight: 44 }}
        data-character={character.id}
        aria-label={`Opponent: ${character.name}. Change opponent`}
      >
        <img src={character.avatar} alt="" />
        <span>{character.name}</span>
      </SelectTrigger>
      <SelectContent align="end">
        {OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value} className="min-h-11 py-2.5">
            {option.name}
            <span className="ml-2 text-muted-foreground">{option.level}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
