"use client";

import React, { useEffect, useState } from "react";

// ─── Hook ─────────────────────────────────────────────────────────────────────

function useWindowWidth(defaultWidth = 9999): number {
  const [width, setWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : defaultWidth
  );

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PageHeaderProps {
  section?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  /**
   * Action to show on small screens instead of `action`.
   * Typically a compact version (e.g. "+" vs "+ New Client").
   * If omitted, `action` is shown at all sizes.
   */
  mobileAction?: React.ReactNode;
  /**
   * Breakpoint (px) below which `mobileAction` is shown. Default 640.
   */
  mobileBreakpoint?: number;
  breadcrumb?: React.ReactNode;
  style?: React.CSSProperties;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PageHeader({
  section,
  title,
  description,
  action,
  mobileAction,
  mobileBreakpoint = 640,
  breadcrumb,
  style,
}: PageHeaderProps): React.ReactElement {
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < mobileBreakpoint;
  const renderedAction =
    mobileAction && isMobile ? mobileAction : action;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        marginBottom: "2rem",
        gap: "1rem",
        flexWrap: "wrap",
        ...style,
      }}
    >
      <div>
        {breadcrumb && (
          <div style={{ marginBottom: "0.5rem" }}>{breadcrumb}</div>
        )}
        {section && (
          <div
            style={{
              fontFamily: "var(--bp-font-mono)",
              fontSize: "clamp(0.6rem, 2vw, var(--bp-text-xs))",
              letterSpacing: "0.25em",
              color: "var(--bp-text-muted)",
              textTransform: "uppercase",
              marginBottom: "0.4rem",
            }}
          >
            {section}
          </div>
        )}
        <h1
          style={{
            fontFamily: "var(--bp-font-heading)",
            fontSize: "clamp(1.1rem, 4vw, 1.6rem)",
            fontWeight: "normal",
            color: "var(--bp-text)",
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          {title}
        </h1>
        {description && (
          <p
            style={{
              fontFamily: "var(--bp-font-body)",
              fontSize: "clamp(0.72rem, 2.5vw, 0.85rem)",
              color: "var(--bp-text-muted)",
              margin: "0.5rem 0 0",
              lineHeight: 1.5,
            }}
          >
            {description}
          </p>
        )}
      </div>
      {renderedAction && (
        <div style={{ flexShrink: 0 }}>{renderedAction}</div>
      )}
    </div>
  );
}
