import React from "react";

export interface SelectionCardProps {
  title: string;
  description?: string;
  icon?: string;
  selected: boolean;
  onClick: () => void;
  /** "stack" = icon big on top (vertical), "template" = icon left (horizontal) */
  layout?: "stack" | "template";
  badge?: string;
  thumbnail?: string;
  thumbnailAlt?: string;
}

export function SelectionCard({
  title,
  description,
  icon,
  selected,
  onClick,
  layout = "stack",
  badge,
  thumbnail,
  thumbnailAlt,
}: SelectionCardProps): React.ReactElement {
  const baseStyle: React.CSSProperties = {
    position: "relative",
    display: "flex",
    flexDirection: layout === "stack" ? "column" : "row",
    alignItems: layout === "stack" ? "flex-start" : "center",
    gap: layout === "stack" ? "0.75rem" : "1rem",
    padding: layout === "stack" ? "1.1rem" : "0.9rem",
    background: selected ? "var(--bp-green-bg)" : "var(--bp-surface)",
    border: `2px solid ${selected ? "var(--bp-green)" : "var(--bp-border)"}`,
    borderRadius: "var(--bp-radius)",
    cursor: "pointer",
    textAlign: "left",
    transition: "border-color var(--bp-transition-fast), background var(--bp-transition-fast)",
    width: "100%",
    boxShadow: selected ? "none" : "var(--bp-shadow-sm)",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      style={baseStyle}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = "var(--bp-text-muted)";
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = "var(--bp-border)";
        }
      }}
    >
      {/* Selected checkmark */}
      {selected && (
        <div
          style={{
            position: "absolute",
            top: "0.5rem",
            right: "0.5rem",
            width: "1.1rem",
            height: "1.1rem",
            borderRadius: "50%",
            background: "var(--bp-green)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--bp-font-mono)",
            fontSize: "0.55rem",
            color: "var(--bp-bg)",
          }}
        >
          ✓
        </div>
      )}

      {/* Icon */}
      {icon && layout === "stack" && (
        <div style={{ fontSize: "2rem" }}>{icon}</div>
      )}
      {icon && layout === "template" && (
        <div
          style={{
            flexShrink: 0,
            width: "2.5rem",
            height: "2.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--bp-border)",
            borderRadius: "var(--bp-radius-sm)",
            fontSize: "1.25rem",
          }}
        >
          {icon}
        </div>
      )}

      {/* Text */}
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem" }}>
          <span
            style={{
              fontFamily: "var(--bp-font-body)",
              fontSize: "var(--bp-text-sm)",
              fontWeight: "600",
              color: "var(--bp-text)",
            }}
          >
            {title}
          </span>
          {badge && (
            <span
              style={{
                flexShrink: 0,
                fontFamily: "var(--bp-font-mono)",
                fontSize: "var(--bp-text-xs)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "0.1rem 0.35rem",
                background: "var(--bp-border)",
                color: "var(--bp-text-muted)",
                borderRadius: "var(--bp-radius-sm)",
              }}
            >
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p
            style={{
              fontFamily: "var(--bp-font-body)",
              fontSize: "var(--bp-text-sm)",
              color: "var(--bp-text-muted)",
              marginTop: "0.3rem",
              lineHeight: 1.5,
              margin: "0.3rem 0 0",
            }}
          >
            {description}
          </p>
        )}
        {thumbnail && (
          <img
            src={thumbnail}
            alt={thumbnailAlt ?? title}
            style={{
              marginTop: "0.75rem",
              width: "100%",
              maxHeight: "7.5rem",
              objectFit: "cover",
              border: "1px solid var(--bp-border)",
              borderRadius: "var(--bp-radius-sm)",
            }}
          />
        )}
      </div>

      {/* Radio dot for template layout */}
      {layout === "template" && (
        <div
          style={{
            flexShrink: 0,
            width: "0.9rem",
            height: "0.9rem",
            borderRadius: "50%",
            border: `2px solid ${selected ? "var(--bp-green)" : "var(--bp-text-muted)"}`,
            background: selected ? "var(--bp-green)" : "transparent",
            transition: "all var(--bp-transition-fast)",
          }}
        />
      )}
    </button>
  );
}
