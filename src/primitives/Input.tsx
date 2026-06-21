import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const baseInputStyle: React.CSSProperties = {
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
  transition: "border-color var(--bp-transition-fast), box-shadow var(--bp-transition-fast)",
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

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, style, onFocus, onBlur, ...rest }, ref) => {
    return (
      <>
        {label && <label style={labelStyle}>{label}</label>}
        <input
          ref={ref}
          style={{ ...baseInputStyle, ...style }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--bp-text-muted)";
            e.currentTarget.style.boxShadow = "var(--bp-shadow-inset), 0 0 0 2px rgba(163,218,8,0.15)";
            onFocus?.(e);
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--bp-border)";
            e.currentTarget.style.boxShadow = "var(--bp-shadow-inset)";
            onBlur?.(e);
          }}
          {...rest}
        />
      </>
    );
  }
);
Input.displayName = "Input";
