import React from "react";

// ── AdminLayout ────────────────────────────────────────────────────────────────

export interface AdminLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  /** Width of the sidebar in pixels — must match the Sidebar component's width prop */
  sidebarWidth?: number;
  /** Optional top bar content (rendered above main content) */
  topBar?: React.ReactNode;
}

export function AdminLayout({
  sidebar,
  children,
  sidebarWidth = 220,
  topBar,
}: AdminLayoutProps): React.ReactElement {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "var(--bp-bg)",
        color: "var(--bp-text)",
      }}
    >
      {/* Sidebar slot */}
      <div
        style={{
          width: sidebarWidth,
          flexShrink: 0,
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        {sidebar}
      </div>

      {/* Main area */}
      <div
        style={{
          marginLeft: sidebarWidth,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {topBar && (
          <div
            style={{
              borderBottom: "1px solid var(--bp-border)",
              background: "var(--bp-surface)",
              flexShrink: 0,
              zIndex: "var(--bp-z-header)" as unknown as number,
            }}
          >
            {topBar}
          </div>
        )}
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "2rem",
            background: "var(--bp-bg)",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

// ── NavItem (legacy, kept for backward compat) ────────────────────────────────

export interface NavItemProps {
  href: string;
  label: string;
  active?: boolean;
}

export function NavItem({ href, label, active = false }: NavItemProps): React.ReactElement {
  const [hovered, setHovered] = React.useState(false);

  return (
    <a
      href={href}
      style={{
        display: "block",
        padding: "0.55rem 1rem",
        fontFamily: "var(--bp-font-body)",
        fontSize: "var(--bp-text-sm)",
        textDecoration: "none",
        borderLeft: active ? "2px solid var(--bp-green)" : "2px solid transparent",
        color: active ? "var(--bp-green)" : hovered ? "var(--bp-text)" : "var(--bp-text-muted)",
        background: active ? "var(--bp-green-bg)" : hovered ? "rgba(255,255,255,0.03)" : "transparent",
        transition: "background var(--bp-transition-fast), color var(--bp-transition-fast)",
        fontWeight: active ? 600 : 400,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
    </a>
  );
}
