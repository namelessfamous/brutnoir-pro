import React, { useEffect, useRef } from "react";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  submitLabel?: string;
  onSubmit?: (e: React.FormEvent) => void;
  submitting?: boolean;
  error?: string | null;
  /** Width of the modal dialog */
  width?: string | number;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  submitLabel = "Submit",
  onSubmit,
  submitting = false,
  error,
  width = 480,
}: ModalProps): React.ReactElement | null {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const w = typeof width === "number" ? `${width}px` : width;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: "var(--bp-z-modal)" as unknown as number,
        padding: "1rem",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="bp-modal-title"
        style={{
          background: "var(--bp-surface)",
          border: "1px solid var(--bp-border)",
          borderRadius: "var(--bp-radius)",
          boxShadow: "var(--bp-shadow-modal)",
          width: w,
          maxWidth: "90vw",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Win95-style title bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.6rem 0.75rem",
            background: "var(--bp-bg)",
            borderBottom: "1px solid var(--bp-border)",
            flexShrink: 0,
          }}
        >
          <h2
            id="bp-modal-title"
            style={{
              fontFamily: "var(--bp-font-body)",
              fontSize: "var(--bp-text-sm)",
              fontWeight: "600",
              color: "var(--bp-text)",
              margin: 0,
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "var(--bp-surface)",
              border: "1px solid var(--bp-border)",
              borderRadius: "var(--bp-radius-sm)",
              cursor: "pointer",
              fontSize: "0.75rem",
              color: "var(--bp-text-muted)",
              padding: "0.1rem 0.4rem",
              lineHeight: 1.2,
              boxShadow: "var(--bp-shadow-sm)",
              transition: "color var(--bp-transition-fast)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--bp-red)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--bp-text-muted)";
            }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          {/* Error banner */}
          {error && (
            <div
              role="alert"
              style={{
                background: "var(--bp-red-bg)",
                border: "1px solid var(--bp-red)",
                color: "var(--bp-red)",
                fontFamily: "var(--bp-font-body)",
                fontSize: "var(--bp-text-sm)",
                padding: "0.6rem 0.75rem",
                marginBottom: "1.25rem",
                borderRadius: "var(--bp-radius-sm)",
              }}
            >
              {error}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit?.(e);
            }}
          >
            {children}

            {onSubmit && (
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  marginTop: "1.5rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid var(--bp-border)",
                }}
              >
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    background: "var(--bp-green)",
                    color: "var(--bp-bg)",
                    border: "1px solid var(--bp-green)",
                    borderRadius: "var(--bp-radius-sm)",
                    cursor: submitting ? "not-allowed" : "pointer",
                    fontFamily: "var(--bp-font-mono)",
                    fontSize: "var(--bp-text-xs)",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    padding: "0.45rem 1rem",
                    opacity: submitting ? 0.6 : 1,
                    boxShadow: "var(--bp-shadow-sm)",
                    transition: "background var(--bp-transition-fast)",
                  }}
                  onMouseEnter={(e) => {
                    if (!submitting)
                      e.currentTarget.style.background = "var(--bp-green-hover)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--bp-green)";
                  }}
                >
                  {submitting ? "…" : submitLabel}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    background: "none",
                    border: "1px solid var(--bp-border)",
                    borderRadius: "var(--bp-radius-sm)",
                    cursor: "pointer",
                    fontFamily: "var(--bp-font-mono)",
                    fontSize: "var(--bp-text-xs)",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--bp-text-muted)",
                    padding: "0.45rem 1rem",
                    transition: "color var(--bp-transition-fast), border-color var(--bp-transition-fast)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--bp-text)";
                    e.currentTarget.style.borderColor = "var(--bp-text-muted)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--bp-text-muted)";
                    e.currentTarget.style.borderColor = "var(--bp-border)";
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
