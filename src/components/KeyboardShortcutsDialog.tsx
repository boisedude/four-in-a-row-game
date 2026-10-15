/**
 * KeyboardShortcutsDialog Component
 * Reference guide for keyboard controls
 */

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog'
import { Button } from './ui/button'

interface KeyboardShortcutsDialogProps {
  open: boolean
  onClose: () => void
}

interface ShortcutItem {
  keys: string[]
  description: string
}

const shortcuts: ShortcutItem[] = [
  { keys: ['1', '2', '3', '4', '5', '6', '7'], description: 'Drop disc in column' },
  { keys: ['←', '→'], description: 'Move between columns' },
  { keys: ['Enter', 'Space'], description: 'Drop disc in selected column' },
  { keys: ['N'], description: 'New game' },
  { keys: ['H'], description: 'How to play' },
  { keys: ['L'], description: 'Stats' },
  { keys: ['M'], description: 'Mute or unmute sound' },
  { keys: ['Esc'], description: 'Close dialog' },
  { keys: ['?'], description: 'Keyboard shortcuts' },
]

export function KeyboardShortcutsDialog({ open, onClose }: KeyboardShortcutsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
        </DialogHeader>

        <ul className="divide-y text-sm">
          {shortcuts.map((shortcut) => (
            <li key={shortcut.description} className="flex items-center justify-between gap-3 py-2">
              <span className="text-muted-foreground">{shortcut.description}</span>
              <span className="flex flex-wrap justify-end gap-1">
                {shortcut.keys.map((key) => (
                  <kbd
                    key={key}
                    className="min-w-[1.75rem] rounded border border-border bg-secondary px-1.5 py-0.5 text-center text-xs font-semibold"
                  >
                    {key}
                  </kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>

        <DialogFooter>
          <Button onClick={onClose} variant="outline" className="h-11 w-full sm:w-auto">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
