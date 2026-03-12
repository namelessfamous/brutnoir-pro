/**
 * brutnoir-os · Overlays
 * Modal · Notification · Popover
 */

"use client";

import { useState, type ReactNode, type CSSProperties } from "react";
import { colors, fonts, shadows } from "../tokens";

// ─── Modal ────────────────────────────────────────────────────────────────────

interface ModalProps {
  open: boolean;
  onClose?: () => void;
  title?: string;
  children: ReactNode;
  width?: number | string;
  footer?: ReactNode;
}

export function Modal({ open, onClose, title, children, width = 400, footer }: ModalProps) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 5000,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div
        style={{
          width,
          maxWidth: "90vw",
          background: colors.noirMid,
          border: `1px solid ${colors.acid}`,
          boxShadow: shadows.modal,
          animation: "nf-fadeIn 0.15s ease",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 12px",
            height: 32,
            background: colors.noirSurface,
            borderBottom: `1px solid ${colors.noirBorder}`,
          }}
        >
          {title && (
            <span style={{
              fontFamily: fonts.mono,
              fontSize: 16,
              color: colors.cream,
              letterSpacing: "0.06em",
            }}>
              {title}
            </span>
          )}
          <button
            onClick={onClose}
            style={{
              marginLeft: "auto",
              background: "transparent",
              border: "none",
              color: colors.creamMuted,
              cursor: "pointer",
              fontSize: 16,
              lineHeight: 1,
              padding: "0 2px",
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 20 }}>{children}</div>

        {/* Footer */}
        {footer && (
          <div
            style={{
              padding: "10px 16px",
              borderTop: `1px solid ${colors.noirBorder}`,
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Notification ─────────────────────────────────────────────────────────────

export type NotificationVariant = "default" | "success" | "error" | "warning" | "info";

const notifColors: Record<NotificationVariant, { border: string; accent: string }> = {
  default: { border: colors.noirBorderLight, accent: colors.acid },
  success: { border: colors.acid, accent: colors.acid },
  error:   { border: colors.crimson, accent: colors.crimson },
  warning: { border: colors.amber, accent: colors.amber },
  info:    { border: colors.ice, accent: colors.ice },
};

interface NotificationProps {
  title?: string;
  message: string;
  variant?: NotificationVariant;
  onClose?: () => void;
  style?: CSSProperties;
}

export function Notification({ title, message, variant = "default", onClose, style }: NotificationProps) {
  const c = notifColors[variant];

  return (
    <div
      style={{
        width: 280,
        background: colors.noirMid,
        border: `1px solid ${c.border}`,
        borderLeft: `3px solid ${c.accent}`,
        boxShadow: `3px 3px 0px ${c.accent}44`,
        padding: "10px 12px",
        animation: "nf-notification 0.2s ease",
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        ...style,
      }}
    >
      <div style={{ flex: 1 }}>
        {title && (
          <div style={{
            fontFamily: fonts.mono,
            fontSize: 16,
            color: c.accent,
            fontWeight: 500,
            marginBottom: 2,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}>
            {title}
          </div>
        )}
        <div style={{
          fontFamily: fonts.sans,
          fontSize: 16,
          color: colors.creamDim,
          lineHeight: 1.5,
        }}>
          {message}
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: colors.creamMuted,
            cursor: "pointer",
            fontSize: 16,
            flexShrink: 0,
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}

// ─── Popover ──────────────────────────────────────────────────────────────────

type PopoverPlacement = "top" | "bottom" | "left" | "right";

interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  title?: string;
  placement?: PopoverPlacement;
  width?: number;
}

export function Popover({ trigger, children, title, placement = "top", width = 240 }: PopoverProps) {
  const [open, setOpen] = useState(false);

  const positionStyles: Record<PopoverPlacement, CSSProperties> = {
    top:    { bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" },
    bottom: { top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" },
    left:   { right: "calc(100% + 8px)", top: "50%", transform: "translateY(-50%)" },
    right:  { left: "calc(100% + 8px)", top: "50%", transform: "translateY(-50%)" },
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div onClick={() => setOpen((v) => !v)}>{trigger}</div>
      {open && (
        <>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 598 }}
            onClick={() => setOpen(false)}
          />
          <div
            style={{
              position: "absolute",
              ...positionStyles[placement],
              zIndex: 599,
              background: colors.noirMid,
              border: `1px solid ${colors.noirBorderLight}`,
              boxShadow: shadows.shadow,
              width,
              animation: "nf-fadeIn 0.1s ease",
            }}
          >
            {title && (
              <div style={{
                padding: "6px 12px",
                borderBottom: `1px solid ${colors.noirBorder}`,
                fontFamily: fonts.mono,
                fontSize: 16,
                color: colors.acid,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}>
                {title}
              </div>
            )}
            <div style={{ padding: 12 }}>{children}</div>
          </div>
        </>
      )}
    </div>
  );
}
