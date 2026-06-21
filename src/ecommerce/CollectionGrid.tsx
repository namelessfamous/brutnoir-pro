/**
 * brutnoir-pro · CollectionGrid
 * Product collection grid with filters, sort, and layout toggle.
 * No Next.js, no framer-motion. Props-driven with render prop for product card.
 */

import React, { useState, useMemo } from "react";
import type { Product, SortOption, FilterConfig } from "./types";

export interface CollectionGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  /** Predefined filter categories. If omitted, derived from product.category */
  filters?: FilterConfig[];
  onFilterChange?: (filterId: string, value: string) => void;
  onSortChange?: (sort: SortOption) => void;
  /**
   * Render prop for each product card.
   * Receives the product and its index for stagger animations.
   */
  renderProductCard: (product: Product, index: number) => React.ReactNode;
  showFilters?: boolean;
  showSearch?: boolean;
  showLayoutToggle?: boolean;
  /** Override accent color. Defaults to var(--bp-orange) */
  accentColor?: string;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest",     label: "Newest" },
  { value: "price-asc",  label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc",   label: "Name: A → Z" },
  { value: "name-desc",  label: "Name: Z → A" },
];

function parsePrice(price: string): number {
  const cleaned = price.replace(/[^0-9.]/g, "");
  return parseFloat(cleaned) || 0;
}

export function CollectionGrid({
  products,
  title,
  subtitle,
  filters,
  onFilterChange,
  onSortChange,
  renderProductCard,
  showFilters = true,
  showSearch = true,
  showLayoutToggle = true,
  accentColor = "var(--bp-orange)",
}: CollectionGridProps): React.ReactElement {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  // Derive categories from products if filters not provided
  const categories = useMemo(() => {
    if (filters && filters.length > 0) {
      // Return flat list of values from first filter (category filter)
      return filters[0]?.values ?? [];
    }
    const cats = new Set<string>();
    products.forEach((p) => {
      if (p.category) {
        p.category.split(",").forEach((c) => cats.add(c.trim()));
      }
    });
    return Array.from(cats);
  }, [products, filters]);

  const filteredAndSorted = useMemo(() => {
    let result = [...products];

    // Category filter
    if (activeCategory !== "all") {
      result = result.filter((p) =>
        p.category?.toLowerCase().includes(activeCategory.toLowerCase())
      );
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
        break;
      case "price-desc":
        result.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return result;
  }, [products, activeCategory, sortBy, searchQuery]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    onFilterChange?.("category", cat);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
    onSortChange?.(sort);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bp-bg)" }}>
      <style>{keyframesCss}</style>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "4rem 2rem" }}>

        {/* Header */}
        {(title || subtitle) && (
          <div style={{ marginBottom: "3rem" }}>
            {title && (
              <h1
                style={{
                  fontFamily: "var(--bp-font-heading)",
                  fontSize: "clamp(2.5rem, 6vw, 4rem)",
                  textTransform: "uppercase",
                  color: "var(--bp-text)",
                  lineHeight: 1.05,
                }}
              >
                {title}
              </h1>
            )}
            {subtitle && (
              <p
                style={{
                  marginTop: "1rem",
                  maxWidth: 600,
                  fontFamily: "var(--bp-font-mono)",
                  fontSize: "var(--bp-text-sm)",
                  color: "var(--bp-text-muted)",
                }}
              >
                {subtitle}
              </p>
            )}
            <div
              style={{
                marginTop: "1.5rem",
                height: 1,
                background: `linear-gradient(to right, ${accentColor}, rgba(250,250,250,0.1) 60%, transparent)`,
              }}
            />
          </div>
        )}

        {/* Filters bar */}
        {showFilters && (
          <div style={{ marginBottom: "2rem" }}>

            {/* Top row: search + sort + layout */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.75rem",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              {/* Search */}
              {showSearch && (
                <div style={{ position: "relative", flex: "1 1 240px", maxWidth: 360 }}>
                  <input
                    type="text"
                    placeholder="Search products…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: "100%",
                      border: "2px solid var(--bp-border)",
                      background: "var(--bp-surface)",
                      padding: "0.6rem 0.75rem 0.6rem 2.5rem",
                      fontFamily: "var(--bp-font-mono)",
                      fontSize: "var(--bp-text-sm)",
                      color: "var(--bp-text)",
                      outline: "none",
                      transition: "border-color var(--bp-transition)",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = accentColor; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "var(--bp-border)"; }}
                  />
                  <svg
                    width={16}
                    height={16}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    style={{
                      position: "absolute",
                      left: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--bp-text-dim)",
                      pointerEvents: "none",
                    }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
                {/* Sort select */}
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value as SortOption)}
                  style={{
                    border: "2px solid var(--bp-border)",
                    background: "var(--bp-surface)",
                    color: "var(--bp-text)",
                    padding: "0.6rem 0.75rem",
                    fontFamily: "var(--bp-font-mono)",
                    fontSize: "var(--bp-text-xs)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    outline: "none",
                    cursor: "pointer",
                    transition: "border-color var(--bp-transition)",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = accentColor; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "var(--bp-border)"; }}
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                {/* Layout toggle */}
                {showLayoutToggle && (
                  <div style={{ display: "flex", border: "2px solid var(--bp-border)" }}>
                    <LayoutBtn
                      active={layout === "grid"}
                      label="Grid view"
                      onClick={() => setLayout("grid")}
                      accentColor={accentColor}
                    >
                      {/* Grid icon */}
                      <svg width={16} height={16} fill="currentColor" viewBox="0 0 16 16">
                        <rect x="1" y="1" width="6" height="6" />
                        <rect x="9" y="1" width="6" height="6" />
                        <rect x="1" y="9" width="6" height="6" />
                        <rect x="9" y="9" width="6" height="6" />
                      </svg>
                    </LayoutBtn>
                    <LayoutBtn
                      active={layout === "list"}
                      label="List view"
                      onClick={() => setLayout("list")}
                      accentColor={accentColor}
                    >
                      {/* List icon */}
                      <svg width={16} height={16} fill="currentColor" viewBox="0 0 16 16">
                        <rect x="1" y="1" width="14" height="3" />
                        <rect x="1" y="6" width="14" height="3" />
                        <rect x="1" y="11" width="14" height="3" />
                      </svg>
                    </LayoutBtn>
                  </div>
                )}
              </div>
            </div>

            {/* Category pills */}
            {categories.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
                <CategoryPill
                  label="All"
                  active={activeCategory === "all"}
                  onClick={() => handleCategoryChange("all")}
                  accentColor={accentColor}
                />
                {categories.map((cat) => (
                  <CategoryPill
                    key={cat}
                    label={cat}
                    active={activeCategory === cat}
                    onClick={() => handleCategoryChange(cat)}
                    accentColor={accentColor}
                  />
                ))}
              </div>
            )}

            {/* Result count */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: "1rem",
                borderTop: "1px solid var(--bp-border)",
              }}
            >
              <p style={{ fontFamily: "var(--bp-font-mono)", fontSize: "var(--bp-text-xs)", color: "var(--bp-text-dim)" }}>
                {filteredAndSorted.length} {filteredAndSorted.length === 1 ? "product" : "products"}
              </p>
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
                  style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--bp-font-mono)", fontSize: "var(--bp-text-xs)", color: accentColor, textDecoration: "underline", textUnderlineOffset: "3px" }}
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Grid / List */}
        {filteredAndSorted.length === 0 ? (
          <div style={{ padding: "6rem 0", textAlign: "center", animation: "bp-ec-fadein 0.4s ease both" }}>
            <p style={{ fontFamily: "var(--bp-font-mono)", fontSize: "var(--bp-text-md)", color: "var(--bp-text-muted)" }}>
              No products found
            </p>
            {(searchQuery || activeCategory !== "all") && (
              <button
                onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
                style={{ marginTop: "1rem", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--bp-font-mono)", fontSize: "var(--bp-text-sm)", color: accentColor, textDecoration: "underline", textUnderlineOffset: "3px" }}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div
            style={
              layout === "grid"
                ? {
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: "1.5rem",
                    animation: "bp-ec-fadein 0.35s ease both",
                  }
                : {
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    animation: "bp-ec-fadein 0.35s ease both",
                  }
            }
          >
            {filteredAndSorted.map((product, idx) =>
              renderProductCard(product, idx)
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function CategoryPill({
  label,
  active,
  onClick,
  accentColor,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  accentColor: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        border: `2px solid ${active ? accentColor : "var(--bp-border)"}`,
        background: active ? accentColor : "none",
        color: active ? "var(--bp-bg)" : "var(--bp-text-muted)",
        padding: "0.35rem 1rem",
        fontFamily: "var(--bp-font-mono)",
        fontSize: "var(--bp-text-xs)",
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        cursor: "pointer",
        transition: "border-color var(--bp-transition), color var(--bp-transition), background var(--bp-transition)",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = "var(--bp-text-muted)";
          e.currentTarget.style.color = "var(--bp-text)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = "var(--bp-border)";
          e.currentTarget.style.color = "var(--bp-text-muted)";
        }
      }}
    >
      {label}
    </button>
  );
}

function LayoutBtn({
  active,
  label,
  onClick,
  accentColor,
  children,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  accentColor: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        background: active ? accentColor : "none",
        color: active ? "var(--bp-bg)" : "var(--bp-text-muted)",
        border: "none",
        padding: "0.5rem",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background var(--bp-transition), color var(--bp-transition)",
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.color = "var(--bp-text)";
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.color = "var(--bp-text-muted)";
      }}
    >
      {children}
    </button>
  );
}

const keyframesCss = `
@keyframes bp-ec-fadein {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;
