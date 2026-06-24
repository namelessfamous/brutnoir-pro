import React from "react";

export type ProgressVariant = "default" | "success" | "warning" | "error" | "info";

export interface ProgressProps {
  /** Progress value 0–100 */
  value: number;
  /** Max value (default 100) */
  max?: number;
  variant?: ProgressVariant;
  /** Show percentage label inside or above the bar */
  showLabel?: boolean;
  /** Label position */
  labelPosition?: "inside" | "above";
  /** Height of the bar in pixels */
  height?: number;
  /** Whether to show indeterminate animation */
  indeterminate?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const variantFill: Record<ProgressVariant, string> = {
  default: "var(--bp-green)",
  success: "var(--bp-green)",
  warning: "var(--bp-warning)",
  error:   "var(--bp-red)",
  info:    "var(--bp-blue)",
};

export function Progress({
  value,
  max = 100,
  variant = "default",
  showLabel = false,
  labelPosition = "above",
  height = 12,
  indeterminate = false,
  style,
  className,
}: ProgressProps): React.ReactElement {
  const pct = indeterminate ? 0 : Math.min(100, Math.max(0, (value / max) * 100));
  const fill = variantFill[variant];

  return (
    <>
      <style>{`
        @keyframes bp-progress-indeterminate {
          0%   { left: -40%; width: 40%; }
          50%  { left: 20%;  width: 60%; }
          100% { left: 100%; width: 40%; }
        }
        .bp-progress-bar-inner--indeterminate {
          position: absolute !important;
          animation: bp-progress-indeterminate 1.5s ease-in-out infinite;
        }
      `}</style>
      <div
        className={className}
        style={{ fontFamily: "var(--bp-font-body)", ...style }}
      >
        {showLabel && labelPosition === "above" && (
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "4px",
            fontSize: "var(--bp-text-xs)",
            color: "var(--bp-text-muted)",
            fontFamily: "var(--bp-font-mono)",
          }}>
            <span></span>
            <span>{indeterminate ? "…" : `${Math.round(pct)}%`}</span>
          </div>
        )}
        <div
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label="Progress"
          style={{
            position: "relative",
            width: "100%",
            height: height,
            background: "var(--bp-bg)",
            border: "2px solid #000",
            borderRadius: "var(--bp-radius-sm)",
            overflow: "hidden",
            boxShadow: "2px 2px 0 0 #000",
          }}
        >
          <div
            className={indeterminate ? "bp-progress-bar-inner--indeterminate" : undefined}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: indeterminate ? "40%" : `${pct}%`,
              background: fill,
              transition: indeterminate ? "none" : "width 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingRight: showLabel && labelPosition === "inside" && pct > 15 ? "6px" : 0,
            }}
          >
            {showLabel && labelPosition === "inside" && !indeterminate && pct > 15 && (
              <span style={{
                fontSize: "var(--bp-text-xs)",
                fontFamily: "var(--bp-font-mono)",
                color: "#000",
                fontWeight: 600,
                lineHeight: 1,
              }}>
                {Math.round(pct)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
