import React from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const baseTextareaStyle: React.CSSProperties = {
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
  resize: "vertical",
  minHeight: "80px",
  lineHeight: "1.5",
  transition: "border-color var(--bp-transition-fast)",
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

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, style, onFocus, onBlur, ...rest }, ref) => {
    return (
      <>
        {label && <label style={labelStyle}>{label}</label>}
        <textarea
          ref={ref}
          style={{ ...baseTextareaStyle, ...style }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--bp-text-muted)";
            onFocus?.(e);
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--bp-border)";
            onBlur?.(e);
          }}
          {...rest}
        />
      </>
    );
  }
);
Textarea.displayName = "Textarea";
