/**
 * Design Tokens for B4K (JavaScript version for Tailwind config)
 * 
 * Monochrome color scheme - no colors, only grayscale
 */

// ============================================================================
// Color Tokens
// ============================================================================

const colors = {
  // Primary Brand Colors (Monochrome)
  primary: {
    DEFAULT: '#171717',
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  
  // Neutral Palette (replacing purple - used extensively in UI)
  purple: {
    glow: '#525252',
    bright: '#737373',
    dark: '#262626',
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  
  // Gray Palette (replacing pink - used in gradients)
  pink: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  
  // Neutral/Gray Colors
  gray: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  
  // Background Colors
  background: {
    light: '#fafafa',
    dark: '#0a0a0a',
    overlay: 'rgba(0, 0, 0, 0.5)',
    gradientStart: '#0a0a0a',
    gradientEnd: 'transparent',
  },
  
  // Text Colors
  text: {
    primary: '#171717',
    secondary: '#525252',
    light: '#fafafa',
    muted: 'rgba(0, 0, 0, 0.6)',
  },
  
  // Status Colors (keeping these for functionality)
  status: {
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  },
  
  // Semantic Colors
  semantic: {
    hover: 'rgba(23, 23, 23, 0.05)',
    active: 'rgba(23, 23, 23, 0.1)',
    border: '#e5e5e5',
    borderHover: '#d4d4d4',
  },
}

// ============================================================================
// Spacing Tokens
// ============================================================================

const spacing = {
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
}

// ============================================================================
// Typography Tokens
// ============================================================================

const typography = {
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
}

// ============================================================================
// Border Radius Tokens
// ============================================================================

const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',     // 12px
  '2xl': '1rem',    // 16px
  full: '9999px',
}

// ============================================================================
// Shadow Tokens
// ============================================================================

const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  purple: {
    sm: '0 0 10px rgba(0, 0, 0, 0.1)',
    md: '0 0 20px rgba(0, 0, 0, 0.15)',
    lg: '0 0 30px rgba(0, 0, 0, 0.2)',
  },
}

// ============================================================================
// Z-Index Tokens
// ============================================================================

const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  sidebar: 40,
  topNav: 40,
  modal: 50,
  tooltip: 60,
}

// ============================================================================
// Transition Tokens
// ============================================================================

const transitions = {
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
}

// ============================================================================
// Breakpoint Tokens (matching Tailwind defaults)
// ============================================================================

const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}

// ============================================================================
// Gradient Tokens (Monochrome)
// ============================================================================

const gradients = {
  primary: 'linear-gradient(to right, #404040, #525252)',
  primaryHover: 'linear-gradient(to right, #262626, #404040)',
  card: 'linear-gradient(to bottom right, rgba(64, 64, 64, 0.4), rgba(82, 82, 82, 0.4))',
  cardHover: 'linear-gradient(to bottom right, rgba(38, 38, 38, 0.6), rgba(64, 64, 64, 0.6))',
  overlay: 'linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.6), transparent)',
  navOverlay: 'linear-gradient(to right, rgba(10, 10, 10, 0.9), transparent)',
}

// ============================================================================
// Export all tokens as a single object
// ============================================================================

const designTokens = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  zIndex,
  transitions,
  breakpoints,
  gradients,
}

module.exports = { designTokens }
