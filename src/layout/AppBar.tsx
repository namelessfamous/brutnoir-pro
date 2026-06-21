import React from "react";

export interface AppBarProps {
  /** Left slot — logo, brand name */
  start?: React.ReactNode;
  /** Center slot — navigation tabs or search */
  center?: React.ReactNode;
  /** Right slot — actions, avatar, theme toggle */
  end?: React.ReactNode;
  height?: string | number;
  style?: React.CSSProperties;
}

export function AppBar({
  start,
  center,
  end,
  height = 56,
  style,
}: AppBarProps): React.ReactElement {
  const h = typeof height === "number" ? `${height}px` : height;

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: h,
        background: "var(--bp-surface)",
        borderBottom: "1px solid var(--bp-border)",
        display: "flex",
        alignItems: "center",
        padding: "0 1rem",
        gap: "1rem",
        zIndex: "var(--bp-z-header)" as unknown as number,
        boxShadow: "var(--bp-shadow-sm)",
        ...style,
      }}
    >
      {start && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
          {start}
        </div>
      )}
      {center && (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {center}
        </div>
      )}
      {end && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginLeft: "auto", flexShrink: 0 }}>
          {end}
        </div>
      )}
    </header>
  );
}

/** Alias */
export const Header = AppBar;
export type HeaderProps = AppBarProps;
