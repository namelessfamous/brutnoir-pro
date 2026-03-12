import React from "react";

export interface ConfirmRowProps {
  label: string;
  onConfirm: () => void;
  onCancel: () => void;
  colSpan: number;
}

export function ConfirmRow({
  label,
  onConfirm,
  onCancel,
  colSpan,
}: ConfirmRowProps): React.ReactElement {
  return (
    <tr style={{ background: "var(--bp-red-bg)" }}>
      <td
        colSpan={colSpan}
        style={{
          padding: "0.75rem 1rem",
          fontFamily: "var(--bp-font-mono)",
          fontSize: "0.6rem",
          letterSpacing: "0.1em",
        }}
      >
        <span style={{ color: "var(--bp-red)", marginRight: "1.5rem" }}>{label}</span>
        <button
          onClick={onConfirm}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--bp-font-mono)",
            fontSize: "0.6rem",
            letterSpacing: "0.15em",
            color: "var(--bp-red)",
            textTransform: "uppercase",
            marginRight: "1rem",
            padding: 0,
            transition: "color 0.1s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--bp-red-hover)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--bp-red)";
          }}
        >
          Confirm
        </button>
        <button
          onClick={onCancel}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--bp-font-mono)",
            fontSize: "0.6rem",
            letterSpacing: "0.15em",
            color: "var(--bp-text-muted)",
            textTransform: "uppercase",
            padding: 0,
            transition: "color 0.1s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--bp-text)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--bp-text-muted)";
          }}
        >
          Cancel
        </button>
      </td>
    </tr>
  );
}
