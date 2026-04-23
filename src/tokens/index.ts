export type ColorKey =
  | "bg" | "surface" | "border"
  | "text" | "textMuted" | "textDim"
  | "green" | "greenHover" | "greenBg"
  | "red" | "redHover" | "redBg"
  | "blue" | "blueBg";

export type FontKey = "heading" | "mono";

export const darkTheme: Record<string, string> = {
  "--bp-bg": "#0a0a0a",
  "--bp-surface": "#111111",
  "--bp-border": "#1e1e1e",
  "--bp-text": "#e8e4dc",
  "--bp-text-muted": "#4a4a4a",
  "--bp-text-dim": "#5e5e5e",
  "--bp-green": "#019458",
  "--bp-green-hover": "#01b06a",
  "--bp-green-bg": "#012a18",
  "--bp-red": "#cc4444",
  "--bp-red-hover": "#ff6666",
  "--bp-red-bg": "#120808",
  "--bp-blue": "#4a9eff",
  "--bp-blue-bg": "#0a1f3d",
  "--bp-font-heading": "'obviously-variable', 'Georgia', 'Times New Roman', serif",
  "--bp-font-mono": "'SF Mono', 'Cascadia Code', 'Fira Code', ui-monospace, monospace",
};

export const lightTheme: Record<string, string> = {
  "--bp-bg": "#f0ece5",
  "--bp-surface": "#ffffff",
  "--bp-border": "#d8d3c9",
  "--bp-text": "#121210",
  "--bp-text-muted": "#7e7e76",
  "--bp-text-dim": "#9e9d96",
  "--bp-green": "#019458",
  "--bp-green-hover": "#017a48",
  "--bp-green-bg": "#e6f7f0",
  "--bp-red": "#cc2222",
  "--bp-red-hover": "#aa1111",
  "--bp-red-bg": "#fdf0f0",
  "--bp-blue": "#0055cc",
  "--bp-blue-bg": "#eef3fd",
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
