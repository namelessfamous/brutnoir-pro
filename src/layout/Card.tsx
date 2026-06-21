import React from "react";

export interface CardProps {
  children: React.ReactNode;
  /** Optional card title — renders a header section */
  title?: React.ReactNode;
  /** Optional right-side header action */
  action?: React.ReactNode;
  /** Remove padding from the card body (useful for flush tables/lists) */
  noPadding?: boolean;
  /** Elevation: none | sm | md (default md) */
  elevation?: "none" | "sm" | "md";
  style?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  className?: string;
}

const shadowMap: Record<string, string> = {
  none: "none",
  sm:   "var(--bp-shadow-sm)",
  md:   "var(--bp-shadow)",
};

export function Card({
  children,
  title,
  action,
  noPadding = false,
  elevation = "md",
  style,
  bodyStyle,
  className,
}: CardProps): React.ReactElement {
  return (
    <div
      className={className}
      style={{
        background: "var(--bp-surface)",
        border: "1px solid var(--bp-border)",
        borderRadius: "var(--bp-radius)",
        boxShadow: shadowMap[elevation],
        overflow: "hidden",
        ...style,
      }}
    >
      {(title || action) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.75rem 1rem",
            borderBottom: "1px solid var(--bp-border)",
            background: "var(--bp-bg)",
          }}
        >
          {title && (
            <div
              style={{
                fontFamily: "var(--bp-font-body)",
                fontSize: "var(--bp-text-sm)",
                fontWeight: "600",
                color: "var(--bp-text)",
                letterSpacing: "0.01em",
              }}
            >
              {title}
            </div>
          )}
          {action && (
            <div style={{ marginLeft: "auto" }}>{action}</div>
          )}
        </div>
      )}
      <div
        style={{
          padding: noPadding ? 0 : "1rem",
          ...bodyStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
}
