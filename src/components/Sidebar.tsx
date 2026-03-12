import React from "react";

export interface SidebarItem {
  label: string;
  href: string;
  exact?: boolean; // if true, only highlight on exact path match
}

export interface SidebarProps {
  title: string;
  subtitle?: string;
  items: SidebarItem[];
  activePath: string;
  onLogout?: () => void;
  footer?: React.ReactNode;
}

export function Sidebar({
  title,
  subtitle,
  items,
  activePath,
  onLogout,
  footer,
}: SidebarProps): React.ReactElement {
  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: "220px",
        height: "100vh",
        background: "var(--bp-surface)",
        borderRight: "1px solid var(--bp-border)",
        display: "flex",
        flexDirection: "column",
        padding: "2rem 0",
        zIndex: 100,
      }}
    >
      {/* Title */}
      <div style={{ padding: "0 1.5rem 2rem" }}>
        <div
          style={{
            fontFamily: "var(--bp-font-heading)",
            fontSize: "1.4rem",
            color: "var(--bp-text)",
            letterSpacing: "0.05em",
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontFamily: "var(--bp-font-mono)",
              fontSize: "0.5rem",
              color: "var(--bp-text-muted)",
              letterSpacing: "0.2em",
              marginTop: "0.25rem",
              textTransform: "uppercase",
            }}
          >
            {subtitle}
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1 }}>
        {items.map((item) => {
          const isActive = item.exact
            ? activePath === item.href
            : activePath === item.href || activePath.startsWith(item.href + "/");
          return (
            <a
              key={item.href}
              href={item.href}
              style={{
                display: "block",
                padding: "0.6rem 1.5rem",
                fontFamily: "var(--bp-font-mono)",
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                textDecoration: "none",
                color: isActive ? "var(--bp-green)" : "var(--bp-text-muted)",
                background: isActive ? "var(--bp-green-bg)" : "transparent",
                borderLeft: isActive
                  ? "2px solid var(--bp-green)"
                  : "2px solid transparent",
                transition: "color 0.1s, background 0.1s",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.color = "var(--bp-text)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.color = "var(--bp-text-muted)";
                }
              }}
            >
              {item.label}
            </a>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid var(--bp-border)" }}>
        {onLogout && (
          <button
            onClick={onLogout}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--bp-font-mono)",
              fontSize: "0.55rem",
              letterSpacing: "0.2em",
              color: "var(--bp-text-muted)",
              padding: 0,
              display: "block",
              marginBottom: footer ? "0.75rem" : 0,
              textTransform: "uppercase",
              transition: "color 0.1s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "var(--bp-red)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "var(--bp-text-muted)";
            }}
          >
            Sign Out
          </button>
        )}
        {footer}
      </div>
    </div>
  );
}
