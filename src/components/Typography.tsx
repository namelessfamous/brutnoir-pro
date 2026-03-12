/**
 * brutnoir-os · Typography
 * Header · Text · Icon
 */

"use client";

import type { CSSProperties, JSX, ReactNode } from "react";
import { colors, fonts } from "../tokens";

// ─── Header ───────────────────────────────────────────────────────────────────

interface HeaderProps {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  accent?: boolean;
  style?: CSSProperties;
  className?: string;
}

export function Header({ children, level = 1, accent, style, className }: HeaderProps) {
  const sizes: Record<number, number> = { 1: 48, 2: 32, 3: 24, 4: 20, 5: 16, 6: 14 };
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Tag
      className={className}
      style={{
        fontFamily: level <= 2 ? fonts.display : fonts.sans,
        fontSize: sizes[level],
        color: accent ? colors.acid : colors.cream,
        fontWeight: level <= 2 ? "normal" : 600,
        lineHeight: 1.2,
        letterSpacing: level >= 4 ? "0.1em" : "0",
        textTransform: level >= 4 ? "uppercase" : "none",
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

// ─── Text ─────────────────────────────────────────────────────────────────────

interface TextProps {
  children: ReactNode;
  muted?: boolean;
  mono?: boolean;
  size?: number;
  style?: CSSProperties;
  className?: string;
}

export function Text({ children, muted, mono, size = 14, style, className }: TextProps) {
  return (
    <p
      className={className}
      style={{
        fontFamily: mono ? fonts.mono : fonts.sans,
        fontSize: size,
        color: muted ? colors.creamMuted : colors.creamDim,
        lineHeight: 1.6,
        ...style,
      }}
    >
      {children}
    </p>
  );
}

// ─── Icon ─────────────────────────────────────────────────────────────────────

interface IconProps {
  glyph: string;
  label?: string;
  size?: number;
  color?: string;
  style?: CSSProperties;
  className?: string;
}

export function Icon({ glyph, label, size = 16, color, style, className }: IconProps) {
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size,
        color: color ?? colors.acid,
        lineHeight: 1,
        ...style,
      }}
    >
      {glyph}
    </span>
  );
}
