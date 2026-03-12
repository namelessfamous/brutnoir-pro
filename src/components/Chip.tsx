import React from "react";

export interface ChipProps {
  label: string;
  color: string;
  onRemove?: () => void;
  onClick?: () => void;
  selected?: boolean;
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

export function Chip({ label, color, onRemove, onClick, selected }: ChipProps): React.ReactElement {
  const luminance = getLuminance(color);
  const textColor = luminance > 0.179 ? "#000000" : "#ffffff";

  return (
    <span
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        background: color,
        color: textColor,
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: "0.55rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        padding: "0.2rem 0.5rem",
        borderRadius: "2px",
        cursor: onClick ? "pointer" : "default",
        opacity: selected === false ? 0.5 : 1,
        outline: selected ? `2px solid ${textColor}` : "none",
        outlineOffset: "1px",
        transition: "opacity 0.1s",
      }}
    >
      {label}
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: textColor,
            fontSize: "0.65rem",
            lineHeight: 1,
            padding: 0,
            display: "flex",
            alignItems: "center",
            opacity: 0.7,
          }}
          aria-label="Remove"
        >
          ×
        </button>
      )}
    </span>
  );
}
