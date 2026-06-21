import React from "react";

export interface DividerProps {
  /** Orientation */
  orientation?: "horizontal" | "vertical";
  /** Label centered in the divider */
  label?: string;
  style?: React.CSSProperties;
}

export function Divider({
  orientation = "horizontal",
  label,
  style,
}: DividerProps): React.ReactElement {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        style={{
          display: "inline-block",
          width: "1px",
          height: "100%",
          background: "var(--bp-border)",
          flexShrink: 0,
          ...style,
        }}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          margin: "1rem 0",
          ...style,
        }}
      >
        <div style={{ flex: 1, height: "1px", background: "var(--bp-border)" }} />
        <span
          style={{
            fontFamily: "var(--bp-font-mono)",
            fontSize: "var(--bp-text-xs)",
            color: "var(--bp-text-dim)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            flexShrink: 0,
          }}
        >
          {label}
        </span>
        <div style={{ flex: 1, height: "1px", background: "var(--bp-border)" }} />
      </div>
    );
  }

  return (
    <hr
      style={{
        border: "none",
        borderTop: "1px solid var(--bp-border)",
        margin: "1rem 0",
        ...style,
      }}
    />
  );
}
