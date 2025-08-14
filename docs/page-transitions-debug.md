# Page Transitions & Debug System

This document covers the advanced UI features implemented in Helixium, including smooth page transitions and a comprehensive debug system for development.

## Overview

The page transitions and debug system provides:

- **Smooth page transitions** using Framer Motion
- **Drawer-style debug panel** for development tools
- **Type-safe animation controls** with enum-like constants
- **Modular architecture** for easy extension

## Page Transitions

### Implementation

Page transitions are implemented using Framer Motion with a simple fade effect:

```tsx
// src/components/PageTransition.tsx
<motion.div
  key={location.pathname}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={pageTransition}
>
  {children}
</motion.div>
```

### Features

- **Simple fade transitions** - Clean, professional appearance
- **Key-based animation** - React unmounts/remounts trigger animations
- **Configurable speed** - Three speed options via debug panel
- **No layout shifts** - Maintains consistent positioning

### Animation Speeds

```typescript
export const AnimationSpeed = {
  SLOWER: "slower", // 1.5s duration
  SLOW: "slow", // 0.8s duration
  NORMAL: "normal", // 0.3s duration
} as const;
```

## Debug System Architecture

### Folder Structure

```
src/features/debug/
├── index.tsx                    # Main debug container (drawer)
├── types.ts                     # Shared debug types
└── components/
    └── AnimationSpeedControl/
        ├── index.tsx           # Animation speed component
        └── types.ts            # Component-specific types
```

### Design Principles

- **Feature-based organization** - Debug system as a feature, not a generic component
- **Modular components** - Each debug tool in its own folder
- **Type safety** - Full TypeScript support with enum-like constants
- **Scalable architecture** - Easy to add new debug components

## Debug Container

### Drawer Design

The debug panel uses a drawer-style interface:

- **Hidden by default** - Doesn't interfere with normal usage
- **Toggle button** - Always visible on left edge of screen
- **60% height** - Centered vertically, preserves navbar visibility
- **Smooth animations** - Slides in/out with Framer Motion

### Implementation

```tsx
// src/features/debug/index.tsx
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ duration: 0.3 }}
    >
      {/* Debug panel content */}
    </motion.div>
  )}
</AnimatePresence>
```

### Features

- **Edge-connected** - No gaps or offsets from browser edge
- **Rounded corners** - Professional appearance
- **Scrollable content** - Handles overflow gracefully
- **High z-index** - Appears above other content

## Animation Speed Control

### Component Features

- **Collapsible interface** - Can be expanded/collapsed
- **Visual indicators** - Border highlights for active state
- **Type-safe controls** - Uses enum-like constants
- **Real-time updates** - Changes apply immediately

### Type Safety

```typescript
// No magic strings - uses constants
speed === AnimationSpeed.NORMAL
onClick={() => handleSpeedChange(AnimationSpeed.SLOWER)}
```

### Visual Design

- **Active state** - Thick blue border for selected speed
- **Inactive state** - Thin gray border for unselected speeds
- **Hover effects** - Subtle interaction feedback
- **Compact layout** - Efficient use of space

## Technical Implementation

### State Management

```tsx
// Centralized state in PageTransition
const [animationSpeed, setAnimationSpeed] = useState<AnimationSpeedType>(
  AnimationSpeed.NORMAL
);

// Passed to debug container
<DebugContainer onAnimationSpeedChange={setAnimationSpeed}>
```

### Type Definitions

```typescript
// Enum-like constants
export const AnimationSpeed = {
  SLOWER: "slower",
  SLOW: "slow",
  NORMAL: "normal",
} as const;

// Derived type
export type AnimationSpeed =
  (typeof AnimationSpeed)[keyof typeof AnimationSpeed];
```

### Transition Configuration

```typescript
const getTransition = (speed: AnimationSpeedType): Transition => {
  const durations = {
    [AnimationSpeed.SLOWER]: 1.5,
    [AnimationSpeed.SLOW]: 0.8,
    [AnimationSpeed.NORMAL]: 0.3,
  };

  return {
    type: "tween",
    ease: "easeInOut",
    duration: durations[speed],
  };
};
```

## Usage

### Development Workflow

1. **Access debug panel** - Click toggle button on left edge
2. **Adjust animation speed** - Use speed controls in drawer
3. **Test transitions** - Navigate between routes to see effects
4. **Collapse when done** - Hide panel to focus on development

### Adding New Debug Components

1. **Create component folder** - `src/features/debug/components/NewComponent/`
2. **Add component files** - `index.tsx` and `types.ts`
3. **Update shared types** - Add to `src/features/debug/types.ts`
4. **Include in container** - Add to debug drawer

### Example: Adding a Theme Switcher

```tsx
// src/features/debug/components/ThemeSwitcher/index.tsx
export default function ThemeSwitcher() {
  return (
    <Box>
      <Text>Theme Switcher</Text>
      {/* Theme controls */}
    </Box>
  );
}

// Add to debug container
<DebugContainer onAnimationSpeedChange={setAnimationSpeed}>
  <ThemeSwitcher />
</DebugContainer>;
```

## Benefits

### Developer Experience

- **Visual feedback** - See animation effects in real-time
- **Easy testing** - Quickly adjust and test different speeds
- **Non-intrusive** - Doesn't interfere with normal development
- **Professional feel** - Polished, integrated appearance

### Code Quality

- **Type safety** - No magic strings, compile-time validation
- **Modular design** - Easy to maintain and extend
- **Consistent patterns** - Follows established architecture
- **Scalable** - Ready for additional debug tools

### Performance

- **Efficient animations** - Optimized Framer Motion usage
- **Minimal overhead** - Debug panel only renders when needed
- **Smooth transitions** - Hardware-accelerated animations
- **Responsive design** - Works on all screen sizes

## Future Enhancements

### Potential Debug Components

- **Performance metrics** - Render times, bundle sizes
- **State inspector** - Jotai atom values and changes
- **Network monitoring** - API calls and response times
- **Error tracking** - Real-time error reporting
- **Feature flags** - Toggle experimental features

### Advanced Features

- **Keyboard shortcuts** - Quick access to debug panel
- **Persistent settings** - Remember user preferences
- **Export/import** - Share debug configurations
- **Custom animations** - User-defined transition effects

## Related Documentation

- [Project Setup](project-setup.md) - Initial setup and configuration
- [Development Workflow](development-workflow.md) - Development practices
- [Jotai State Management](jotai-state-management.md) - State management patterns

---

_This documentation covers the page transitions and debug system implemented in Helixium. For questions or suggestions, please create an issue or discussion on GitHub._
