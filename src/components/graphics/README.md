# Connect 4 Graphics Library

Custom SVG graphics for the Connect 4 game, designed by **M. Cooper** for www.mcooper.com.

All graphics feature unique branding elements including the "MC" signature mark.

## Components

### 🎮 Connect4Logo

Enhanced brand logo with MC branding

- Stylized Connect 4 board with gradient effects
- Integrated "MC" initials in design
- Red and yellow color scheme
- Scalable to any size

**Usage:**

```tsx
import { Connect4Logo } from '@/components/graphics'
;<Connect4Logo size={120} className="..." />
```

**Props:**

- `size?: number` - Logo size in pixels (default: 100)
- `className?: string` - Additional CSS classes

---

### 💿 DiscGraphic

Realistic disc graphics with multiple visual styles

- 5 visual styles: smooth, textured, gem, glossy, metallic
- 2 color variants each: red, yellow
- Subtle MC branding on disc surface
- Realistic shading and highlights

**Usage:**

```tsx
import { DiscGraphic } from '@/components/graphics'
;<DiscGraphic style="smooth" color="red" size={60} />
```

**Props:**

- `style: 'smooth' | 'textured' | 'gem' | 'glossy' | 'metallic'` - Visual style
- `color: 'red' | 'yellow'` - Disc color
- `size?: number` - Size in pixels (default: 60)
- `className?: string` - Additional CSS classes

---

### 🏆 VictoryGraphic

Animated victory trophy with MC branding

- Golden trophy with shine effects
- Rotating stars animation
- MC initials engraved on trophy base
- 60fps CSS animations

**Usage:**

```tsx
import { VictoryGraphic } from '@/components/graphics'
;<VictoryGraphic size={200} />
```

**Props:**

- `size?: number` - Graphic size (default: 150)
- `className?: string` - Additional CSS classes

---

### 😢 DefeatGraphic

Game over graphic with sad elements

- Broken disc or sad face design
- MC branding integrated
- Subtle animations

**Usage:**

```tsx
import { DefeatGraphic } from '@/components/graphics'
;<DefeatGraphic size={150} />
```

**Props:**

- `size?: number` - Graphic size (default: 150)
- `className?: string` - Additional CSS classes

---

### ✨ CelebrationBurst

Radial burst effect for special moments

- Particle burst animation
- MC signature elements
- Customizable colors
- Hardware-accelerated animations

**Usage:**

```tsx
import { CelebrationBurst } from '@/components/graphics'
;<CelebrationBurst size={300} color="gold" />
```

**Props:**

- `size?: number` - Burst size (default: 200)
- `color?: string` - Primary color (default: 'gold')
- `className?: string` - Additional CSS classes

---

### 🏅 AchievementBadge

Four-tier achievement badges with MC branding

- 4 tiers: bronze, silver, gold, platinum
- Star-shaped design with gradients
- Lock/unlock states
- MC initials on badge
- Custom icon support in center

**Usage:**

```tsx
import { AchievementBadge } from '@/components/graphics'
;<AchievementBadge tier="gold" icon="🏆" locked={false} />
```

**Props:**

- `tier: 'bronze' | 'silver' | 'gold' | 'platinum'` - Badge tier
- `icon?: string` - Center emoji/icon
- `locked?: boolean` - Lock state (default: false)
- `size?: number` - Badge size (default: 80)
- `className?: string` - Additional CSS classes

---

### 🎨 BoardPattern

Wood grain texture with MC watermark

- Subtle wood texture overlay
- MC monogram watermark (very subtle)
- Layered opacity for depth
- Enhances board visual polish

**Usage:**

```tsx
import { BoardPattern } from '@/components/graphics'
;<div className="relative">
  <BoardPattern opacity={0.1} />
  {/* Board content */}
</div>
```

**Props:**

- `opacity?: number` - Pattern opacity (default: 0.1)
- `className?: string` - Additional CSS classes

---

### 🎭 BoardCorner

Decorative corner embellishments with MC styling

- 4 positions: topLeft, topRight, bottomLeft, bottomRight
- Ornamental design with MC elements
- Matches board aesthetic

**Usage:**

```tsx
import { BoardCorner } from '@/components/graphics'
;<BoardCorner position="topLeft" />
```

**Props:**

- `position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'` - Corner position
- `size?: number` - Corner size (default: 40)
- `className?: string` - Additional CSS classes

---

## Design Philosophy

All graphics follow these principles:

1. **Scalability** - 100% SVG for infinite scaling without quality loss
2. **Performance** - <20KB total bundle size, 60fps animations
3. **Branding** - MC initials integrated throughout for unique identity
4. **Accessibility** - Proper ARIA labels, dark mode compatible
5. **Consistency** - Unified color palette and design language

## Technical Details

- **Format:** SVG with inline styling
- **Animations:** CSS-based, hardware-accelerated
- **Compatibility:** Modern browsers (Chrome, Firefox, Safari, Edge)
- **Bundle Impact:** ~15-20KB total (minified)
- **TypeScript:** Full type safety with prop interfaces
- **Dark Mode:** All graphics work in light and dark modes

## Color Palette

- **Player 1 (Red):** `#ef4444` to `#dc2626`
- **Player 2 (Yellow):** `#eab308` to `#ca8a04`
- **Board Blue:** `#2563eb` to `#1d4ed8`
- **Gold (Victory):** `#fbbf24` to `#f59e0b`
- **MC Brand:** `#1e40af` (deep blue) for signature elements

## Credits

All graphics designed and created by **M. Cooper** (www.mcooper.com) as part of the Connect 4 portfolio project.

**Version:** 1.0.0
**Last Updated:** 2025-11-04
