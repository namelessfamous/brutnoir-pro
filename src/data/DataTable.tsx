"use client";

import React, { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T, index: number) => React.ReactNode;
  /** Hide this column below this viewport width (px) */
  hideBelow?: number;
}

export interface DataTableAction<T> {
  label: string | React.ReactNode;
  onClick: (row: T) => void;
  variant?: "default" | "danger";
  title?: string;
  /** Set true to hide this action for a specific row */
  hidden?: boolean;
}

export interface DataTablePagination {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export interface DataTableSort {
  key: string;
  dir: "asc" | "desc";
  onSort: (key: string) => void;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  error?: string | null;
  actions?: (row: T) => DataTableAction<T>[];
  onRowClick?: (row: T) => void;
  pagination?: DataTablePagination;
  sort?: DataTableSort;
  /** Filter UI rendered above the table */
  filters?: React.ReactNode;
  size?: "default" | "compact";
  minWidth?: number;
  /** Unique key extractor — defaults to (row as any).id ?? index */
  rowKey?: (row: T, index: number) => string | number;
}

/** @deprecated Use DataTableColumn instead */
export type Column<T> = DataTableColumn<T>;

// ─── Component ────────────────────────────────────────────────────────────────

export function DataTable<T>({
  columns,
  data,
  loading = false,
  emptyMessage = "No data found",
  error,
  actions,
  onRowClick,
  pagination,
  sort,
  filters,
  size = "default",
  minWidth,
  rowKey,
}: DataTableProps<T>) {
  const [hoveredRow, setHoveredRow] = useState<string | number | null>(null);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 9999
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleColumns = columns.filter(
    (col) => !col.hideBelow || windowWidth >= col.hideBelow
  );

  const totalColSpan = visibleColumns.length + (actions ? 1 : 0);
  const isCompact = size === "compact";
  const cellPadding = isCompact ? "0.5rem 0.75rem" : "0.75rem 1rem";
  const headerPadding = isCompact ? "0.45rem 0.75rem" : "0.6rem 1rem";

  const getKey = (row: T, idx: number): string | number => {
    if (rowKey) return rowKey(row, idx);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (row as any).id ?? idx;
  };

  return (
    <div>
      {/* Filters slot */}
      {filters}

      {/* Error banner */}
      {error && (
        <div
          style={{
            border: "1px solid var(--bp-red)",
            background: "var(--bp-red-bg)",
            color: "var(--bp-red)",
            padding: "0.75rem 1rem",
            fontFamily: "var(--bp-font-mono)",
            fontSize: "0.8rem",
            borderRadius: "2px",
            marginBottom: "1rem",
          }}
        >
          {error}
        </div>
      )}

      {/* Table wrapper — horizontal scroll on mobile */}
      <div
        style={{
          border: "1px solid var(--bp-border)",
          borderRadius: "2px",
          overflowX: "auto",
          maxWidth: "100%",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            ...(minWidth ? { minWidth } : {}),
          }}
        >
          <thead>
            <tr
              style={{
                background: "var(--bp-surface)",
                borderBottom: "1px solid var(--bp-border)",
              }}
            >
              {visibleColumns.map((col) => {
                const isSorted = sort?.key === col.key;
                const sortIndicator = isSorted
                  ? sort!.dir === "asc"
                    ? " ▲"
                    : " ▼"
                  : "";

                return (
                  <th
                    key={col.key}
                    style={{
                      textAlign: "left",
                      padding: headerPadding,
                      fontFamily: "var(--bp-font-mono)",
                      fontSize: "0.68rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--bp-text-muted)",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      cursor: sort ? "pointer" : undefined,
                      userSelect: sort ? "none" : undefined,
                    }}
                    onClick={sort ? () => sort.onSort(col.key) : undefined}
                  >
                    {col.header}
                    {sortIndicator}
                  </th>
                );
              })}
              {actions && (
                <th
                  style={{
                    textAlign: "left",
                    padding: headerPadding,
                    fontFamily: "var(--bp-font-mono)",
                    fontSize: "0.68rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--bp-text-muted)",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {/* Loading state */}
            {loading && (
              <tr>
                <td
                  colSpan={totalColSpan}
                  style={{
                    padding: "2.5rem",
                    textAlign: "center",
                    color: "var(--bp-text-dim)",
                    fontFamily: "var(--bp-font-body)",
                    fontSize: "0.85rem",
                  }}
                >
                  Loading…
                </td>
              </tr>
            )}

            {/* Empty state */}
            {!loading && data.length === 0 && (
              <tr>
                <td
                  colSpan={totalColSpan}
                  style={{
                    padding: "2.5rem",
                    textAlign: "center",
                    color: "var(--bp-text-dim)",
                    fontFamily: "var(--bp-font-body)",
                    fontSize: "0.85rem",
                  }}
                >
                  {emptyMessage}
                </td>
              </tr>
            )}

            {/* Data rows */}
            {!loading &&
              data.map((row, idx) => {
                const key = getKey(row, idx);
                const isHovered = hoveredRow === key;
                const rowActions = actions
                  ? actions(row).filter((a) => !a.hidden)
                  : [];

                return (
                  <tr
                    key={key}
                    style={{
                      borderBottom: "1px solid var(--bp-border)",
                      cursor: onRowClick ? "pointer" : undefined,
                      background: isHovered
                        ? "var(--bp-surface)"
                        : "transparent",
                      transition: "background 0.08s",
                    }}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    onMouseEnter={() => setHoveredRow(key)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    {visibleColumns.map((col) => (
                      <td
                        key={col.key}
                        style={{
                          padding: cellPadding,
                          fontFamily: "var(--bp-font-body)",
                          fontSize: "var(--bp-text-sm)",
                          color: "var(--bp-text)",
                          verticalAlign: "middle",
                        }}
                      >
                        {col.render(row, idx)}
                      </td>
                    ))}
                    {actions && (
                      <td
                        style={{
                          padding: cellPadding,
                          fontFamily: "var(--bp-font-body)",
                          verticalAlign: "middle",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div style={{ display: "flex", gap: "0.375rem" }}>
                          {rowActions.map((action, aIdx) => (
                            <button
                              key={aIdx}
                              onClick={() => action.onClick(row)}
                              title={action.title}
                              style={{
                                background: "none",
                                border: "1px solid var(--bp-border)",
                                color:
                                  action.variant === "danger"
                                    ? "var(--bp-red)"
                                    : "var(--bp-text-muted)",
                                borderRadius: "2px",
                                padding: "0.2rem 0.5rem",
                                cursor: "pointer",
                                fontSize: "0.8rem",
                                fontFamily: "var(--bp-font-body)",
                                transition: "border-color var(--bp-transition-fast), color var(--bp-transition-fast)",
                              }}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.total > 0 && (
        <div
          style={{
            padding: "0.75rem 1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "var(--bp-font-mono)",
            fontSize: "0.72rem",
            color: "var(--bp-text-muted)",
            letterSpacing: "0.1em",
          }}
        >
          <span>
            Showing{" "}
            {(pagination.page - 1) * pagination.pageSize + 1}–
            {Math.min(
              pagination.page * pagination.pageSize,
              pagination.total
            )}{" "}
            of {pagination.total.toLocaleString()}
          </span>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button
              disabled={pagination.page <= 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              style={{
                background: "var(--bp-surface)",
                border: "1px solid var(--bp-border)",
                color: "var(--bp-text)",
                fontFamily: "var(--bp-font-mono)",
                fontSize: "0.75rem",
                padding: "0.4rem 0.6rem",
                borderRadius: "2px",
                cursor: pagination.page <= 1 ? "default" : "pointer",
                opacity: pagination.page <= 1 ? 0.35 : 1,
              }}
            >
              ← Prev
            </button>
            <span
              style={{
                padding: "0.4rem 0.6rem",
                fontFamily: "var(--bp-font-mono)",
                fontSize: "0.72rem",
                color: "var(--bp-text-dim)",
              }}
            >
              {pagination.page}
            </span>
            <button
              disabled={
                pagination.page * pagination.pageSize >= pagination.total
              }
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              style={{
                background: "var(--bp-surface)",
                border: "1px solid var(--bp-border)",
                color: "var(--bp-text)",
                fontFamily: "var(--bp-font-mono)",
                fontSize: "0.75rem",
                padding: "0.4rem 0.6rem",
                borderRadius: "2px",
                cursor:
                  pagination.page * pagination.pageSize >= pagination.total
                    ? "default"
                    : "pointer",
                opacity:
                  pagination.page * pagination.pageSize >= pagination.total
                    ? 0.35
                    : 1,
              }}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
