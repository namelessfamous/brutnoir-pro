import React from "react";

export interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg";
  color?: string;
  label?: string;
  /** Show label text next to or below the spinner */
  labelPosition?: "right" | "below";
  style?: React.CSSProperties;
}

const sizeMap: Record<string, string> = {
  xs: "0.75rem",
  sm: "1rem",
  md: "1.5rem",
  lg: "2rem",
};

export function Spinner({
  size = "md",
  color = "var(--bp-green)",
  label,
  labelPosition = "right",
  style,
}: SpinnerProps): React.ReactElement {
  const dim = sizeMap[size];

  const spinnerEl = (
    <span
      role="progressbar"
      aria-label={label ?? "Loading"}
      aria-busy="true"
      style={{
        display: "inline-block",
        width: dim,
        height: dim,
        border: `2px solid ${color}`,
        borderTopColor: "transparent",
        borderRadius: "50%",
        animation: "bp-spin 0.7s linear infinite",
        flexShrink: 0,
      }}
    />
  );

  if (!label) {
    return (
      <>
        <span style={{ display: "inline-block", ...style }}>{spinnerEl}</span>
        <style>{`@keyframes bp-spin { to { transform: rotate(360deg); } }`}</style>
      </>
    );
  }

  return (
    <>
      <span
        style={{
          display: "inline-flex",
          flexDirection: labelPosition === "below" ? "column" : "row",
          alignItems: "center",
          gap: "0.5rem",
          ...style,
        }}
      >
        {spinnerEl}
        <span
          style={{
            fontFamily: "var(--bp-font-body)",
            fontSize: "var(--bp-text-sm)",
            color: "var(--bp-text-muted)",
          }}
        >
          {label}
        </span>
      </span>
      <style>{`@keyframes bp-spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}

/** Loader — full-area centered spinner overlay */
export interface LoaderProps {
  label?: string;
  overlay?: boolean;
  style?: React.CSSProperties;
}

export function Loader({ label, overlay = false, style }: LoaderProps): React.ReactElement {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
        padding: "2rem",
        ...(overlay ? {
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: "var(--bp-z-modal)" as unknown as number,
        } : {}),
        ...style,
      }}
    >
      <Spinner size="md" />
      {label && (
        <span
          style={{
            fontFamily: "var(--bp-font-body)",
            fontSize: "var(--bp-text-sm)",
            color: "var(--bp-text-muted)",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
