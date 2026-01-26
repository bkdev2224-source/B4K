const { designTokens } = require('./lib/config/design-tokens/tokens.js')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Sidebar states
    'lg:ml-[12.75%]',
    'lg:w-[calc(100%-12.75%)]',
    'lg:ml-[80px]',
    'lg:w-[calc(100%-80px)]',
    // Sidebar + Default panel (16rem)
    'lg:ml-[calc(12.75%+16rem)]',
    'lg:w-[calc(100%-12.75%-16rem)]',
    // Sidebar + Routes panel (24rem)
    'lg:ml-[calc(12.75%+24rem)]',
    'lg:w-[calc(100%-12.75%-24rem)]',
    'lg:ml-[calc(80px+24rem)]',
    'lg:w-[calc(100%-80px-24rem)]',
    // TopNav positions
    'lg:left-[12.75%]',
    'lg:left-[80px]',
    'lg:left-[calc(12.75%+16rem)]',
    'lg:left-[calc(12.75%+24rem)]',
    'lg:left-[calc(80px+24rem)]',
    'lg:right-0',
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand color
        primary: {
          DEFAULT: designTokens.colors.primary.DEFAULT,
          ...designTokens.colors.primary,
        },
        // Neutral palette (replacing purple)
        purple: {
          ...designTokens.colors.purple,
          glow: designTokens.colors.purple.glow,
          bright: designTokens.colors.purple.bright,
          dark: designTokens.colors.purple.dark,
        },
        // Gray palette (replacing pink)
        pink: designTokens.colors.pink,
        // Gray/Neutral palette
        gray: designTokens.colors.gray,
        // Background colors
        background: designTokens.colors.background,
        // Text colors
        text: designTokens.colors.text,
        // Status colors
        status: designTokens.colors.status,
        // Semantic colors
        semantic: designTokens.colors.semantic,
      },
      spacing: {
        ...designTokens.spacing,
        sidebar: designTokens.spacing.sidebar,
        topNav: designTokens.spacing.topNav,
        panel: designTokens.spacing.panel,
      },
      fontFamily: designTokens.typography.fontFamily,
      fontSize: designTokens.typography.fontSize,
      fontWeight: designTokens.typography.fontWeight,
      lineHeight: designTokens.typography.lineHeight,
      borderRadius: designTokens.borderRadius,
      boxShadow: {
        ...designTokens.shadows,
        'purple-sm': designTokens.shadows.purple.sm,
        'purple-md': designTokens.shadows.purple.md,
        'purple-lg': designTokens.shadows.purple.lg,
      },
      zIndex: designTokens.zIndex,
      transitionDuration: designTokens.transitions.duration,
      transitionTimingFunction: designTokens.transitions.easing,
    },
  },
  plugins: [],
}

