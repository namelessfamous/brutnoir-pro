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
    padding: layout === "stack" ? "1.25rem" : "1rem",
    background: selected ? "var(--bp-green-bg)" : "var(--bp-surface)",
    border: `2px solid ${selected ? "var(--bp-green)" : "var(--bp-border)"}`,
    cursor: "pointer",
    textAlign: "left",
    transition: "border-color 0.1s, background 0.1s",
    width: "100%",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      style={baseStyle}
      onMouseEnter={(e) => {
        if (!selected) {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--bp-text-muted)";
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--bp-border)";
        }
      }}
    >
      {/* Selected indicator */}
      {selected && (
        <div
          style={{
            position: "absolute",
            top: "0.6rem",
            right: "0.6rem",
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
              fontFamily: "var(--bp-font-mono)",
              fontSize: "0.7rem",
              letterSpacing: "0.1em",
              fontWeight: "bold",
              color: "var(--bp-text)",
              textTransform: "uppercase",
            }}
          >
            {title}
          </span>
          {badge && (
            <span
              style={{
                flexShrink: 0,
                fontFamily: "var(--bp-font-mono)",
                fontSize: "0.45rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                padding: "0.1rem 0.35rem",
                background: "var(--bp-border)",
                color: "var(--bp-text-muted)",
              }}
            >
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p
            style={{
              fontFamily: "var(--bp-font-mono)",
              fontSize: "0.6rem",
              color: "var(--bp-text-muted)",
              marginTop: "0.35rem",
              lineHeight: 1.5,
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
            transition: "all 0.1s",
          }}
        />
      )}
    </button>
  );
}
