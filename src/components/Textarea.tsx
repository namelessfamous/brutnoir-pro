import React from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const textareaStyle: React.CSSProperties = {
  width: "100%",
  background: "transparent",
  border: "none",
  borderBottom: "1px solid var(--bp-border)",
  outline: "none",
  fontFamily: "var(--bp-font-mono)",
  fontSize: "0.75rem",
  color: "var(--bp-text)",
  padding: "0.4rem 0",
  boxSizing: "border-box",
  resize: "vertical",
  minHeight: "80px",
  transition: "border-bottom-color 0.1s",
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, style, onFocus, onBlur, ...rest }, ref) => {
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
        <textarea
          ref={ref}
          style={{ ...textareaStyle, ...style }}
          onFocus={(e) => {
            e.currentTarget.style.borderBottomColor = "var(--bp-text)";
            onFocus?.(e);
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderBottomColor = "var(--bp-border)";
            onBlur?.(e);
          }}
          {...rest}
        />
      </>
    );
  }
);
Textarea.displayName = "Textarea";
