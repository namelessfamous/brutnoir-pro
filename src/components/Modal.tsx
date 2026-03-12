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

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "var(--bp-surface)",
          border: "1px solid var(--bp-border)",
          padding: "2rem",
          width: "480px",
          maxWidth: "90vw",
          maxHeight: "85vh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
            paddingBottom: "1rem",
            borderBottom: "1px solid var(--bp-border)",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--bp-font-heading)",
              fontSize: "1.2rem",
              fontWeight: "normal",
              color: "var(--bp-text)",
              margin: 0,
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--bp-font-mono)",
              fontSize: "0.6rem",
              color: "var(--bp-text-muted)",
              padding: 0,
              letterSpacing: "0.1em",
            }}
          >
            ✕
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div
            style={{
              background: "var(--bp-red-bg)",
              border: "1px solid var(--bp-red)",
              color: "var(--bp-red)",
              fontFamily: "var(--bp-font-mono)",
              fontSize: "0.65rem",
              padding: "0.75rem",
              marginBottom: "1.25rem",
              letterSpacing: "0.05em",
            }}
          >
            {error}
          </div>
        )}

        {/* Body */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit?.(e);
          }}
        >
          {children}

          {/* Footer */}
          {onSubmit && (
            <div
              style={{
                display: "flex",
                gap: "1rem",
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
                  border: "none",
                  cursor: submitting ? "not-allowed" : "pointer",
                  fontFamily: "var(--bp-font-mono)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "0.5rem 1.25rem",
                  opacity: submitting ? 0.6 : 1,
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => {
                  if (!submitting)
                    (e.currentTarget as HTMLButtonElement).style.background = "var(--bp-green-hover)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--bp-green)";
                }}
              >
                {submitting ? "..." : submitLabel}
              </button>
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--bp-font-mono)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--bp-text-muted)",
                  padding: "0.5rem 0",
                  transition: "color 0.1s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--bp-text)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--bp-text-muted)";
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
