import React from "react";

export interface BadgeProps {
  variant?: "green" | "red" | "blue" | "amber" | "gray" | "muted";
  children: React.ReactNode;
  color?: string; // Custom hex background — auto-derives text color
}

function getLuminance(hex: string): number {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;
  const toLinear = (x: number) =>
    x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

const variantStyles: Record<string, React.CSSProperties> = {
  green: { background: "var(--bp-green-bg)", color: "var(--bp-green)" },
  red: { background: "var(--bp-red-bg)", color: "var(--bp-red)" },
  blue: { background: "var(--bp-blue-bg)", color: "var(--bp-blue)" },
  amber: { background: "rgba(194, 120, 0, 0.15)", color: "#c27800" },
  gray: { background: "#2a2a2a", color: "#555555" },
  muted: { background: "transparent", color: "var(--bp-text-muted)" },
};

export function Badge({
  variant = "muted",
  children,
  color,
}: BadgeProps): React.ReactElement {
  let colorStyle: React.CSSProperties = variantStyles[variant];

  if (color) {
    const luminance = getLuminance(color);
    const textColor = luminance > 0.179 ? "#000000" : "#ffffff";
    colorStyle = { background: color, color: textColor };
  }

  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: "var(--bp-font-mono)",
        fontSize: "0.65rem",
        letterSpacing: "0.15em",
        padding: "0.15rem 0.4rem",
        textTransform: "uppercase",
        ...colorStyle,
      }}
    >
      {children}
    </span>
  );
}
