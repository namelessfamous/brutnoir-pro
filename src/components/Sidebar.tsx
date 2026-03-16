import React from "react";

export interface SidebarItem {
  label: string;
  href: string;
  exact?: boolean; // if true, only highlight on exact path match
}

export interface SidebarGroup {
  title?: string;
  items: SidebarItem[];
}

export interface SidebarProps {
  title: string;
  subtitle?: string;
  /** Flat list of nav items (use groups for sections with titles) */
  items?: SidebarItem[];
  /** Grouped nav items with optional section headings */
  groups?: SidebarGroup[];
  activePath: string;
  onLogout?: () => void;
  footer?: React.ReactNode;
  /** Custom link renderer — defaults to native <a>. Pass Next.js <Link> for SPA navigation. */
  LinkComponent?: React.ElementType;
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
    display: "block",
    padding: "0.6rem 1.5rem",
    fontFamily: "var(--bp-font-mono)",
    fontSize: "0.6rem",
    letterSpacing: "0.2em",
    textDecoration: "none",
    color: isActive ? "var(--bp-green)" : "var(--bp-text-muted)",
    background: isActive ? "var(--bp-green-bg)" : "transparent",
    borderLeft: isActive ? "2px solid var(--bp-green)" : "2px solid transparent",
    transition: "color 0.1s, background 0.1s",
  };

  return (
    <LinkComponent
      href={item.href}
      style={linkStyle}
      onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!isActive) {
          (e.currentTarget as HTMLAnchorElement).style.color = "var(--bp-text)";
        }
      }}
      onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!isActive) {
          (e.currentTarget as HTMLAnchorElement).style.color = "var(--bp-text-muted)";
        }
      }}
    >
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
}: SidebarProps): React.ReactElement {
  // Normalise to groups array for rendering
  const resolvedGroups: SidebarGroup[] =
    groups ?? (items ? [{ items }] : []);

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
        overflowY: "auto",
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

      {/* Nav */}
      <nav style={{ flex: 1 }}>
        {resolvedGroups.map((group, gi) => (
          <div key={gi} style={{ marginBottom: group.title ? "0.5rem" : 0 }}>
            {group.title && (
              <div
                style={{
                  padding: "0.75rem 1.5rem 0.35rem",
                  fontFamily: "var(--bp-font-mono)",
                  fontSize: "0.45rem",
                  letterSpacing: "0.25em",
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
