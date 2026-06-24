import React, { useEffect, useRef } from "react";

export type DrawerPlacement = "left" | "right" | "top" | "bottom";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  /** Width for left/right drawers, height for top/bottom */
  size?: string | number;
  placement?: DrawerPlacement;
  /** Show the dark backdrop overlay */
  overlay?: boolean;
  /** Inline styles for the drawer panel */
  style?: React.CSSProperties;
  className?: string;
}

function getTranslate(placement: DrawerPlacement, open: boolean): string {
  if (open) return "translate(0, 0)";
  switch (placement) {
    case "right":  return "translateX(100%)";
    case "left":   return "translateX(-100%)";
    case "top":    return "translateY(-100%)";
    case "bottom": return "translateY(100%)";
  }
}

function getPanelStyle(placement: DrawerPlacement, size: string | number): React.CSSProperties {
  const s = typeof size === "number" ? `${size}px` : size;
  switch (placement) {
    case "right":
      return { top: 0, bottom: 0, right: 0, width: s, borderLeft: "2px solid #000", borderRadius: "8px 0 0 8px" };
    case "left":
      return { top: 0, bottom: 0, left: 0, width: s, borderRight: "2px solid #000", borderRadius: "0 8px 8px 0" };
    case "top":
      return { top: 0, left: 0, right: 0, height: s, borderBottom: "2px solid #000", borderRadius: "0 0 8px 8px" };
    case "bottom":
      return { bottom: 0, left: 0, right: 0, height: s, borderTop: "2px solid #000", borderRadius: "8px 8px 0 0" };
  }
}

export function Drawer({
  open,
  onClose,
  title,
  children,
  size = 420,
  placement = "right",
  overlay = true,
  style,
  className,
}: DrawerProps): React.ReactElement {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const translate = getTranslate(placement, open);
  const panelPositioning = getPanelStyle(placement, size);

  return (
    <>
      <style>{`
        .bp-drawer-root {
          position: fixed;
          inset: 0;
          z-index: var(--bp-z-modal);
          pointer-events: none;
        }
        .bp-drawer-root--open {
          pointer-events: auto;
        }
        .bp-drawer-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .bp-drawer-overlay--visible {
          opacity: 1;
        }
        .bp-drawer-panel {
          position: absolute;
          background: var(--bp-surface);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: transform 0.35s ease;
        }
        .bp-drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 1.5rem 1rem;
          border-bottom: 2px solid #000;
          flex-shrink: 0;
          background: var(--bp-bg);
        }
        .bp-drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
        }
        .bp-drawer-close-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--bp-text-muted);
          font-size: 1rem;
          line-height: 1;
          padding: 0.25rem;
          border-radius: var(--bp-radius-sm);
          transition: color var(--bp-transition-fast);
        }
        .bp-drawer-close-btn:hover {
          color: var(--bp-red);
        }
      `}</style>
      <div className={`bp-drawer-root${open ? " bp-drawer-root--open" : ""}`}>
        {overlay && (
          <div
            className={`bp-drawer-overlay${open ? " bp-drawer-overlay--visible" : ""}`}
            onClick={onClose}
            aria-hidden="true"
          />
        )}
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "bp-drawer-title" : undefined}
          className={`bp-drawer-panel${className ? ` ${className}` : ""}`}
          style={{
            ...panelPositioning,
            transform: translate,
            ...style,
          }}
        >
          {title !== undefined && (
            <div className="bp-drawer-header">
              <h2
                id="bp-drawer-title"
                style={{
                  fontFamily: "var(--bp-font-body)",
                  fontSize: "var(--bp-text-md)",
                  fontWeight: 700,
                  color: "var(--bp-text)",
                  margin: 0,
                  flex: 1,
                }}
              >
                {title}
              </h2>
              <button
                onClick={onClose}
                className="bp-drawer-close-btn"
                aria-label="Close drawer"
              >
                ✕
              </button>
            </div>
          )}
          {title === undefined && (
            <button
              onClick={onClose}
              className="bp-drawer-close-btn"
              aria-label="Close drawer"
              style={{ position: "absolute", top: "1rem", right: "1rem", zIndex: 1 }}
            >
              ✕
            </button>
          )}
          <div className="bp-drawer-body">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
