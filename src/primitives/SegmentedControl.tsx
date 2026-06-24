import React, { useId } from "react";

export interface SegmentedControlOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  size?: "sm" | "md";
  fullWidth?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function SegmentedControl({
  options,
  value,
  onChange,
  size = "md",
  fullWidth = false,
  style,
  className,
}: SegmentedControlProps): React.ReactElement {
  const uid = useId();

  const height = size === "sm" ? "28px" : "34px";
  const px     = size === "sm" ? "10px" : "16px";
  const fs     = size === "sm" ? "var(--bp-text-xs)" : "var(--bp-text-sm)";

  return (
    <div
      className={className}
      style={{
        display: fullWidth ? "flex" : "inline-flex",
        alignItems: "center",
        borderRadius: "var(--bp-radius-sm)",
        boxShadow: "2px 2px 0 0 #000000",
        ...style,
      }}
    >
      {options.map((opt, i) => {
        const inputId = `${uid}-${opt.value}`;
        const isSelected = opt.value === value;
        const isFirst = i === 0;
        const isLast  = i === options.length - 1;

        return (
          <label
            key={opt.value}
            htmlFor={inputId}
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              height,
              padding: `0 ${px}`,
              fontSize: fs,
              fontFamily: "var(--bp-font-body)",
              fontWeight: 500,
              letterSpacing: "0.007em",
              border: "1px solid #000",
              marginLeft: isFirst ? 0 : "-1px",
              borderRadius: isFirst
                ? "var(--bp-radius-sm) 0 0 var(--bp-radius-sm)"
                : isLast
                ? "0 var(--bp-radius-sm) var(--bp-radius-sm) 0"
                : "0",
              background: isSelected ? "#000" : "var(--bp-surface)",
              color: isSelected ? "var(--bp-bg)" : "var(--bp-text)",
              cursor: opt.disabled ? "not-allowed" : "pointer",
              opacity: opt.disabled ? 0.5 : 1,
              userSelect: "none",
              flex: fullWidth ? 1 : undefined,
              transition: "background var(--bp-transition-fast), color var(--bp-transition-fast)",
              zIndex: isSelected ? 1 : 0,
            }}
          >
            <input
              id={inputId}
              type="radio"
              name={uid}
              value={opt.value}
              checked={isSelected}
              disabled={opt.disabled}
              onChange={() => !opt.disabled && onChange(opt.value)}
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0,
                zIndex: 10,
                cursor: opt.disabled ? "not-allowed" : "pointer",
                margin: 0,
              }}
            />
            <span style={{ position: "relative", zIndex: 0 }}>{opt.label}</span>
          </label>
        );
      })}
    </div>
  );
}
