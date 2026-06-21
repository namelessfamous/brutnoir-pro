/**
 * NfSvgIcon — renders SVGs as inline mask-images.
 * Uses `mask-image` so the icon inherits color from the parent's `color`
 * or from the explicit `color` prop.
 *
 * Generic base component — no app-specific named icons.
 */

import type { CSSProperties } from "react";

// ─── Base icon component ────────────────────────────────────────────────────

export interface NfSvgIconProps {
  /** Icon filename without extension, e.g. "nf-add" */
  name: string;
  size?: number;
  /** Explicit color override. Omit to inherit from parent `color`. */
  color?: string;
  className?: string;
  style?: CSSProperties;
}

export function NfSvgIcon({
  name,
  size = 16,
  color,
  className,
  style,
}: NfSvgIconProps) {
  return (
    <span
      className={className}
      role="img"
      aria-label={name}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        flexShrink: 0,
        backgroundColor: color ?? "currentColor",
        WebkitMaskImage: `url(/icons/${name}.svg)`,
        WebkitMaskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskImage: `url(/icons/${name}.svg)`,
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center",
        ...style,
      }}
    />
  );
}

// ─── Functional color palette ───────────────────────────────────────────────
// Each functional area gets a CSS variable color that auto-adapts dark/light.
// These map to brutnoir-pro's --bp-* tokens.

export type NfIconColor =
  | "green"
  | "blue"
  | "cyan"
  | "purple"
  | "orange"
  | "pink"
  | "warning"
  | "red"
  | "neutral"
  | "text"
  | "textMuted";

export const COLOR_VAR: Record<NfIconColor, string> = {
  green:     "var(--bp-green)",
  blue:      "var(--bp-blue)",
  cyan:      "var(--bp-cyan)",
  purple:    "var(--bp-purple)",
  orange:    "var(--bp-orange)",
  pink:      "var(--bp-pink)",
  warning:   "var(--bp-warning)",
  red:       "var(--bp-red)",
  neutral:   "var(--bp-neutral)",
  text:      "var(--bp-text)",
  textMuted: "var(--bp-text-muted)",
};

// ─── Typed icon component factory ───────────────────────────────────────────

interface NfAppIconProps {
  size?: number;
  /** Override the default color for this icon */
  color?: NfIconColor | string;
  className?: string;
  style?: CSSProperties;
}

export function makeIcon(svgName: string, defaultColor: NfIconColor) {
  function Icon({ size = 16, color, className, style }: NfAppIconProps) {
    const resolvedColor =
      color && color in COLOR_VAR
        ? COLOR_VAR[color as NfIconColor]
        : color ?? COLOR_VAR[defaultColor];
    return (
      <NfSvgIcon
        name={svgName}
        size={size}
        color={resolvedColor}
        className={className}
        style={style}
      />
    );
  }
  Icon.displayName = `NfIcon.${svgName}`;
  return Icon;
}
