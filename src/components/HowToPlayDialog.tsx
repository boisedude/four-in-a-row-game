/**
 * HowToPlayDialog Component
 * Comprehensive game rules and strategy guide
 * Designed by M. Cooper for www.mcooper.com
 */

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { DiscGraphic } from './graphics'

interface HowToPlayDialogProps {
  open: boolean
  onClose: () => void
}

export function HowToPlayDialog({ open, onClose }: HowToPlayDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">How to Play Connect 4</DialogTitle>
          <DialogDescription>Learn the rules and master winning strategies</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Objective */}
          <section>
            <h3 className="mb-3 text-lg font-semibold">🎯 Objective</h3>
            <p className="text-muted-foreground">
              Be the first player to connect <strong>four of your discs</strong> in a row —
              horizontally, vertically, or diagonally — before your opponent does!
            </p>
          </section>

          {/* Game Setup */}
          <section>
            <h3 className="mb-3 text-lg font-semibold">🎮 Game Setup</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>
                  The game board has <strong>7 columns</strong> and <strong>6 rows</strong> (42
                  total spaces)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>
                  You play as <strong className="text-red-600">Red</strong>, the AI plays as{' '}
                  <strong className="text-yellow-600">Yellow</strong>
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span>•</span>
                <span className="flex items-center gap-2">
                  Red always goes first
                  <DiscGraphic style="smooth" color="red" size={24} showBranding={false} />
                </span>
              </li>
            </ul>
          </section>

          {/* How to Play */}
          <section>
            <h3 className="mb-3 text-lg font-semibold">🕹️ How to Play</h3>
            <ol className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="font-semibold">1.</span>
                <span>
                  <strong>Click a column</strong> to drop your disc. It will fall to the lowest
                  available space in that column.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold">2.</span>
                <span>
                  <strong>Players alternate turns.</strong> After you place a disc, the AI will make
                  its move.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold">3.</span>
                <span>
                  <strong>Connect four in a row</strong> to win. Valid winning patterns include:
                </span>
              </li>
            </ol>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-muted p-3 text-center">
                <div className="mb-2 text-2xl">—</div>
                <div className="text-sm font-medium">Horizontal</div>
                <div className="text-xs text-muted-foreground">Four in a row →</div>
              </div>
              <div className="rounded-lg bg-muted p-3 text-center">
                <div className="mb-2 text-2xl">|</div>
                <div className="text-sm font-medium">Vertical</div>
                <div className="text-xs text-muted-foreground">Four stacked ↓</div>
              </div>
              <div className="rounded-lg bg-muted p-3 text-center">
                <div className="mb-2 text-2xl">/</div>
                <div className="text-sm font-medium">Diagonal</div>
                <div className="text-xs text-muted-foreground">Four diagonal ↗ or ↘</div>
              </div>
            </div>
          </section>

          {/* Winning Strategies */}
          <section>
            <h3 className="mb-3 text-lg font-semibold">🧠 Winning Strategies</h3>
            <div className="space-y-3 text-muted-foreground">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950">
                <h4 className="mb-1 font-semibold text-blue-900 dark:text-blue-100">
                  1. Control the Center
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  The center column (column 4) offers the most opportunities to create winning
                  combinations. Start there when possible!
                </p>
              </div>

              <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950">
                <h4 className="mb-1 font-semibold text-green-900 dark:text-green-100">
                  2. Think Ahead
                </h4>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Always plan your next 2-3 moves. Create multiple threats so your opponent can't
                  block them all.
                </p>
              </div>

              <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 dark:border-orange-800 dark:bg-orange-950">
                <h4 className="mb-1 font-semibold text-orange-900 dark:text-orange-100">
                  3. Block Your Opponent
                </h4>
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  Watch for when the AI has three in a row — block them immediately! Defense is as
                  important as offense.
                </p>
              </div>

              <div className="rounded-lg border border-purple-200 bg-purple-50 p-3 dark:border-purple-800 dark:bg-purple-950">
                <h4 className="mb-1 font-semibold text-purple-900 dark:text-purple-100">
                  4. Create Two-Way Threats
                </h4>
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  Set up situations where you have two ways to win on your next turn. Your opponent
                  can only block one!
                </p>
              </div>
            </div>
          </section>

          {/* AI Difficulty Levels */}
          <section>
            <h3 className="mb-3 text-lg font-semibold">🤖 AI Difficulty Levels</h3>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-start gap-2">
                <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-900 dark:text-green-100">
                  EASY
                </span>
                <span className="text-sm">Random moves — great for beginners</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                  MEDIUM
                </span>
                <span className="text-sm">Strategic moves — blocks threats and looks for wins</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800 dark:bg-red-900 dark:text-red-100">
                  HARD
                </span>
                <span className="text-sm">
                  Advanced AI — uses minimax algorithm to think 6 moves ahead
                </span>
              </div>
            </div>
          </section>

          {/* Tips */}
          <section>
            <h3 className="mb-3 text-lg font-semibold">💡 Pro Tips</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Avoid filling the bottom row too quickly — it limits your options</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Look for "forks" — positions where you threaten multiple wins at once</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>
                  Count how many discs are in each column to predict where your disc will land
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Practice on Easy mode first, then work your way up to Hard!</span>
              </li>
            </ul>
          </section>
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
