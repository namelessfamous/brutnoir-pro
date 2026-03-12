import React from "react";

export interface FormFieldProps {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
  error?: string;
}

export function FormField({ label, children, error }: FormFieldProps): React.ReactElement {
  const enhanced = React.cloneElement(children, {
    style: {
      ...children.props.style,
      ...(error
        ? { borderBottomColor: "var(--bp-red)", borderColor: "var(--bp-red)" }
        : {}),
    },
  });

  return (
    <div style={{ marginBottom: "1.25rem" }}>
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
      {enhanced}
      {error && (
        <div
          style={{
            fontFamily: "var(--bp-font-mono)",
            fontSize: "0.55rem",
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
