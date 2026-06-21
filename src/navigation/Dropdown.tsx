import React, { useEffect, useRef, useState } from "react";

export interface DropdownItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  /** Renders as a visual separator — ignores other props */
  separator?: boolean;
  /** Color variant for destructive actions */
  variant?: "default" | "danger";
}

export interface DropdownProps {
  /** Trigger element */
  trigger: React.ReactElement;
  items: DropdownItem[];
  /** Alignment of the dropdown relative to the trigger */
  align?: "left" | "right";
  style?: React.CSSProperties;
}

export function Dropdown({
  trigger,
  items,
  align = "left",
  style,
}: DropdownProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", keyHandler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", keyHandler);
    };
  }, [open]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const triggerWithHandler = React.cloneElement(trigger as React.ReactElement<any>, {
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      setOpen((prev) => !prev);
      (trigger.props as React.HTMLAttributes<HTMLElement>).onClick?.(e as React.MouseEvent<HTMLElement>);
    },
    "aria-haspopup": "true",
    "aria-expanded": open,
  });

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", display: "inline-flex", ...style }}
    >
      {triggerWithHandler}

      {open && (
        <div
          role="menu"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            ...(align === "right" ? { right: 0 } : { left: 0 }),
            background: "var(--bp-surface)",
            border: "1px solid var(--bp-border)",
            borderRadius: "var(--bp-radius)",
            boxShadow: "var(--bp-shadow)",
            zIndex: "var(--bp-z-dropdown)" as unknown as number,
            minWidth: "160px",
            overflow: "hidden",
            animation: "bp-dropdown-in 0.1s ease",
          }}
        >
          {items.map((item, i) => {
            if (item.separator) {
              return (
                <div
                  key={i}
                  role="separator"
                  style={{
                    height: "1px",
                    background: "var(--bp-border)",
                    margin: "0.25rem 0",
                  }}
                />
              );
            }

            const isDanger = item.variant === "danger";
            const Tag = item.href ? "a" : "button";

            const commonStyle: React.CSSProperties = {
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              width: "100%",
              padding: "0.5rem 0.75rem",
              background: "none",
              border: "none",
              cursor: item.disabled ? "not-allowed" : "pointer",
              fontFamily: "var(--bp-font-body)",
              fontSize: "var(--bp-text-sm)",
              color: item.disabled
                ? "var(--bp-text-dim)"
                : isDanger ? "var(--bp-red)" : "var(--bp-text-muted)",
              textDecoration: "none",
              textAlign: "left",
              transition: "background var(--bp-transition-fast), color var(--bp-transition-fast)",
              opacity: item.disabled ? 0.5 : 1,
            };

            return (
              <Tag
                key={item.id}
                role="menuitem"
                href={(Tag === "a" && item.href) ? item.href : undefined}
                disabled={Tag === "button" ? item.disabled : undefined}
                aria-disabled={item.disabled}
                onClick={() => {
                  if (item.disabled) return;
                  item.onClick?.();
                  setOpen(false);
                }}
                style={commonStyle}
                onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
                  if (!item.disabled) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    if (!isDanger) e.currentTarget.style.color = "var(--bp-text)";
                  }
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
                  e.currentTarget.style.background = "none";
                  e.currentTarget.style.color = item.disabled
                    ? "var(--bp-text-dim)"
                    : isDanger ? "var(--bp-red)" : "var(--bp-text-muted)";
                }}
              >
                {item.icon && (
                  <span style={{ flexShrink: 0, opacity: 0.7, display: "flex", alignItems: "center" }}>
                    {item.icon}
                  </span>
                )}
                {item.label}
              </Tag>
            );
          })}
        </div>
      )}
      <style>{`@keyframes bp-dropdown-in { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  );
}

/** Menu — alias for Dropdown, for clarity when used as a context/action menu */
export const Menu = Dropdown;
export type MenuProps = DropdownProps;
export type MenuItemProps = DropdownItem;
