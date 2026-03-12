import React from "react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

const selectStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--bp-bg)",
  border: "1px solid var(--bp-border)",
  outline: "none",
  fontFamily: "var(--bp-font-mono)",
  fontSize: "0.75rem",
  color: "var(--bp-text)",
  padding: "0.5rem",
  boxSizing: "border-box",
  cursor: "pointer",
  transition: "border-color 0.1s",
};

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, style, onFocus, onBlur, children, ...rest }, ref) => {
    return (
      <>
        {label && (
          <label
            style={{
              display: "block",
              fontFamily: "var(--bp-font-mono)",
              fontSize: "0.55rem",
              letterSpacing: "0.2em",
              color: "var(--bp-text-muted)",
              textTransform: "uppercase",
              marginBottom: "0.3rem",
            }}
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          style={{ ...selectStyle, ...style }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--bp-text)";
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
