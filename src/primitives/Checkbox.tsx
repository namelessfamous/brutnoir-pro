import React, { useId } from "react";

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  indeterminate?: boolean;
  id?: string;
  name?: string;
  value?: string;
  style?: React.CSSProperties;
  className?: string;
}

export function Checkbox({
  checked,
  onChange,
  label,
  disabled = false,
  indeterminate = false,
  id,
  name,
  value,
  style,
  className,
}: CheckboxProps): React.ReactElement {
  const autoId = useId();
  const inputId = id ?? `bp-checkbox-${autoId}`;
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <>
      <style>{`
        .bp-checkbox-input {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border: 2px solid #000;
          border-radius: var(--bp-radius-sm);
          background: var(--bp-surface);
          cursor: pointer;
          flex-shrink: 0;
          position: relative;
          transition: background var(--bp-transition-fast), box-shadow var(--bp-transition-fast), transform var(--bp-transition-fast);
        }
        .bp-checkbox-input:checked,
        .bp-checkbox-input:indeterminate {
          background: var(--bp-green);
          border-color: #000;
        }
        .bp-checkbox-input:checked::after {
          content: '';
          position: absolute;
          left: 3px;
          top: 0px;
          width: 6px;
          height: 10px;
          border: 2px solid #000;
          border-top: none;
          border-left: none;
          transform: rotate(45deg);
        }
        .bp-checkbox-input:indeterminate::after {
          content: '';
          position: absolute;
          left: 2px;
          top: 5px;
          width: 10px;
          height: 2px;
          background: #000;
        }
        .bp-checkbox-input:hover:not(:disabled) {
          box-shadow: 2px 2px 0 0 #000;
          transform: translate(-1px, -1px);
        }
        .bp-checkbox-input:focus-visible {
          outline: none;
          box-shadow: 3px 3px 0 0 #000;
          transform: translate(-1px, -1px);
        }
        .bp-checkbox-input:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
        .bp-checkbox-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-family: var(--bp-font-body);
          font-size: var(--bp-text-base);
          color: var(--bp-text);
          user-select: none;
        }
        .bp-checkbox-label--disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
      `}</style>
      <label
        htmlFor={inputId}
        className={`bp-checkbox-label${disabled ? " bp-checkbox-label--disabled" : ""}${className ? ` ${className}` : ""}`}
        style={style}
      >
        <input
          ref={inputRef}
          type="checkbox"
          id={inputId}
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="bp-checkbox-input"
        />
        {label && <span>{label}</span>}
      </label>
    </>
  );
}
