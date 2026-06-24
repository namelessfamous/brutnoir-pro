import React from "react";

export interface InputGroupProps {
  children: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const addonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 10px",
  background: "var(--bp-bg)",
  border: "1px solid #000",
  color: "var(--bp-text-muted)",
  fontSize: "var(--bp-text-sm)",
  fontFamily: "var(--bp-font-mono)",
  fontWeight: 500,
  whiteSpace: "nowrap",
  flexShrink: 0,
  minWidth: "36px",
  userSelect: "none",
};

export function InputGroup({
  children,
  prefix,
  suffix,
  style,
  className,
}: InputGroupProps): React.ReactElement {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "stretch",
        width: "100%",
        boxShadow: "2px 2px 0 0 #000",
        ...style,
      }}
    >
      {prefix && (
        <span
          style={{
            ...addonStyle,
            borderRight: "none",
            borderRadius: "var(--bp-radius-sm) 0 0 var(--bp-radius-sm)",
          }}
        >
          {prefix}
        </span>
      )}

      {/* Clone children to inject connected border styling */}
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        const el = child as React.ReactElement<{
          style?: React.CSSProperties;
          [key: string]: unknown;
        }>;
        return React.cloneElement(el, {
          style: {
            ...(el.props.style ?? {}),
            borderRadius: 0,
            borderLeft: prefix ? "none" : "1px solid #000",
            borderRight: suffix ? "none" : "1px solid #000",
            flex: 1,
            minWidth: 0,
            boxShadow: "none",
          },
        });
      })}

      {suffix && (
        <span
          style={{
            ...addonStyle,
            borderLeft: "none",
            borderRadius: "0 var(--bp-radius-sm) var(--bp-radius-sm) 0",
          }}
        >
          {suffix}
        </span>
      )}
    </div>
  );
}
