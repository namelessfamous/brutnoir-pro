/**
 * brutnoir-pro · SearchCommand
 * Product search command palette. Native implementation — no cmdk dependency.
 * Props-driven, framework-agnostic.
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import type { SearchProduct, RenderLink } from "./types";
import { defaultRenderLink } from "./helpers";

export interface SearchCommandProps {
  /** Products to search through. Pass pre-loaded or let onSearch fetch dynamically. */
  products?: SearchProduct[];
  /**
   * Called when query changes. Use for server-side search.
   * Returning products replaces the local client-side filter.
   */
  onSearch?: (query: string) => Promise<SearchProduct[]> | SearchProduct[];
  /** Render a custom result row. Receives product + isSelected state. */
  renderResult?: (product: SearchProduct, isSelected: boolean) => React.ReactNode;
  /** Called when user selects a product. Use to navigate. */
  onSelect?: (product: SearchProduct) => void;
  /** Render quick links shown when query is empty */
  quickLinks?: { label: string; href: string; icon?: React.ReactNode }[];
  isOpen?: boolean;
  onClose?: () => void;
  /** If true, renders a trigger button that manages open state internally */
  showTrigger?: boolean;
  placeholder?: string;
  maxResults?: number;
  renderLink?: RenderLink;
  /** Override accent color. Defaults to var(--bp-orange) */
  accentColor?: string;
}

export function SearchCommand({
  products = [],
  onSearch,
  renderResult,
  onSelect,
  quickLinks,
  isOpen: controlledOpen,
  onClose: controlledClose,
  showTrigger = true,
  placeholder = "Search products…",
  maxResults = 8,
  renderLink = defaultRenderLink,
  accentColor = "var(--bp-orange)",
}: SearchCommandProps): React.ReactElement {
  const [internalOpen, setInternalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);

  const isOpen = controlledOpen ?? internalOpen;
  const handleClose = useCallback(() => {
    controlledClose?.() ?? setInternalOpen(false);
    setQuery("");
    setSelectedIdx(-1);
  }, [controlledClose]);

  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Cmd+K / Ctrl+K toggle
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) {
          handleClose();
        } else {
          controlledClose ? undefined : setInternalOpen(true);
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, handleClose, controlledClose]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Search logic
  useEffect(() => {
    if (!isOpen) return;
    const q = query.trim();

    if (onSearch) {
      setLoading(true);
      Promise.resolve(onSearch(q)).then((r) => {
        setResults(r.slice(0, maxResults));
        setLoading(false);
      });
    } else {
      // Client-side filter
      if (!q) {
        setResults([]);
        return;
      }
      const ql = q.toLowerCase();
      const filtered = products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(ql) ||
            p.description?.toLowerCase().includes(ql) ||
            p.category?.toLowerCase().includes(ql)
        )
        .slice(0, maxResults);
      setResults(filtered);
    }
  }, [query, isOpen, products, onSearch, maxResults]);

  // Reset selection when results change
  useEffect(() => { setSelectedIdx(-1); }, [results]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const total = results.length;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIdx((i) => (i + 1) % total);
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIdx((i) => (i - 1 + total) % total);
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIdx >= 0 && results[selectedIdx]) {
          handleSelect(results[selectedIdx]);
        }
        break;
      case "Escape":
        handleClose();
        break;
    }
  };

  const handleSelect = (product: SearchProduct) => {
    if (onSelect) {
      onSelect(product);
    }
    handleClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) handleClose();
  };

  const displayedResults = onSearch ? results : (query.trim() ? results : []);

  return (
    <>
      {/* Trigger */}
      {showTrigger && (
        <button
          onClick={() => setInternalOpen(true)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            border: "2px solid var(--bp-border)",
            background: "var(--bp-surface)",
            color: "var(--bp-text-dim)",
            padding: "0.45rem 1rem",
            fontFamily: "var(--bp-font-mono)",
            fontSize: "var(--bp-text-xs)",
            cursor: "pointer",
            transition: "border-color var(--bp-transition), color var(--bp-transition)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.color = "var(--bp-text)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--bp-border)"; e.currentTarget.style.color = "var(--bp-text-dim)"; }}
        >
          <svg width={16} height={16} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>Search</span>
          <kbd
            style={{
              marginLeft: "0.75rem",
              border: "1px solid var(--bp-border)",
              padding: "0.1rem 0.35rem",
              fontFamily: "var(--bp-font-mono)",
              fontSize: "10px",
              color: "var(--bp-text-dim)",
              background: "var(--bp-bg)",
            }}
          >
            ⌘K
          </kbd>
        </button>
      )}

      {/* Palette overlay */}
      {isOpen && (
        <div
          ref={overlayRef}
          onClick={handleOverlayClick}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(4px)",
            zIndex: "var(--bp-z-modal)" as unknown as number,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "15vh",
            paddingInline: "1rem",
            animation: "bp-sc-overlay 0.15s ease both",
          }}
        >
          <style>{keyframesCss}</style>

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Product search"
            style={{
              width: "100%",
              maxWidth: 560,
              background: "var(--bp-surface)",
              border: "2px solid var(--bp-border)",
              boxShadow: `8px 8px 0 0 color-mix(in srgb, ${accentColor} 30%, transparent)`,
              animation: "bp-sc-drop 0.2s ease both",
            }}
          >
            {/* Input row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0 1rem",
                borderBottom: "2px solid var(--bp-border)",
              }}
            >
              <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: accentColor, flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  padding: "1rem 0",
                  fontFamily: "var(--bp-font-mono)",
                  fontSize: "var(--bp-text-base)",
                  color: "var(--bp-text)",
                }}
              />
              <button
                onClick={handleClose}
                aria-label="Close search"
                style={{
                  background: "var(--bp-bg)",
                  border: "1px solid var(--bp-border)",
                  color: "var(--bp-text-dim)",
                  padding: "0.15rem 0.4rem",
                  fontFamily: "var(--bp-font-mono)",
                  fontSize: "10px",
                  cursor: "pointer",
                  transition: "color var(--bp-transition)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--bp-text)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--bp-text-dim)"; }}
              >
                ESC
              </button>
            </div>

            {/* Results */}
            <div
              role="listbox"
              aria-label="Search results"
              style={{ maxHeight: 320, overflowY: "auto" }}
            >
              {loading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      border: `2px solid ${accentColor}`,
                      borderTopColor: "transparent",
                      borderRadius: "50%",
                      animation: "bp-sc-spin 0.7s linear infinite",
                    }}
                  />
                </div>
              ) : (
                <>
                  {/* Quick links (shown when query empty and no server search) */}
                  {!query.trim() && quickLinks && quickLinks.length > 0 && (
                    <div>
                      <p
                        style={{
                          padding: "0.5rem 1rem 0.25rem",
                          fontFamily: "var(--bp-font-mono)",
                          fontSize: "10px",
                          textTransform: "uppercase",
                          letterSpacing: "0.18em",
                          color: "var(--bp-text-dim)",
                        }}
                      >
                        Quick Links
                      </p>
                      {quickLinks.map((link, i) => (
                        <div
                          key={i}
                          role="option"
                          aria-selected={false}
                        >
                          {renderLink({
                            href: link.href,
                            style: {
                              display: "flex",
                              alignItems: "center",
                              gap: "0.75rem",
                              padding: "0.75rem 1rem",
                              fontFamily: "var(--bp-font-mono)",
                              fontSize: "var(--bp-text-sm)",
                              color: "var(--bp-text-muted)",
                              textDecoration: "none",
                              cursor: "pointer",
                              transition: "background var(--bp-transition), color var(--bp-transition)",
                            },
                            children: (
                              <>
                                {link.icon && (
                                  <span style={{ color: accentColor, flexShrink: 0 }}>{link.icon}</span>
                                )}
                                {link.label}
                              </>
                            ),
                            onClick: handleClose,
                          })}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Search results */}
                  {displayedResults.length > 0 && (
                    <div>
                      {query.trim() && (
                        <p
                          style={{
                            padding: "0.5rem 1rem 0.25rem",
                            fontFamily: "var(--bp-font-mono)",
                            fontSize: "10px",
                            textTransform: "uppercase",
                            letterSpacing: "0.18em",
                            color: "var(--bp-text-dim)",
                          }}
                        >
                          Products
                        </p>
                      )}
                      {displayedResults.map((product, idx) => {
                        const isSelected = selectedIdx === idx;
                        if (renderResult) {
                          return (
                            <div
                              key={product.id}
                              role="option"
                              aria-selected={isSelected}
                              onClick={() => handleSelect(product)}
                              style={{ cursor: "pointer" }}
                            >
                              {renderResult(product, isSelected)}
                            </div>
                          );
                        }
                        return (
                          <DefaultResultRow
                            key={product.id}
                            product={product}
                            isSelected={isSelected}
                            onSelect={() => handleSelect(product)}
                            accentColor={accentColor}
                          />
                        );
                      })}
                    </div>
                  )}

                  {/* No results */}
                  {query.trim() && displayedResults.length === 0 && !loading && (
                    <div style={{ padding: "2rem", textAlign: "center" }}>
                      <p style={{ fontFamily: "var(--bp-font-mono)", fontSize: "var(--bp-text-sm)", color: "var(--bp-text-muted)" }}>
                        No products found.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                borderTop: "2px solid var(--bp-border)",
                padding: "0.5rem 1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontFamily: "var(--bp-font-mono)", fontSize: "10px", color: "var(--bp-text-dim)" }}>
                {query.trim()
                  ? `${displayedResults.length} result${displayedResults.length !== 1 ? "s" : ""}`
                  : "Type to search"}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <kbd style={kbdStyle}>↑↓</kbd>
                <span style={{ fontFamily: "var(--bp-font-mono)", fontSize: "10px", color: "var(--bp-text-dim)" }}>navigate</span>
                <kbd style={kbdStyle}>↵</kbd>
                <span style={{ fontFamily: "var(--bp-font-mono)", fontSize: "10px", color: "var(--bp-text-dim)" }}>select</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Default result row ────────────────────────────────────────────────────────

function DefaultResultRow({
  product,
  isSelected,
  onSelect,
  accentColor,
}: {
  product: SearchProduct;
  isSelected: boolean;
  onSelect: () => void;
  accentColor: string;
}) {
  return (
    <div
      role="option"
      aria-selected={isSelected}
      onClick={onSelect}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "0.75rem 1rem",
        cursor: "pointer",
        background: isSelected ? `color-mix(in srgb, ${accentColor} 10%, var(--bp-surface))` : "transparent",
        transition: "background var(--bp-transition)",
      }}
      onMouseEnter={(e) => {
        if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)";
      }}
      onMouseLeave={(e) => {
        if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = "transparent";
      }}
    >
      {product.imageSrc && (
        <div style={{ width: 40, height: 40, flexShrink: 0, overflow: "hidden", border: "1px solid var(--bp-border)" }}>
          <img src={product.imageSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
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
          {product.name}
        </p>
        {product.description && (
          <p
            style={{
              fontFamily: "var(--bp-font-mono)",
              fontSize: "var(--bp-text-xs)",
              color: "var(--bp-text-dim)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              marginTop: "0.1rem",
            }}
          >
            {product.description}
          </p>
        )}
      </div>
      <span style={{ flexShrink: 0, fontFamily: "var(--bp-font-mono)", fontSize: "var(--bp-text-sm)", color: accentColor }}>
        {product.price}
      </span>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const kbdStyle: React.CSSProperties = {
  border: "1px solid var(--bp-border)",
  background: "var(--bp-bg)",
  padding: "0.1rem 0.3rem",
  fontFamily: "var(--bp-font-mono)",
  fontSize: "9px",
  color: "var(--bp-text-dim)",
};

const keyframesCss = `
@keyframes bp-sc-overlay {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes bp-sc-drop {
  from { opacity: 0; transform: scale(0.97) translateY(-12px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes bp-sc-spin {
  to { transform: rotate(360deg); }
}
`;
