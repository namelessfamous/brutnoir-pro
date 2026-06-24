import React, { useId } from "react";

export interface RangeProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  label?: React.ReactNode;
  showValue?: boolean;
  id?: string;
  name?: string;
  style?: React.CSSProperties;
  className?: string;
}

export function Range({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  label,
  showValue = false,
  id,
  name,
  style,
  className,
}: RangeProps): React.ReactElement {
  const autoId = useId();
  const inputId = id ?? `bp-range-${autoId}`;

  // Calculate percentage for thumb positioning
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <>
      <style>{`
        .bp-range-wrapper {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-family: var(--bp-font-body);
          color: var(--bp-text);
        }
        .bp-range-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .bp-range-input {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border: 2px solid #000;
          border-radius: var(--bp-radius-sm);
          background: var(--bp-bg);
          cursor: pointer;
          outline: none;
          transition: box-shadow var(--bp-transition-fast), transform var(--bp-transition-fast);
        }
        .bp-range-input::-webkit-slider-runnable-track {
          height: 6px;
          border-radius: var(--bp-radius-sm);
        }
        .bp-range-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border: 2px solid #000;
          border-radius: 50%;
          background: var(--bp-green);
          cursor: pointer;
          margin-top: -8px;
          transition: box-shadow var(--bp-transition-fast), transform var(--bp-transition-fast);
        }
        .bp-range-input::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border: 2px solid #000;
          border-radius: 50%;
          background: var(--bp-green);
          cursor: pointer;
          box-shadow: none;
        }
        .bp-range-input:hover:not(:disabled)::-webkit-slider-thumb {
          box-shadow: 2px 2px 0 0 #000;
          transform: translate(-1px, -1px);
        }
        .bp-range-input:focus-visible::-webkit-slider-thumb {
          box-shadow: 3px 3px 0 0 #000;
        }
        .bp-range-input:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
        .bp-range-value {
          font-size: var(--bp-text-sm);
          font-family: var(--bp-font-mono);
          color: var(--bp-text-muted);
          min-width: 2.5rem;
          text-align: right;
        }
        .bp-range-label {
          font-size: var(--bp-text-sm);
          color: var(--bp-text-muted);
          font-weight: 500;
        }
      `}</style>
      <div
        className={`bp-range-wrapper${className ? ` ${className}` : ""}`}
        style={style}
      >
        {label && (
          <label htmlFor={inputId} className="bp-range-label">
            {label}
          </label>
        )}
        <div className="bp-range-row">
          <input
            type="range"
            id={inputId}
            name={name}
            min={min}
            max={max}
            step={step}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(Number(e.target.value))}
            className="bp-range-input"
            style={{
              background: `linear-gradient(to right, var(--bp-green) 0%, var(--bp-green) ${pct}%, var(--bp-bg) ${pct}%, var(--bp-bg) 100%)`,
            }}
          />
          {showValue && (
            <span className="bp-range-value">{value}</span>
          )}
        </div>
      </div>
    </>
  );
}
