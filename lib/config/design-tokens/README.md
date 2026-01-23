# Design Tokens System

This project uses a comprehensive design token system to ensure consistent styling across all components without affecting existing styles.

## Overview

All design values (colors, spacing, typography, shadows, etc.) are centralized in design tokens, making it easy to:
- Maintain consistency across the application
- Update the design system globally
- Ensure accessibility and design standards
- Support theming in the future

## Files

- **`lib/design-tokens.ts`** - TypeScript source of truth (for type safety in components)
- **`lib/design-tokens.js`** - JavaScript version (for Tailwind config)
- **`lib/utils/tokens.ts`** - Helper utilities for programmatic access
- **`tailwind.config.js`** - Tailwind configuration using tokens
- **`app/globals.css`** - CSS variables mapped from tokens

## Usage

### In Tailwind Classes

The tokens are automatically available in Tailwind classes:

```tsx
// Colors
<div className="bg-primary text-white">
<div className="bg-purple-500 text-purple-100">
<div className="border-purple-glow">

// Spacing
<div className="p-md m-lg">
<div className="w-sidebar-collapsed">

// Typography
<p className="text-xl font-semibold">
```

### In CSS/SCSS

Use CSS variables defined in `globals.css`:

```css
.my-component {
  color: var(--primary-color);
  background: var(--background-light);
  padding: var(--spacing-md);
}
```

### In TypeScript/React Components

Import tokens directly:

```tsx
import { designTokens } from '@/lib/design-tokens'

const MyComponent = () => {
  return (
    <div style={{ 
      color: designTokens.colors.primary.DEFAULT,
      padding: designTokens.spacing.md 
    }}>
      Content
    </div>
  )
}
```

Or use helper utilities:

```tsx
import { tokens } from '@/lib/utils/tokens'

const MyComponent = () => {
  return (
    <div style={{ 
      color: tokens.primary,
      padding: tokens.sidebarCollapsed 
    }}>
      Content
    </div>
  )
}
```

## Token Categories

### Colors
- **Primary**: Brand primary color (#62256e) with full palette (50-900)
- **Purple**: Purple palette with glow, bright, dark variants
- **Pink**: Pink palette for gradients
- **Gray**: Neutral grays
- **Background**: Background colors
- **Text**: Text colors
- **Status**: Success, error, warning, info
- **Semantic**: Hover, active, border states

### Spacing
- Base spacing units (xs, sm, md, lg, xl, 2xl, 3xl)
- Component-specific spacing (sidebar, topNav, panel)

### Typography
- Font families (sans, mono)
- Font sizes (xs to 4xl)
- Font weights (normal, medium, semibold, bold)
- Line heights (tight, normal, relaxed)

### Other
- Border radius
- Shadows (including purple variants)
- Z-index layers
- Transitions (duration, easing)
- Breakpoints
- Gradients

## Migration Notes

All existing styles continue to work exactly as before. The token system:
- ✅ Preserves all current visual appearance
- ✅ Maps existing colors to tokens
- ✅ Maintains Tailwind class compatibility
- ✅ Adds CSS variables for custom styling
- ✅ Provides TypeScript types for safety

## Future Enhancements

The token system is designed to support:
- Dark mode theming
- Custom color schemes
- Responsive design tokens
- Animation tokens
- Component-specific tokens
