/**
 * brutnoir-pro · ProductDetail
 * Full product detail view. Fully props-driven — no internal data fetching.
 * No Next.js, no Stripe, no framer-motion.
 */

import React, { useState } from "react";
import type { Product, ProductVariant, RenderLink } from "./types";
import { defaultRenderLink } from "./helpers";
import SmartVariantSelector, { canUseSmartSelector } from "./SmartVariantSelector";

export interface ProductDetailBreadcrumb {
  id: string | number;
  name: string;
  href: string;
}

export interface ProductDetailReviews {
  average: number;
  totalCount: number;
}

export interface ProductDetailProps {
  product: Product;
  breadcrumbs?: ProductDetailBreadcrumb[];
  reviews?: ProductDetailReviews;
  /** Externally controlled selected variant */
  selectedVariant?: ProductVariant;
  onVariantChange?: (variant: ProductVariant) => void;
  /** Externally controlled quantity */
  quantity?: number;
  onQuantityChange?: (quantity: number) => void;
  onAddToCart?: (product: Product, variant: ProductVariant, quantity: number) => void | Promise<void>;
  /** For free products: called on "Download Now" click */
  onDownload?: (product: Product) => void;
  onToggleWishlist?: (productId: string) => void;
  isWishlisted?: boolean;
  isAddingToCart?: boolean;
  successMessage?: string;
  renderLink?: RenderLink;
  /** Override accent color. Defaults to var(--bp-orange) */
  accentColor?: string;
  /**
   * Color name → CSS hex map passed to SmartVariantSelector.
   * Defaults to DEFAULT_CLOTHING_COLORS. Consumers can spread and extend.
   */
  colorMap?: Record<string, string>;
  /**
   * Ordered list of recognised size tokens passed to SmartVariantSelector.
   * Defaults to ["XS","S","M","L","XL","2XL","3XL","4XL","5XL","One size"].
   */
  sizeTokens?: string[];
}

const heartPath =
  "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z";

const checkPath = "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z";

export function ProductDetail({
  product,
  breadcrumbs = [],
  reviews,
  selectedVariant: controlledVariant,
  onVariantChange,
  quantity: controlledQty,
  onQuantityChange,
  onAddToCart,
  onDownload,
  onToggleWishlist,
  isWishlisted = false,
  isAddingToCart = false,
  successMessage,
  renderLink = defaultRenderLink,
  accentColor = "var(--bp-orange)",
  colorMap,
  sizeTokens,
}: ProductDetailProps): React.ReactElement {
  const [internalVariant, setInternalVariant] = useState<ProductVariant>(
    product.variants?.[0] ?? { name: "Default" }
  );
  const [internalQty, setInternalQty] = useState(1);

  // Smart selector state — only used when canUseSmartSelector returns true
  const [smartVariant, setSmartVariant] = useState<ProductVariant | null>(null);

  const hasVariants = (product.variants?.length ?? 0) > 0;
  const availableVariants = product.variants?.filter(v => v.availableForSale !== false) ?? [];
  const isSingleVariant = availableVariants.length <= 1;
  const useSmartSel = hasVariants && !isSingleVariant && canUseSmartSelector(product.variants!);

  // When smart selector is active, use the smart-picked variant (falling back
  // to the first variant for display-only fields like price/free check).
  // When inactive, use controlled or internal variant as before.
  const selectedVariant = useSmartSel
    ? (controlledVariant ?? smartVariant ?? product.variants?.[0] ?? { name: "Default" })
    : (controlledVariant ?? internalVariant);

  // The variant actually submitted — null in smart mode until user has picked
  const submitVariant = useSmartSel ? smartVariant : selectedVariant;
  // Disable CTA while smart selector hasn't made a full selection
  const smartPending = useSmartSel && submitVariant === null && controlledVariant === undefined;

  const quantity = controlledQty ?? internalQty;

  const setVariant = (v: ProductVariant) => {
    setInternalVariant(v);
    onVariantChange?.(v);
  };

  const setQuantity = (q: number) => {
    setInternalQty(q);
    onQuantityChange?.(q);
  };

  const isFree =
    !product.price ||
    product.price.toLowerCase().includes("free") ||
    product.price === "$0" ||
    product.price === "0";

  const isVariantFree =
    !selectedVariant.stripePriceId ||
    (selectedVariant.price ?? "").toLowerCase().includes("free") ||
    selectedVariant.price === "$0" ||
    selectedVariant.price === "0";

  const effectiveFree = isFree || isVariantFree;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (effectiveFree) {
      onDownload?.(product);
    } else if (submitVariant) {
      onAddToCart?.(product, submitVariant, quantity);
    }
  };

  return (
    <div
      style={{
        background: "var(--bp-bg)",
        minHeight: "100vh",
        animation: "bp-ec-fadein 0.5s ease both",
      }}
    >
      <style>{keyframesCss}</style>

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "4rem 2rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "3rem",
        }}
      >
        {/* ── Left: Details + Form ───────────────────────────────────────────── */}
        <div style={{ maxWidth: 560 }}>
          {/* Breadcrumb */}
          {breadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb">
              <ol
                role="list"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: 0,
                  margin: 0,
                  listStyle: "none",
                }}
              >
                {breadcrumbs.map((crumb, i) => (
                  <li key={crumb.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {renderLink({
                      href: crumb.href,
                      style: {
                        fontFamily: "var(--bp-font-mono)",
                        fontSize: "var(--bp-text-xs)",
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                        color: "var(--bp-text-dim)",
                        textDecoration: "none",
                        transition: "color var(--bp-transition)",
                      },
                      children: crumb.name,
                    })}
                    {i < breadcrumbs.length - 1 && (
                      <span style={{ color: "var(--bp-text-dim)" }}>/</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Title */}
          <h1
            style={{
              marginTop: "1.5rem",
              fontFamily: "var(--bp-font-heading)",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              textTransform: "uppercase",
              color: "var(--bp-text)",
              lineHeight: 1.1,
            }}
          >
            {product.name}
          </h1>

          {/* Price + Rating */}
          <div
            style={{
              marginTop: "1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
              <p style={{ fontFamily: "var(--bp-font-mono)", fontSize: "var(--bp-text-xl)", color: accentColor }}>
                {isFree ? "Free" : product.price}
              </p>
              {product.comparePrice && !isFree && (
                <p style={{ fontFamily: "var(--bp-font-mono)", fontSize: "var(--bp-text-base)", color: "var(--bp-text-dim)", textDecoration: "line-through" }}>
                  {product.comparePrice}
                </p>
              )}
            </div>

            {reviews && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                {[0, 1, 2, 3, 4].map((r) => (
                  <svg key={r} width={16} height={16} fill="currentColor" viewBox="0 0 20 20"
                    style={{ color: r < reviews.average ? accentColor : "var(--bp-border)" }}
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span style={{ marginLeft: "0.5rem", fontFamily: "var(--bp-font-mono)", fontSize: "var(--bp-text-xs)", color: "var(--bp-text-dim)" }}>
                  ({reviews.totalCount.toLocaleString()})
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p
              style={{
                marginTop: "1.5rem",
                fontFamily: "var(--bp-font-mono)",
                fontSize: "var(--bp-text-sm)",
                lineHeight: 1.7,
                color: "var(--bp-text-muted)",
              }}
            >
              {product.description}
            </p>
          )}

          {/* Status indicator */}
          <div style={{ marginTop: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--bp-green)" }} />
            <p style={{ fontFamily: "var(--bp-font-mono)", fontSize: "var(--bp-text-xs)", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--bp-green)" }}>
              {effectiveFree ? "Ready for Download" : "In Stock"}
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{ marginTop: "2rem" }}
          >
            {/* Variant selector — Smart (size+color) or flat grid.
             * Hidden entirely when only one available variant exists. */}
            {product.variants && product.variants.length > 0 && !isSingleVariant && (
              useSmartSel ? (
                <SmartVariantSelector
                  variants={product.variants}
                  onVariantChange={(v) => {
                    setSmartVariant(v);
                    if (v) onVariantChange?.(v);
                  }}
                  accentColor={accentColor}
                  colorMap={colorMap}
                  sizeTokens={sizeTokens}
                />
              ) : (
                <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
                  <legend
                    style={{
                      fontFamily: "var(--bp-font-mono)",
                      fontSize: "var(--bp-text-xs)",
                      textTransform: "uppercase",
                      letterSpacing: "0.18em",
                      color: "var(--bp-text-dim)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Variant
                  </legend>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                      gap: "0.75rem",
                    }}
                  >
                    {product.variants.map((variant) => {
                      const active = selectedVariant.name === variant.name;
                      return (
                        <label
                          key={variant.name}
                          style={{
                            position: "relative",
                            display: "flex",
                            cursor: "pointer",
                            border: `2px solid ${active ? accentColor : "var(--bp-border)"}`,
                            background: active ? `color-mix(in srgb, ${accentColor} 8%, var(--bp-surface))` : "var(--bp-surface)",
                            padding: "1rem",
                            transition: "border-color var(--bp-transition), background var(--bp-transition)",
                          }}
                          onMouseEnter={(e) => {
                            if (!active) (e.currentTarget as HTMLLabelElement).style.borderColor = "var(--bp-text-muted)";
                          }}
                          onMouseLeave={(e) => {
                            if (!active) (e.currentTarget as HTMLLabelElement).style.borderColor = "var(--bp-border)";
                          }}
                        >
                          <input
                            type="radio"
                            name="variant"
                            value={variant.name}
                            checked={active}
                            onChange={() => setVariant(variant)}
                            style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
                          />
                          <div style={{ flex: 1 }}>
                            <span
                              style={{
                                display: "block",
                                fontFamily: "var(--bp-font-heading)",
                                fontSize: "var(--bp-text-sm)",
                                textTransform: "uppercase",
                                color: "var(--bp-text)",
                              }}
                            >
                              {variant.name}
                            </span>
                            {variant.description && (
                              <span style={{ display: "block", marginTop: "0.25rem", fontFamily: "var(--bp-font-mono)", fontSize: "var(--bp-text-xs)", color: "var(--bp-text-dim)" }}>
                                {variant.description}
                              </span>
                            )}
                            {variant.price && (
                              <span style={{ display: "block", marginTop: "0.5rem", fontFamily: "var(--bp-font-mono)", fontSize: "var(--bp-text-sm)", color: accentColor }}>
                                {variant.price}
                              </span>
                            )}
                          </div>
                          {active && (
                            <div style={{ position: "absolute", top: "0.5rem", right: "0.5rem" }}>
                              <svg width={16} height={16} fill="currentColor" viewBox="0 0 20 20" style={{ color: accentColor }}>
                                <path fillRule="evenodd" d={checkPath} clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              )
            )}

            {/* Quantity */}
            {!effectiveFree && (
              <div style={{ marginTop: "2rem" }}>
                <label
                  htmlFor="bp-qty"
                  style={{
                    display: "block",
                    fontFamily: "var(--bp-font-mono)",
                    fontSize: "var(--bp-text-xs)",
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                    color: "var(--bp-text-dim)",
                    marginBottom: "0.75rem",
                  }}
                >
                  Quantity
                </label>
                <div style={{ display: "flex" }}>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={qtyBtnStyle}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.color = accentColor; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--bp-border)"; e.currentTarget.style.color = "var(--bp-text)"; }}
                  >
                    −
                  </button>
                  <input
                    id="bp-qty"
                    type="number"
                    min={1}
                    max={99}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    style={{
                      width: 64,
                      borderTop: "2px solid var(--bp-border)",
                      borderBottom: "2px solid var(--bp-border)",
                      borderLeft: "none",
                      borderRight: "none",
                      background: "var(--bp-surface)",
                      textAlign: "center",
                      fontFamily: "var(--bp-font-mono)",
                      fontSize: "var(--bp-text-base)",
                      color: "var(--bp-text)",
                      outline: "none",
                    }}
                  />
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

            {/* CTA */}
            <div style={{ marginTop: "2rem" }}>
              <button
                type="submit"
                disabled={isAddingToCart || smartPending}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `2px solid ${effectiveFree ? "var(--bp-green)" : accentColor}`,
                  background: effectiveFree ? "var(--bp-green)" : accentColor,
                  color: "var(--bp-bg)",
                  padding: "1rem 2rem",
                  fontFamily: "var(--bp-font-heading)",
                  fontSize: "var(--bp-text-sm)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  boxShadow: "4px 4px 0 0 rgba(0,0,0,0.4)",
                  cursor: isAddingToCart ? "not-allowed" : "pointer",
                  opacity: isAddingToCart ? 0.7 : 1,
                  transition: "transform var(--bp-transition-fast), box-shadow var(--bp-transition-fast)",
                }}
                onMouseEnter={(e) => {
                  if (!isAddingToCart) {
                    e.currentTarget.style.transform = "translate(2px, 2px)";
                    e.currentTarget.style.boxShadow = "2px 2px 0 0 rgba(0,0,0,0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "4px 4px 0 0 rgba(0,0,0,0.4)";
                }}
              >
                {isAddingToCart
                  ? "Processing…"
                  : effectiveFree
                  ? "Download Now"
                  : "Add to Bag"}
              </button>
            </div>

            {/* Success message */}
            {successMessage && (
              <div
                style={{
                  marginTop: "1rem",
                  border: "2px solid var(--bp-green)",
                  background: "var(--bp-green-bg)",
                  padding: "0.75rem 1rem",
                  animation: "bp-ec-fadein 0.3s ease both",
                }}
              >
                <p style={{ fontFamily: "var(--bp-font-mono)", fontSize: "var(--bp-text-sm)", color: "var(--bp-green)" }}>
                  {successMessage}
                </p>
              </div>
            )}

            {/* Guarantee note */}
            <div style={{ marginTop: "2rem", textAlign: "center" }}>
              <span style={{ fontFamily: "var(--bp-font-mono)", fontSize: "var(--bp-text-xs)", textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--bp-text-dim)" }}>
                Lifetime Guarantee
              </span>
            </div>
          </form>
        </div>

        {/* ── Right: Image ───────────────────────────────────────────────────── */}
        <div>
          <div
            style={{
              position: "relative",
              border: "2px solid var(--bp-border)",
              overflow: "hidden",
            }}
          >
            <img
              src={product.imageSrc}
              alt={product.imageAlt ?? product.name}
              style={{
                width: "100%",
                aspectRatio: "1",
                objectFit: "cover",
                display: "block",
                transition: "transform 0.6s ease",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
            />

            {/* Wishlist overlay */}
            {onToggleWishlist && (
              <button
                onClick={() => onToggleWishlist(product.id)}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  padding: "0.65rem",
                  border: `2px solid ${isWishlisted ? "var(--bp-red)" : "rgba(250,250,250,0.3)"}`,
                  background: isWishlisted ? "rgba(241,48,14,0.15)" : "rgba(0,0,0,0.5)",
                  color: isWishlisted ? "var(--bp-red)" : "rgba(250,250,250,0.6)",
                  cursor: "pointer",
                  transition: "border-color var(--bp-transition), color var(--bp-transition)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--bp-red)";
                  e.currentTarget.style.color = "var(--bp-red)";
                }}
                onMouseLeave={(e) => {
                  if (!isWishlisted) {
                    e.currentTarget.style.borderColor = "rgba(250,250,250,0.3)";
                    e.currentTarget.style.color = "rgba(250,250,250,0.6)";
                  } else {
                    e.currentTarget.style.borderColor = "var(--bp-red)";
                    e.currentTarget.style.color = "var(--bp-red)";
                  }
                }}
              >
                <svg width={20} height={20} fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={heartPath} />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const qtyBtnStyle: React.CSSProperties = {
  border: "2px solid var(--bp-border)",
  background: "var(--bp-surface)",
  color: "var(--bp-text)",
  padding: "0.5rem 1rem",
  fontFamily: "var(--bp-font-mono)",
  fontSize: "var(--bp-text-base)",
  cursor: "pointer",
  transition: "border-color var(--bp-transition), color var(--bp-transition)",
};

const keyframesCss = `
@keyframes bp-ec-fadein {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;
