import React from "react";

export interface PaginationProps {
  /** Current page (1-indexed) */
  page: number;
  /** Total number of pages */
  totalPages: number;
  onChange: (page: number) => void;
  /** How many page number buttons to show around the current page */
  siblingCount?: number;
  /** Whether to show first/last buttons */
  showEdges?: boolean;
  /** Whether to show prev/next labels as text */
  showLabels?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function buildPages(page: number, totalPages: number, siblingCount: number): (number | "…")[] {
  const totalNums = siblingCount * 2 + 5; // siblings + current + 2 edges + 2 ellipsis slots

  if (totalPages <= totalNums) {
    return range(1, totalPages);
  }

  const leftSiblingIndex  = Math.max(page - siblingCount, 1);
  const rightSiblingIndex = Math.min(page + siblingCount, totalPages);
  const showLeftEllipsis  = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftItems = 3 + 2 * siblingCount;
    return [...range(1, leftItems), "…", totalPages];
  }
  if (showLeftEllipsis && !showRightEllipsis) {
    const rightItems = 3 + 2 * siblingCount;
    return [1, "…", ...range(totalPages - rightItems + 1, totalPages)];
  }
  return [1, "…", ...range(leftSiblingIndex, rightSiblingIndex), "…", totalPages];
}

export function Pagination({
  page,
  totalPages,
  onChange,
  siblingCount = 1,
  showEdges = false,
  showLabels = false,
  style,
  className,
}: PaginationProps): React.ReactElement {
  const pages = buildPages(page, totalPages, siblingCount);

  const btnBase: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "2rem",
    height: "2rem",
    padding: "0 0.5rem",
    border: "1px solid #000",
    borderRadius: "var(--bp-radius-sm)",
    background: "var(--bp-surface)",
    color: "var(--bp-text)",
    fontFamily: "var(--bp-font-body)",
    fontSize: "var(--bp-text-sm)",
    cursor: "pointer",
    userSelect: "none",
    transition: "box-shadow var(--bp-transition-fast), transform var(--bp-transition-fast), background var(--bp-transition-fast)",
    lineHeight: 1,
  };

  const activeBtnStyle: React.CSSProperties = {
    ...btnBase,
    background: "#000",
    color: "var(--bp-surface)",
    fontWeight: 700,
  };

  const disabledBtnStyle: React.CSSProperties = {
    ...btnBase,
    opacity: 0.35,
    cursor: "not-allowed",
  };

  const ellipsisStyle: React.CSSProperties = {
    ...btnBase,
    cursor: "default",
    background: "transparent",
    border: "1px solid transparent",
  };

  const handleHover = (el: HTMLButtonElement, in_: boolean) => {
    if (in_) {
      el.style.boxShadow = "2px 2px 0 0 #000";
      el.style.transform = "translate(-1px, -1px)";
    } else {
      el.style.boxShadow = "none";
      el.style.transform = "none";
    }
  };

  return (
    <nav
      aria-label="Pagination"
      className={className}
      style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", alignItems: "center", ...style }}
    >
      {/* First */}
      {showEdges && (
        <button
          disabled={page === 1}
          onClick={() => onChange(1)}
          style={page === 1 ? disabledBtnStyle : btnBase}
          aria-label="First page"
          onMouseEnter={(e) => page !== 1 && handleHover(e.currentTarget, true)}
          onMouseLeave={(e) => page !== 1 && handleHover(e.currentTarget, false)}
        >
          «
        </button>
      )}

      {/* Prev */}
      <button
        disabled={page === 1}
        onClick={() => page > 1 && onChange(page - 1)}
        style={page === 1 ? disabledBtnStyle : btnBase}
        aria-label="Previous page"
        onMouseEnter={(e) => page !== 1 && handleHover(e.currentTarget, true)}
        onMouseLeave={(e) => page !== 1 && handleHover(e.currentTarget, false)}
      >
        {showLabels ? "← Prev" : "‹"}
      </button>

      {/* Page numbers */}
      {pages.map((p, i) => {
        if (p === "…") {
          return (
            <span key={`ellipsis-${i}`} style={ellipsisStyle} aria-hidden="true">…</span>
          );
        }
        const isActive = p === page;
        return (
          <button
            key={p}
            onClick={() => !isActive && onChange(p as number)}
            aria-current={isActive ? "page" : undefined}
            style={isActive ? activeBtnStyle : btnBase}
            onMouseEnter={(e) => !isActive && handleHover(e.currentTarget, true)}
            onMouseLeave={(e) => !isActive && handleHover(e.currentTarget, false)}
          >
            {p}
          </button>
        );
      })}

      {/* Next */}
      <button
        disabled={page === totalPages}
        onClick={() => page < totalPages && onChange(page + 1)}
        style={page === totalPages ? disabledBtnStyle : btnBase}
        aria-label="Next page"
        onMouseEnter={(e) => page !== totalPages && handleHover(e.currentTarget, true)}
        onMouseLeave={(e) => page !== totalPages && handleHover(e.currentTarget, false)}
      >
        {showLabels ? "Next →" : "›"}
      </button>

      {/* Last */}
      {showEdges && (
        <button
          disabled={page === totalPages}
          onClick={() => onChange(totalPages)}
          style={page === totalPages ? disabledBtnStyle : btnBase}
          aria-label="Last page"
          onMouseEnter={(e) => page !== totalPages && handleHover(e.currentTarget, true)}
          onMouseLeave={(e) => page !== totalPages && handleHover(e.currentTarget, false)}
        >
          »
        </button>
      )}
    </nav>
  );
}
