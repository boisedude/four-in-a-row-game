# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

This is **Connect 4 - Play Coop!** - a classic strategy game with personality. Challenge Coop, an AI opponent with three hilarious difficulty levels, complete with edgy humor, rotating victory messages, and smooth animations. Built as a portfolio piece for www.mcooper.com.

### Game Features

- **"Play Coop" Theme** - Challenge Coop, your AI opponent with personality!
- **3 Difficulty Levels with Character**:
  - **😴 Sleepy Coop** (Easy): Hung over and barely functional
  - **🤓 Caffeinated Coop** (Medium): Fueled by coffee and ready to compete
  - **🐺 Bentley - The Mastermind** (Hard): Bringing everything - minimax algorithm with alpha-beta pruning (depth 6)
- **30+ Rotating Victory/Defeat Messages** - Edgy, funny messages that change every game
- **Smooth Drop Animations** - Watch discs fall into place (600ms animation with 100ms delay)
- **Sound Effects** - Web Audio API-powered sounds for disc drops, victories, and defeats
- **Leaderboard System** - Track your record vs Coop with comprehensive stats
- **Win Highlighting** - Winning four discs highlighted with animated rings
- **Column Hover Preview** - See where your disc will land
- **Keyboard Controls** - Full keyboard support for accessibility
- **Tutorial System** - First-time player walkthrough
- **Custom SVG Graphics** - Hand-crafted Connect 4 logo and achievement badges
- **Local Persistence** - Stats and game state saved with validation
- **Responsive UI** - Beautiful blue board with red and yellow discs

### Technology Stack

- **React 19** with TypeScript - Latest React features with strict mode compliance
- **Vite 5** - Lightning-fast build tool and dev server
- **Tailwind CSS + shadcn/ui** - Beautiful, accessible components
- **React Router 7** - Client-side routing (HashRouter)
- **Web Audio API** - Dynamic sound effects
- **Error Boundaries** - Graceful error handling

## Common Development Commands

### Development

```bash
npm install --no-bin-links           # Install dependencies (required for WSL)
npm run dev                          # Start development server on http://localhost:3001
npm run build                        # Build for production
npm run preview                      # Preview production build
```

### Code Quality

```bash
npm run lint                         # Run ESLint
npm run lint:fix                     # Auto-fix issues
npm run format                       # Format with Prettier
npm run type-check                   # Run TypeScript compiler
```

## Project Structure

```
connect4/
├── src/
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components (button, card, dialog, select)
│   │   ├── graphics/               # Custom SVG graphics
│   │   │   ├── Connect4Logo.tsx        # Brand logo
│   │   │   ├── AchievementBadge.tsx    # Achievement badges
│   │   │   └── DiscGraphic.tsx         # Disc variants
│   │   ├── Board.tsx               # Main game board with hover effects
│   │   ├── Column.tsx              # Clickable column component
│   │   ├── Cell.tsx                # Individual cell with disc
│   │   ├── Disc.tsx                # Animated disc component (red/yellow)
│   │   ├── GameControls.tsx        # Coop difficulty selector and controls
│   │   ├── VictoryDialog.tsx       # End game dialog with rotating messages
│   │   ├── LeaderboardDialog.tsx   # "Your Record vs Coop" stats
│   │   ├── AudioControls.tsx       # Sound toggle
│   │   ├── Tutorial.tsx            # First-time player tutorial
│   │   └── HowToPlayDialog.tsx     # Game rules
│   ├── pages/
│   │   └── Connect4Game.tsx        # Main game page with "Play Coop" branding
│   ├── hooks/
│   │   ├── useConnect4Game.ts      # Game state management (with animation cleanup)
│   │   ├── useLeaderboard.ts       # Stats management (with localStorage validation)
│   │   └── useGameAudio.ts         # Web Audio API sound effects
│   ├── lib/
│   │   ├── connect4Rules.ts        # Game rules engine (debug code guarded)
│   │   ├── aiStrategies.ts         # AI algorithms for all Coop levels
│   │   └── utils.ts                # Utility functions
│   ├── types/
│   │   └── connect4.types.ts       # TypeScript types for game state
│   ├── App.tsx                     # Main app with routing and error boundary
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Global styles with disc-drop animation
├── index.html                      # HTML entry point
├── vite.config.ts                  # Vite configuration (port 3001, HashRouter base)
├── tailwind.config.js              # Tailwind CSS configuration
└── package.json                    # Dependencies and scripts
```

## Architecture & Conventions

### Game Architecture

#### Game State Management (`useConnect4Game` hook)

- Manages complete game state (board, current player, status, winner, difficulty)
- Handles move validation and execution with drop animation
- **Animation System** (Fixed):
  - 600ms disc drop animation with 100ms state update delay
  - Proper timeout cleanup to prevent memory leaks
  - Uses `animationTimeoutRef` for tracking
  - Cancels animations on game reset
- **AI Move Scheduling**:
  - Triggers Coop's moves automatically when it's his turn (500ms delay)
  - Debounced to prevent duplicate AI moves
  - Proper cleanup in unmount and game reset
- Provides game controls (start, reset, difficulty change)

#### Game Rules Engine (`connect4Rules.ts`)

- **Board layout**: 7 columns x 6 rows
- **Move execution**: Drop disc to lowest available row
  - `executeMove()` - Instant move execution
  - `makeMove()` - Complete game state update
- **Win detection**: Four in a row (horizontal, vertical, diagonal)
  - `checkWinner()` - Returns winner and winning cells
- **Draw condition**: Board is full with no winner
- **Move simulation**: `simulateMove()` for Coop's AI lookahead
- **Debug function**: `printBoard()` guarded with `import.meta.env.DEV` check

#### AI Strategies - "Coop's Brain" (`aiStrategies.ts`)

Each difficulty level represents a different version of Coop:

- **😴 Sleepy Coop (Easy)**: Random move selection
  - "Hung over and can barely think straight"
  - Perfect for beginners or confidence building

- **🤓 Caffeinated Coop (Medium)**: Greedy algorithm
  - Win immediately (+∞ priority)
  - Block opponent win (high priority)
  - Prefer center columns (tactical advantage)
  - "Coffee-powered tactical thinking"

- **🐺 Bentley - The Mastermind (Hard)**: Minimax with alpha-beta pruning
  - Search depth: 6 levels
  - Evaluation: Pattern scoring + center preference
  - Move ordering for better pruning (center-first)
  - "Bringing the full analytical power"

#### Victory/Defeat System (`VictoryDialog.tsx`)

- **30+ Rotating Messages**: Random selection from message pools
- **Difficulty-Specific Humor**:
  - Sleepy Coop: Hung over jokes, embarrassment for losing
  - Caffeinated Coop: Coffee references, moderate roasting
  - Bentley - The Mastermind: Epic celebrations, savage roasts
- **Edgy Tone**: Self-aware, playful trash talk
- Messages rotate to prevent repetition

#### Leaderboard System (`useLeaderboard` hook)

- Tracks player stats vs Coop in localStorage
- **Comprehensive Validation** (Security Fix):
  - Type guards prevent corrupted data crashes
  - Validates all fields before loading
  - Automatic cleanup of invalid data
- Metrics: wins, losses, draws, win streak, longest streak, fastest win
- Persistent across sessions

#### Audio System (`useGameAudio` hook)

- **Web Audio API** for dynamic sound generation
- Sound effects:
  - Disc drop (bouncy thump)
  - Victory (triumphant fanfare)
  - Defeat (sad trombone)
  - Draw (neutral chime)
  - Click/hover (UI feedback)
- Mute toggle with localStorage persistence
- Type-safe webkit browser support

### Component Organization

- **Pages**: Page components in `src/pages/`
- **Components**: Reusable components in `src/components/`
- **UI Components**: shadcn/ui components in `src/components/ui/`
- **Graphics**: Custom SVG components in `src/components/graphics/`
- **Hooks**: Custom hooks in `src/hooks/`
- **Game Logic**: Game rules and AI in `src/lib/`
- **Type Definitions**: TypeScript types in `src/types/`
- Use `@/` path alias for imports: `import { cn } from '@/lib/utils'`

### Styling

- Tailwind CSS utility classes
- shadcn/ui components for UI elements
- Custom animations in `index.css`:
  - `disc-drop` - Disc falling animation (600ms ease-in)
- Color scheme:
  - Player 1: Red (`bg-gradient-to-br from-red-500 to-red-600`)
  - Coop (Player 2): Yellow (`bg-gradient-to-br from-yellow-400 to-yellow-500`)
  - Board: Blue (`bg-gradient-to-b from-blue-500 to-blue-600`)
- Responsive design with mobile support

## Game Implementation Details

### How Connect 4 Works

**Objective**: Connect four of your discs in a row before Coop does

**Setup**:

- 7 columns x 6 rows grid
- Two players: You (Red) vs Coop (Yellow)
- Empty board at start

**Gameplay**:

1. Click a column to drop your disc (or use number keys 1-7)
2. Disc falls to the lowest available position
3. Players alternate turns
4. **Win condition**: Four discs in a row (horizontal, vertical, or diagonal)
5. **Draw condition**: Board is full with no winner

**Winning Patterns**:

- Horizontal: ●●●● (row)
- Vertical: ●●●● (column)
- Diagonal: ●●●● (both directions)

### Code Organization

- **Separation of Concerns**: Game logic separate from UI
- **Type Safety**: Full TypeScript coverage with strict mode
- **Immutability**: Game state updates use immutable patterns
- **Performance**: Minimax depth limited to 6 for responsive AI
- **React 19 Compliance**: Pure render functions, proper hook dependencies
- **Security**: localStorage validation, no XSS vulnerabilities
- **Extensibility**: Easy to add new Coop personalities or features

## Code Quality & Best Practices

### Recent Improvements (Production-Ready)

**Critical Fixes**:

- ✅ **React 19 Compliance**: Replaced `Math.random()` with `useId()` in SVG components
- ✅ **useEffect Dependencies**: Fixed stale closures in AI move scheduling
- ✅ **Memory Leak Prevention**: Proper timeout cleanup in animations and AI moves
- ✅ **localStorage Validation**: Type guards prevent crashes from corrupted data
- ✅ **Type Safety**: No `any` types, proper webkit AudioContext typing

**Quality Score**: 8.2/10 (A-) - Production Ready

### TypeScript Configuration

- Strict mode enabled for maximum type safety
- Path aliases configured: `@/*` maps to `./src/*`
- React 19 JSX transform
- Module resolution: "bundler" for Vite compatibility

### Testing Strategy

- Type checking with `npm run type-check`
- ESLint 9 with React hooks plugin
- Prettier for code formatting
- Production build test before deployment

## Important Notes for WSL + Windows Filesystem

This project includes workarounds for WSL development:

1. **Always use `--no-bin-links`** when running `npm install`
2. **Scripts run through node_modules** or **npm scripts**
3. **Port 3001** used to avoid conflicts with other projects

## Deployment

Build for production and deploy the `dist/` folder to www.mcooper.com:

```bash
npm run build               # Creates optimized production build
# Deploy dist/ folder to web server
```

**Build Output**:

- Single-page application (SPA)
- HashRouter for client-side routing
- No backend required - all game logic runs client-side
- Gzipped bundle: ~125KB

**SEO & Meta**:

- Title: "Connect 4 - Play Coop!"
- Description: "Challenge Coop in Connect 4! Choose your opponent's difficulty: Sleepy Coop, Caffeinated Coop, or Bentley - The Mastermind. Can you beat him?"
- Designed by M. Cooper for www.mcooper.com

## Portfolio Highlights

This project demonstrates:

- **Personality-Driven UX**: "Coop" branding creates memorable experience
- **Sophisticated AI**: Minimax with alpha-beta pruning
- **React 19 Best Practices**: Pure renders, proper hooks, cleanup
- **Type Safety**: Full TypeScript with guards and validation
- **Performance**: Optimized animations, efficient AI (60fps)
- **Security**: Input validation, XSS prevention, safe localStorage
- **Accessibility**: Keyboard controls, ARIA labels, reduced motion support
- **Audio Engineering**: Web Audio API for dynamic sound generation
- **Code Quality**: ESLint 9, Prettier, zero TypeScript errors
- **User Engagement**: Rotating messages, humor, personality

## Technology Versions

- React: 19.2.0
- TypeScript: 5.7.3
- Vite: 5.4.21
- Tailwind CSS: 3.4.18
- React Router: 7.2.0
- shadcn/ui: Latest via CLI

All dependencies are set to stable versions as of January 2025.

## Branding & Theming

**Tagline**: "Play Coop • Can you beat Coop?"

**Coop's Personality Levels**:

1. 😴 Sleepy Coop - "I'm hung over"
2. 🤓 Caffeinated Coop - "Coffee powered"
3. 🐺 Bentley - The Mastermind - "Bringing everything"

**Message Themes**:

- Self-aware humor about AI difficulty
- Edgy but playful trash talk
- Celebrates player skill appropriately
- Roasts losses with humor, not cruelty
- Makes the AI feel like a character, not just code

This creates an engaging, memorable gaming experience that showcases both technical skill and creative design.
