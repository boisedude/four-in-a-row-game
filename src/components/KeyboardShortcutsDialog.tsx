/**
 * KeyboardShortcutsDialog Component
 * Reference guide for keyboard controls
 * Designed by M. Cooper for www.mcooper.com
 */

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'

interface KeyboardShortcutsDialogProps {
  open: boolean
  onClose: () => void
}

interface ShortcutItem {
  keys: string[]
  description: string
  category: string
}

const shortcuts: ShortcutItem[] = [
  {
    keys: ['1', '2', '3', '4', '5', '6', '7'],
    description: 'Drop disc in column',
    category: 'Game',
  },
  { keys: ['←', '→'], description: 'Navigate between columns', category: 'Game' },
  { keys: ['Enter'], description: 'Drop disc in selected column', category: 'Game' },
  { keys: ['Space'], description: 'Drop disc in selected column', category: 'Game' },
  { keys: ['N'], description: 'New game', category: 'Controls' },
  { keys: ['H'], description: 'Open help / How to play', category: 'Controls' },
  { keys: ['L'], description: 'Open leaderboard', category: 'Controls' },
  { keys: ['M'], description: 'Toggle sound mute', category: 'Controls' },
  { keys: ['Esc'], description: 'Close dialog', category: 'Controls' },
  { keys: ['?'], description: 'Show keyboard shortcuts', category: 'Controls' },
]

export function KeyboardShortcutsDialog({ open, onClose }: KeyboardShortcutsDialogProps) {
  const gameShortcuts = shortcuts.filter(s => s.category === 'Game')
  const controlShortcuts = shortcuts.filter(s => s.category === 'Controls')

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">⌨️ Keyboard Shortcuts</DialogTitle>
          <DialogDescription>Master these shortcuts to play more efficiently</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Game Controls */}
          <section>
            <h3 className="mb-3 text-lg font-semibold">Game Controls</h3>
            <div className="space-y-2">
              {gameShortcuts.map((shortcut, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-muted p-3"
                >
                  <span className="text-sm text-muted-foreground">{shortcut.description}</span>
                  <div className="flex gap-1">
                    {shortcut.keys.map((key, keyIndex) => (
                      <kbd
                        key={keyIndex}
                        className="min-w-[2rem] rounded border border-border bg-background px-2 py-1 text-center text-xs font-semibold shadow-sm"
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* General Controls */}
          <section>
            <h3 className="mb-3 text-lg font-semibold">General Controls</h3>
            <div className="space-y-2">
              {controlShortcuts.map((shortcut, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-muted p-3"
                >
                  <span className="text-sm text-muted-foreground">{shortcut.description}</span>
                  <div className="flex gap-1">
                    {shortcut.keys.map((key, keyIndex) => (
                      <kbd
                        key={keyIndex}
                        className="min-w-[2rem] rounded border border-border bg-background px-2 py-1 text-center text-xs font-semibold shadow-sm"
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Pro Tip */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
            <div className="mb-1 font-semibold text-blue-900 dark:text-blue-100">💡 Pro Tip</div>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Use number keys{' '}
              <kbd className="rounded bg-blue-100 px-1 py-0.5 text-xs dark:bg-blue-900">1</kbd>-
              <kbd className="rounded bg-blue-100 px-1 py-0.5 text-xs dark:bg-blue-900">7</kbd> for
              lightning-fast moves! No need to reach for your mouse.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t pt-4">
          <Button onClick={onClose}>Got it!</Button>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          Game designed by M. Cooper • www.mcooper.com
        </div>
      </DialogContent>
    </Dialog>
  )
}
