/**
 * Tutorial Component
 * Interactive walkthrough for first-time players
 */

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import { getDiscStyle } from '@/lib/discStyles'

interface TutorialProps {
  open: boolean
  opponentName: string
  onClose: () => void
  onComplete: () => void
}

interface TutorialStep {
  title: string
  description: string
  tip?: string
  image?: React.ReactNode
}

function MiniDisc({ player, size = 48 }: { player: 1 | 2; size?: number }) {
  return (
    <div
      className="rounded-full"
      style={{ width: size, height: size, ...getDiscStyle(player) }}
      aria-hidden="true"
    />
  )
}

function getSteps(opponent: string): TutorialStep[] {
  return [
    {
      title: 'Welcome to Connect 4',
      description:
        'A classic strategy game that is easy to learn and hard to master.',
      image: (
        <div className="flex items-center justify-center gap-3">
          <MiniDisc player={1} />
          <MiniDisc player={2} />
          <MiniDisc player={1} />
          <MiniDisc player={2} />
        </div>
      ),
    },
    {
      title: 'The goal',
      description:
        'Be the first to connect four of your discs in a row. You can win horizontally, vertically, or diagonally.',
      tip: 'Every move should either help you win or stop your opponent.',
    },
    {
      title: 'You are red',
      description: `You play red and ${opponent} plays yellow. Red always goes first, which gives you a slight advantage.`,
      image: (
        <div className="flex items-center justify-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <MiniDisc player={1} size={56} />
            <div className="text-sm font-semibold">You</div>
          </div>
          <div className="text-muted-foreground">vs</div>
          <div className="flex flex-col items-center gap-2">
            <MiniDisc player={2} size={56} />
            <div className="text-sm font-semibold">{opponent}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'How a turn works',
      description: `Click a column (or press 1 to 7) to drop your disc. It falls to the lowest empty space. Then ${opponent} takes a turn.`,
      tip: 'The centre column is the strongest position.',
    },
    {
      title: 'Winning patterns',
      description:
        'Watch every direction: across, up and down, and both diagonals. Block any three in a row before it becomes four.',
      tip: 'Create two threats at once. Your opponent can only block one.',
    },
    {
      title: 'Choose your opponent',
      description:
        'Start with Bella to learn the basics. Coop plays a stronger game, and Bentley looks six moves ahead.',
      tip: 'Click the opponent chip at the top to switch at any time.',
    },
    {
      title: 'Ready to play',
      description:
        "Control the centre, think ahead, and watch for your opponent's threats.",
      tip: 'Click "How to play" any time to see the full rules.',
    },
  ]
}

export function Tutorial({ open, opponentName, onClose, onComplete }: TutorialProps) {
  const tutorialSteps = getSteps(opponentName)
  const [currentStep, setCurrentStep] = useState(0)
  const step = tutorialSteps[currentStep]
  const isLastStep = currentStep === tutorialSteps.length - 1

  const handleNext = () => {
    if (isLastStep) {
      onComplete()
      onClose()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSkip = () => {
    onComplete()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={isOpen => { if (!isOpen) handleSkip() }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">{step.title}</DialogTitle>
          <DialogDescription>
            Step {currentStep + 1} of {tutorialSteps.length}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Visual */}
          {step.image && <div className="py-4">{step.image}</div>}

          {/* Description */}
          <p className="text-center text-muted-foreground">{step.description}</p>

          {/* Tip */}
          {step.tip && (
            <p className="rounded-md border bg-secondary p-3 text-sm text-muted-foreground">
              {step.tip}
            </p>
          )}

          {/* Progress dots */}
          <div className="flex justify-center gap-2 pt-2">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-6 bg-primary'
                    : index < currentStep
                      ? 'bg-primary/50'
                      : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:space-x-0">
          <Button variant="ghost" onClick={handleSkip} className="h-11 sm:w-auto">
            Skip
          </Button>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handleBack} className="h-11">
                Back
              </Button>
            )}
            <Button onClick={handleNext} className="h-11">
              {isLastStep ? 'Play' : 'Next'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
