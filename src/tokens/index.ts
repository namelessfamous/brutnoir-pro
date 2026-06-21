// ─────────────────────────────────────────────────────────────────────────────
// brutnoir-pro · Design Tokens v0.3
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

// ── Shared structural tokens (same across themes) ────────────────────────────
const sharedTokens: Record<string, string> = {
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
