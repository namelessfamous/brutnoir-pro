/**
 * brutnoir-pro · ProductQuickview
 * Quick-view modal for products. Native dialog implementation — no @headlessui.
 * Props-driven, framework-agnostic.
 */

import React, { useState, useEffect, useRef } from "react";
import type { Product, ProductVariant, RenderLink } from "./types";
import { defaultRenderLink } from "./helpers";

export interface ProductQuickviewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product, variant: ProductVariant, quantity: number) => void | Promise<void>;
  /** For free products — called on "Download" click */
  onDownload?: (product: Product) => void;
  renderLink?: RenderLink;
  /** Override accent color. Defaults to var(--bp-orange) */
  accentColor?: string;
}

const checkPath = "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z";

export function ProductQuickview({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onDownload,
  renderLink = defaultRenderLink,
  accentColor = "var(--bp-orange)",
}: ProductQuickviewProps): React.ReactElement | null {
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setSelectedVariantIdx(0);
      setQuantity(1);
      setIsAdding(false);
      setAdded(false);
    }
  }, [product]);

  // Keyboard close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const variant = product.variants?.[selectedVariantIdx];
  const isFree =
    !product.price ||
    product.price.toLowerCase().includes("free") ||
    product.price === "$0" ||
    product.price === "0";
  const isVariantFree =
    !variant?.stripePriceId ||
    (variant?.price ?? "").toLowerCase().includes("free") ||
    variant?.price === "$0";
  const effectiveFree = isFree || isVariantFree;

  const handleAddToCart = async () => {
    if (!onAddToCart || isAdding) return;
    setIsAdding(true);
    try {
      await onAddToCart(product, variant ?? { name: "Default" }, quantity);
      setAdded(true);
      setTimeout(() => {
        setAdded(false);
        onClose();
      }, 1200);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDownload = () => {
    onDownload?.(product);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: "var(--bp-z-modal)" as unknown as number,
        padding: "1rem",
        animation: "bp-qv-in 0.2s ease both",
      }}
    >
      <style>{keyframesCss}</style>

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Quick view — ${product.name}`}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 768,
          maxHeight: "90vh",
          overflowY: "auto",
          background: "var(--bp-surface)",
          border: "2px solid var(--bp-border)",
          boxShadow: "12px 12px 0 0 rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          animation: "bp-qv-slide 0.25s ease both",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close quick view"
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            zIndex: 10,
            background: "var(--bp-bg)",
            border: "1px solid var(--bp-border)",
            color: "var(--bp-text-muted)",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "color var(--bp-transition), border-color var(--bp-transition)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--bp-text)"; e.currentTarget.style.borderColor = "var(--bp-text)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--bp-text-muted)"; e.currentTarget.style.borderColor = "var(--bp-border)"; }}
        >
          <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Body */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {/* Image */}
          <div
            style={{
              flex: "1 1 300px",
              position: "relative",
            }}
          >
            <div style={{ aspectRatio: "1", overflow: "hidden", background: "var(--bp-bg)" }}>
              <img
                src={product.imageSrc}
                alt={product.imageAlt ?? product.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            {effectiveFree && (
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

          {/* Details */}
          <div
            style={{
              flex: "1 1 300px",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
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
              <h2
                style={{
                  marginTop: "0.25rem",
                  fontFamily: "var(--bp-font-heading)",
                  fontSize: "var(--bp-text-xl)",
                  textTransform: "uppercase",
                  color: "var(--bp-text)",
                  lineHeight: 1.1,
                }}
              >
                {product.name}
              </h2>
              <p
                style={{
                  marginTop: "0.5rem",
                  fontFamily: "var(--bp-font-mono)",
                  fontSize: "var(--bp-text-xl)",
                  color: accentColor,
                }}
              >
                {effectiveFree ? "Free" : (variant?.price ?? product.price)}
              </p>
              {product.description && (
                <p
                  style={{
                    marginTop: "1rem",
                    fontFamily: "var(--bp-font-mono)",
                    fontSize: "var(--bp-text-xs)",
                    lineHeight: 1.7,
                    color: "var(--bp-text-muted)",
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {product.description}
                </p>
              )}

              {/* Variant selector */}
              {product.variants && product.variants.length > 1 && (
                <div style={{ marginTop: "1.5rem" }}>
                  <p
                    style={{
                      fontFamily: "var(--bp-font-mono)",
                      fontSize: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.18em",
                      color: "var(--bp-text-dim)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Variant
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {product.variants.map((v, idx) => {
                      const active = selectedVariantIdx === idx;
                      return (
                        <button
                          key={v.name}
                          onClick={() => setSelectedVariantIdx(idx)}
                          style={{
                            border: `2px solid ${active ? accentColor : "var(--bp-border)"}`,
                            background: active ? `color-mix(in srgb, ${accentColor} 10%, var(--bp-surface))` : "none",
                            color: active ? accentColor : "var(--bp-text-muted)",
                            padding: "0.35rem 0.75rem",
                            fontFamily: "var(--bp-font-mono)",
                            fontSize: "var(--bp-text-xs)",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            cursor: "pointer",
                            transition: "border-color var(--bp-transition), color var(--bp-transition)",
                            position: "relative",
                          }}
                        >
                          {v.name}
                          {active && (
                            <span
                              style={{
                                position: "absolute",
                                top: -8,
                                right: -8,
                                background: accentColor,
                                borderRadius: "50%",
                                width: 16,
                                height: 16,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <svg width={10} height={10} fill="currentColor" viewBox="0 0 20 20" style={{ color: "var(--bp-bg)" }}>
                                <path fillRule="evenodd" d={checkPath} clipRule="evenodd" />
                              </svg>
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity */}
              {!effectiveFree && (
                <div style={{ marginTop: "1.5rem" }}>
                  <p
                    style={{
                      fontFamily: "var(--bp-font-mono)",
                      fontSize: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.18em",
                      color: "var(--bp-text-dim)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Quantity
                  </p>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      style={qtyBtnStyle}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.color = accentColor; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--bp-border)"; e.currentTarget.style.color = "var(--bp-text)"; }}
                    >
                      −
                    </button>
                    <span
                      style={{
                        width: 40,
                        textAlign: "center",
                        fontFamily: "var(--bp-font-mono)",
                        fontSize: "var(--bp-text-sm)",
                        color: "var(--bp-text)",
                      }}
                    >
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      style={qtyBtnStyle}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.color = accentColor; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--bp-border)"; e.currentTarget.style.color = "var(--bp-text)"; }}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {effectiveFree ? (
                <button
                  onClick={handleDownload}
                  style={{
                    width: "100%",
                    border: "2px solid var(--bp-green)",
                    background: "var(--bp-green)",
                    color: "var(--bp-bg)",
                    padding: "0.75rem 1.5rem",
                    fontFamily: "var(--bp-font-heading)",
                    fontSize: "var(--bp-text-xs)",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    cursor: "pointer",
                    boxShadow: "4px 4px 0 0 rgba(0,0,0,0.3)",
                    transition: "transform var(--bp-transition-fast), box-shadow var(--bp-transition-fast)",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(2px,2px)"; e.currentTarget.style.boxShadow = "2px 2px 0 0 rgba(0,0,0,0.3)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "4px 4px 0 0 rgba(0,0,0,0.3)"; }}
                >
                  Download Free
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || added}
                  style={{
                    width: "100%",
                    border: `2px solid ${accentColor}`,
                    background: accentColor,
                    color: "var(--bp-bg)",
                    padding: "0.75rem 1.5rem",
                    fontFamily: "var(--bp-font-heading)",
                    fontSize: "var(--bp-text-xs)",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    cursor: isAdding || added ? "not-allowed" : "pointer",
                    opacity: isAdding || added ? 0.8 : 1,
                    boxShadow: "4px 4px 0 0 rgba(0,0,0,0.3)",
                    transition: "transform var(--bp-transition-fast), box-shadow var(--bp-transition-fast), opacity var(--bp-transition)",
                  }}
                  onMouseEnter={(e) => { if (!isAdding && !added) { e.currentTarget.style.transform = "translate(2px,2px)"; e.currentTarget.style.boxShadow = "2px 2px 0 0 rgba(0,0,0,0.3)"; } }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "4px 4px 0 0 rgba(0,0,0,0.3)"; }}
                >
                  {added ? "Added to Bag ✓" : isAdding ? "Adding…" : "Add to Bag"}
                </button>
              )}

              {renderLink({
                href: `/shop/products/${product.slug}`,
                style: {
                  display: "block",
                  width: "100%",
                  border: "2px solid var(--bp-border)",
                  background: "none",
                  color: "var(--bp-text-muted)",
                  padding: "0.65rem 1.5rem",
                  fontFamily: "var(--bp-font-mono)",
                  fontSize: "var(--bp-text-xs)",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  textAlign: "center",
                  textDecoration: "none",
                  cursor: "pointer",
                  transition: "border-color var(--bp-transition), color var(--bp-transition)",
                  boxSizing: "border-box",
                },
                children: "View Full Details",
                onClick: onClose,
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const qtyBtnStyle: React.CSSProperties = {
  border: "2px solid var(--bp-border)",
  background: "none",
  color: "var(--bp-text)",
  width: 36,
  height: 36,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "var(--bp-font-mono)",
  fontSize: "var(--bp-text-sm)",
  cursor: "pointer",
  transition: "border-color var(--bp-transition), color var(--bp-transition)",
};

const keyframesCss = `
@keyframes bp-qv-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes bp-qv-slide {
  from { opacity: 0; transform: scale(0.96) translateY(12px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
`;
