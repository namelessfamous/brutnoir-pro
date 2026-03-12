/**
 * brutnoir-os · Menu
 * MenuItem · MenuDivider · MenuDropdown
 */

"use client";

import { useState, type ReactNode, type CSSProperties, type MouseEvent } from "react";
import { colors, fonts, shadows } from "../tokens";

// ─── MenuItem ─────────────────────────────────────────────────────────────────

interface MenuItemProps {
  children: ReactNode;
  icon?: string;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export function MenuItem({ children, icon, shortcut, disabled, danger, onClick }: MenuItemProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        width: "100%",
        textAlign: "left",
        background: "transparent",
        border: "none",
        color: danger ? colors.crimson : disabled ? colors.creamMuted : colors.cream,
        padding: "6px 12px",
        fontFamily: fonts.mono,
        fontSize: 16,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "background 0.1s",
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.background = `${colors.acid}18`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
    >
      {icon && (
        <span style={{ fontSize: 16, width: 18, textAlign: "center" }}>{icon}</span>
      )}
      <span style={{ flex: 1 }}>{children}</span>
      {shortcut && (
        <span style={{ fontSize: 14, color: colors.creamMuted, marginLeft: "auto" }}>
          {shortcut}
        </span>
      )}
    </button>
  );
}

// ─── MenuDivider ──────────────────────────────────────────────────────────────

export function MenuDivider() {
  return (
    <div style={{ borderTop: `1px solid ${colors.noirBorder}`, margin: "2px 0" }} />
  );
}

// ─── MenuDropdown ─────────────────────────────────────────────────────────────

type DropdownAlign = "left" | "right";

interface MenuDropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: DropdownAlign;
  style?: CSSProperties;
}

export function MenuDropdown({ trigger, children, align = "left", style }: MenuDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative", display: "inline-block", ...style }}>
      <div onClick={() => setOpen((v) => !v)}>{trigger}</div>
      {open && (
        <>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 498 }}
            onClick={() => setOpen(false)}
          />
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              [align === "right" ? "right" : "left"]: 0,
              zIndex: 499,
              background: colors.noirMid,
              border: `1px solid ${colors.noirBorderLight}`,
              boxShadow: shadows.shadow,
              minWidth: 160,
              animation: "nf-slideDown 0.1s ease",
              paddingTop: 4,
              paddingBottom: 4,
            }}
          >
            {children}
          </div>
        </>
      )}
    </div>
  );
}
