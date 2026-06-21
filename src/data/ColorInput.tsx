import React from "react";

export interface ColorInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function ColorInput({ label, style, ...rest }: ColorInputProps): React.ReactElement {
  const [internalValue, setInternalValue] = React.useState(
    (rest.defaultValue as string) ?? "#019458"
  );
  const current = (rest.value as string) ?? internalValue;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
      {label && (
        <label
          style={{
            display: "block",
            fontFamily: "var(--bp-font-mono)",
            fontSize: "var(--bp-text-xs)",
            letterSpacing: "0.12em",
            color: "var(--bp-text-muted)",
            textTransform: "uppercase",
          }}
        >
          {label}
        </label>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: "var(--bp-radius-sm)",
            background: current,
            border: "1px solid var(--bp-border)",
            flexShrink: 0,
            boxShadow: "var(--bp-shadow-sm)",
          }}
        />
        <input
          type="color"
          {...rest}
          value={current}
          onChange={(e) => {
            setInternalValue(e.target.value);
            rest.onChange?.(e);
          }}
          style={{
            fontFamily: "var(--bp-font-body)",
            fontSize: "var(--bp-text-sm)",
            color: "var(--bp-text)",
            background: "var(--bp-bg)",
            border: "1px solid var(--bp-border)",
            borderRadius: "var(--bp-radius-sm)",
            outline: "none",
            padding: "0.2rem 0.4rem",
            width: "100%",
            cursor: "pointer",
            boxShadow: "var(--bp-shadow-inset)",
            ...style,
          }}
        />
      </div>
    </div>
  );
}
