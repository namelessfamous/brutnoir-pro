import React from "react";

export interface SectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  padded?: boolean;
  /** Right-side header slot — e.g. action buttons */
  action?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export function Section({
  title,
  description,
  children,
  padded = true,
  action,
  style,
  className,
}: SectionProps): React.ReactElement {
  const hasHeader = title || description || action;

  return (
    <section
      className={className}
      style={{
        border: "1px solid #000",
        borderRadius: "var(--bp-radius-sm)",
        background: "var(--bp-surface)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        ...style,
      }}
    >
      {hasHeader && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "12px",
            padding: "16px 20px",
            borderBottom: "1px solid #000",
            background: "var(--bp-bg)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {title && (
              <h3
                style={{
                  margin: 0,
                  fontSize: "var(--bp-text-md)",
                  fontFamily: "var(--bp-font-heading)",
                  fontWeight: 700,
                  color: "var(--bp-text)",
                  lineHeight: 1.2,
                }}
              >
                {title}
              </h3>
            )}
            {description && (
              <p
                style={{
                  margin: 0,
                  fontSize: "var(--bp-text-sm)",
                  fontFamily: "var(--bp-font-body)",
                  color: "var(--bp-text-muted)",
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
      )}

      <div
        style={{
          padding: padded ? "20px" : undefined,
          flex: 1,
        }}
      >
        {children}
      </div>
    </section>
  );
}
