import React, { useState } from "react";

export interface AccordionItem {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Allow multiple panels open at once */
  multiple?: boolean;
  /** Default open item ids */
  defaultOpen?: string[];
  /** Controlled open item ids */
  openIds?: string[];
  onOpenChange?: (openIds: string[]) => void;
  style?: React.CSSProperties;
  className?: string;
}

export function Accordion({
  items,
  multiple = false,
  defaultOpen = [],
  openIds: controlledOpenIds,
  onOpenChange,
  style,
  className,
}: AccordionProps): React.ReactElement {
  const [internalOpen, setInternalOpen] = useState<string[]>(defaultOpen);
  const openIds = controlledOpenIds ?? internalOpen;

  const toggle = (id: string) => {
    let next: string[];
    if (openIds.includes(id)) {
      next = openIds.filter((x) => x !== id);
    } else {
      next = multiple ? [...openIds, id] : [id];
    }
    if (!controlledOpenIds) setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <div
      className={className}
      style={{ display: "flex", flexDirection: "column", gap: "1rem", ...style }}
    >
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div
            key={item.id}
            style={{
              position: "relative",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              background: "var(--bp-surface)",
              border: "2px solid #000",
              borderRadius: "var(--bp-radius)",
              boxShadow: "4px 4px 0 0 #000",
              overflow: "hidden",
            }}
          >
            {/* Trigger */}
            <button
              onClick={() => !item.disabled && toggle(item.id)}
              disabled={item.disabled}
              aria-expanded={isOpen}
              aria-controls={`bp-accordion-panel-${item.id}`}
              id={`bp-accordion-trigger-${item.id}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.75rem 1rem",
                background: "var(--bp-bg)",
                border: "none",
                borderBottom: isOpen ? "2px solid #000" : "none",
                cursor: item.disabled ? "not-allowed" : "pointer",
                textAlign: "left",
                width: "100%",
                opacity: item.disabled ? 0.45 : 1,
                transition: "background var(--bp-transition-fast)",
              }}
              onMouseEnter={(e) => {
                if (!item.disabled) e.currentTarget.style.background = "var(--bp-surface)";
              }}
              onMouseLeave={(e) => {
                if (!item.disabled) e.currentTarget.style.background = "var(--bp-bg)";
              }}
            >
              <span
                style={{
                  fontFamily: "var(--bp-font-body)",
                  fontSize: "var(--bp-text-base)",
                  fontWeight: 700,
                  color: "var(--bp-text)",
                }}
              >
                {item.title}
              </span>
              <span
                style={{
                  marginLeft: "auto",
                  display: "inline-block",
                  transition: "transform 0.3s ease",
                  transform: isOpen ? "rotate(-180deg)" : "rotate(0deg)",
                  color: "var(--bp-text)",
                  fontSize: "0.75rem",
                  lineHeight: 1,
                }}
              >
                ▼
              </span>
            </button>

            {/* Content */}
            {isOpen && (
              <div
                id={`bp-accordion-panel-${item.id}`}
                role="region"
                aria-labelledby={`bp-accordion-trigger-${item.id}`}
                style={{
                  flex: 1,
                  padding: "1.5rem",
                  background: "var(--bp-surface)",
                  fontFamily: "var(--bp-font-body)",
                  fontSize: "var(--bp-text-base)",
                  color: "var(--bp-text)",
                }}
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
