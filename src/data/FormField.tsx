import React from "react";

export interface FormFieldProps {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
  error?: string;
  hint?: string;
  required?: boolean;
}

export function FormField({
  label,
  children,
  error,
  hint,
  required,
}: FormFieldProps): React.ReactElement {
  const enhanced = React.cloneElement(children, {
    style: {
      ...children.props.style,
      ...(error
        ? { borderColor: "var(--bp-red)" }
        : {}),
    },
  });

  return (
    <div style={{ marginBottom: "1.1rem" }}>
      <label
        style={{
          display: "block",
          fontFamily: "var(--bp-font-mono)",
          fontSize: "var(--bp-text-xs)",
          letterSpacing: "0.12em",
          color: "var(--bp-text-muted)",
          textTransform: "uppercase",
          marginBottom: "0.3rem",
        }}
      >
        {label}
        {required && (
          <span style={{ color: "var(--bp-red)", marginLeft: "0.25rem" }} aria-hidden="true">
            *
          </span>
        )}
      </label>
      {enhanced}
      {hint && !error && (
        <div
          style={{
            fontFamily: "var(--bp-font-body)",
            fontSize: "var(--bp-text-xs)",
            color: "var(--bp-text-dim)",
            marginTop: "0.25rem",
            lineHeight: 1.4,
          }}
        >
          {hint}
        </div>
      )}
      {error && (
        <div
          role="alert"
          style={{
            fontFamily: "var(--bp-font-body)",
            fontSize: "var(--bp-text-xs)",
            color: "var(--bp-red)",
            marginTop: "0.25rem",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
