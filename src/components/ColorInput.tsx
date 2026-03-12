import React from "react";

export interface ColorInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function ColorInput({ label, style, ...rest }: ColorInputProps): React.ReactElement {
  const [value, setValue] = React.useState(rest.defaultValue as string ?? "#019458");
  const current = rest.value as string ?? value;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
      {label && (
        <label
          style={{
            display: "block",
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: "0.55rem",
            letterSpacing: "0.2em",
            color: "var(--bp-text-muted, #404040)",
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
            borderRadius: 2,
            background: current,
            border: "1px solid var(--bp-border, #1a1a1a)",
            flexShrink: 0,
          }}
        />
        <input
          type="color"
          {...rest}
          value={current}
          onChange={(e) => {
            setValue(e.target.value);
            rest.onChange?.(e);
          }}
          style={{
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: "0.65rem",
            color: "var(--bp-text, #f0ede6)",
            background: "transparent",
            border: "none",
            borderBottom: "1px solid var(--bp-border, #1a1a1a)",
            outline: "none",
            padding: "0.2rem 0",
            width: "100%",
            cursor: "pointer",
            ...style,
          }}
        />
      </div>
    </div>
  );
}
