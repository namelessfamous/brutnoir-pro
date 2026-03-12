/**
 * brutnoir-os · Primitives
 * Button · ButtonLink · Badge · Spinner · Card · Divider
 */

"use client";

import type { CSSProperties, ReactNode, MouseEvent } from "react";
import { colors, fonts, shadows } from "../tokens";
import { Icon } from "./Typography";

// ─── Button ───────────────────────────────────────────────────────────────────

export type ButtonVariant = "default" | "primary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const buttonVariants: Record<ButtonVariant, {
  background: string; color: string; border: string;
  boxShadow: string; hoverBg: string;
}> = {
  default: {
    background: colors.noirSurface,
    color: colors.cream,
    border: `1px solid ${colors.noirBorderLight}`,
    boxShadow: shadows.shadowDark,
    hoverBg: colors.noirBorderLight,
  },
  primary: {
    background: colors.acid,
    color: colors.noir,
    border: `1px solid ${colors.acid}`,
    boxShadow: shadows.shadowSm,
    hoverBg: colors.acidDim,
  },
  danger: {
    background: "transparent",
    color: colors.crimson,
    border: `1px solid ${colors.crimson}`,
    boxShadow: `2px 2px 0px ${colors.crimson}44`,
    hoverBg: `${colors.crimson}22`,
  },
  ghost: {
    background: "transparent",
    color: colors.creamMuted,
    border: "1px solid transparent",
    boxShadow: "none",
    hoverBg: `${colors.acid}11`,
  },
};

const buttonSizes: Record<ButtonSize, { padding: string; fontSize: number; height: number }> = {
  sm: { padding: "4px 12px", fontSize: 14, height: 36 },
  md: { padding: "6px 16px", fontSize: 16, height: 42 },
  lg: { padding: "12px 24px", fontSize: 18, height: 56 },
};

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  icon?: string;
  type?: "button" | "submit" | "reset";
  style?: CSSProperties;
  className?: string;
}

export function Button({
  children, variant = "default", size = "md",
  onClick, disabled, icon, type = "button", style, className,
}: ButtonProps) {
  const v = buttonVariants[variant];
  const sz = buttonSizes[size];

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: v.background,
        color: v.color,
        border: v.border,
        boxShadow: v.boxShadow,
        fontFamily: fonts.mono,
        fontSize: sz.fontSize,
        height: sz.height,
        padding: sz.padding,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "all 0.1s",
        letterSpacing: "0.04em",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.background = v.hoverBg;
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.currentTarget.style.background = v.background;
      }}
    >
      {icon && <Icon glyph={icon} size={sz.fontSize} color={v.color} />}
      {children}
    </button>
  );
}

// ─── ButtonLink ───────────────────────────────────────────────────────────────

interface ButtonLinkProps {
  children: ReactNode;
  href: string;
  icon?: string;
  style?: CSSProperties;
  className?: string;
}

export function ButtonLink({ children, href, icon, style, className }: ButtonLinkProps) {
  return (
    <a
      href={href}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        color: colors.acid,
        fontFamily: fonts.mono,
        fontSize: 16,
        textDecoration: "none",
        borderBottom: `1px solid ${colors.acid}44`,
        paddingBottom: 1,
        transition: "border-color 0.1s",
        ...style,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = colors.acid)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = `${colors.acid}44`)}
    >
      {icon && <Icon glyph={icon} size={12} color={colors.acid} />}
      {children}
    </a>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────

export type BadgeVariant = "default" | "acid" | "danger" | "amber" | "ice";

const badgeColors: Record<BadgeVariant, { bg: string; color: string; border: string }> = {
  default: { bg: colors.noirSurface, color: colors.creamMuted, border: colors.noirBorder },
  acid:    { bg: `${colors.acid}22`, color: colors.acid, border: colors.acid },
  danger:  { bg: `${colors.crimson}22`, color: colors.crimson, border: colors.crimson },
  amber:   { bg: `${colors.amber}22`, color: colors.amber, border: colors.amber },
  ice:     { bg: `${colors.ice}22`, color: colors.ice, border: colors.ice },
};

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  style?: CSSProperties;
}

export function Badge({ children, variant = "default", style }: BadgeProps) {
  const c = badgeColors[variant];
  return (
    <span
      style={{
        background: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
        fontFamily: fonts.mono,
        fontSize: 12,
        padding: "1px 6px",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

interface SpinnerProps {
  size?: number;
  color?: string;
  style?: CSSProperties;
}

export function Spinner({ size = 20, color = colors.acid, style }: SpinnerProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `2px solid ${colors.noirBorder}`,
        borderTop: `2px solid ${color}`,
        borderRadius: "50%",
        animation: "nf-spin 0.7s linear infinite",
        display: "inline-block",
        ...style,
      }}
    />
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

interface CardProps {
  children: ReactNode;
  accent?: boolean;
  style?: CSSProperties;
  className?: string;
}

export function Card({ children, accent, style, className }: CardProps) {
  return (
    <div
      className={className}
      style={{
        background: colors.noirMid,
        border: `1px solid ${accent ? colors.acid : colors.noirBorder}`,
        boxShadow: accent ? shadows.shadow : shadows.shadowDark,
        padding: 16,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────

interface DividerProps {
  label?: string;
  style?: CSSProperties;
}

export function Divider({ label, style }: DividerProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        margin: "8px 0",
        ...style,
      }}
    >
      <div style={{ flex: 1, height: 1, background: colors.noirBorder }} />
      {label && (
        <span
          style={{
            fontFamily: fonts.mono,
            fontSize: 14,
            color: colors.creamMuted,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      )}
      <div style={{ flex: 1, height: 1, background: colors.noirBorder }} />
    </div>
  );
}
