/**
 * brutnoir-os · ScreenDock + StartMenu
 * Windows 95 start bar × macOS dock hybrid
 * Left: NF start button → app launcher
 * Center: Open window tabs
 * Right: System tray
 */

"use client";

import { useState, type ReactNode } from "react";
import { colors, fonts } from "../tokens";
import { useScreen } from "../hooks";
import type { WindowConfig } from "../hooks";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DockApp extends WindowConfig {
  id: string;
  title: string;
  icon: string;
  description?: string;
  content?: ReactNode;
}

// ─── ScreenDock ───────────────────────────────────────────────────────────────

interface ScreenDockProps {
  apps?: DockApp[];
}

export function ScreenDock({ apps = [] }: ScreenDockProps) {
  const { windows, focusWindow, minimizeWindow, activeWindow } = useScreen();
  const [startOpen, setStartOpen] = useState(false);

  return (
    <>
      <div style={{
        height: 40,
        background: "rgba(10,10,11,0.97)",
        backdropFilter: "blur(16px)",
        borderTop: `1px solid ${colors.noirBorder}`,
        display: "flex",
        alignItems: "center",
        padding: "0 6px",
        gap: 4,
        userSelect: "none",
        zIndex: 7000,
        position: "relative",
        flexShrink: 0,
      }}>
        {/* Start Button */}
        <button
          onClick={() => setStartOpen((v) => !v)}
          style={{
            height: 30,
            padding: "0 12px",
            background: startOpen ? colors.acid : colors.noirSurface,
            color: startOpen ? colors.noir : colors.cream,
            border: `1px solid ${startOpen ? colors.acid : colors.noirBorder}`,
            fontFamily: fonts.mono,
            fontSize: 11,
            fontWeight: 500,
            cursor: "pointer",
            letterSpacing: "0.05em",
            transition: "all 0.1s",
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 14 }}>✦</span>
          NF
        </button>

        {/* Separator */}
        <div style={{ width: 1, height: 24, background: colors.noirBorder, flexShrink: 0 }} />

        {/* Window Tabs */}
        <div style={{ flex: 1, display: "flex", gap: 3, overflow: "hidden" }}>
          {windows.map((win) => {
            const isActive = activeWindow === win.id;
            return (
              <button
                key={win.id}
                onClick={() => {
                  if (win.minimized) {
                    minimizeWindow(win.id);
                  }
                  focusWindow(win.id);
                }}
                style={{
                  height: 28,
                  padding: "0 10px",
                  background: isActive ? colors.noirSurface : "transparent",
                  color: isActive ? colors.acid : colors.creamMuted,
                  border: `1px solid ${isActive ? colors.noirBorderLight : "transparent"}`,
                  borderBottom: isActive ? `2px solid ${colors.acid}` : "1px solid transparent",
                  fontFamily: fonts.mono,
                  fontSize: 11,
                  cursor: "pointer",
                  maxWidth: 140,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  transition: "all 0.1s",
                  opacity: win.minimized ? 0.5 : 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                {win.icon && <span>{win.icon}</span>}
                {win.title}
              </button>
            );
          })}
        </div>

        {/* System Tray */}
        <div style={{
          display: "flex",
          gap: 8,
          padding: "0 8px",
          fontFamily: fonts.mono,
          fontSize: 10,
          color: colors.creamMuted,
          borderLeft: `1px solid ${colors.noirBorder}`,
          alignItems: "center",
          flexShrink: 0,
        }}>
          <span title="Signal">◈</span>
          <span title="Battery" style={{ color: colors.acid }}>▮▮▮</span>
          <span>NF/OS 1.0</span>
        </div>
      </div>

      {/* Start Menu */}
      {startOpen && (
        <StartMenu apps={apps} onClose={() => setStartOpen(false)} />
      )}
    </>
  );
}

// ─── StartMenu ────────────────────────────────────────────────────────────────

const nfBuiltinApps: DockApp[] = [
  { id: "ignite", title: "Ignite", icon: "🔥", description: "Campaign Sites" },
  { id: "command", title: "Command", icon: "⚡", description: "Analytics" },
  { id: "vault", title: "Vault", icon: "🗄️", description: "Assets" },
  { id: "signal", title: "Signal", icon: "📡", description: "Comms" },
  { id: "forge", title: "Forge", icon: "⚙️", description: "Settings" },
  { id: "brief", title: "Brief", icon: "📋", description: "Projects" },
  { id: "canvas", title: "Canvas", icon: "🎨", description: "Design" },
  { id: "pulse", title: "Pulse", icon: "📊", description: "Reports" },
];

interface StartMenuProps {
  apps: DockApp[];
  onClose: () => void;
}

function StartMenu({ apps, onClose }: StartMenuProps) {
  const { openWindow } = useScreen();
  const allApps = [...nfBuiltinApps, ...apps];

  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 6998 }} onClick={onClose} />
      <div style={{
        position: "fixed",
        bottom: 44,
        left: 6,
        width: 340,
        background: colors.noirMid,
        border: `1px solid ${colors.noirBorderLight}`,
        boxShadow: `4px -4px 0px ${colors.acid}, 0 20px 60px rgba(0,0,0,0.8)`,
        zIndex: 6999,
        animation: "bn-slideUp 0.15s ease",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${colors.acid}15, ${colors.noirSurface})`,
          borderBottom: `1px solid ${colors.noirBorder}`,
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}>
          <span style={{ fontFamily: fonts.display, fontSize: 22, color: colors.acid }}>✦</span>
          <div>
            <div style={{ fontFamily: fonts.display, fontSize: 16, color: colors.cream }}>
              Nameless Famous
            </div>
            <div style={{ fontFamily: fonts.mono, fontSize: 10, color: colors.creamMuted }}>
              NF/OS · Creative Suite
            </div>
          </div>
        </div>

        {/* App Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 2,
          padding: 8,
        }}>
          {allApps.map((app) => (
            <AppIcon
              key={app.id}
              app={app}
              onClick={() => { openWindow(app); onClose(); }}
            />
          ))}
        </div>

        {/* Footer */}
        <div style={{
          borderTop: `1px solid ${colors.noirBorder}`,
          padding: "6px 12px",
          display: "flex",
          gap: 8,
          justifyContent: "flex-end",
        }}>
          {([["⚙", "Settings"], ["⏻", "Shutdown"]] as const).map(([icon, label]) => (
            <button
              key={label}
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                color: colors.creamMuted,
                cursor: "pointer",
                fontFamily: fonts.mono,
                fontSize: 11,
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "3px 6px",
                transition: "color 0.1s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = colors.acid)}
              onMouseLeave={(e) => (e.currentTarget.style.color = colors.creamMuted)}
            >
              {icon} {label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── AppIcon ──────────────────────────────────────────────────────────────────

function AppIcon({ app, onClick }: { app: DockApp; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        border: "1px solid transparent",
        color: colors.cream,
        padding: "10px 6px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        fontFamily: fonts.mono,
        fontSize: 10,
        transition: "all 0.1s",
        borderRadius: "2px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = `${colors.acid}15`;
        e.currentTarget.style.border = `1px solid ${colors.acid}44`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.border = "1px solid transparent";
      }}
    >
      <span style={{ fontSize: 24, lineHeight: 1 }}>{app.icon}</span>
      <span style={{ color: colors.cream, lineHeight: 1.2, textAlign: "center" }}>{app.title}</span>
      {app.description && (
        <span style={{ color: colors.creamMuted, fontSize: 9 }}>{app.description}</span>
      )}
    </button>
  );
}
