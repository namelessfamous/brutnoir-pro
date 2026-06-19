export type ColorKey =
  | "bg" | "surface" | "border"
  | "text" | "textMuted" | "textDim"
  | "green" | "greenHover" | "greenBg"
  | "red" | "redHover" | "redBg"
  | "blue" | "blueBg"
  | "warning" | "warningHover" | "warningBg"
  | "tertiary" | "neutral";

export type FontKey = "heading" | "mono";

// NF2 palette — monotone primary grays, vivid semantic accents
// Primary: pure neutral grays (#0B0B0B → #FAFAFA)
// Success: lime-green (#A3DA08)  Warning: amber (#E2B51D)
// Error/Tertiary: scarlet (#F1300E)  Neutral: muted mauve (#8C738B)

export const darkTheme: Record<string, string> = {
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

  // ── Info (muted blue — kept from prior palette) ────────────────────────────
  "--bp-blue":          "#4a8fc8",
  "--bp-blue-bg":       "#061e2e",

  // ── Warning (amber) ───────────────────────────────────────────────────────
  "--bp-warning":       "#E2B51D",    // warning-500
  "--bp-warning-hover": "#E6C329",    // warning-400
  "--bp-warning-bg":    "#3D210B",    // warning-950

  // ── Tertiary / highlight (scarlet, same as error) ─────────────────────────
  "--bp-tertiary":      "#F1300E",    // tertiary-600

  // ── Neutral (muted mauve) ─────────────────────────────────────────────────
  "--bp-neutral":       "#8C738B",    // neutral-500

  // ── Typography stacks ─────────────────────────────────────────────────────
  "--bp-font-heading":  "'obviously-variable', 'Georgia', 'Times New Roman', serif",
  "--bp-font-mono":     "'SF Mono', 'Cascadia Code', 'Fira Code', ui-monospace, monospace",
};

export const lightTheme: Record<string, string> = {
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

  // ── Typography stacks ─────────────────────────────────────────────────────
  "--bp-font-heading":  "'obviously-variable', 'Georgia', 'Times New Roman', serif",
  "--bp-font-mono":     "'SF Mono', 'Cascadia Code', 'Fira Code', ui-monospace, monospace",
};

export const tokens = {
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
  fontHeading:   "var(--bp-font-heading)",
  fontMono:      "var(--bp-font-mono)",
} as const;
