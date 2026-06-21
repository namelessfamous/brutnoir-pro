import React from "react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

const baseSelectStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--bp-bg)",
  border: "1px solid var(--bp-border)",
  borderRadius: "var(--bp-radius-sm)",
  outline: "none",
  fontFamily: "var(--bp-font-body)",
  fontSize: "var(--bp-text-sm)",
  color: "var(--bp-text)",
  padding: "0.45rem 0.6rem",
  boxSizing: "border-box",
  boxShadow: "var(--bp-shadow-inset)",
  cursor: "pointer",
  transition: "border-color var(--bp-transition-fast)",
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23727272'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 0.6rem center",
  paddingRight: "2rem",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--bp-font-mono)",
  fontSize: "var(--bp-text-xs)",
  letterSpacing: "0.15em",
  color: "var(--bp-text-muted)",
  textTransform: "uppercase",
  marginBottom: "0.3rem",
};

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, style, onFocus, onBlur, children, ...rest }, ref) => {
    return (
      <>
        {label && <label style={labelStyle}>{label}</label>}
        <select
          ref={ref}
          style={{ ...baseSelectStyle, ...style }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--bp-text-muted)";
            onFocus?.(e);
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--bp-border)";
            onBlur?.(e);
          }}
          {...rest}
        >
          {children}
        </select>
      </>
    );
  }
);
Select.displayName = "Select";
