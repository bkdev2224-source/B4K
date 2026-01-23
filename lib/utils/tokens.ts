/**
 * Design Token Utilities
 * 
 * Helper functions to access design tokens programmatically in components
 */

import { designTokens } from '../config/design-tokens'

/**
 * Get a color value from the design tokens
 */
export function getColor(path: string): string {
  const parts = path.split('.')
  let value: any = designTokens.colors
  
  for (const part of parts) {
    value = value[part]
    if (value === undefined) {
      throw new Error(`Color token not found: ${path}`)
    }
  }
  
  return value as string
}

/**
 * Get a spacing value from the design tokens
 */
export function getSpacing(path: string): string {
  const parts = path.split('.')
  let value: any = designTokens.spacing
  
  for (const part of parts) {
    value = value[part]
    if (value === undefined) {
      throw new Error(`Spacing token not found: ${path}`)
    }
  }
  
  return value as string
}

/**
 * Get a CSS variable name for a token
 */
export function getCSSVariable(tokenPath: string): string {
  // Convert token path to CSS variable name
  // e.g., "primary.DEFAULT" -> "--primary-color"
  // e.g., "purple.glow" -> "--purple-glow"
  const parts = tokenPath.split('.')
  
  if (parts.length === 1) {
    return `--${parts[0].replace(/([A-Z])/g, '-$1').toLowerCase()}`
  }
  
  if (parts[1] === 'DEFAULT') {
    return `--${parts[0]}-color`
  }
  
  return `--${parts.join('-').replace(/([A-Z])/g, '-$1').toLowerCase()}`
}

/**
 * Get a CSS variable value
 */
export function getCSSVariableValue(tokenPath: string): string {
  return `var(${getCSSVariable(tokenPath)})`
}

/**
 * Export commonly used token getters
 */
export const tokens = {
  // Colors
  primary: designTokens.colors.primary.DEFAULT,
  purpleGlow: designTokens.colors.purple.glow,
  purpleBright: designTokens.colors.purple.bright,
  purpleDark: designTokens.colors.purple.dark,
  
  // Spacing
  sidebarCollapsed: designTokens.spacing.sidebar.collapsed,
  sidebarExpanded: designTokens.spacing.sidebar.expanded,
  panelDefault: designTokens.spacing.panel.default,
  panelRoutes: designTokens.spacing.panel.routes,
  topNavHeight: designTokens.spacing.topNav.height,
  
  // Shadows
  shadowPurpleSm: designTokens.shadows.purple.sm,
  shadowPurpleMd: designTokens.shadows.purple.md,
  shadowPurpleLg: designTokens.shadows.purple.lg,
  
  // Transitions
  transitionFast: designTokens.transitions.duration.fast,
  transitionNormal: designTokens.transitions.duration.normal,
  transitionSlow: designTokens.transitions.duration.slow,
}
