/**
 * HowToPlayDialog Component
 * Rules and a few strategy notes
 */

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'

interface HowToPlayDialogProps {
  open: boolean
  opponentName: string
  onClose: () => void
}

export function HowToPlayDialog({ open, opponentName, onClose }: HowToPlayDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>How to play</DialogTitle>
          <DialogDescription>Connect four of your discs in a row before {opponentName} does.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 text-sm text-muted-foreground">
          <section>
            <h3 className="mb-1.5 text-base font-semibold text-foreground">Rules</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>The board has 7 columns and 6 rows.</li>
              <li>You play red and go first. {opponentName} plays yellow.</li>
              <li>Pick a column to drop a disc. It falls to the lowest empty space.</li>
              <li>Four in a row wins, horizontally, vertically, or diagonally.</li>
              <li>If all 42 spaces fill with no winner, the game is a draw.</li>
            </ul>
          </section>

          <section>
            <h3 className="mb-1.5 text-base font-semibold text-foreground">Strategy</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>Control the centre. Column 4 sits in the most winning lines.</li>
              <li>Plan two or three moves ahead.</li>
              <li>Block any three in a row before it becomes four.</li>
              <li>Build two threats at once, since your opponent can only block one.</li>
              <li>Count the discs in a column to predict where yours will land.</li>
            </ul>
          </section>

          <section>
            <h3 className="mb-1.5 text-base font-semibold text-foreground">Opponents</h3>
            <p>
              Bella plays random moves. Coop blocks threats and takes wins. Bentley searches six
              moves ahead. Click the opponent chip at the top to switch.
            </p>
          </section>
        </div>

        <DialogFooter>
          <Button onClick={onClose} variant="outline" className="h-11 w-full sm:w-auto">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
