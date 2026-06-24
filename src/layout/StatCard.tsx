import React, { useState } from "react";

export interface StatCardTrend {
  value: number;
  label?: string;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  trend?: StatCardTrend;
  subtitle?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

export function StatCard({
  title,
  value,
  trend,
  subtitle,
  icon,
  onClick,
  style,
  className,
}: StatCardProps): React.ReactElement {
  const [hovered, setHovered] = useState(false);

  const isPositive  = trend ? trend.value >= 0 : null;
  const trendColor  = isPositive ? "var(--bp-green)"  : "var(--bp-red)";
  const trendBg     = isPositive ? "var(--bp-green-bg)" : "var(--bp-red-bg)";
  const trendPrefix = isPositive ? "+" : "";

  return (
    <div
      className={className}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => { if (e.key === "Enter" || e.key === " ") onClick(); }
          : undefined
      }
      style={{
        padding: "24px",
        background: "var(--bp-surface)",
        border: "1px solid #000",
        borderRadius: "var(--bp-radius-sm)",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        cursor: onClick ? "pointer" : "default",
        boxShadow: hovered ? "4px 4px 0 0 #000000" : "none",
        transform: hovered ? "translate(-2px, -2px)" : "none",
        transition: "box-shadow 0.3s ease, transform 0.3s ease",
        userSelect: "none",
        ...style,
      }}
    >
      {/* Header row: title + icon */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        <span
          style={{
            fontSize: "var(--bp-text-base)",
            fontFamily: "var(--bp-font-body)",
            fontWeight: 500,
            color: "var(--bp-text)",
          }}
        >
          {title}
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {trend !== undefined && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "2px",
                padding: "2px 8px",
                background: trendBg,
                color: trendColor,
                border: `1px solid ${trendColor}`,
                borderRadius: "var(--bp-radius-sm)",
                fontSize: "var(--bp-text-xs)",
                fontFamily: "var(--bp-font-mono)",
                fontWeight: 600,
              }}
            >
              {isPositive ? "▲" : "▼"}{" "}
              {trendPrefix}{Math.abs(trend.value).toFixed(1)}%
              {trend.label ? ` ${trend.label}` : ""}
            </span>
          )}
          {icon && (
            <span
              style={{
                fontSize: "1.25rem",
                color: "var(--bp-text-muted)",
                lineHeight: 1,
              }}
            >
              {icon}
            </span>
          )}
        </div>
      </div>

      {/* Large value */}
      <div
        style={{
          fontSize: "var(--bp-text-xxl)",
          fontFamily: "var(--bp-font-heading)",
          fontWeight: 700,
          color: "var(--bp-text)",
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <span
          style={{
            fontSize: "var(--bp-text-sm)",
            fontFamily: "var(--bp-font-body)",
            color: "var(--bp-text-muted)",
          }}
        >
          {subtitle}
        </span>
      )}
    </div>
  );
}
