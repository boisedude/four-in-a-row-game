// Runs before each test file: adds the DOM matchers (toBeInTheDocument and friends).
import '@testing-library/jest-dom/vitest'

// jsdom has no matchMedia; components read it for reduced motion.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
