/**
 * brutnoir-os · Design Tokens
 * Nameless Famous · Neobrutal Noir Design System
 */

export const colors = {
  // Noir scale
  noir: "#0a0a0b",
  noirLight: "#111114",
  noirMid: "#1a1a1f",
  noirSurface: "#22222a",
  noirBorder: "#333340",
  noirBorderLight: "#44445a",

  // Cream scale
  cream: "#f5f0e8",
  creamDim: "#d4cfc6",
  creamMuted: "#8a8577",

  // Brand accents
  acid: "#c8f53c",
  acidDim: "#9ab82d",
  crimson: "#e8233a",
  amber: "#f5a623",
  ice: "#7eb8d4",
} as const;

export const fonts = {
  mono: "'DM Mono', 'Courier New', monospace",
  display: "'DM Serif Display', 'Georgia', serif",
  sans: "'DM Sans', 'Helvetica Neue', sans-serif",
} as const;

export const radii = {
  none: "0px",
  sm: "2px",
} as const;

export const shadows = {
  // Canonical names
  default: `3px 3px 0px ${colors.acid}`,
  sm: `2px 2px 0px ${colors.acid}`,
  dark: `3px 3px 0px #000`,
  inset: "inset 2px 2px 0px rgba(0,0,0,0.5)",
  modal: `6px 6px 0px ${colors.acid}`,
  // Aliases used by components
  shadow: `3px 3px 0px ${colors.acid}`,
  shadowSm: `2px 2px 0px ${colors.acid}`,
  shadowDark: `3px 3px 0px #000`,
} as const;

export const tokens = {
  colors,
  fonts,
  radii,
  shadows,
} as const;

export type ColorKey = keyof typeof colors;
export type FontKey = keyof typeof fonts;

export default tokens;
