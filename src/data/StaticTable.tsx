import React from "react";

export interface StaticTableColumn {
  key: string;
  header: React.ReactNode;
  /** Cell renderer. Receives the row data object and row index */
  render?: (row: Record<string, unknown>, index: number) => React.ReactNode;
  /** Text alignment for this column */
  align?: "left" | "center" | "right";
  /** Width hint */
  width?: string | number;
}

export interface StaticTableProps {
  columns: StaticTableColumn[];
  rows: Record<string, unknown>[];
  /** Row key extractor (defaults to index) */
  rowKey?: (row: Record<string, unknown>, index: number) => string | number;
  /** Optional caption */
  caption?: string;
  /** Alternate row shading */
  striped?: boolean;
  /** Hover highlight on rows */
  hoverable?: boolean;
  /** Compact padding */
  compact?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function StaticTable({
  columns,
  rows,
  rowKey,
  caption,
  striped = false,
  hoverable = true,
  compact = false,
  style,
  className,
}: StaticTableProps): React.ReactElement {
  const cellPad = compact ? "0.375rem 0.75rem" : "0.625rem 1rem";

  return (
    <>
      <style>{`
        .bp-static-table-wrapper {
          width: 100%;
          overflow-x: auto;
          border: 2px solid #000;
          border-radius: var(--bp-radius);
          box-shadow: 4px 4px 0 0 #000;
        }
        .bp-static-table {
          width: 100%;
          border-collapse: collapse;
          font-family: var(--bp-font-body);
          font-size: var(--bp-text-sm);
          color: var(--bp-text);
          background: var(--bp-surface);
        }
        .bp-static-table caption {
          caption-side: top;
          padding: 0.5rem 1rem;
          font-size: var(--bp-text-xs);
          font-family: var(--bp-font-mono);
          color: var(--bp-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          text-align: left;
          border-bottom: 1px solid var(--bp-border);
        }
        .bp-static-table thead {
          background: var(--bp-bg);
          border-bottom: 2px solid #000;
        }
        .bp-static-table thead th {
          font-weight: 700;
          text-transform: uppercase;
          font-size: var(--bp-text-xs);
          letter-spacing: 0.1em;
          color: var(--bp-text);
          white-space: nowrap;
        }
        .bp-static-table tbody tr {
          border-bottom: 1px solid var(--bp-border);
          transition: background var(--bp-transition-fast);
        }
        .bp-static-table tbody tr:last-child {
          border-bottom: none;
        }
        .bp-static-table--striped tbody tr:nth-child(even) {
          background: var(--bp-bg);
        }
        .bp-static-table--hoverable tbody tr:hover {
          background: var(--bp-bg);
        }
      `}</style>
      <div
        className={`bp-static-table-wrapper${className ? ` ${className}` : ""}`}
        style={style}
      >
        <table
          className={[
            "bp-static-table",
            striped ? "bp-static-table--striped" : "",
            hoverable ? "bp-static-table--hoverable" : "",
          ].filter(Boolean).join(" ")}
        >
          {caption && <caption>{caption}</caption>}
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    padding: cellPad,
                    textAlign: col.align ?? "left",
                    width: col.width,
                  }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const key = rowKey ? rowKey(row, idx) : idx;
              return (
                <tr key={key}>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{
                        padding: cellPad,
                        textAlign: col.align ?? "left",
                      }}
                    >
                      {col.render
                        ? col.render(row, idx)
                        : (row[col.key] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    padding: "2rem 1rem",
                    textAlign: "center",
                    color: "var(--bp-text-dim)",
                    fontStyle: "italic",
                  }}
                >
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
