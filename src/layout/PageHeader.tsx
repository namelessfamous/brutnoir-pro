import React from "react";

export interface PageHeaderProps {
  section?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  style?: React.CSSProperties;
}

export function PageHeader({
  section,
  title,
  description,
  action,
  breadcrumb,
  style,
}: PageHeaderProps): React.ReactElement {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        marginBottom: "2rem",
        gap: "1rem",
        ...style,
      }}
    >
      <div>
        {breadcrumb && <div style={{ marginBottom: "0.5rem" }}>{breadcrumb}</div>}
        {section && (
          <div
            style={{
              fontFamily: "var(--bp-font-mono)",
              fontSize: "var(--bp-text-xs)",
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
            fontSize: "var(--bp-text-xxl)",
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
              fontSize: "var(--bp-text-sm)",
              color: "var(--bp-text-muted)",
              margin: "0.5rem 0 0",
              lineHeight: 1.5,
            }}
          >
            {description}
          </p>
        )}
      </div>
      {action && (
        <div style={{ flexShrink: 0 }}>{action}</div>
      )}
    </div>
  );
}
