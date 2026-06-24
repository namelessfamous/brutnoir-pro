import React, { useState } from "react";

export type AlertVariant = "info" | "success" | "warning" | "error";

export interface AlertProps {
  variant?: AlertVariant;
  children: React.ReactNode;
  /** If true, renders a close button and alert can be dismissed */
  dismissible?: boolean;
  /** Called when the alert is dismissed */
  onDismiss?: () => void;
  /** Controlled open state */
  open?: boolean;
  /** Bold prefix label, e.g. "Info:", "Success!" */
  title?: string;
  /** Leading icon element */
  icon?: React.ReactNode;
  /** Visual weight: strong = 2px border + hard shadow, simple = 1px border + hover lift */
  weight?: "strong" | "simple";
  style?: React.CSSProperties;
  className?: string;
}

const variantStyles: Record<AlertVariant, React.CSSProperties> = {
  info:    { background: "var(--bp-surface)",    color: "var(--bp-text)" },
  success: { background: "var(--bp-green-bg)",   color: "var(--bp-text)" },
  warning: { background: "var(--bp-warning-bg)", color: "var(--bp-text)" },
  error:   { background: "var(--bp-red-bg)",     color: "var(--bp-text)" },
};

export function Alert({
  variant = "info",
  children,
  dismissible = false,
  onDismiss,
  open: controlledOpen,
  title,
  icon,
  weight = "strong",
  style,
  className,
}: AlertProps): React.ReactElement | null {
  const [internalOpen, setInternalOpen] = useState(true);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const handleDismiss = () => {
    setInternalOpen(false);
    onDismiss?.();
  };

  if (!isOpen) return null;

  const isStrong = weight === "strong";

  const baseStyle: React.CSSProperties = {
    padding: "0.625rem 1rem",
    borderRadius: "var(--bp-radius-sm)",
    fontSize: "var(--bp-text-sm)",
    fontFamily: "var(--bp-font-body)",
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
    justifyContent: "space-between",
    border: isStrong ? "2px solid #000" : "1px solid #000",
    boxShadow: isStrong ? "3px 3px 0 0 #000" : "none",
    transition: "box-shadow var(--bp-transition-fast), transform var(--bp-transition-fast)",
    ...variantStyles[variant],
    ...style,
  };

  return (
    <div
      role="alert"
      className={className}
      style={baseStyle}
      onMouseEnter={!isStrong ? (e) => {
        e.currentTarget.style.boxShadow = "4px 4px 0 0 #000";
        e.currentTarget.style.transform = "translateY(-1px)";
      } : undefined}
      onMouseLeave={!isStrong ? (e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "none";
      } : undefined}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1 }}>
        {icon && (
          <span style={{ fontSize: "1.125rem", lineHeight: 1, flexShrink: 0 }}>{icon}</span>
        )}
        <span>
          {title && <strong style={{ marginRight: "0.25rem" }}>{title}</strong>}
          {children}
        </span>
      </div>
      {dismissible && (
        <button
          onClick={handleDismiss}
          aria-label="Dismiss alert"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "inherit",
            padding: "0",
            lineHeight: 1,
            flexShrink: 0,
            fontSize: "1rem",
            opacity: 0.7,
            transition: "opacity var(--bp-transition-fast)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.7"; }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
