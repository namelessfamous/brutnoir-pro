export type ColorKey =
  | "bg" | "surface" | "border"
  | "text" | "textMuted" | "textDim"
  | "green" | "greenHover" | "greenBg"
  | "red" | "redHover" | "redBg"
  | "blue" | "blueBg";

export type FontKey = "heading" | "mono";

export const darkTheme: Record<string, string> = {
  "--bp-bg": "#080808",
  "--bp-surface": "#0d0d0d",
  "--bp-border": "#1a1a1a",
  "--bp-text": "#f0ede6",
  "--bp-text-muted": "#404040",
  "--bp-text-dim": "#555555",
  "--bp-green": "#019458",
  "--bp-green-hover": "#01b06a",
  "--bp-green-bg": "#012a18",
  "--bp-red": "#cc4444",
  "--bp-red-hover": "#ff6666",
  "--bp-red-bg": "#120808",
  "--bp-blue": "#4a9eff",
  "--bp-blue-bg": "#0a1f3d",
  "--bp-font-heading": '"Georgia", "Times New Roman", serif',
  "--bp-font-mono": '"Courier New", monospace',
};

export const lightTheme: Record<string, string> = {
  "--bp-bg": "#f5f2ed",
  "--bp-surface": "#ffffff",
  "--bp-border": "#e0dbd2",
  "--bp-text": "#0d0d0d",
  "--bp-text-muted": "#888880",
  "--bp-text-dim": "#aaa9a3",
  "--bp-green": "#019458",
  "--bp-green-hover": "#017a48",
  "--bp-green-bg": "#e6f7f0",
  "--bp-red": "#cc2222",
  "--bp-red-hover": "#aa1111",
  "--bp-red-bg": "#fdf0f0",
  "--bp-blue": "#0055cc",
  "--bp-blue-bg": "#eef3fd",
  "--bp-font-heading": '"Georgia", "Times New Roman", serif',
  "--bp-font-mono": '"Courier New", monospace',
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
