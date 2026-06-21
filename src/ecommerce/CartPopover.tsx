/**
 * brutnoir-pro · CartPopover
 * Cart dropdown/popover. Native implementation — no @headlessui.
 * Props-driven: pass items, callbacks, and renderLink.
 */

import React, { useRef, useEffect, useState } from "react";
import type { CartItem, RenderLink } from "./types";
import { defaultRenderLink } from "./helpers";

export interface CartPopoverProps {
  items: CartItem[];
  total?: string;
  onUpdateQuantity?: (productId: string, variantName: string, newQty: number) => void;
  onRemove?: (productId: string, variantName: string) => void;
  onCheckout?: () => void;
  onClearCart?: () => void;
  onContinueShopping?: () => void;
  renderLink?: RenderLink;
  checkoutHref?: string;
  shopHref?: string;
  /** Override accent color. Defaults to var(--bp-orange) */
  accentColor?: string;
  /** Custom trigger element. If omitted, renders a cart icon button. */
  renderTrigger?: (props: { onClick: () => void; itemCount: number }) => React.ReactElement;
}

export function CartPopover({
  items,
  total,
  onUpdateQuantity,
  onRemove,
  onCheckout,
  onClearCart,
  onContinueShopping,
  renderLink = defaultRenderLink,
  checkoutHref = "/shop/checkout",
  shopHref = "/shop/products",
  accentColor = "var(--bp-orange)",
  renderTrigger,
}: CartPopoverProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const handleUpdateQty = (productId: string, variantName: string, newQty: number) => {
    if (newQty <= 0) {
      onRemove?.(productId, variantName);
    } else {
      onUpdateQuantity?.(productId, variantName, newQty);
    }
  };

  return (
    <div ref={containerRef} style={{ position: "relative", display: "inline-block" }}>
      {/* Trigger */}
      {renderTrigger ? (
        renderTrigger({ onClick: () => setOpen((p) => !p), itemCount: totalItems })
      ) : (
        <button
          onClick={() => setOpen((p) => !p)}
          aria-label={`Cart — ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
          aria-expanded={open}
          style={{
            position: "relative",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0.5rem",
            color: "var(--bp-text)",
            transition: "color var(--bp-transition)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = accentColor; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--bp-text)"; }}
        >
          {/* Cart icon */}
          <svg width={24} height={24} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          {totalItems > 0 && (
            <span
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                minWidth: 20,
                height: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: accentColor,
                color: "var(--bp-bg)",
                fontFamily: "var(--bp-font-mono)",
                fontSize: "10px",
                fontWeight: 700,
              }}
            >
              {totalItems}
            </span>
          )}
        </button>
      )}

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Shopping cart"
          style={{
            position: "absolute",
            top: "calc(100% + 0.5rem)",
            right: 0,
            width: 420,
            maxWidth: "95vw",
            background: "var(--bp-surface)",
            border: "2px solid var(--bp-border)",
            boxShadow: "8px 8px 0 0 rgba(0,0,0,0.5)",
            zIndex: "var(--bp-z-dropdown)" as unknown as number,
            animation: "bp-cart-drop 0.18s ease both",
          }}
        >
          <style>{keyframesCss}</style>

          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem 1.5rem",
              borderBottom: "1px solid var(--bp-border)",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--bp-font-heading)",
                fontSize: "var(--bp-text-md)",
                textTransform: "uppercase",
                color: "var(--bp-text)",
                margin: 0,
              }}
            >
              Your Bag
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {items.length > 0 && (
                <span style={{ fontFamily: "var(--bp-font-mono)", fontSize: "var(--bp-text-xs)", color: "var(--bp-text-dim)" }}>
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </span>
              )}
              <button
                onClick={() => setOpen(false)}
                aria-label="Close cart"
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--bp-text-dim)", padding: "0.2rem", transition: "color var(--bp-transition)" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--bp-text)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--bp-text-dim)"; }}
              >
                <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Empty state */}
          {items.length === 0 ? (
            <div style={{ padding: "3rem 1.5rem", textAlign: "center" }}>
              <svg
                width={48}
                height={48}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                style={{ color: "var(--bp-border)", margin: "0 auto 1rem" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <p style={{ fontFamily: "var(--bp-font-mono)", fontSize: "var(--bp-text-sm)", color: "var(--bp-text-muted)", marginBottom: "1rem" }}>
                Your bag is empty
              </p>
              {renderLink({
                href: shopHref,
                style: {
                  fontFamily: "var(--bp-font-mono)",
                  fontSize: "var(--bp-text-xs)",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: accentColor,
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                },
                children: "Continue Shopping",
                onClick: () => setOpen(false),
              })}
            </div>
          ) : (
            <>
              {/* Items */}
              <ul
                role="list"
                style={{
                  maxHeight: 320,
                  overflowY: "auto",
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                }}
              >
                {items.map((item) => (
                  <li
                    key={`${item.productId}-${item.variantName}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "1rem 1.5rem",
                      borderBottom: "1px solid var(--bp-border)",
                      gap: "0.75rem",
                    }}
                  >
                    {/* Image thumbnail */}
                    {item.imageSrc && (
                      <div style={{ width: 48, height: 48, flexShrink: 0, overflow: "hidden", border: "1px solid var(--bp-border)" }}>
                        <img src={item.imageSrc} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    )}

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {renderLink({
                        href: `/shop/products/${item.productSlug}`,
                        style: {
                          display: "block",
                          fontFamily: "var(--bp-font-heading)",
                          fontSize: "var(--bp-text-sm)",
                          textTransform: "uppercase",
                          color: "var(--bp-text)",
                          textDecoration: "none",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          transition: "color var(--bp-transition)",
                        },
                        children: item.title,
                      })}
                      <p style={{ marginTop: "0.15rem", fontFamily: "var(--bp-font-mono)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--bp-text-dim)" }}>
                        {item.variantName}
                      </p>
                      <p style={{ marginTop: "0.25rem", fontFamily: "var(--bp-font-mono)", fontSize: "var(--bp-text-sm)", color: accentColor }}>
                        {item.price}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <button onClick={() => handleUpdateQty(item.productId, item.variantName, item.quantity - 1)} style={qtyBtnStyle} aria-label="Decrease quantity">
                        −
                      </button>
                      <span style={{ width: 32, textAlign: "center", fontFamily: "var(--bp-font-mono)", fontSize: "var(--bp-text-xs)", color: "var(--bp-text)" }}>
                        {item.quantity}
                      </span>
                      <button onClick={() => handleUpdateQty(item.productId, item.variantName, item.quantity + 1)} style={qtyBtnStyle} aria-label="Increase quantity">
                        +
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => onRemove?.(item.productId, item.variantName)}
                      aria-label={`Remove ${item.title}`}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--bp-text-dim)", padding: "0.2rem", transition: "color var(--bp-transition)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "var(--bp-red)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "var(--bp-text-dim)"; }}
                    >
                      <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>

              {/* Footer */}
              <div style={{ padding: "1rem 1.5rem" }}>
                {/* Total */}
                {total && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid var(--bp-border)" }}>
                    <span style={{ fontFamily: "var(--bp-font-mono)", fontSize: "var(--bp-text-sm)", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--bp-text-muted)" }}>Total</span>
                    <span style={{ fontFamily: "var(--bp-font-mono)", fontSize: "var(--bp-text-base)", color: "var(--bp-text)" }}>{total}</span>
                  </div>
                )}

                {/* Checkout CTA */}
                {onCheckout ? (
                  <button
                    onClick={() => { setOpen(false); onCheckout(); }}
                    style={checkoutBtnStyle(accentColor)}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(2px, 2px)"; e.currentTarget.style.boxShadow = "2px 2px 0 0 rgba(1,148,88,1)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "4px 4px 0 0 rgba(1,148,88,1)"; }}
                  >
                    Proceed to Checkout
                  </button>
                ) : (
                  renderLink({
                    href: checkoutHref,
                    style: checkoutBtnStyle(accentColor),
                    children: "Proceed to Checkout",
                    onClick: () => setOpen(false),
                  })
                )}

                {/* Clear cart */}
                {onClearCart && (
                  <button
                    onClick={() => { onClearCart(); }}
                    style={clearBtnStyle}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--bp-red)"; e.currentTarget.style.color = "var(--bp-red)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--bp-border)"; e.currentTarget.style.color = "var(--bp-text-dim)"; }}
                  >
                    Clear Cart
                  </button>
                )}

                {/* Continue shopping */}
                <div style={{ marginTop: "0.75rem", textAlign: "center" }}>
                  {renderLink({
                    href: shopHref,
                    style: {
                      fontFamily: "var(--bp-font-mono)",
                      fontSize: "var(--bp-text-xs)",
                      color: accentColor,
                      textDecoration: "underline",
                      textUnderlineOffset: "3px",
                    },
                    children: "Continue Shopping",
                    onClick: () => setOpen(false),
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── Style helpers ─────────────────────────────────────────────────────────────

const qtyBtnStyle: React.CSSProperties = {
  border: "1px solid var(--bp-border)",
  background: "none",
  color: "var(--bp-text-muted)",
  width: 28,
  height: 28,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontFamily: "var(--bp-font-mono)",
  fontSize: "var(--bp-text-sm)",
  transition: "border-color var(--bp-transition), color var(--bp-transition)",
};

function checkoutBtnStyle(accentColor: string): React.CSSProperties {
  return {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    border: `2px solid ${accentColor}`,
    background: accentColor,
    color: "var(--bp-bg)",
    padding: "0.75rem 1.5rem",
    fontFamily: "var(--bp-font-heading)",
    fontSize: "var(--bp-text-xs)",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    textDecoration: "none",
    cursor: "pointer",
    boxShadow: "4px 4px 0 0 rgba(1,148,88,1)",
    transition: "transform var(--bp-transition-fast), box-shadow var(--bp-transition-fast)",
    marginBottom: "0.5rem",
  };
}

const clearBtnStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  border: "2px solid var(--bp-border)",
  background: "none",
  color: "var(--bp-text-dim)",
  padding: "0.65rem 1.5rem",
  fontFamily: "var(--bp-font-mono)",
  fontSize: "var(--bp-text-xs)",
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  cursor: "pointer",
  marginBottom: "0.5rem",
  transition: "border-color var(--bp-transition), color var(--bp-transition)",
};

const keyframesCss = `
@keyframes bp-cart-drop {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;
