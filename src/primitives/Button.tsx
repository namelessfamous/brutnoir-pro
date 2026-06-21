import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger" | "secondary";
  size?: "sm" | "md" | "lg" | "icon";
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
    letterSpacing: "0.12em",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    opacity: disabled || loading ? 0.6 : 1,
    borderRadius: "var(--bp-radius-sm)",
    transition: "background var(--bp-transition-fast), color var(--bp-transition-fast), box-shadow var(--bp-transition-fast)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.4rem",
    whiteSpace: "nowrap",
    userSelect: "none",
    fontSize:
      size === "sm" ? "var(--bp-text-xs)" :
      size === "lg" ? "var(--bp-text-base)" :
      "var(--bp-text-sm)",
    padding:
      size === "icon" ? "0.45rem" :
      size === "sm" ? "0.3rem 0.65rem" :
      size === "lg" ? "0.7rem 1.5rem" :
      "0.45rem 1rem",
    width:  size === "icon" ? "2rem" : undefined,
    height: size === "icon" ? "2rem" : undefined,
    minWidth: size !== "icon" ? "4rem" : undefined,
  };

  // Win95-inspired raised look for primary, outlined for others
  const variants: Record<string, React.CSSProperties> = {
    primary: {
      background: "var(--bp-green)",
      color: "var(--bp-bg)",
      border: "1px solid var(--bp-green)",
      boxShadow: "var(--bp-shadow-sm)",
    },
    secondary: {
      background: "var(--bp-surface)",
      color: "var(--bp-text)",
      border: "1px solid var(--bp-border)",
      boxShadow: "var(--bp-shadow-sm)",
    },
    ghost: {
      background: "transparent",
      color: "var(--bp-text-muted)",
      border: "1px solid transparent",
      boxShadow: "none",
    },
    danger: {
      background: "transparent",
      color: "var(--bp-red)",
      border: "1px solid var(--bp-red)",
      boxShadow: "none",
    },
  };

  const hoverStyles: Record<string, Partial<React.CSSProperties>> = {
    primary:   { background: "var(--bp-green-hover)", boxShadow: "none", transform: "translate(1px, 1px)" },
    secondary: { background: "var(--bp-bg)", boxShadow: "none", transform: "translate(1px, 1px)" },
    ghost:     { color: "var(--bp-text)", background: "rgba(255,255,255,0.05)" },
    danger:    { background: "var(--bp-red-bg)" },
  };

  const resetStyles: Record<string, Partial<React.CSSProperties>> = {
    primary:   { background: "var(--bp-green)",   boxShadow: "var(--bp-shadow-sm)", transform: "none" },
    secondary: { background: "var(--bp-surface)", boxShadow: "var(--bp-shadow-sm)", transform: "none" },
    ghost:     { color: "var(--bp-text-muted)", background: "transparent" },
    danger:    { background: "transparent" },
  };

  return (
    <button
      disabled={disabled || loading}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          const el = e.currentTarget;
          const h = hoverStyles[variant];
          if (h.background !== undefined) el.style.background = h.background as string;
          if (h.color)       el.style.color = h.color;
          if (h.boxShadow !== undefined)  el.style.boxShadow = h.boxShadow as string;
          if (h.transform)   el.style.transform = h.transform;
        }
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        const r = resetStyles[variant];
        if (r.background !== undefined) el.style.background = r.background as string;
        if (r.color)       el.style.color = r.color;
        if (r.boxShadow !== undefined)  el.style.boxShadow = r.boxShadow as string;
        if (r.transform)   el.style.transform = r.transform ?? "";
        onMouseLeave?.(e);
      }}
      {...rest}
    >
      {loading ? (
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
          <span
            style={{
              display: "inline-block",
              width: "0.6rem",
              height: "0.6rem",
              border: "1.5px solid currentColor",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "bp-spin 0.7s linear infinite",
            }}
          />
          {typeof children === "string" ? children : "Loading"}
        </span>
      ) : children}
      <style>{`@keyframes bp-spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
}
