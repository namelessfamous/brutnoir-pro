import React from "react";

export interface SidebarItem {
  label: string;
  href: string;
  exact?: boolean;
  icon?: React.ReactNode;
}

export interface SidebarGroup {
  title?: string;
  items: SidebarItem[];
}

export interface SidebarProps {
  title: string;
  subtitle?: string;
  /** Flat list of nav items */
  items?: SidebarItem[];
  /** Grouped nav items with optional section headings */
  groups?: SidebarGroup[];
  activePath: string;
  onLogout?: () => void;
  footer?: React.ReactNode;
  /** Custom link renderer — defaults to native <a>. Pass Next.js <Link> for SPA navigation. */
  LinkComponent?: React.ElementType;
  width?: string | number;
}

function NavLink({
  item,
  activePath,
  LinkComponent = "a",
}: {
  item: SidebarItem;
  activePath: string;
  LinkComponent?: React.ElementType;
}): React.ReactElement {
  const isActive = item.exact
    ? activePath === item.href
    : activePath === item.href || activePath.startsWith(item.href + "/");

  const linkStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    padding: "0.5rem 1.25rem",
    fontFamily: "var(--bp-font-body)",
    fontSize: "var(--bp-text-sm)",
    fontWeight: isActive ? "600" : "400",
    textDecoration: "none",
    color: isActive ? "var(--bp-green)" : "var(--bp-text-muted)",
    background: isActive ? "var(--bp-green-bg)" : "transparent",
    borderLeft: isActive ? "2px solid var(--bp-green)" : "2px solid transparent",
    transition: "color var(--bp-transition-fast), background var(--bp-transition-fast)",
    userSelect: "none",
  };

  return (
    <LinkComponent
      href={item.href}
      style={linkStyle}
      onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.color = "var(--bp-text)";
          (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
        }
      }}
      onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.color = "var(--bp-text-muted)";
          (e.currentTarget as HTMLElement).style.background = "transparent";
        }
      }}
    >
      {item.icon && (
        <span style={{ width: "1rem", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.7, flexShrink: 0 }}>
          {item.icon}
        </span>
      )}
      {item.label}
    </LinkComponent>
  );
}

export function Sidebar({
  title,
  subtitle,
  items,
  groups,
  activePath,
  onLogout,
  footer,
  LinkComponent = "a",
  width = 220,
}: SidebarProps): React.ReactElement {
  const resolvedGroups: SidebarGroup[] =
    groups ?? (items ? [{ items }] : []);

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: typeof width === "number" ? `${width}px` : width,
        height: "100vh",
        background: "var(--bp-surface)",
        borderRight: "1px solid var(--bp-border)",
        display: "flex",
        flexDirection: "column",
        zIndex: "var(--bp-z-sidebar)" as unknown as number,
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {/* Brand / Title */}
      <div
        style={{
          padding: "1.5rem 1.25rem 1.25rem",
          borderBottom: "1px solid var(--bp-border)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontFamily: "var(--bp-font-heading)",
            fontSize: "1.3rem",
            color: "var(--bp-text)",
            letterSpacing: "0.03em",
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontFamily: "var(--bp-font-mono)",
              fontSize: "var(--bp-text-xs)",
              color: "var(--bp-text-muted)",
              letterSpacing: "0.15em",
              marginTop: "0.3rem",
              textTransform: "uppercase",
            }}
          >
            {subtitle}
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, paddingTop: "0.75rem", paddingBottom: "0.75rem" }}>
        {resolvedGroups.map((group, gi) => (
          <div key={gi} style={{ marginBottom: "0.5rem" }}>
            {group.title && (
              <div
                style={{
                  padding: "0.5rem 1.25rem 0.25rem",
                  fontFamily: "var(--bp-font-mono)",
                  fontSize: "var(--bp-text-xs)",
                  letterSpacing: "0.2em",
                  color: "var(--bp-text-dim)",
                  textTransform: "uppercase",
                }}
              >
                {group.title}
              </div>
            )}
            {group.items.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                activePath={activePath}
                LinkComponent={LinkComponent}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* Footer / Logout */}
      {(onLogout || footer) && (
        <div
          style={{
            padding: "0.75rem 1.25rem",
            borderTop: "1px solid var(--bp-border)",
            flexShrink: 0,
          }}
        >
          {onLogout && (
            <button
              onClick={onLogout}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--bp-font-body)",
                fontSize: "var(--bp-text-sm)",
                color: "var(--bp-text-muted)",
                padding: "0.4rem 0",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                marginBottom: footer ? "0.5rem" : 0,
                transition: "color var(--bp-transition-fast)",
                width: "100%",
                textAlign: "left",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--bp-red)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--bp-text-muted)";
              }}
            >
              Sign Out
            </button>
          )}
          {footer}
        </div>
      )}
    </div>
  );
}
