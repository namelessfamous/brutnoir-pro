/**
 * brutnoir-pro · CompareDrawer
 * Product comparison table. Renders as a full-width section.
 * No Next.js, no framer-motion. Props-driven.
 */

import React, { useCallback, useState } from "react";
import type { Product, CompareField, RenderLink } from "./types";
import { defaultRenderLink } from "./helpers";

export interface CompareDrawerProps {
  products: Product[];
  /** Custom fields to compare. Defaults to built-in fields. */
  compareFields?: CompareField[];
  onRemove?: (productId: string) => void;
  onAddToCart?: (product: Product) => void | Promise<void>;
  renderLink?: RenderLink;
  /** Override accent color. Defaults to var(--bp-orange) */
  accentColor?: string;
}

const DEFAULT_FIELDS: CompareField[] = [
  { key: "price",    label: "Price" },
  { key: "category", label: "Category" },
  { key: "description", label: "Description" },
  { key: "variants", label: "Variants" },
];

const checkPath = "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z";
const xPath = "M6 18L18 6M6 6l12 12";

export function CompareDrawer({
  products,
  compareFields = DEFAULT_FIELDS,
  onRemove,
  onAddToCart,
  renderLink = defaultRenderLink,
  accentColor = "var(--bp-orange)",
}: CompareDrawerProps): React.ReactElement {
  const [addingId, setAddingId] = useState<string | null>(null);

  const handleAddToCart = useCallback(async (product: Product) => {
    setAddingId(product.id);
    try {
      await onAddToCart?.(product);
    } finally {
      setTimeout(() => setAddingId(null), 800);
    }
  }, [onAddToCart]);

  // Collect all variant names across compared products
  const allVariantNames = Array.from(
    new Set(products.flatMap((p) => p.variants?.map((v) => v.name) ?? []))
  );

  // Empty state
  if (products.length === 0) {
    return (
      <div
        style={{
          minHeight: 400,
          background: "var(--bp-bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <svg
            width={64}
            height={64}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
            style={{ color: "var(--bp-border)", margin: "0 auto 1rem" }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
          <p style={{ fontFamily: "var(--bp-font-mono)", fontSize: "var(--bp-text-sm)", color: "var(--bp-text-muted)" }}>
            No products to compare
          </p>
          <p style={{ marginTop: "0.25rem", fontFamily: "var(--bp-font-mono)", fontSize: "var(--bp-text-xs)", color: "var(--bp-text-dim)" }}>
            Add products from the collection page
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bp-bg)", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "4rem 2rem" }}>
        {/* Header */}
        <h1
          style={{
            fontFamily: "var(--bp-font-heading)",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            textTransform: "uppercase",
            color: "var(--bp-text)",
            marginBottom: "0.5rem",
          }}
        >
          Compare Products
        </h1>
        <p style={{ fontFamily: "var(--bp-font-mono)", fontSize: "var(--bp-text-xs)", color: "var(--bp-text-dim)", marginBottom: "2rem" }}>
          {products.length} {products.length === 1 ? "product" : "products"} selected
        </p>
        <div
          style={{
            height: 1,
            background: `linear-gradient(to right, ${accentColor}, rgba(250,250,250,0.1) 60%, transparent)`,
            marginBottom: "2rem",
          }}
        />

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              minWidth: 640,
              borderCollapse: "collapse",
            }}
          >
            {/* Product headers */}
            <thead>
              <tr>
                <th style={{ width: 160, padding: 0 }} />
                {products.map((product) => (
                  <th key={product.id} style={{ padding: "0.5rem", verticalAlign: "top" }}>
                    <div
                      style={{
                        border: "2px solid var(--bp-border)",
                        background: "var(--bp-surface)",
                        transition: "border-color var(--bp-transition)",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = accentColor; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--bp-border)"; }}
                    >
                      {renderLink({
                        href: `/shop/products/${product.slug}`,
                        style: { display: "block", textDecoration: "none" },
                        children: (
                          <div style={{ position: "relative", aspectRatio: "1", overflow: "hidden", background: "var(--bp-bg)" }}>
                            <img
                              src={product.imageSrc}
                              alt={product.imageAlt ?? product.name}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          </div>
                        ),
                      })}
                      <div style={{ padding: "0.75rem" }}>
                        <h3
                          style={{
                            fontFamily: "var(--bp-font-heading)",
                            fontSize: "var(--bp-text-sm)",
                            textTransform: "uppercase",
                            color: "var(--bp-text)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {renderLink({
                            href: `/shop/products/${product.slug}`,
                            style: { textDecoration: "none", color: "inherit", transition: "color var(--bp-transition)" },
                            children: product.name,
                          })}
                        </h3>
                        {onRemove && (
                          <button
                            onClick={() => onRemove(product.id)}
                            style={{
                              marginTop: "0.5rem",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontFamily: "var(--bp-font-mono)",
                              fontSize: "10px",
                              textTransform: "uppercase",
                              letterSpacing: "0.12em",
                              color: "var(--bp-text-dim)",
                              padding: 0,
                              transition: "color var(--bp-transition)",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--bp-red)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--bp-text-dim)"; }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Built-in rows */}
              {compareFields.map((field) => {
                if (field.render) {
                  return (
                    <CompareRow key={field.key} label={field.label}>
                      {products.map((product) => (
                        <td key={product.id} style={tdStyle}>
                          {field.render!(product)}
                        </td>
                      ))}
                    </CompareRow>
                  );
                }

                // Built-in field renderers
                switch (field.key) {
                  case "price":
                    return (
                      <CompareRow key="price" label="Price">
                        {products.map((product) => {
                          const isFree = product.price?.toLowerCase().includes("free") || product.price === "$0";
                          return (
                            <td key={product.id} style={tdStyle}>
                              <span style={{ fontFamily: "var(--bp-font-mono)", fontSize: "var(--bp-text-md)", color: accentColor }}>
                                {isFree ? "Free" : product.price}
                              </span>
                              {product.comparePrice && !isFree && (
                                <span style={{ marginLeft: "0.5rem", fontFamily: "var(--bp-font-mono)", fontSize: "var(--bp-text-sm)", color: "var(--bp-text-dim)", textDecoration: "line-through" }}>
                                  {product.comparePrice}
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </CompareRow>
                    );

                  case "category":
                    return (
                      <CompareRow key="category" label="Category">
                        {products.map((product) => (
                          <td key={product.id} style={tdStyle}>
                            <span style={{ fontFamily: "var(--bp-font-mono)", fontSize: "var(--bp-text-xs)", color: "var(--bp-text-muted)" }}>
                              {product.category ?? "—"}
                            </span>
                          </td>
                        ))}
                      </CompareRow>
                    );

                  case "description":
                    return (
                      <CompareRow key="description" label="Description">
                        {products.map((product) => (
                          <td key={product.id} style={tdStyle}>
                            <p
                              style={{
                                fontFamily: "var(--bp-font-mono)",
                                fontSize: "var(--bp-text-xs)",
                                color: "var(--bp-text-muted)",
                                display: "-webkit-box",
                                WebkitLineClamp: 4,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {product.description ?? "—"}
                            </p>
                          </td>
                        ))}
                      </CompareRow>
                    );

                  case "variants":
                    return (
                      <CompareRow key="variants" label="Variants">
                        {products.map((product) => (
                          <td key={product.id} style={tdStyle}>
                            {product.variants && product.variants.length > 0 ? (
                              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                                {product.variants.map((v) => (
                                  <div key={v.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontFamily: "var(--bp-font-mono)", fontSize: "var(--bp-text-xs)", color: "var(--bp-text-muted)" }}>{v.name}</span>
                                    {v.price && (
                                      <span style={{ fontFamily: "var(--bp-font-mono)", fontSize: "var(--bp-text-xs)", color: accentColor }}>{v.price}</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span style={{ fontFamily: "var(--bp-font-mono)", fontSize: "var(--bp-text-xs)", color: "var(--bp-text-dim)" }}>—</span>
                            )}
                          </td>
                        ))}
                      </CompareRow>
                    );

                  default:
                    return (
                      <CompareRow key={field.key} label={field.label}>
                        {products.map((product) => (
                          <td key={product.id} style={tdStyle}>
                            <span style={{ fontFamily: "var(--bp-font-mono)", fontSize: "var(--bp-text-xs)", color: "var(--bp-text-muted)" }}>
                              {String((product as unknown as Record<string, unknown>)[field.key] ?? "—")}
                            </span>
                          </td>
                        ))}
                      </CompareRow>
                    );
                }
              })}

              {/* Variant feature-check rows */}
              {allVariantNames.map((variantName) => (
                <CompareRow key={`variant-${variantName}`} label={variantName}>
                  {products.map((product) => {
                    const has = product.variants?.some((v) => v.name === variantName);
                    return (
                      <td key={product.id} style={{ ...tdStyle, textAlign: "center" }}>
                        {has ? (
                          <svg width={20} height={20} fill="currentColor" viewBox="0 0 20 20" style={{ color: "var(--bp-green)", margin: "0 auto" }}>
                            <path fillRule="evenodd" d={checkPath} clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: "var(--bp-border)", margin: "0 auto" }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={xPath} />
                          </svg>
                        )}
                      </td>
                    );
                  })}
                </CompareRow>
              ))}

              {/* Add to cart row */}
              {onAddToCart && (
                <tr>
                  <td style={{ padding: "1rem" }} />
                  {products.map((product) => {
                    const isFree = product.price?.toLowerCase().includes("free") || product.price === "$0";
                    return (
                      <td key={product.id} style={{ padding: "1rem 0.5rem" }}>
                        {isFree ? (
                          renderLink({
                            href: `/shop/products/download/${product.slug}`,
                            style: ctaBtnStyle("var(--bp-green)"),
                            children: "Download",
                          })
                        ) : (
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={addingId === product.id}
                            style={{
                              ...ctaBtnStyle(accentColor),
                              cursor: addingId === product.id ? "not-allowed" : "pointer",
                              opacity: addingId === product.id ? 0.7 : 1,
                            }}
                          >
                            {addingId === product.id ? "Added" : "Add to Bag"}
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function CompareRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <tr style={{ borderTop: "1px solid var(--bp-border)" }}>
      <td style={{ padding: "1rem", verticalAlign: "top" }}>
        <span
          style={{
            fontFamily: "var(--bp-font-mono)",
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "var(--bp-text-dim)",
          }}
        >
          {label}
        </span>
      </td>
      {children}
    </tr>
  );
}

// ── Style constants ───────────────────────────────────────────────────────────

const tdStyle: React.CSSProperties = {
  padding: "1rem 0.5rem",
  verticalAlign: "top",
};

function ctaBtnStyle(color: string): React.CSSProperties {
  return {
    display: "block",
    width: "100%",
    border: `2px solid ${color}`,
    background: color,
    color: "var(--bp-bg)",
    padding: "0.6rem 1rem",
    fontFamily: "var(--bp-font-heading)",
    fontSize: "var(--bp-text-xs)",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    textAlign: "center",
    textDecoration: "none",
    boxShadow: "3px 3px 0 0 rgba(0,0,0,0.3)",
    transition: "transform var(--bp-transition-fast), box-shadow var(--bp-transition-fast)",
    boxSizing: "border-box",
  };
}
