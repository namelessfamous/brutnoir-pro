/**
 * brutnoir-pro · SmartVariantSelector
 *
 * Parses "Color / Size" variant names and renders:
 *   - A horizontal size-pill strip (logically ordered XS → 5XL)
 *   - A color-swatch row with named swatches
 *
 * Availability-aware: combos that don't exist or have availableForSale=false
 * are visually disabled/crossed-out.
 *
 * Returns null (render nothing) when variants can't be parsed into dimensions.
 *
 * Framework-agnostic: no Next.js directives, no Shopify types, no external deps.
 */

import React, { useState, useMemo } from "react";
import type { ProductVariant } from "./types";

// ── Default constants ──────────────────────────────────────────────────────────

/** Canonical size order for strip display */
const DEFAULT_SIZE_ORDER = [
  "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "One size",
];

/** Known clothing colors → CSS hex */
export const DEFAULT_CLOTHING_COLORS: Record<string, string> = {
  black: "#000000",
  white: "#FFFFFF",
  "iron grey": "#48494B",
  "iron gray": "#48494B",
  "true red": "#BF0D3E",
  "atomic blue": "#2B6CC4",
  navy: "#1B2A4A",
  sand: "#C2B280",
  "sport grey": "#9EA1A2",
  "sport gray": "#9EA1A2",
  ash: "#B2BEB5",
  "dark heather": "#414A4C",
  gold: "#FFD700",
  chambray: "#9DB0C6",
  "island reef": "#AADBCE",
  natural: "#F5F0E1",
  "ice grey": "#C5C9C7",
  "ice gray": "#C5C9C7",
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function getColorHex(
  name: string,
  colorMap: Record<string, string>,
): string | null {
  return colorMap[name.toLowerCase().trim()] ?? null;
}

/** Luminance check — light colors need a visible border */
function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.72;
}

// ── Parsing ────────────────────────────────────────────────────────────────────

interface ParsedVariant {
  original: ProductVariant;
  color: string | null;
  size: string | null;
}

function isKnownSize(token: string, sizeTokenSet: Set<string>): boolean {
  return sizeTokenSet.has(token.toLowerCase().trim());
}

function parseVariant(
  v: ProductVariant,
  sizeTokenSet: Set<string>,
): ParsedVariant {
  const parts = v.name.split(" / ").map((p) => p.trim());
  if (parts.length !== 2) return { original: v, color: null, size: null };

  const [a, b] = parts;
  if (!isKnownSize(a, sizeTokenSet) && isKnownSize(b, sizeTokenSet))
    return { original: v, color: a, size: b };
  if (isKnownSize(a, sizeTokenSet) && !isKnownSize(b, sizeTokenSet))
    return { original: v, color: b, size: a };
  // Both look like sizes — treat first as color, second as size
  if (isKnownSize(b, sizeTokenSet)) return { original: v, color: a, size: b };

  return { original: v, color: null, size: null };
}

/**
 * Returns true when at least one variant can be parsed into color+size dimensions.
 * Export this so consumers and ProductDetail can gate the smart selector.
 */
export function canUseSmartSelector(variants: ProductVariant[]): boolean {
  if (!variants || variants.length === 0) return false;
  const sizeTokenSet = new Set(DEFAULT_SIZE_ORDER.map((s) => s.toLowerCase()));
  return variants.some((v) => {
    const p = parseVariant(v, sizeTokenSet);
    return p.color !== null && p.size !== null;
  });
}

function sortSizes(sizes: string[], sizeOrder: string[]): string[] {
  return [...sizes].sort((a, b) => {
    const ai = sizeOrder.findIndex(
      (s) => s.toLowerCase() === a.toLowerCase(),
    );
    const bi = sizeOrder.findIndex(
      (s) => s.toLowerCase() === b.toLowerCase(),
    );
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });
}

// ── Types ──────────────────────────────────────────────────────────────────────

export interface SmartVariantSelectorProps {
  variants: ProductVariant[];
  onVariantChange: (variant: ProductVariant | null) => void;
  /** Override accent color. Defaults to var(--bp-orange) */
  accentColor?: string;
  /**
   * Color name → CSS hex map.
   * Defaults to DEFAULT_CLOTHING_COLORS — consumers can spread and extend.
   */
  colorMap?: Record<string, string>;
  /**
   * Ordered list of recognised size tokens.
   * Defaults to ["XS","S","M","L","XL","2XL","3XL","4XL","5XL","One size"].
   */
  sizeTokens?: string[];
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function SmartVariantSelector({
  variants,
  onVariantChange,
  accentColor = "var(--bp-orange)",
  colorMap = DEFAULT_CLOTHING_COLORS,
  sizeTokens = DEFAULT_SIZE_ORDER,
}: SmartVariantSelectorProps): React.ReactElement | null {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const sizeTokenSet = useMemo(
    () => new Set(sizeTokens.map((s) => s.toLowerCase())),
    [sizeTokens],
  );

  const parsed = useMemo(
    () => variants.map((v) => parseVariant(v, sizeTokenSet)),
    [variants, sizeTokenSet],
  );

  const parseable = useMemo(
    () => parsed.filter((p) => p.color !== null && p.size !== null),
    [parsed],
  );

  const uniqueSizes = useMemo(
    () => sortSizes([...new Set(parseable.map((p) => p.size!))], sizeTokens),
    [parseable, sizeTokens],
  );

  const uniqueColors = useMemo(
    () => [...new Set(parseable.map((p) => p.color!))],
    [parseable],
  );

  // Only show size strip when there are multiple distinct sizes (or the only
  // size is not "One size")
  const showSizeSelector =
    uniqueSizes.length > 1 ||
    (uniqueSizes.length === 1 &&
      uniqueSizes[0].toLowerCase() !== "one size");
  const showColorSelector = uniqueColors.length > 0;

  // ── Lookup ─────────────────────────────────────────────────────────────────

  function findParsed(
    color: string | null,
    size: string | null,
  ): ParsedVariant | null {
    return (
      parseable.find(
        (p) =>
          (color === null || p.color === color) &&
          (size === null || p.size === size),
      ) ?? null
    );
  }

  function isSizeAvailable(size: string): boolean {
    return parseable
      .filter(
        (p) =>
          p.size === size &&
          (selectedColor === null || p.color === selectedColor),
      )
      .some((p) => p.original.availableForSale !== false);
  }

  function isColorAvailable(color: string): boolean {
    return parseable
      .filter(
        (p) =>
          p.color === color &&
          (selectedSize === null || p.size === selectedSize),
      )
      .some((p) => p.original.availableForSale !== false);
  }

  // ── Selection handlers ─────────────────────────────────────────────────────

  function resolveVariant(
    newSize: string | null,
    newColor: string | null,
  ): void {
    if (newSize !== null && newColor !== null) {
      const match = findParsed(newColor, newSize);
      onVariantChange(match?.original ?? null);
    } else if (
      !showSizeSelector &&
      newColor !== null &&
      uniqueSizes.length > 0
    ) {
      // Single-size product: color alone is enough
      const match = findParsed(newColor, uniqueSizes[0]);
      onVariantChange(match?.original ?? null);
    } else if (
      !showColorSelector &&
      newSize !== null &&
      uniqueColors.length > 0
    ) {
      // Single-color product: size alone is enough
      const match = findParsed(uniqueColors[0], newSize);
      onVariantChange(match?.original ?? null);
    } else {
      onVariantChange(null);
    }
  }

  function handleSizeClick(size: string): void {
    if (!isSizeAvailable(size)) return;
    const next = size === selectedSize ? null : size;
    setSelectedSize(next);
    resolveVariant(next, selectedColor);
  }

  function handleColorClick(color: string): void {
    if (!isColorAvailable(color)) return;
    const next = color === selectedColor ? null : color;
    setSelectedColor(next);
    resolveVariant(selectedSize, next);
  }

  // ── Hint text ─────────────────────────────────────────────────────────────

  function getHint(): string {
    if (showSizeSelector && showColorSelector) {
      if (!selectedSize && !selectedColor) return "Select a size and color";
      if (!selectedSize) return "Now select a size";
      if (!selectedColor) return "Now select a color";
      const match = findParsed(selectedColor, selectedSize);
      if (!match) return "This combination is unavailable";
      if (match.original.availableForSale === false)
        return "This combination is out of stock";
      return "✓ Ready to add to bag";
    }
    if (showSizeSelector)
      return !selectedSize ? "Select a size" : "✓ Ready to add to bag";
    if (showColorSelector)
      return !selectedColor ? "Select a color" : "✓ Ready to add to bag";
    return "";
  }

  const hint = getHint();
  const isReady = hint.startsWith("✓");

  // ── Shared label style ─────────────────────────────────────────────────────

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--bp-font-mono, 'Space Mono', 'Courier New', monospace)",
    fontSize: "0.7rem",
    textTransform: "uppercase" as React.CSSProperties["textTransform"],
    letterSpacing: "0.18em",
    color: "var(--bp-text-dim)",
    marginBottom: "0.75rem",
    display: "block",
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* ── Size strip ──────────────────────────────────────────────────── */}
      {showSizeSelector && (
        <div style={{ marginBottom: "1.75rem" }}>
          <span style={labelStyle}>
            Size
            {selectedSize ? (
              <>
                {" — "}
                <strong style={{ color: "var(--bp-text)" }}>
                  {selectedSize}
                </strong>
              </>
            ) : null}
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {uniqueSizes.map((size) => {
              const isActive = selectedSize === size;
              const avail = isSizeAvailable(size);
              return (
                <SizePill
                  key={size}
                  size={size}
                  isActive={isActive}
                  isAvailable={avail}
                  accentColor={accentColor}
                  onClick={() => handleSizeClick(size)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* ── Color swatches ───────────────────────────────────────────────── */}
      {showColorSelector && (
        <div style={{ marginBottom: "1.75rem" }}>
          <span style={labelStyle}>
            Color
            {selectedColor ? (
              <>
                {" — "}
                <strong style={{ color: "var(--bp-text)" }}>
                  {selectedColor}
                </strong>
              </>
            ) : null}
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem" }}>
            {uniqueColors.map((color) => {
              const isActive = selectedColor === color;
              const avail = isColorAvailable(color);
              const hex = getColorHex(color, colorMap);
              return (
                <ColorSwatch
                  key={color}
                  color={color}
                  hex={hex}
                  isActive={isActive}
                  isAvailable={avail}
                  accentColor={accentColor}
                  onClick={() => handleColorClick(color)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* ── Selection hint ───────────────────────────────────────────────── */}
      {(showSizeSelector || showColorSelector) && (
        <div
          style={{
            fontFamily:
              "var(--bp-font-mono, 'Space Mono', 'Courier New', monospace)",
            fontSize: "0.7rem",
            letterSpacing: "0.08em",
            color: isReady ? accentColor : "var(--bp-text-dim)",
            minHeight: "1.1em",
            transition: "color 0.2s ease",
          }}
        >
          {hint}
        </div>
      )}
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

interface SizePillProps {
  size: string;
  isActive: boolean;
  isAvailable: boolean;
  accentColor: string;
  onClick: () => void;
}

function SizePill({
  size,
  isActive,
  isAvailable,
  accentColor,
  onClick,
}: SizePillProps): React.ReactElement {
  const [hovered, setHovered] = useState(false);

  const borderColor = isActive
    ? accentColor
    : hovered && isAvailable
      ? "var(--bp-text-muted)"
      : "var(--bp-border)";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isAvailable}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "0.45rem 1rem",
        border: `2px solid ${borderColor}`,
        background: isActive
          ? `color-mix(in srgb, ${accentColor} 12%, var(--bp-surface, #f9f9f9))`
          : "var(--bp-surface, #f9f9f9)",
        color: isActive
          ? accentColor
          : isAvailable
            ? "var(--bp-text)"
            : "var(--bp-text-dim)",
        fontFamily:
          "var(--bp-font-mono, 'Space Mono', 'Courier New', monospace)",
        fontSize: "0.75rem",
        letterSpacing: "0.06em",
        cursor: isAvailable ? "pointer" : "not-allowed",
        opacity: isAvailable ? 1 : 0.38,
        textDecoration: isAvailable ? "none" : "line-through",
        transition:
          "border-color 0.15s ease, background 0.15s ease, color 0.15s ease",
        lineHeight: 1,
        minWidth: 44,
        textAlign: "center",
      }}
    >
      {size}
    </button>
  );
}

interface ColorSwatchProps {
  color: string;
  hex: string | null;
  isActive: boolean;
  isAvailable: boolean;
  accentColor: string;
  onClick: () => void;
}

function ColorSwatch({
  color,
  hex,
  isActive,
  isAvailable,
  accentColor,
  onClick,
}: ColorSwatchProps): React.ReactElement {
  const fill = hex ?? accentColor;
  const light = hex ? isLightColor(hex) : false;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isAvailable}
      title={color}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.4rem",
        background: "none",
        border: "none",
        padding: 0,
        cursor: isAvailable ? "pointer" : "not-allowed",
        opacity: isAvailable ? 1 : 0.35,
      }}
    >
      {/* Swatch circle */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: fill,
          border: isActive
            ? `3px solid ${accentColor}`
            : light
              ? "2px solid var(--bp-border)"
              : "2px solid transparent",
          boxShadow: isActive
            ? `0 0 0 2px var(--bp-bg, #fff), 0 0 0 4px ${accentColor}`
            : "none",
          transition: "box-shadow 0.15s ease, border-color 0.15s ease",
          position: "relative",
          flexShrink: 0,
        }}
      >
        {/* X stripe for unavailable */}
        {!isAvailable && (
          <svg
            viewBox="0 0 32 32"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
            }}
          >
            <line
              x1="6"
              y1="6"
              x2="26"
              y2="26"
              stroke="var(--bp-text-dim)"
              strokeWidth="2.5"
            />
            <line
              x1="26"
              y1="6"
              x2="6"
              y2="26"
              stroke="var(--bp-text-dim)"
              strokeWidth="2.5"
            />
          </svg>
        )}
        {/* Checkmark for active when no hex map entry */}
        {isActive && !hex && (
          <svg
            viewBox="0 0 32 32"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
            }}
          >
            <polyline
              points="8,17 13,22 24,11"
              fill="none"
              stroke="var(--bp-bg, #fff)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* Color name label */}
      <span
        style={{
          fontFamily:
            "var(--bp-font-mono, 'Space Mono', 'Courier New', monospace)",
          fontSize: "0.62rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: isActive ? accentColor : "var(--bp-text-dim)",
          textAlign: "center",
          maxWidth: 60,
          lineHeight: 1.25,
          transition: "color 0.15s ease",
          overflowWrap: "break-word",
          wordBreak: "normal",
        }}
      >
        {color}
      </span>
    </button>
  );
}
