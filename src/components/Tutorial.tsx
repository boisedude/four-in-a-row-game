/**
 * Tutorial Component
 * Interactive walkthrough for first-time players
 * Designed by M. Cooper for www.mcooper.com
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
import { DiscGraphic, Connect4Logo } from './graphics'

interface TutorialProps {
  open: boolean
  onClose: () => void
  onComplete: () => void
}

interface TutorialStep {
  title: string
  description: string
  tip?: string
  image?: React.ReactNode
}

const tutorialSteps: TutorialStep[] = [
  {
    title: 'Welcome to Connect 4!',
    description:
      "I'm excited to teach you this classic strategy game. It's easy to learn but challenging to master!",
    image: <Connect4Logo size={120} className="mx-auto" />,
  },
  {
    title: 'The Goal',
    description:
      'Your objective is simple: be the first to connect FOUR of your discs in a row. You can win horizontally, vertically, or diagonally.',
    tip: 'Think ahead! Every move should either help you win or stop your opponent.',
  },
  {
    title: 'You Are Red',
    description:
      'You play as Red discs, and the AI plays as Yellow. Red always goes first, giving you a slight advantage!',
    image: (
      <div className="flex items-center justify-center gap-4">
        <div className="text-center">
          <DiscGraphic style="smooth" color="red" size={80} showBranding={false} />
          <div className="mt-2 text-sm font-semibold">You (Red)</div>
        </div>
        <div className="text-4xl">vs</div>
        <div className="text-center">
          <DiscGraphic style="smooth" color="yellow" size={80} showBranding={false} />
          <div className="mt-2 text-sm font-semibold">AI (Yellow)</div>
        </div>
      </div>
    ),
  },
  {
    title: 'How to Play',
    description:
      'Click on any column (1-7) to drop your disc. It will fall to the lowest available space. Then the AI takes its turn automatically.',
    tip: 'The center column (column 4) is the most strategic position!',
  },
  {
    title: 'Winning Patterns',
    description:
      'You win by getting four discs in a row. Watch out for all directions: horizontal (—), vertical (|), and both diagonal directions (/ \\).',
    tip: 'Try to create multiple threats at once. Your opponent can only block one move at a time!',
  },
  {
    title: 'Choose Your Challenge',
    description:
      "Start on Easy mode to learn the basics. When you're ready, challenge yourself with Medium or Hard difficulty. The Hard AI thinks 6 moves ahead!",
    tip: 'Easy is great for practice. Medium teaches strategy. Hard is for pros!',
  },
  {
    title: 'Ready to Play!',
    description:
      "You're all set! Remember: control the center, think ahead, and watch for your opponent's threats. Good luck, and have fun!",
    tip: 'Press "H" anytime during the game to see the full rules and strategies.',
  },
]

export function Tutorial({ open, onClose, onComplete }: TutorialProps) {
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">{step.title}</DialogTitle>
          <DialogDescription>
            Step {currentStep + 1} of {tutorialSteps.length}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-6">
          {/* Visual */}
          {step.image && <div className="py-4">{step.image}</div>}

          {/* Description */}
          <p className="text-center text-muted-foreground">{step.description}</p>

          {/* Tip */}
          {step.tip && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950">
              <div className="mb-1 text-sm font-semibold text-blue-900 dark:text-blue-100">
                💡 Tip
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-200">{step.tip}</p>
            </div>
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

        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <Button variant="ghost" onClick={handleSkip} className="sm:w-auto">
            Skip Tutorial
          </Button>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
            <Button onClick={handleNext}>{isLastStep ? "Let's Play!" : 'Next'}</Button>
          </div>
        </DialogFooter>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          Tutorial by M. Cooper • www.mcooper.com
        </div>
      </DialogContent>
    </Dialog>
  )
}
