/**
 * brutnoir-pro · ProductCard
 * Props-driven, framework-agnostic product card component.
 * No Next.js, no framer-motion, no external deps.
 */

import React, { useState } from "react";
import type { Product, RenderLink } from "./types";
import { defaultRenderLink } from "./helpers";

export interface ProductCardProps {
  product: Product;
  /** Stagger index for entry animation delay */
  index?: number;
  layout?: "grid" | "list";
  onAddToCart?: (product: Product) => void | Promise<void>;
  onToggleWishlist?: (productId: string) => void;
  isWishlisted?: boolean;
  onQuickView?: (product: Product) => void;
  renderLink?: RenderLink;
  /** Override accent color. Defaults to var(--bp-orange) */
  accentColor?: string;
}

const heartPath =
  "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z";

export function ProductCard({
  product,
  index = 0,
  layout = "grid",
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
  onQuickView,
  renderLink = defaultRenderLink,
  accentColor = "var(--bp-orange)",
}: ProductCardProps): React.ReactElement {
  const [isAdding, setIsAdding] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);

  const isFree =
    !product.price ||
    product.price.toLowerCase().includes("free") ||
    product.price === "$0" ||
    product.price === "0";

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onAddToCart || isAdding) return;
    setIsAdding(true);
    try {
      await onAddToCart(product);
    } finally {
      setTimeout(() => setIsAdding(false), 1200);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleWishlist?.(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  const animDelay = `${index * 0.06}s`;
  const productHref = `/shop/products/${product.slug}`;

  // ── List layout ────────────────────────────────────────────────────────────
  if (layout === "list") {
    return (
      <div
        style={{
          animation: `bp-ec-fadein 0.4s ease both`,
          animationDelay: animDelay,
        }}
      >
        {renderLink({
          href: productHref,
          style: { display: "block", textDecoration: "none", color: "inherit" },
          children: (
            <div
              style={{
                display: "flex",
                gap: "1.5rem",
                border: "2px solid var(--bp-border)",
                background: "var(--bp-surface)",
                padding: "1rem",
                transition: "border-color var(--bp-transition), box-shadow var(--bp-transition)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = accentColor;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--bp-border)";
              }}
            >
              {/* Thumbnail */}
              <div
                style={{
                  position: "relative",
                  width: 160,
                  height: 160,
                  flexShrink: 0,
                  overflow: "hidden",
                  background: "var(--bp-bg)",
                }}
              >
                <img
                  src={product.imageSrc}
                  alt={product.imageAlt ?? product.name}
                  onLoad={() => setImageLoaded(true)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: imageLoaded ? 1 : 0,
                    transition: "opacity 0.4s ease",
                  }}
                />
                {!imageLoaded && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "var(--bp-bg)",
                      animation: "bp-ec-pulse 1.5s ease-in-out infinite",
                    }}
                  />
                )}
              </div>

              {/* Info */}
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  justifyContent: "space-between",
                  paddingBlock: "0.25rem",
                  minWidth: 0,
                }}
              >
                <div>
                  {product.category && (
                    <span
                      style={{
                        fontFamily: "var(--bp-font-mono)",
                        fontSize: "var(--bp-text-xs)",
                        textTransform: "uppercase",
                        letterSpacing: "0.18em",
                        color: accentColor,
                      }}
                    >
                      {product.category}
                    </span>
                  )}
                  <h3
                    style={{
                      marginTop: "0.25rem",
                      fontFamily: "var(--bp-font-heading)",
                      fontSize: "var(--bp-text-lg)",
                      textTransform: "uppercase",
                      color: "var(--bp-text)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {product.name}
                  </h3>
                  {product.description && (
                    <p
                      style={{
                        marginTop: "0.5rem",
                        fontFamily: "var(--bp-font-mono)",
                        fontSize: "var(--bp-text-sm)",
                        color: "var(--bp-text-muted)",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {product.description}
                    </p>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                    <span style={{ fontFamily: "var(--bp-font-mono)", fontSize: "var(--bp-text-md)", color: "var(--bp-text)" }}>
                      {isFree ? "Free" : product.price}
                    </span>
                    {product.comparePrice && !isFree && (
                      <span style={{ fontFamily: "var(--bp-font-mono)", fontSize: "var(--bp-text-sm)", color: "var(--bp-text-dim)", textDecoration: "line-through" }}>
                        {product.comparePrice}
                      </span>
                    )}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {onToggleWishlist && (
                      <WishlistButton isWishlisted={isWishlisted} onClick={handleWishlist} accentColor={accentColor} />
                    )}
                    {!isFree && onAddToCart && (
                      <button
                        onClick={handleAddToCart}
                        disabled={isAdding}
                        style={{
                          border: "2px solid var(--bp-border)",
                          background: "none",
                          padding: "0.4rem 1rem",
                          fontFamily: "var(--bp-font-mono)",
                          fontSize: "var(--bp-text-xs)",
                          textTransform: "uppercase",
                          letterSpacing: "0.12em",
                          color: "var(--bp-text)",
                          cursor: isAdding ? "not-allowed" : "pointer",
                          opacity: isAdding ? 0.7 : 1,
                          transition: "border-color var(--bp-transition), color var(--bp-transition)",
                        }}
                        onMouseEnter={(e) => {
                          if (!isAdding) e.currentTarget.style.borderColor = accentColor;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "var(--bp-border)";
                        }}
                      >
                        {isAdding ? "Added" : "Quick Add"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ),
        })}
        <style>{keyframesCss}</style>
      </div>
    );
  }

  // ── Grid layout ────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        animation: `bp-ec-fadein 0.5s ease both`,
        animationDelay: animDelay,
      }}
    >
      {renderLink({
        href: productHref,
        style: { display: "block", textDecoration: "none", color: "inherit" },
        children: (
          <div
            style={{
              position: "relative",
              border: "2px solid var(--bp-border)",
              background: "var(--bp-surface)",
              transition: "border-color var(--bp-transition)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = accentColor;
              setOverlayVisible(true);
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "var(--bp-border)";
              setOverlayVisible(false);
            }}
          >
            {/* Image */}
            <div
              style={{
                position: "relative",
                aspectRatio: "1",
                overflow: "hidden",
                background: "var(--bp-bg)",
              }}
            >
              <img
                src={product.imageSrc}
                alt={product.imageAlt ?? product.name}
                onLoad={() => setImageLoaded(true)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: imageLoaded ? 1 : 0,
                  transform: overlayVisible ? "scale(1.07)" : "scale(1)",
                  transition: "opacity 0.5s ease, transform 0.6s ease",
                }}
              />
              {!imageLoaded && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "var(--bp-bg)",
                    animation: "bp-ec-pulse 1.5s ease-in-out infinite",
                  }}
                />
              )}

              {/* Overlay actions */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)",
                  padding: "1rem",
                  opacity: overlayVisible ? 1 : 0,
                  transition: "opacity var(--bp-transition)",
                  pointerEvents: overlayVisible ? "auto" : "none",
                }}
              >
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {!isFree && onAddToCart && (
                    <button
                      onClick={handleAddToCart}
                      disabled={isAdding}
                      style={{
                        background: accentColor,
                        border: `2px solid ${accentColor}`,
                        color: "var(--bp-bg)",
                        padding: "0.45rem 1rem",
                        fontFamily: "var(--bp-font-mono)",
                        fontSize: "var(--bp-text-xs)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        cursor: isAdding ? "not-allowed" : "pointer",
                        opacity: isAdding ? 0.7 : 1,
                        transition: "opacity var(--bp-transition)",
                      }}
                    >
                      {isAdding ? "Added" : "Add to Bag"}
                    </button>
                  )}
                  {onQuickView && (
                    <button
                      onClick={handleQuickView}
                      style={{
                        background: "rgba(0,0,0,0.7)",
                        border: "2px solid rgba(250,250,250,0.4)",
                        color: "var(--bp-text)",
                        padding: "0.45rem 1rem",
                        fontFamily: "var(--bp-font-mono)",
                        fontSize: "var(--bp-text-xs)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        cursor: "pointer",
                        transition: "border-color var(--bp-transition)",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--bp-text)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(250,250,250,0.4)"; }}
                    >
                      Quick View
                    </button>
                  )}
                </div>

                {onToggleWishlist && (
                  <WishlistButton isWishlisted={isWishlisted} onClick={handleWishlist} accentColor={accentColor} />
                )}
              </div>

              {/* Free badge */}
              {isFree && (
                <div
                  style={{
                    position: "absolute",
                    top: "0.75rem",
                    left: "0.75rem",
                    background: "var(--bp-green)",
                    color: "var(--bp-bg)",
                    padding: "0.2rem 0.65rem",
                    fontFamily: "var(--bp-font-mono)",
                    fontSize: "var(--bp-text-xs)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  Free
                </div>
              )}
            </div>

            {/* Info strip */}
            <div style={{ padding: "1rem" }}>
              {product.category && (
                <span
                  style={{
                    fontFamily: "var(--bp-font-mono)",
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    color: accentColor,
                  }}
                >
                  {product.category}
                </span>
              )}
              <h3
                style={{
                  marginTop: "0.25rem",
                  fontFamily: "var(--bp-font-heading)",
                  fontSize: "var(--bp-text-md)",
                  textTransform: "uppercase",
                  color: "var(--bp-text)",
                  lineHeight: 1.2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  transition: "color var(--bp-transition)",
                }}
              >
                {product.name}
              </h3>
              {product.description && (
                <p
                  style={{
                    marginTop: "0.25rem",
                    fontFamily: "var(--bp-font-mono)",
                    fontSize: "var(--bp-text-xs)",
                    color: "var(--bp-text-dim)",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {product.description}
                </p>
              )}
              <div
                style={{
                  marginTop: "0.75rem",
                  paddingTop: "0.75rem",
                  borderTop: "1px solid var(--bp-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem" }}>
                  <span style={{ fontFamily: "var(--bp-font-mono)", fontSize: "var(--bp-text-base)", color: "var(--bp-text)" }}>
                    {isFree ? "Free" : product.price}
                  </span>
                  {product.comparePrice && !isFree && (
                    <span style={{ fontFamily: "var(--bp-font-mono)", fontSize: "var(--bp-text-sm)", color: "var(--bp-text-dim)", textDecoration: "line-through" }}>
                      {product.comparePrice}
                    </span>
                  )}
                </div>
                {product.variants && product.variants.length > 1 && (
                  <span style={{ fontFamily: "var(--bp-font-mono)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--bp-text-dim)" }}>
                    {product.variants.length} options
                  </span>
                )}
              </div>
            </div>
          </div>
        ),
      })}
      <style>{keyframesCss}</style>
    </div>
  );
}

// ── Internal: Wishlist heart button ──────────────────────────────────────────

interface WishlistButtonProps {
  isWishlisted: boolean;
  onClick: (e: React.MouseEvent) => void;
  accentColor: string;
}

function WishlistButton({ isWishlisted, onClick, accentColor }: WishlistButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      style={{
        background: "none",
        border: "none",
        padding: "0.4rem",
        cursor: "pointer",
        color: isWishlisted ? "var(--bp-red)" : "var(--bp-text-muted)",
        transition: "color var(--bp-transition)",
      }}
      onMouseEnter={(e) => {
        if (!isWishlisted) e.currentTarget.style.color = "var(--bp-red)";
      }}
      onMouseLeave={(e) => {
        if (!isWishlisted) e.currentTarget.style.color = "var(--bp-text-muted)";
      }}
    >
      <svg width={20} height={20} fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d={heartPath} />
      </svg>
    </button>
  );
}

// ── Keyframes ─────────────────────────────────────────────────────────────────

const keyframesCss = `
@keyframes bp-ec-fadein {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes bp-ec-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
}
`;
