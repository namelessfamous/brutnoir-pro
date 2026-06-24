import React, { useId } from "react";

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  labelPosition?: "left" | "right";
  disabled?: boolean;
  id?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  style?: React.CSSProperties;
  className?: string;
}

const sizes = {
  sm: { width: 36, height: 20, knob: 14, offset: 3 },
  md: { width: 48, height: 26, knob: 20, offset: 3 },
  lg: { width: 60, height: 32, knob: 26, offset: 3 },
};

export function Switch({
  checked,
  onChange,
  label,
  labelPosition = "right",
  disabled = false,
  id,
  name,
  size = "md",
  style,
  className,
}: SwitchProps): React.ReactElement {
  const autoId = useId();
  const inputId = id ?? `bp-switch-${autoId}`;
  const dim = sizes[size];
  const knobTravel = dim.width - dim.knob - dim.offset * 2;

  return (
    <>
      <style>{`
        .bp-switch-track {
          position: relative;
          display: inline-block;
          border: 2px solid #000;
          border-radius: 9999px;
          cursor: pointer;
          transition: background var(--bp-transition-fast), box-shadow var(--bp-transition-fast), transform var(--bp-transition-fast);
          flex-shrink: 0;
        }
        .bp-switch-track--checked {
          background: var(--bp-green);
        }
        .bp-switch-track--unchecked {
          background: var(--bp-bg);
        }
        .bp-switch-track:hover:not(.bp-switch-track--disabled) {
          box-shadow: 2px 2px 0 0 #000;
          transform: translate(-1px, -1px);
        }
        .bp-switch-track--disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
        .bp-switch-knob {
          position: absolute;
          border-radius: 50%;
          background: #000;
          transition: transform var(--bp-transition-fast);
        }
        .bp-switch-label {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-family: var(--bp-font-body);
          font-size: var(--bp-text-base);
          color: var(--bp-text);
          user-select: none;
        }
        .bp-switch-label--disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
        .bp-switch-input {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0,0,0,0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
      <label
        htmlFor={inputId}
        className={`bp-switch-label${disabled ? " bp-switch-label--disabled" : ""}${className ? ` ${className}` : ""}`}
        style={{ flexDirection: labelPosition === "left" ? "row-reverse" : "row", ...style }}
      >
        <input
          type="checkbox"
          id={inputId}
          name={name}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="bp-switch-input"
        />
        <span
          className={`bp-switch-track${checked ? " bp-switch-track--checked" : " bp-switch-track--unchecked"}${disabled ? " bp-switch-track--disabled" : ""}`}
          style={{ width: dim.width, height: dim.height }}
          aria-hidden="true"
        >
          <span
            className="bp-switch-knob"
            style={{
              width: dim.knob,
              height: dim.knob,
              top: dim.offset,
              left: dim.offset,
              transform: checked ? `translateX(${knobTravel}px)` : "translateX(0)",
            }}
          />
        </span>
        {label && <span>{label}</span>}
      </label>
    </>
  );
}
