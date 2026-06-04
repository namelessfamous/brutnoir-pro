export type ColorKey =
  | "bg" | "surface" | "border"
  | "text" | "textMuted" | "textDim"
  | "green" | "greenHover" | "greenBg"
  | "red" | "redHover" | "redBg"
  | "blue" | "blueBg";

export type FontKey = "heading" | "mono";

// NF1 palette — Blue Smoke neutrals base, Scarlet error, Inch Worm success, Galliano warning
export const darkTheme: Record<string, string> = {
  "--bp-bg": "#031212",         // Blue Smoke 950 — deep teal-black
  "--bp-surface": "#112726",    // Blue Smoke 900
  "--bp-border": "#1f3734",     // Blue Smoke 800
  "--bp-text": "#fafafa",       // Tuatara 50 — clean white
  "--bp-text-muted": "#9cafae", // Blue Smoke 400 — high-contrast muted
  "--bp-text-dim": "#748b8a",   // Blue Smoke 500
  "--bp-green": "#7eaf01",      // Inch Worm 600 — softened lime-green
  "--bp-green-hover": "#a3da08", // Inch Worm 500
  "--bp-green-bg": "#203102",   // Inch Worm 950
  "--bp-red": "#f1300e",        // Scarlet 600 — warm orange-red
  "--bp-red-hover": "#ff4f30",  // Scarlet 500
  "--bp-red-bg": "#4c0e03",     // Scarlet 950
  "--bp-blue": "#4a8fc8",       // Complementary muted blue (teal-adjusted)
  "--bp-blue-bg": "#061e2e",    // Deep muted blue bg
  "--bp-font-heading": "'obviously-variable', 'Georgia', 'Times New Roman', serif",
  "--bp-font-mono": "'SF Mono', 'Cascadia Code', 'Fira Code', ui-monospace, monospace",
};

export const lightTheme: Record<string, string> = {
  "--bp-bg": "#f9fbfb",         // Blue Smoke 50 — cool off-white
  "--bp-surface": "#ffffff",
  "--bp-border": "#d1dbda",     // Blue Smoke 300
  "--bp-text": "#031212",       // Blue Smoke 950 — deep teal-black text
  "--bp-text-muted": "#4b6360", // Blue Smoke 600
  "--bp-text-dim": "#748b8a",   // Blue Smoke 500
  "--bp-green": "#7eaf01",      // Inch Worm 600
  "--bp-green-hover": "#5f8407", // Inch Worm 700
  "--bp-green-bg": "#fbffe5",   // Inch Worm 50
  "--bp-red": "#cb270a",        // Scarlet 700 — darkened for light bg
  "--bp-red-hover": "#a8230c",  // Scarlet 800
  "--bp-red-bg": "#fff3f1",     // Scarlet 50
  "--bp-blue": "#1c6fa0",       // Complementary muted blue
  "--bp-blue-bg": "#f0f8ff",    // Light blue bg
  "--bp-font-heading": "'obviously-variable', 'Georgia', 'Times New Roman', serif",
  "--bp-font-mono": "'SF Mono', 'Cascadia Code', 'Fira Code', ui-monospace, monospace",
};

export const tokens = {
  bg: "var(--bp-bg)",
  surface: "var(--bp-surface)",
  border: "var(--bp-border)",
  text: "var(--bp-text)",
  textMuted: "var(--bp-text-muted)",
  textDim: "var(--bp-text-dim)",
  green: "var(--bp-green)",
  greenHover: "var(--bp-green-hover)",
  greenBg: "var(--bp-green-bg)",
  red: "var(--bp-red)",
  redHover: "var(--bp-red-hover)",
  redBg: "var(--bp-red-bg)",
  blue: "var(--bp-blue)",
  blueBg: "var(--bp-blue-bg)",
  fontHeading: "var(--bp-font-heading)",
  fontMono: "var(--bp-font-mono)",
} as const;
