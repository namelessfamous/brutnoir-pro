// ─────────────────────────────────────────────────────────────────────────────
// brutnoir-pro · Design Tokens v0.4
// NF2 palette — monotone primary grays, vivid semantic accents
// Aesthetic direction: Windows 95 / brutalist dark UI
// ─────────────────────────────────────────────────────────────────────────────

export type ColorKey =
  | "bg" | "surface" | "border"
  | "text" | "textMuted" | "textDim"
  | "green" | "greenHover" | "greenBg"
  | "red" | "redHover" | "redBg"
  | "blue" | "blueBg"
  | "warning" | "warningHover" | "warningBg"
  | "tertiary" | "neutral"
  | "cyan" | "cyanBg"
  | "purple" | "purpleBg"
  | "orange" | "orangeBg"
  | "pink" | "pinkBg";

export type FontKey = "heading" | "mono" | "body";
export type SpaceKey = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
export type TextSizeKey = "xs" | "sm" | "base" | "md" | "lg" | "xl" | "xxl";
export type RadiusKey = "none" | "sm" | "DEFAULT" | "lg";
export type ZKey = "sidebar" | "header" | "dropdown" | "modal" | "tooltip" | "toast";

// ── Full 11-stop color scales (brand constants, same across themes) ─────────
const paletteTokens: Record<string, string> = {
  // Primary (monochrome grays)
  "--bp-primary-50":  "#FAFAFA",
  "--bp-primary-100": "#F5F5F5",
  "--bp-primary-200": "#E6E6E6",
  "--bp-primary-300": "#D3D3D3",
  "--bp-primary-400": "#A3A3A3",
  "--bp-primary-500": "#727272",
  "--bp-primary-600": "#535353",
  "--bp-primary-700": "#363636",
  "--bp-primary-800": "#272727",
  "--bp-primary-900": "#1A1A1A",
  "--bp-primary-950": "#0B0B0B",

  // Secondary (monochrome grays, light default)
  "--bp-secondary-50":  "#FAFAFA",
  "--bp-secondary-100": "#F5F5F5",
  "--bp-secondary-200": "#E6E6E6",
  "--bp-secondary-300": "#D3D3D3",
  "--bp-secondary-400": "#A3A3A3",
  "--bp-secondary-500": "#727272",
  "--bp-secondary-600": "#535353",
  "--bp-secondary-700": "#404040",
  "--bp-secondary-800": "#272727",
  "--bp-secondary-900": "#1A1A1A",
  "--bp-secondary-950": "#0B0B0B",

  // Tertiary (scarlet)
  "--bp-tertiary-50":  "#FFF3F1",
  "--bp-tertiary-100": "#FFE4DF",
  "--bp-tertiary-200": "#FFCDC4",
  "--bp-tertiary-300": "#FFAA9B",
  "--bp-tertiary-400": "#FF7961",
  "--bp-tertiary-500": "#FF4F30",
  "--bp-tertiary-600": "#F1300E",
  "--bp-tertiary-700": "#CB270A",
  "--bp-tertiary-800": "#A8230C",
  "--bp-tertiary-900": "#8A2412",
  "--bp-tertiary-950": "#4C0E03",

  // Neutral (muted purple-gray)
  "--bp-neutral-50":  "#FAFAFA",
  "--bp-neutral-100": "#F6F3F6",
  "--bp-neutral-200": "#E9E2E9",
  "--bp-neutral-300": "#DBD1DB",
  "--bp-neutral-400": "#B19AB0",
  "--bp-neutral-500": "#8C738B",
  "--bp-neutral-600": "#624B61",
  "--bp-neutral-700": "#4B3A4A",
  "--bp-neutral-800": "#2C252C",
  "--bp-neutral-900": "#1D161D",
  "--bp-neutral-950": "#0D070D",

  // Success (lime green)
  "--bp-success-50":  "#FBFFE5",
  "--bp-success-100": "#F4FFC7",
  "--bp-success-200": "#E9FF96",
  "--bp-success-300": "#D7FD59",
  "--bp-success-400": "#C2F427",
  "--bp-success-500": "#A3DA08",
  "--bp-success-600": "#7EAF01",
  "--bp-success-700": "#5F8407",
  "--bp-success-800": "#4C680C",
  "--bp-success-900": "#40580F",
  "--bp-success-950": "#203102",

  // Warning (amber)
  "--bp-warning-50":  "#FCFBEA",
  "--bp-warning-100": "#F9F6C8",
  "--bp-warning-200": "#F4EA94",
  "--bp-warning-300": "#EDD757",
  "--bp-warning-400": "#E6C329",
  "--bp-warning-500": "#E2B51D",
  "--bp-warning-600": "#B98615",
  "--bp-warning-700": "#946214",
  "--bp-warning-800": "#7B4E18",
  "--bp-warning-900": "#69411A",
  "--bp-warning-950": "#3D210B",

  // Error (scarlet, same as tertiary)
  "--bp-error-50":  "#FFF3F1",
  "--bp-error-100": "#FFE4DF",
  "--bp-error-200": "#FFCDC4",
  "--bp-error-300": "#FFAA9B",
  "--bp-error-400": "#FF7961",
  "--bp-error-500": "#FF4F30",
  "--bp-error-600": "#F1300E",
  "--bp-error-700": "#CB270A",
  "--bp-error-800": "#A8230C",
  "--bp-error-900": "#8A2412",
  "--bp-error-950": "#4C0E03",
};

// ── Shared structural tokens (same across themes) ────────────────────────────
const sharedTokens: Record<string, string> = {
  ...paletteTokens,
  // ── Spacing scale ──────────────────────────────────────────────────────────
  "--bp-space-xs":   "4px",
  "--bp-space-sm":   "8px",
  "--bp-space-md":   "12px",
  "--bp-space-lg":   "16px",
  "--bp-space-xl":   "24px",
  "--bp-space-xxl":  "32px",

  // ── Font size scale ────────────────────────────────────────────────────────
  "--bp-text-xs":    "11px",
  "--bp-text-sm":    "12px",
  "--bp-text-base":  "14px",
  "--bp-text-md":    "16px",
  "--bp-text-lg":    "18px",
  "--bp-text-xl":    "24px",
  "--bp-text-xxl":   "32px",

  // ── Border radius ──────────────────────────────────────────────────────────
  "--bp-radius-none": "0",
  "--bp-radius-sm":   "2px",
  "--bp-radius":      "4px",
  "--bp-radius-lg":   "8px",

  // ── Transitions ───────────────────────────────────────────────────────────
  "--bp-transition-fast": "0.1s ease",
  "--bp-transition":      "0.15s ease",

  // ── Z-index layers ────────────────────────────────────────────────────────
  "--bp-z-sidebar":   "100",
  "--bp-z-header":    "200",
  "--bp-z-dropdown":  "400",
  "--bp-z-modal":     "1000",
  "--bp-z-tooltip":   "2000",
  "--bp-z-toast":     "3000",

  // ── Typography stacks ─────────────────────────────────────────────────────
  "--bp-font-heading": "'obviously-variable', 'Georgia', 'Times New Roman', serif",
  "--bp-font-mono":    "'SF Mono', 'Cascadia Code', 'Fira Code', ui-monospace, monospace",
  "--bp-font-body":    "'DM Sans', 'Inter', 'Helvetica Neue', system-ui, sans-serif",
};

export const darkTheme: Record<string, string> = {
  ...sharedTokens,

  // ── Backgrounds / surfaces ────────────────────────────────────────────────
  "--bp-bg":            "#0B0B0B",    // primary-950 — near-black
  "--bp-surface":       "#1A1A1A",    // primary-900
  "--bp-border":        "#272727",    // primary-800

  // ── Typography ────────────────────────────────────────────────────────────
  "--bp-text":          "#FAFAFA",    // primary-50 — clean white
  "--bp-text-muted":    "#A3A3A3",    // primary-400
  "--bp-text-dim":      "#727272",    // primary-500

  // ── Success / primary action (lime-green) ─────────────────────────────────
  "--bp-green":         "#A3DA08",    // success-500
  "--bp-green-hover":   "#C2F427",    // success-400
  "--bp-green-bg":      "#203102",    // success-950

  // ── Error / destructive (scarlet) ─────────────────────────────────────────
  "--bp-red":           "#F1300E",    // error-600
  "--bp-red-hover":     "#FF4F30",    // error-500
  "--bp-red-bg":        "#4C0E03",    // error-950

  // ── Info (muted blue) ────────────────────────────────────────────────────
  "--bp-blue":          "#4a8fc8",
  "--bp-blue-bg":       "#061e2e",

  // ── Warning (amber) ───────────────────────────────────────────────────────
  "--bp-warning":       "#E2B51D",    // warning-500
  "--bp-warning-hover": "#E6C329",    // warning-400
  "--bp-warning-bg":    "#3D210B",    // warning-950

  // ── Tertiary / highlight ──────────────────────────────────────────────────
  "--bp-tertiary":      "#F1300E",    // tertiary-600

  // ── Neutral (muted mauve) ─────────────────────────────────────────────────
  "--bp-neutral":       "#8C738B",    // neutral-500

  // ── Cyan ──────────────────────────────────────────────────────────────────
  "--bp-cyan":          "#22D3EE",    // cyan-400
  "--bp-cyan-bg":       "#083344",    // cyan-950

  // ── Purple ────────────────────────────────────────────────────────────────
  "--bp-purple":        "#A78BFA",    // violet-400
  "--bp-purple-bg":     "#2E1065",    // violet-950

  // ── Orange ────────────────────────────────────────────────────────────────
  "--bp-orange":        "#FB923C",    // orange-400
  "--bp-orange-bg":     "#431407",    // orange-950

  // ── Pink ──────────────────────────────────────────────────────────────────
  "--bp-pink":          "#F472B6",    // pink-400
  "--bp-pink-bg":       "#500724",    // pink-950

  // ── Shadows (hard-offset brutalist) ──────────────────────────────────────
  "--bp-shadow":        "2px 2px 0 rgba(0,0,0,0.5)",
  "--bp-shadow-sm":     "1px 1px 0 rgba(0,0,0,0.5)",
  "--bp-shadow-inset":  "inset 1px 1px 2px rgba(0,0,0,0.5), inset -1px -1px 0 rgba(255,255,255,0.03)",
  "--bp-shadow-modal":  "4px 4px 0 rgba(0,0,0,0.7)",
};

export const lightTheme: Record<string, string> = {
  ...sharedTokens,

  // ── Backgrounds / surfaces ────────────────────────────────────────────────
  "--bp-bg":            "#FAFAFA",    // primary-50 — clean white
  "--bp-surface":       "#FFFFFF",
  "--bp-border":        "#D3D3D3",    // primary-300

  // ── Typography ────────────────────────────────────────────────────────────
  "--bp-text":          "#0B0B0B",    // primary-950 — near-black
  "--bp-text-muted":    "#535353",    // primary-600
  "--bp-text-dim":      "#727272",    // primary-500

  // ── Success / primary action ──────────────────────────────────────────────
  "--bp-green":         "#7EAF01",    // success-600 (darkened for light bg)
  "--bp-green-hover":   "#5F8407",    // success-700
  "--bp-green-bg":      "#FBFFE5",    // success-50

  // ── Error / destructive ───────────────────────────────────────────────────
  "--bp-red":           "#CB270A",    // error-700 (darkened for light bg)
  "--bp-red-hover":     "#A8230C",    // error-800
  "--bp-red-bg":        "#FFF3F1",    // error-50

  // ── Info ──────────────────────────────────────────────────────────────────
  "--bp-blue":          "#1c6fa0",
  "--bp-blue-bg":       "#f0f8ff",

  // ── Warning ───────────────────────────────────────────────────────────────
  "--bp-warning":       "#946214",    // warning-700 (darkened for light bg)
  "--bp-warning-hover": "#B98615",    // warning-600
  "--bp-warning-bg":    "#FCFBEA",    // warning-50

  // ── Tertiary ──────────────────────────────────────────────────────────────
  "--bp-tertiary":      "#CB270A",    // tertiary-700

  // ── Neutral ───────────────────────────────────────────────────────────────
  "--bp-neutral":       "#624B61",    // neutral-600

  // ── Cyan ──────────────────────────────────────────────────────────────────
  "--bp-cyan":          "#0891B2",    // cyan-600 (darkened for light bg)
  "--bp-cyan-bg":       "#ECFEFF",    // cyan-50

  // ── Purple ────────────────────────────────────────────────────────────────
  "--bp-purple":        "#7C3AED",    // violet-600 (darkened for light bg)
  "--bp-purple-bg":     "#F5F3FF",    // violet-50

  // ── Orange ────────────────────────────────────────────────────────────────
  "--bp-orange":        "#EA580C",    // orange-600 (darkened for light bg)
  "--bp-orange-bg":     "#FFF7ED",    // orange-50

  // ── Pink ──────────────────────────────────────────────────────────────────
  "--bp-pink":          "#DB2777",    // pink-600 (darkened for light bg)
  "--bp-pink-bg":       "#FDF2F8",    // pink-50

  // ── Shadows ───────────────────────────────────────────────────────────────
  "--bp-shadow":        "2px 2px 0 rgba(0,0,0,0.2)",
  "--bp-shadow-sm":     "1px 1px 0 rgba(0,0,0,0.2)",
  "--bp-shadow-inset":  "inset 1px 1px 2px rgba(0,0,0,0.12), inset -1px -1px 0 rgba(255,255,255,0.7)",
  "--bp-shadow-modal":  "4px 4px 0 rgba(0,0,0,0.25)",
};

export const tokens = {
  // Colors
  bg:            "var(--bp-bg)",
  surface:       "var(--bp-surface)",
  border:        "var(--bp-border)",
  text:          "var(--bp-text)",
  textMuted:     "var(--bp-text-muted)",
  textDim:       "var(--bp-text-dim)",
  green:         "var(--bp-green)",
  greenHover:    "var(--bp-green-hover)",
  greenBg:       "var(--bp-green-bg)",
  red:           "var(--bp-red)",
  redHover:      "var(--bp-red-hover)",
  redBg:         "var(--bp-red-bg)",
  blue:          "var(--bp-blue)",
  blueBg:        "var(--bp-blue-bg)",
  warning:       "var(--bp-warning)",
  warningHover:  "var(--bp-warning-hover)",
  warningBg:     "var(--bp-warning-bg)",
  tertiary:      "var(--bp-tertiary)",
  neutral:       "var(--bp-neutral)",
  cyan:          "var(--bp-cyan)",
  cyanBg:        "var(--bp-cyan-bg)",
  purple:        "var(--bp-purple)",
  purpleBg:      "var(--bp-purple-bg)",
  orange:        "var(--bp-orange)",
  orangeBg:      "var(--bp-orange-bg)",
  pink:          "var(--bp-pink)",
  pinkBg:        "var(--bp-pink-bg)",
  // Fonts
  fontHeading:   "var(--bp-font-heading)",
  fontMono:      "var(--bp-font-mono)",
  fontBody:      "var(--bp-font-body)",
  // Spacing
  spaceXs:       "var(--bp-space-xs)",
  spaceSm:       "var(--bp-space-sm)",
  spaceMd:       "var(--bp-space-md)",
  spaceLg:       "var(--bp-space-lg)",
  spaceXl:       "var(--bp-space-xl)",
  spaceXxl:      "var(--bp-space-xxl)",
  // Text sizes
  textXs:        "var(--bp-text-xs)",
  textSm:        "var(--bp-text-sm)",
  textBase:      "var(--bp-text-base)",
  textMd:        "var(--bp-text-md)",
  textLg:        "var(--bp-text-lg)",
  textXl:        "var(--bp-text-xl)",
  textXxl:       "var(--bp-text-xxl)",
  // Shadows
  shadow:        "var(--bp-shadow)",
  shadowSm:      "var(--bp-shadow-sm)",
  shadowInset:   "var(--bp-shadow-inset)",
  shadowModal:   "var(--bp-shadow-modal)",
  // Radius
  radiusNone:    "var(--bp-radius-none)",
  radiusSm:      "var(--bp-radius-sm)",
  radius:        "var(--bp-radius)",
  radiusLg:      "var(--bp-radius-lg)",
  // Transitions
  transitionFast: "var(--bp-transition-fast)",
  transition:     "var(--bp-transition)",
  // Z-index
  zSidebar:      "var(--bp-z-sidebar)",
  zHeader:       "var(--bp-z-header)",
  zDropdown:     "var(--bp-z-dropdown)",
  zModal:        "var(--bp-z-modal)",
  zTooltip:      "var(--bp-z-tooltip)",
  zToast:        "var(--bp-z-toast)",
} as const;

// ── Full 11-stop color palette (programmatic access via CSS vars) ────────────

type PaletteStop = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;
type PaletteScale = Readonly<Record<PaletteStop, string>>;

function makeScale(prefix: string): PaletteScale {
  return {
    50:  `var(--bp-${prefix}-50)`,
    100: `var(--bp-${prefix}-100)`,
    200: `var(--bp-${prefix}-200)`,
    300: `var(--bp-${prefix}-300)`,
    400: `var(--bp-${prefix}-400)`,
    500: `var(--bp-${prefix}-500)`,
    600: `var(--bp-${prefix}-600)`,
    700: `var(--bp-${prefix}-700)`,
    800: `var(--bp-${prefix}-800)`,
    900: `var(--bp-${prefix}-900)`,
    950: `var(--bp-${prefix}-950)`,
  } as const;
}

export const palette = {
  primary:   makeScale("primary"),
  secondary: makeScale("secondary"),
  tertiary:  makeScale("tertiary"),
  neutral:   makeScale("neutral"),
  success:   makeScale("success"),
  warning:   makeScale("warning"),
  error:     makeScale("error"),
} as const;
