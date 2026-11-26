# Four in a Row - Play Coop!

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![React](https://img.shields.io/badge/React-19-blue)

A browser-based Four in a Row game featuring AI opponents with personality-driven difficulty levels. Challenge Coop and his alter ego Bentley in this classic strategy game with a modern twist!

![Screenshot](screenshot.png)

---

## About

Four in a Row is a classic strategy game where you compete against Coop, an AI opponent with three distinct personalities. Each difficulty level brings unique character and challenge, from Bella, who plays at random, to Bentley, who solves the endgame exactly.

Created by M. Cooper for [www.mcooper.com](https://www.mcooper.com)

---

## Features

### Three AI Difficulty Levels with Personality

- **Bella (Easy)** - Random moves, perfect for beginners
- **Coop (Medium)** - Searches 6 moves ahead, with a little randomness among near-equal moves
- **Bentley (Hard)** - Bitboard engine in a Web Worker: deep alpha-beta search early, exact solving of the endgame

### Engaging User Experience

- 30+ rotating victory/defeat messages with edgy humor
- Smooth disc drop animations (600ms with physics-inspired motion)
- Web Audio API-powered sound effects
- Comprehensive stats tracking and leaderboard
- Animated win highlighting
- Column hover preview showing where your disc will land

### Full Accessibility

- Keyboard controls (1-7 for columns, N for new game, M to mute)
- ARIA labels throughout
- Reduced motion support
- Responsive design for desktop, tablet, and mobile

### Quality Features

- Zero backend required - all game logic runs client-side
- First-time player tutorial
- Local stats persistence with validation
- Custom SVG graphics and branding

---

## Tech Stack

Built with modern web technologies:

- **[React 19](https://react.dev/)** - Latest React features with strict mode compliance
- **[TypeScript 5.7](https://www.typescriptlang.org/)** - Full type safety throughout
- **[Vite 5](https://vitejs.dev/)** - Lightning-fast development and builds
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful, accessible component library
- **[React Router 7](https://reactrouter.com/)** - Client-side routing
- **[Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)** - Dynamic sound generation

---

## Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/four-in-a-row.git
cd four-in-a-row

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit **http://localhost:3001** to play!

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` folder.

---

## How to Play

**Objective:** Connect four of your discs in a row before Coop does!

### Controls

- **Mouse**: Click any column to drop your disc (Red)
- **Keyboard**:
  - Press `1-7` to drop disc in columns 1-7
  - `M` - Toggle mute/unmute sounds
  - `N` - Start new game
  - `H` - Show help
  - `L` - View leaderboard

### Win Conditions

Connect four of your discs in any direction:
- **Horizontal**: Four discs across a row
- **Vertical**: Four discs down a column
- **Diagonal**: Four discs in either diagonal direction

---

## AI Difficulty Levels

### Bella (Easy)

Random move selection makes Bella unpredictable but beatable. Great for learning the game or building confidence.

### Coop (Medium)

Coop searches 6 moves ahead with the same engine as Bentley and picks at random among moves that score about the same, so he sees tactics but drifts strategically.

### Bentley (Hard)

Bentley's engine (`src/lib/engine.ts`) runs in a Web Worker with about 700 ms per move. Early on it searches deep with alpha-beta and an evaluation built on open threats and their row parity; once enough discs are down it solves the position exactly and plays perfectly from there. You move first, and the first player wins with perfect play, so he can be beaten, but he punishes mistakes.

---

## Project Structure

```
four-in-a-row/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui component library
│   │   ├── graphics/       # Custom SVG graphics
│   │   ├── Board.tsx       # Main game board with hover effects
│   │   ├── VictoryDialog.tsx   # End game dialog with rotating messages
│   │   └── GameControls.tsx    # Difficulty selector and controls
│   ├── hooks/              # Custom React hooks
│   │   ├── useConnect4Game.ts  # Game state management
│   │   ├── useLeaderboard.ts   # Stats tracking
│   │   └── useGameAudio.ts     # Web Audio API integration
│   ├── lib/                # Game logic
│   │   ├── connect4Rules.ts    # Game rules engine
│   │   └── aiStrategies.ts     # Opponents (Bella, Coop, Bentley); engine.ts is the search
│   ├── types/              # TypeScript type definitions
│   ├── pages/              # Page components
│   └── App.tsx             # Main application with routing
├── dist/                   # Production build output
└── package.json            # Dependencies and scripts
```

---

## Development

### Available Commands

```bash
npm run dev          # Start development server (http://localhost:3001)
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # TypeScript validation
npm run lint         # ESLint check
npm run lint:fix     # Auto-fix lint issues
npm run format       # Format code with Prettier
```

---

## Deployment

The game is a static single-page application with no backend requirements. Simply upload the `dist/` folder to any web server or hosting service:

- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Traditional web hosting

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines

- Follow the existing code style (Prettier + ESLint)
- Maintain TypeScript strict mode compliance
- Add appropriate comments for complex logic
- Test all changes thoroughly

---

## License

MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2025 M. Cooper

---

## Credits

**Created by:** M. Cooper for [www.mcooper.com](https://www.mcooper.com)

**Character Names:** Coop and Bentley are named after the creator's dogs!

---

**Can you beat Bentley?** 🐺

Made with ❤️ by M. Cooper | [www.mcooper.com](https://www.mcooper.com)
