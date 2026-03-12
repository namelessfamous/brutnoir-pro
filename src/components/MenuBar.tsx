/**
 * brutnoir-os · MenuBar
 * Mac OS-style top application menu bar
 */

"use client";

import { useState, useEffect, type ReactNode } from "react";
import { colors, fonts } from "../tokens";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MenuBarSubItem {
  label: string;
  shortcut?: string;
  onClick?: () => void;
}

export interface MenuBarItem {
  label: string;
  items?: (MenuBarSubItem | null)[];
}

interface MenuBarProps {
  items?: MenuBarItem[];
  /** Replace the default NF/OS + File + View items entirely */
  replaceDefaults?: boolean;
  /**
   * Logo mark shown left of the menu items.
   * - URL/path string → rendered as <img> (e.g. "/icon.svg")
   * - ReactNode (inline JSX / SVG) → rendered directly
   * - Omit → falls back to the default ✦ glyph
   */
  icon?: string | ReactNode;
  /** Slot for right-side tray content */
  tray?: ReactNode;
}

// ─── MenuBar ──────────────────────────────────────────────────────────────────

const defaultItems: MenuBarItem[] = [
  {
    label: "NF/OS",
    items: [
      { label: "About Nameless Famous" },
      { label: "Preferences…", shortcut: "⌘," },
      null,
      { label: "Quit NF/OS", shortcut: "⌘Q" },
    ],
  },
  {
    label: "File",
    items: [
      { label: "New Window", shortcut: "⌘N" },
      { label: "Open…", shortcut: "⌘O" },
      null,
      { label: "Close", shortcut: "⌘W" },
    ],
  },
  {
    label: "View",
    items: [
      { label: "Zoom In", shortcut: "⌘+" },
      { label: "Zoom Out", shortcut: "⌘-" },
      { label: "Toggle Full Screen", shortcut: "⌃⌘F" },
    ],
  },
];

export function MenuBar({ items = [], replaceDefaults = false, icon, tray }: MenuBarProps) {
  const [open, setOpen] = useState<number | null>(null);
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const allItems = replaceDefaults ? items : [...defaultItems, ...items];

  return (
    <div
      style={{
        height: 24,
        background: "rgba(10,10,11,0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${colors.noirBorder}`,
        display: "flex",
        alignItems: "center",
        padding: "0 4px",
        fontSize: 16,
        fontFamily: fonts.mono,
        zIndex: 8000,
        userSelect: "none",
        position: "relative",
        flexShrink: 0,
      }}
    >
      {/* Logo mark */}
      <span style={{
        width: 28,
        height: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRight: `1px solid ${colors.noirBorder}`,
        flexShrink: 0,
      }}>
        {icon ? (
          typeof icon === "string" ? (
            <img
              src={icon}
              alt="app icon"
              style={{ width: 18, height: 18, objectFit: "contain" }}
            />
          ) : (
            icon
          )
        ) : (
          <span style={{
            color: colors.acid,
            fontFamily: fonts.display,
            fontSize: 24,
            fontWeight: "bold",
          }}>
            ✦
          </span>
        )}
      </span>

      {allItems.map((item, i) => (
        <MenuBarItemButton
          key={i}
          item={item}
          isOpen={open === i}
          onOpen={() => setOpen(open === i ? null : i)}
          onClose={() => setOpen(null)}
        />
      ))}

      {/* Right tray */}
      <div style={{
        marginLeft: "auto",
        display: "flex",
        alignItems: "center",
        gap: 12,
        paddingRight: 8,
      }}>
        {tray}
        <span style={{ color: colors.creamMuted, fontSize: 14 }}>{time}</span>
      </div>
    </div>
  );
}

// ─── MenuBarItemButton ────────────────────────────────────────────────────────

function MenuBarItemButton({
  item,
  isOpen,
  onOpen,
  onClose,
}: {
  item: MenuBarItem;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={onOpen}
        style={{
          background: isOpen ? colors.acid : "transparent",
          color: isOpen ? colors.noir : colors.cream,
          border: "none",
          cursor: "pointer",
          padding: "0 8px",
          height: 24,
          fontFamily: fonts.mono,
          fontSize: 14,
          transition: "all 0.1s",
        }}
      >
        {item.label}
      </button>

      {isOpen && item.items && (
        <>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 7999 }}
            onClick={onClose}
          />
          <div style={{
            position: "absolute",
            top: "100%",
            left: 0,
            background: colors.noirMid,
            border: `1px solid ${colors.noirBorder}`,
            boxShadow: `3px 3px 0px ${colors.acid}`,
            minWidth: 180,
            zIndex: 8001,
            animation: "nf-slideDown 0.12s ease",
            paddingTop: 4,
            paddingBottom: 4,
          }}>
            {item.items.map((sub, i) =>
              sub === null ? (
                <div key={i} style={{ borderTop: `1px solid ${colors.noirBorder}`, margin: "2px 0" }} />
              ) : (
                <button
                  key={i}
                  onClick={() => { sub.onClick?.(); onClose(); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    textAlign: "left",
                    background: "transparent",
                    border: "none",
                    color: colors.cream,
                    padding: "5px 16px",
                    fontFamily: fonts.mono,
                    fontSize: 16,
                    cursor: "pointer",
                    transition: "background 0.1s",
                    gap: 8,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = `${colors.acid}22`)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <span style={{ flex: 1 }}>{sub.label}</span>
                  {sub.shortcut && (
                    <span style={{ fontSize: 14, color: colors.creamMuted }}>{sub.shortcut}</span>
                  )}
                </button>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}
