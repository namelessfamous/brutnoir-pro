/**
 * brutnoir-pro · RecentlyViewed
 * Horizontal scrolling recently-viewed products bar.
 * Props-driven, framework-agnostic. No Next.js, no framer-motion.
 */

import React from "react";
import type { RecentlyViewedItem, RenderLink } from "./types";
import { defaultRenderLink } from "./helpers";

export interface RecentlyViewedProps {
  items: RecentlyViewedItem[];
  onClear?: () => void;
  /** Render prop for each product card. Falls back to built-in thumbnail card. */
  renderProductCard?: (item: RecentlyViewedItem, index: number) => React.ReactNode;
  renderLink?: RenderLink;
  /** Max items to display */
  maxItems?: number;
  /** Exclude an item by ID (e.g. the current product page) */
  excludeId?: string;
  /** Override accent color. Defaults to var(--bp-orange) */
  accentColor?: string;
  /** Section title */
  title?: string;
}

export function RecentlyViewed({
  items,
  onClear,
  renderProductCard,
  renderLink = defaultRenderLink,
  maxItems = 6,
  excludeId,
  accentColor = "var(--bp-orange)",
  title = "Recently Viewed",
}: RecentlyViewedProps): React.ReactElement | null {
  const displayItems = items
    .filter((item) => item.id !== excludeId)
    .slice(0, maxItems);

  if (displayItems.length === 0) return null;

  return (
    <div
      style={{
        background: "var(--bp-bg)",
        borderTop: "2px solid var(--bp-border)",
        paddingBlock: "3rem",
      }}
    >
      <style>{keyframesCss}</style>

      <div style={{ maxWidth: 1280, margin: "0 auto", paddingInline: "2rem" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "2rem",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--bp-font-heading)",
              fontSize: "var(--bp-text-xl)",
              textTransform: "uppercase",
              color: "var(--bp-text)",
            }}
          >
            {title}
          </h2>
          {onClear && (
            <button
              onClick={onClear}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--bp-font-mono)",
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "var(--bp-text-dim)",
                padding: 0,
                transition: "color var(--bp-transition)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--bp-text)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--bp-text-dim)"; }}
            >
              Clear History
            </button>
          )}
        </div>

        {/* Scrollable row */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            overflowX: "auto",
            paddingBottom: "1rem",
            scrollbarWidth: "thin",
            scrollbarColor: "var(--bp-border) transparent",
          }}
        >
          {displayItems.map((item, idx) => {
            if (renderProductCard) {
              return (
                <React.Fragment key={item.id}>
                  {renderProductCard(item, idx)}
                </React.Fragment>
              );
            }
            return (
              <RecentlyViewedCard
                key={item.id}
                item={item}
                index={idx}
                renderLink={renderLink}
                accentColor={accentColor}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Internal thumbnail card ───────────────────────────────────────────────────

interface RecentlyViewedCardProps {
  item: RecentlyViewedItem;
  index: number;
  renderLink: RenderLink;
  accentColor: string;
}

function RecentlyViewedCard({ item, index, renderLink, accentColor }: RecentlyViewedCardProps) {
  return (
    <div
      style={{
        flexShrink: 0,
        width: 192,
        animation: "bp-rv-fadein 0.35s ease both",
        animationDelay: `${index * 0.05}s`,
      }}
    >
      {renderLink({
        href: `/shop/products/${item.slug}`,
        style: { display: "block", textDecoration: "none", color: "inherit" },
        children: (
          <>
            {/* Thumbnail */}
            <div
              style={{
                position: "relative",
                aspectRatio: "1",
                overflow: "hidden",
                border: "2px solid var(--bp-border)",
                background: "var(--bp-bg)",
                transition: "border-color var(--bp-transition)",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = `color-mix(in srgb, ${accentColor} 60%, var(--bp-border))`; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--bp-border)"; }}
            >
              <img
                src={item.imageSrc}
                alt={item.imageAlt ?? item.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.45s ease",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
              />
              {/* Time-ago overlay */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                  padding: "0.5rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--bp-font-mono)",
                    fontSize: "9px",
                    color: "rgba(250,250,250,0.6)",
                  }}
                >
                  {formatTimeAgo(item.viewedAt)}
                </span>
              </div>
            </div>

            {/* Info */}
            <div style={{ marginTop: "0.5rem" }}>
              <h3
                style={{
                  fontFamily: "var(--bp-font-heading)",
                  fontSize: "var(--bp-text-xs)",
                  textTransform: "uppercase",
                  color: "var(--bp-text)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  transition: "color var(--bp-transition)",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = accentColor; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--bp-text)"; }}
              >
                {item.name}
              </h3>
              <p
                style={{
                  marginTop: "0.2rem",
                  fontFamily: "var(--bp-font-mono)",
                  fontSize: "var(--bp-text-xs)",
                  color: accentColor,
                }}
              >
                {item.price}
              </p>
            </div>
          </>
        ),
      })}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const keyframesCss = `
@keyframes bp-rv-fadein {
  from { opacity: 0; transform: translateX(16px); }
  to   { opacity: 1; transform: translateX(0); }
}
`;
