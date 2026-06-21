import React from "react";

export interface EmptyStateProps {
  /** Large icon or illustration — emoji or React node */
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  style?: React.CSSProperties;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  style,
}: EmptyStateProps): React.ReactElement {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "3rem 2rem",
        gap: "0.75rem",
        ...style,
      }}
    >
      {icon && (
        <div
          style={{
            fontSize: "2.5rem",
            marginBottom: "0.25rem",
            opacity: 0.5,
            lineHeight: 1,
          }}
        >
          {icon}
        </div>
      )}
      <h3
        style={{
          fontFamily: "var(--bp-font-body)",
          fontSize: "var(--bp-text-md)",
          fontWeight: "600",
          color: "var(--bp-text)",
          margin: 0,
        }}
      >
        {title}
      </h3>
      {description && (
        <p
          style={{
            fontFamily: "var(--bp-font-body)",
            fontSize: "var(--bp-text-sm)",
            color: "var(--bp-text-muted)",
            margin: 0,
            lineHeight: 1.5,
            maxWidth: "320px",
          }}
        >
          {description}
        </p>
      )}
      {action && <div style={{ marginTop: "0.5rem" }}>{action}</div>}
    </div>
  );
}
