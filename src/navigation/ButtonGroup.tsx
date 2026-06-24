import React from "react";

export interface ButtonGroupProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  style?: React.CSSProperties;
  className?: string;
}

export function ButtonGroup({
  children,
  size,
  style,
  className,
}: ButtonGroupProps): React.ReactElement {
  const validChildren = React.Children.toArray(children).filter(
    (c) => React.isValidElement(c)
  ) as React.ReactElement<{
    size?: string;
    style?: React.CSSProperties;
    [key: string]: unknown;
  }>[];

  const count = validChildren.length;

  return (
    <div
      className={className}
      role="group"
      style={{
        display: "inline-flex",
        alignItems: "stretch",
        boxShadow: "2px 2px 0 0 #000",
        ...style,
      }}
    >
      {validChildren.map((child, i) => {
        const isFirst = i === 0;
        const isLast  = i === count - 1;
        const isOnly  = count === 1;

        const borderRadius = isOnly
          ? "var(--bp-radius-sm)"
          : isFirst
          ? "var(--bp-radius-sm) 0 0 var(--bp-radius-sm)"
          : isLast
          ? "0 var(--bp-radius-sm) var(--bp-radius-sm) 0"
          : "0";

        return React.cloneElement(child, {
          key: i,
          ...(size ? { size } : {}),
          style: {
            ...(child.props.style ?? {}),
            borderRadius,
            // Remove left border on non-first to prevent double borders
            borderLeft: !isFirst ? "none" : undefined,
            // Suppress individual box-shadow — group has its own
            boxShadow: "none",
          },
        });
      })}
    </div>
  );
}
