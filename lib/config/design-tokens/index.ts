/**
 * Design Tokens for B4K
 * 
 * This file contains all design tokens (colors, spacing, typography, etc.)
 * that are used throughout the application. These tokens ensure consistency
 * and make it easy to update the design system without affecting functionality.
 */

// ============================================================================
// Color Tokens
// ============================================================================

export const colors = {
  // Primary Brand Colors
  primary: {
    DEFAULT: '#62256e',
    50: '#f5f3f7',
    100: '#e9e3ed',
    200: '#d3c7db',
    300: '#b8a3c4',
    400: '#9d7fad',
    500: '#62256e', // Main primary color
    600: '#4d1d57',
    700: '#3a1641',
    800: '#2a0f2f',
    900: '#1a091d',
  },
  
  // Purple Palette (used extensively in UI)
  purple: {
    glow: '#a855f7',
    bright: '#c084fc',
    dark: '#6b21a8',
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
  },
  
  // Pink Palette (used in gradients)
  pink: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#ec4899',
    600: '#db2777',
    700: '#be185d',
    800: '#9f1239',
    900: '#831843',
  },
  
  // Neutral/Gray Colors
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // Background Colors
  background: {
    light: '#ffffff',
    dark: '#1a1a2e',
    overlay: 'rgba(0, 0, 0, 0.5)',
    gradientStart: '#0a0a0f',
    gradientEnd: 'transparent',
  },
  
  // Text Colors
  text: {
    primary: '#1a1a2e',
    secondary: '#6b7280',
    light: '#ffffff',
    muted: 'rgba(255, 255, 255, 0.7)',
  },
  
  // Status Colors
  status: {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  },
  
  // Semantic Colors
  semantic: {
    hover: 'rgba(98, 37, 110, 0.1)',
    active: 'rgba(98, 37, 110, 0.15)',
    border: '#e5e7eb',
    borderHover: '#d1d5db',
  },
} as const

// ============================================================================
// Spacing Tokens
// ============================================================================

export const spacing = {
  // Base spacing unit (4px)
  base: 4,
  
  // Common spacing values
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
  
  // Component-specific spacing
  sidebar: {
    collapsed: '80px',
    expanded: '12.75%',
    padding: {
      collapsed: '1rem',
      expanded: '1.5rem',
    },
  },
  
  topNav: {
    height: '4rem', // 64px
    padding: '1.5rem',
  },
  
  panel: {
    default: '16rem',  // 256px
    routes: '24rem',    // 384px
  },
} as const

// ============================================================================
// Typography Tokens
// ============================================================================

export const typography = {
  fontFamily: {
    sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    mono: ['Menlo', 'Monaco', 'Courier New', 'monospace'],
  },
  
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
  },
  
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const

// ============================================================================
// Border Radius Tokens
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',     // 12px
  '2xl': '1rem',    // 16px
  full: '9999px',
} as const

// ============================================================================
// Shadow Tokens
// ============================================================================

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  purple: {
    sm: '0 0 10px rgba(168, 85, 247, 0.2)',
    md: '0 0 20px rgba(168, 85, 247, 0.3)',
    lg: '0 0 30px rgba(168, 85, 247, 0.4)',
  },
} as const

// ============================================================================
// Z-Index Tokens
// ============================================================================

export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  sidebar: 40,
  topNav: 40,
  modal: 50,
  tooltip: 60,
} as const

// ============================================================================
// Transition Tokens
// ============================================================================

export const transitions = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
  },
  easing: {
    default: 'ease-in-out',
    easeOut: 'ease-out',
    easeIn: 'ease-in',
  },
} as const

// ============================================================================
// Breakpoint Tokens (matching Tailwind defaults)
// ============================================================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// ============================================================================
// Gradient Tokens
// ============================================================================

export const gradients = {
  primary: 'linear-gradient(to right, #9333ea, #ec4899)', // purple-600 to pink-500
  primaryHover: 'linear-gradient(to right, #7e22ce, #db2777)', // purple-700 to pink-600
  card: 'linear-gradient(to bottom right, rgba(107, 33, 168, 0.4), rgba(219, 39, 119, 0.4))',
  cardHover: 'linear-gradient(to bottom right, rgba(126, 34, 206, 0.6), rgba(190, 24, 93, 0.6))',
  overlay: 'linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.6), transparent)',
  navOverlay: 'linear-gradient(to right, rgba(10, 10, 15, 0.9), transparent)',
} as const

// ============================================================================
// Export all tokens as a single object
// ============================================================================

export const designTokens = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  zIndex,
  transitions,
  breakpoints,
  gradients,
} as const

// ============================================================================
// Type exports for TypeScript
// ============================================================================

export type ColorToken = typeof colors
export type SpacingToken = typeof spacing
export type TypographyToken = typeof typography
