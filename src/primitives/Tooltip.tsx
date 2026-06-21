import React, { useState, useRef } from "react";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  placement?: "top" | "bottom" | "left" | "right";
  /** Delay before showing tooltip in ms */
  delay?: number;
}

export function Tooltip({
  content,
  children,
  placement = "top",
  delay = 400,
}: TooltipProps): React.ReactElement {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    timerRef.current = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  };

  const placementStyles: Record<string, React.CSSProperties> = {
    top:    { bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)" },
    bottom: { top: "calc(100% + 6px)",   left: "50%", transform: "translateX(-50%)" },
    left:   { right: "calc(100% + 6px)", top: "50%",  transform: "translateY(-50%)" },
    right:  { left: "calc(100% + 6px)",  top: "50%",  transform: "translateY(-50%)" },
  };

  const arrowStyles: Record<string, React.CSSProperties> = {
    top: {
      bottom: "-4px", left: "50%", transform: "translateX(-50%)",
      borderLeft: "4px solid transparent", borderRight: "4px solid transparent",
      borderTop: "4px solid var(--bp-surface)",
    },
    bottom: {
      top: "-4px", left: "50%", transform: "translateX(-50%)",
      borderLeft: "4px solid transparent", borderRight: "4px solid transparent",
      borderBottom: "4px solid var(--bp-surface)",
    },
    left: {
      right: "-4px", top: "50%", transform: "translateY(-50%)",
      borderTop: "4px solid transparent", borderBottom: "4px solid transparent",
      borderLeft: "4px solid var(--bp-surface)",
    },
    right: {
      left: "-4px", top: "50%", transform: "translateY(-50%)",
      borderTop: "4px solid transparent", borderBottom: "4px solid transparent",
      borderRight: "4px solid var(--bp-surface)",
    },
  };

  return (
    <span
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && content && (
        <span
          role="tooltip"
          style={{
            position: "absolute",
            zIndex: "var(--bp-z-tooltip)" as unknown as number,
            background: "var(--bp-surface)",
            color: "var(--bp-text)",
            border: "1px solid var(--bp-border)",
            borderRadius: "var(--bp-radius-sm)",
            padding: "0.3rem 0.6rem",
            fontFamily: "var(--bp-font-body)",
            fontSize: "var(--bp-text-xs)",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            boxShadow: "var(--bp-shadow)",
            ...placementStyles[placement],
          }}
        >
          {content}
          <span
            style={{
              position: "absolute",
              width: 0,
              height: 0,
              ...arrowStyles[placement],
            }}
          />
        </span>
      )}
    </span>
  );
}
