import React from "react";

// ── AdminLayout ────────────────────────────────────────────────────────────────

export interface AdminLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export function AdminLayout({ sidebar, children }: AdminLayoutProps): React.ReactElement {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "var(--bg-primary, #080808)",
        color: "var(--text-primary, #f0ede6)",
      }}
    >
      <div
        style={{
          width: 220,
          flexShrink: 0,
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          borderRight: "1px solid var(--border, #1a1a1a)",
          background: "var(--bg-surface, #0d0d0d)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {sidebar}
      </div>
      <main
        style={{
          marginLeft: 220,
          flex: 1,
          overflowY: "auto",
          padding: "2rem",
          background: "var(--bg-primary, #080808)",
        }}
      >
        {children}
      </main>
    </div>
  );
}

// ── NavItem ────────────────────────────────────────────────────────────────────

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
        padding: "0.6rem 1rem",
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: "0.65rem",
        textTransform: "uppercase",
        letterSpacing: "0.15em",
        textDecoration: "none",
        borderLeft: active ? "2px solid #019458" : "2px solid transparent",
        color: active ? "#019458" : hovered ? "#f0ede6" : "#404040",
        background: active ? "#012a18" : hovered ? "#1a1a1a" : "transparent",
        transition: "background 0.1s, color 0.1s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
    </a>
  );
}
