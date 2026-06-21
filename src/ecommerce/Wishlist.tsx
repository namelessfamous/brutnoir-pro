/**
 * brutnoir-pro · Wishlist
 * Wishlist panel / page. Props-driven — no internal localStorage coupling.
 * No Next.js, no framer-motion.
 */

import React, { useState } from "react";
import type { WishlistItem, RenderLink } from "./types";
import { defaultRenderLink } from "./helpers";

export interface WishlistProps {
  items: WishlistItem[];
  onRemove?: (productId: string) => void;
  onClearAll?: () => void;
  /** Called when user clicks "Move to Bag". App handles cart logic. */
  onMoveToCart?: (item: WishlistItem) => void | Promise<void>;
  /**
   * Render prop for each product card.
   * When provided, the built-in card is replaced.
   */
  renderProductCard?: (item: WishlistItem, index: number) => React.ReactNode;
  renderLink?: RenderLink;
  shopHref?: string;
  /** Override accent color. Defaults to var(--bp-orange) */
  accentColor?: string;
}

const heartPath =
  "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z";

export function Wishlist({
  items,
  onRemove,
  onClearAll,
  onMoveToCart,
  renderProductCard,
  renderLink = defaultRenderLink,
  shopHref = "/shop/products",
  accentColor = "var(--bp-orange)",
}: WishlistProps): React.ReactElement {
  const [movingId, setMovingId] = useState<string | null>(null);

  const handleMoveToCart = async (item: WishlistItem) => {
    setMovingId(item.id);
    try {
      await onMoveToCart?.(item);
    } finally {
      setTimeout(() => setMovingId(null), 800);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bp-bg)" }}>
      <style>{keyframesCss}</style>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "4rem 2rem" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "3rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "var(--bp-font-heading)",
                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                textTransform: "uppercase",
                color: "var(--bp-text)",
                lineHeight: 1.05,
              }}
            >
              Wishlist
            </h1>
            <p style={{ marginTop: "0.5rem", fontFamily: "var(--bp-font-mono)", fontSize: "var(--bp-text-xs)", color: "var(--bp-text-dim)" }}>
              {items.length} {items.length === 1 ? "item" : "items"} saved
            </p>
          </div>
          {items.length > 0 && onClearAll && (
            <button
              onClick={onClearAll}
              style={{
                border: "2px solid var(--bp-border)",
                background: "none",
                color: "var(--bp-text-dim)",
                padding: "0.5rem 1rem",
                fontFamily: "var(--bp-font-mono)",
                fontSize: "var(--bp-text-xs)",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                cursor: "pointer",
                transition: "border-color var(--bp-transition), color var(--bp-transition)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--bp-red)"; e.currentTarget.style.color = "var(--bp-red)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--bp-border)"; e.currentTarget.style.color = "var(--bp-text-dim)"; }}
            >
              Clear All
            </button>
          )}
        </div>

        <div
          style={{
            height: 1,
            background: `linear-gradient(to right, ${accentColor}, rgba(250,250,250,0.1) 60%, transparent)`,
            marginBottom: "2rem",
          }}
        />

        {/* Empty state */}
        {items.length === 0 ? (
          <div style={{ paddingBlock: "6rem", textAlign: "center", animation: "bp-wl-fadein 0.4s ease both" }}>
            <svg
              width={64}
              height={64}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
              style={{ color: "var(--bp-border)", margin: "0 auto 1.5rem" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d={heartPath} />
            </svg>
            <p style={{ fontFamily: "var(--bp-font-mono)", fontSize: "var(--bp-text-md)", color: "var(--bp-text-muted)", marginBottom: "1.5rem" }}>
              Your wishlist is empty
            </p>
            {renderLink({
              href: shopHref,
              style: {
                display: "inline-block",
                border: `2px solid ${accentColor}`,
                background: accentColor,
                color: "var(--bp-bg)",
                padding: "0.75rem 2rem",
                fontFamily: "var(--bp-font-heading)",
                fontSize: "var(--bp-text-sm)",
                textTransform: "uppercase",
                textDecoration: "none",
                cursor: "pointer",
                transition: "opacity var(--bp-transition)",
              },
              children: "Browse Products",
            })}
          </div>
        ) : (
          /* Product grid */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {items.map((item, idx) => {
              if (renderProductCard) {
                return (
                  <React.Fragment key={item.id}>
                    {renderProductCard(item, idx)}
                  </React.Fragment>
                );
              }
              return (
                <WishlistCard
                  key={item.id}
                  item={item}
                  index={idx}
                  isMoving={movingId === item.id}
                  onMoveToCart={onMoveToCart ? () => handleMoveToCart(item) : undefined}
                  onRemove={onRemove ? () => onRemove(item.id) : undefined}
                  renderLink={renderLink}
                  accentColor={accentColor}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Internal card ─────────────────────────────────────────────────────────────

interface WishlistCardProps {
  item: WishlistItem;
  index: number;
  isMoving: boolean;
  onMoveToCart?: () => void;
  onRemove?: () => void;
  renderLink: RenderLink;
  accentColor: string;
}

function WishlistCard({
  item,
  index,
  isMoving,
  onMoveToCart,
  onRemove,
  renderLink,
  accentColor,
}: WishlistCardProps) {
  return (
    <div
      style={{
        border: "2px solid var(--bp-border)",
        background: "var(--bp-surface)",
        transition: "border-color var(--bp-transition)",
        animation: "bp-wl-fadein 0.4s ease both",
        animationDelay: `${index * 0.05}s`,
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = `color-mix(in srgb, ${accentColor} 60%, var(--bp-border))`; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--bp-border)"; }}
    >
      {/* Image */}
      {renderLink({
        href: `/shop/products/${item.slug}`,
        style: { display: "block", textDecoration: "none" },
        children: (
          <div style={{ position: "relative", aspectRatio: "1", overflow: "hidden", background: "var(--bp-bg)" }}>
            <img
              src={item.imageSrc}
              alt={item.imageAlt ?? item.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
            />
          </div>
        ),
      })}

      {/* Info */}
      <div style={{ padding: "1rem" }}>
        {item.category && (
          <span
            style={{
              fontFamily: "var(--bp-font-mono)",
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: accentColor,
            }}
          >
            {item.category}
          </span>
        )}
        <h3
          style={{
            marginTop: "0.25rem",
            fontFamily: "var(--bp-font-heading)",
            fontSize: "var(--bp-text-md)",
            textTransform: "uppercase",
            color: "var(--bp-text)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {renderLink({
            href: `/shop/products/${item.slug}`,
            style: { textDecoration: "none", color: "inherit", transition: "color var(--bp-transition)" },
            children: item.name,
          })}
        </h3>
        {item.description && (
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
            {item.description}
          </p>
        )}
        <p style={{ marginTop: "0.5rem", fontFamily: "var(--bp-font-mono)", fontSize: "var(--bp-text-base)", color: accentColor }}>
          {item.price}
        </p>

        {/* Actions */}
        <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
          {onMoveToCart && (
            <button
              onClick={onMoveToCart}
              disabled={isMoving}
              style={{
                flex: 1,
                border: `2px solid ${accentColor}`,
                background: accentColor,
                color: "var(--bp-bg)",
                padding: "0.5rem 0.75rem",
                fontFamily: "var(--bp-font-mono)",
                fontSize: "var(--bp-text-xs)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                cursor: isMoving ? "not-allowed" : "pointer",
                opacity: isMoving ? 0.7 : 1,
                transition: "opacity var(--bp-transition)",
              }}
            >
              {isMoving ? "Added" : "Move to Bag"}
            </button>
          )}
          {onRemove && (
            <button
              onClick={onRemove}
              aria-label="Remove from wishlist"
              style={{
                border: "2px solid var(--bp-border)",
                background: "none",
                color: "var(--bp-text-dim)",
                padding: "0.5rem 0.75rem",
                cursor: "pointer",
                transition: "border-color var(--bp-transition), color var(--bp-transition)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--bp-red)"; e.currentTarget.style.color = "var(--bp-red)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--bp-border)"; e.currentTarget.style.color = "var(--bp-text-dim)"; }}
            >
              <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Keyframes ─────────────────────────────────────────────────────────────────

const keyframesCss = `
@keyframes bp-wl-fadein {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;
