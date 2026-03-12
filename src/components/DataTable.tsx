import React from "react";
import { ConfirmRow } from "./ConfirmRow";

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  style?: React.CSSProperties;
}

export interface DataTableProps<T extends { id: number }> {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  emptyText?: string;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  confirmDeleteId?: number | null;
  onConfirmDelete?: (id: number) => void;
  onCancelDelete?: () => void;
  deleteLabel?: (row: T) => string;
}

export function DataTable<T extends { id: number }>({
  columns,
  rows,
  loading = false,
  emptyText = "No records found.",
  onEdit,
  onDelete,
  confirmDeleteId,
  onConfirmDelete,
  onCancelDelete,
  deleteLabel,
}: DataTableProps<T>): React.ReactElement {
  const hasActions = !!(onEdit || onDelete);
  const totalCols = columns.length + (hasActions ? 1 : 0);

  const headerStyle: React.CSSProperties = {
    fontFamily: "var(--bp-font-mono)",
    fontSize: "0.5rem",
    letterSpacing: "0.2em",
    color: "var(--bp-text-muted)",
    textTransform: "uppercase",
    padding: "0.6rem 1rem",
    borderBottom: "1px solid var(--bp-border)",
    textAlign: "left",
    fontWeight: "normal",
  };

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} style={{ ...headerStyle, ...col.style }}>
              {col.label}
            </th>
          ))}
          {hasActions && (
            <th style={{ ...headerStyle, textAlign: "right" }}>Actions</th>
          )}
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td
              colSpan={totalCols}
              style={{
                padding: "2rem 1rem",
                textAlign: "center",
                fontFamily: "var(--bp-font-mono)",
                fontSize: "0.6rem",
                color: "var(--bp-text-muted)",
                letterSpacing: "0.2em",
              }}
            >
              LOADING...
            </td>
          </tr>
        ) : rows.length === 0 ? (
          <tr>
            <td
              colSpan={totalCols}
              style={{
                padding: "2rem 1rem",
                textAlign: "center",
                fontFamily: "var(--bp-font-mono)",
                fontSize: "0.6rem",
                color: "var(--bp-text-muted)",
                letterSpacing: "0.2em",
              }}
            >
              {emptyText.toUpperCase()}
            </td>
          </tr>
        ) : (
          rows.map((row, idx) => {
            if (confirmDeleteId === row.id) {
              return (
                <ConfirmRow
                  key={`confirm-${row.id}`}
                  label={deleteLabel ? deleteLabel(row) : `DELETE #${row.id}?`}
                  onConfirm={() => onConfirmDelete?.(row.id)}
                  onCancel={() => onCancelDelete?.()}
                  colSpan={totalCols}
                />
              );
            }

            const cellStyle: React.CSSProperties = {
              padding: "0.65rem 1rem",
              fontFamily: "var(--bp-font-mono)",
              fontSize: "0.65rem",
              color: "var(--bp-text)",
              borderBottom: "1px solid var(--bp-border)",
              background: idx % 2 === 0 ? "var(--bp-bg)" : "var(--bp-surface)",
            };

            return (
              <tr
                key={row.id}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLTableRowElement)
                    .querySelectorAll("td")
                    .forEach((td) => {
                      (td as HTMLTableCellElement).style.background = "var(--bp-surface)";
                    });
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLTableRowElement)
                    .querySelectorAll("td")
                    .forEach((td, i) => {
                      if (i < columns.length || !hasActions) {
                        (td as HTMLTableCellElement).style.background =
                          idx % 2 === 0 ? "var(--bp-bg)" : "var(--bp-surface)";
                      }
                    });
                }}
              >
                {columns.map((col) => (
                  <td key={col.key} style={{ ...cellStyle, ...col.style }}>
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? "")}
                  </td>
                ))}
                {hasActions && (
                  <td
                    style={{
                      ...cellStyle,
                      textAlign: "right",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontFamily: "var(--bp-font-mono)",
                          fontSize: "0.55rem",
                          letterSpacing: "0.15em",
                          color: "var(--bp-text-muted)",
                          textTransform: "uppercase",
                          marginRight: "0.75rem",
                          padding: 0,
                          transition: "color 0.1s",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.color = "var(--bp-text)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.color = "var(--bp-text-muted)";
                        }}
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontFamily: "var(--bp-font-mono)",
                          fontSize: "0.55rem",
                          letterSpacing: "0.15em",
                          color: "var(--bp-text-muted)",
                          textTransform: "uppercase",
                          padding: 0,
                          transition: "color 0.1s",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.color = "var(--bp-red)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.color = "var(--bp-text-muted)";
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                )}
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}
