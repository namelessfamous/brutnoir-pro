import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger";
  size?: "sm" | "md";
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  style,
  onMouseEnter,
  onMouseLeave,
  disabled,
  ...rest
}: ButtonProps): React.ReactElement {
  const base: React.CSSProperties = {
    fontFamily: "var(--bp-font-mono)",
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    border: "none",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    transition: "background 0.1s, color 0.1s",
    opacity: disabled || loading ? 0.6 : 1,
    fontSize: size === "sm" ? "0.55rem" : "0.65rem",
    padding: size === "sm" ? "0.35rem 0.75rem" : "0.55rem 1.25rem",
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      background: "var(--bp-green)",
      color: "var(--bp-bg)",
    },
    ghost: {
      background: "none",
      color: "var(--bp-text-muted)",
    },
    danger: {
      background: "none",
      color: "var(--bp-red)",
    },
  };

  const hoverColors: Record<string, Partial<React.CSSProperties>> = {
    primary: { background: "var(--bp-green-hover)" },
    ghost: { color: "var(--bp-text)" },
    danger: { color: "var(--bp-red-hover)" },
  };

  return (
    <button
      disabled={disabled || loading}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          const el = e.currentTarget as HTMLButtonElement;
          const hover = hoverColors[variant];
          if (hover.background) el.style.background = hover.background as string;
          if (hover.color) el.style.color = hover.color;
        }
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        const v = variants[variant];
        if (v.background !== undefined) el.style.background = v.background as string;
        if (v.color !== undefined) el.style.color = v.color as string;
        onMouseLeave?.(e);
      }}
      {...rest}
    >
      {loading ? "..." : children}
    </button>
  );
}
