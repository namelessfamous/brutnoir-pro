import React from "react";

export interface PageHeaderProps {
  section: string;
  title: string;
  action?: React.ReactNode;
}

export function PageHeader({ section, title, action }: PageHeaderProps): React.ReactElement {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        marginBottom: "2.5rem",
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "var(--bp-font-mono)",
            fontSize: "0.75rem",
            letterSpacing: "0.3em",
            color: "var(--bp-text-muted)",
            textTransform: "uppercase",
            marginBottom: "0.5rem",
          }}
        >
          {section}
        </div>
        <h1
          style={{
            fontFamily: "var(--bp-font-heading)",
            fontSize: "2rem",
            fontWeight: "normal",
            color: "var(--bp-text)",
            margin: 0,
          }}
        >
          {title}
        </h1>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
