/**
 * brutnoir-os · Window
 * Draggable, resizable, Mac OS chrome
 */

"use client";

import {
  useState,
  useRef,
  useEffect,
  type ReactNode,
  type CSSProperties,
} from "react";
import { colors, fonts, shadows } from "../tokens";
import { useScreen } from "../hooks";

// ─── Types ────────────────────────────────────────────────────────────────────

interface WindowProps {
  id: string;
  title: string;
  icon?: string;
  children?: ReactNode;
  content?: ReactNode;      // alias — used when opened programmatically
  defaultX?: number;
  defaultY?: number;
  defaultWidth?: number;
  defaultHeight?: number;
  resizable?: boolean;
  controls?: boolean;
  style?: CSSProperties;
  /** Called when the close (×) button is clicked, after closeWindow(id) */
  onClose?: () => void;
}

// ─── Window ───────────────────────────────────────────────────────────────────

export function Window({
  id, title, icon,
  children, content,
  defaultX = 80, defaultY = 40,
  defaultWidth = 480, defaultHeight = 320,
  resizable = true,
  controls = true,
  style: styleProp,
  onClose,
}: WindowProps) {
  const { closeWindow, minimizeWindow, focusWindow, activeWindow } = useScreen();
  const [pos, setPos] = useState({ x: defaultX, y: defaultY });
  const [size, setSize] = useState({ w: defaultWidth, h: defaultHeight });
  const [maximized, setMaximized] = useState(false);

  // Add slight random offset after mount (client-side only) to avoid hydration mismatch
  useEffect(() => {
    setPos(prev => ({ x: prev.x + Math.random() * 30, y: prev.y + Math.random() * 20 }));
  }, []);

  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const isActive = activeWindow === id;

  const handleTitleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".nf-window-control")) return;
    dragging.current = true;
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    focusWindow(id);
    e.preventDefault();
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current || maximized) return;
      setPos({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
    };
    const onUp = () => { dragging.current = false; };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [maximized]);

  const winStyle: CSSProperties = maximized
    ? { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }
    : { position: "absolute", top: pos.y, left: pos.x, width: size.w, height: size.h };

  return (
    <div
      onMouseDown={() => focusWindow(id)}
      style={{
        ...winStyle,
        background: colors.noirMid,
        border: `1px solid ${isActive ? colors.acid : colors.noirBorder}`,
        boxShadow: isActive ? `4px 4px 0px ${colors.acid}` : shadows.shadowDark,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "border-color 0.15s, box-shadow 0.15s",
        animation: "nf-fadeIn 0.15s ease",
        ...styleProp,
      }}
    >
      {/* Title Bar */}
      <div
        className="nf-window-titlebar"
        onMouseDown={handleTitleMouseDown}
        style={{
          height: 28,
          background: isActive
            ? `linear-gradient(180deg, ${colors.noirSurface} 0%, ${colors.noirMid} 100%)`
            : colors.noir,
          borderBottom: `1px solid ${colors.noirBorder}`,
          display: "flex",
          alignItems: "center",
          padding: "0 8px",
          gap: 8,
          flexShrink: 0,
        }}
      >
        {controls && (
          <div className="nf-window-control" style={{ display: "flex", gap: 5, flexShrink: 0 }}>
            <TrafficLight color={colors.crimson} title="Close" onClick={() => { closeWindow(id); onClose?.(); }} />
            <TrafficLight color={colors.amber} title="Minimize" onClick={() => minimizeWindow(id)} />
            <TrafficLight color={colors.acid} title="Zoom" onClick={() => setMaximized((v) => !v)} />
          </div>
        )}

        {icon && <span style={{ fontSize: 16 }}>{icon}</span>}

        <span style={{
          flex: 1,
          textAlign: "center",
          fontFamily: fonts.mono,
          fontSize: 16,
          color: isActive ? colors.cream : colors.creamMuted,
          letterSpacing: "0.08em",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          {title}
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {children ?? content}
      </div>

      {/* Resize handle */}
      {resizable && !maximized && (
        <ResizeHandle onResize={(dw, dh) => setSize((s) => ({
          w: Math.max(200, s.w + dw),
          h: Math.max(120, s.h + dh),
        }))} />
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TrafficLight({ color, title, onClick }: { color: string; title: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 12, height: 12,
        borderRadius: "50%",
        background: color,
        border: `1px solid ${color}aa`,
        cursor: "pointer",
        fontSize: 0,
      }}
    />
  );
}

function ResizeHandle({ onResize }: { onResize: (dw: number, dh: number) => void }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 12,
        height: 12,
        cursor: "nwse-resize",
        borderTop: `2px solid ${colors.noirBorderLight}`,
        borderLeft: `2px solid ${colors.noirBorderLight}`,
        transform: "rotate(180deg)",
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        const startX = e.clientX, startY = e.clientY;
        const onMove = (ev: MouseEvent) => onResize(ev.clientX - startX, ev.clientY - startY);
        const onUp = () => {
          window.removeEventListener("mousemove", onMove);
          window.removeEventListener("mouseup", onUp);
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
      }}
    />
  );
}
