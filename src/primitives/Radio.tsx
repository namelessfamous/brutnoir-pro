import React, { useId } from "react";

export interface RadioOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface RadioProps {
  /** The currently selected value */
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  name?: string;
  /** Layout direction */
  direction?: "vertical" | "horizontal";
  style?: React.CSSProperties;
  className?: string;
}

export function Radio({
  value,
  onChange,
  options,
  name,
  direction = "vertical",
  style,
  className,
}: RadioProps): React.ReactElement {
  const autoId = useId();
  const groupName = name ?? `bp-radio-${autoId}`;

  return (
    <>
      <style>{`
        .bp-radio-input {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border: 2px solid #000;
          border-radius: 50%;
          background: var(--bp-surface);
          cursor: pointer;
          flex-shrink: 0;
          position: relative;
          transition: background var(--bp-transition-fast), box-shadow var(--bp-transition-fast), transform var(--bp-transition-fast);
        }
        .bp-radio-input:checked {
          background: var(--bp-surface);
          border-color: #000;
        }
        .bp-radio-input:checked::after {
          content: '';
          position: absolute;
          left: 2px;
          top: 2px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--bp-green);
        }
        .bp-radio-input:hover:not(:disabled) {
          box-shadow: 2px 2px 0 0 #000;
          transform: translate(-1px, -1px);
        }
        .bp-radio-input:focus-visible {
          outline: none;
          box-shadow: 3px 3px 0 0 #000;
          transform: translate(-1px, -1px);
        }
        .bp-radio-input:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
        .bp-radio-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-family: var(--bp-font-body);
          font-size: var(--bp-text-base);
          color: var(--bp-text);
          user-select: none;
        }
        .bp-radio-label--disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
      `}</style>
      <div
        role="radiogroup"
        className={className}
        style={{
          display: "flex",
          flexDirection: direction === "horizontal" ? "row" : "column",
          gap: direction === "horizontal" ? "1.5rem" : "0.75rem",
          ...style,
        }}
      >
        {options.map((opt) => {
          const optId = `${groupName}-${opt.value}`;
          return (
            <label
              key={opt.value}
              htmlFor={optId}
              className={`bp-radio-label${opt.disabled ? " bp-radio-label--disabled" : ""}`}
            >
              <input
                type="radio"
                id={optId}
                name={groupName}
                value={opt.value}
                checked={value === opt.value}
                disabled={opt.disabled}
                onChange={() => onChange(opt.value)}
                className="bp-radio-input"
              />
              <span>{opt.label}</span>
            </label>
          );
        })}
      </div>
    </>
  );
}
