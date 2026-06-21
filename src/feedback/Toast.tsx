import React, { createContext, useCallback, useContext, useRef, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export type ToastVariant = "default" | "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  message: string;
  variant?: ToastVariant;
  duration?: number;
}

export interface ToastContextValue {
  toast: (message: string, options?: Omit<ToastItem, "id" | "message">) => void;
  dismiss: (id: string) => void;
}

// ── Context ────────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

// ── useToast hook ──────────────────────────────────────────────────────────────

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

// ── Toast visual component ────────────────────────────────────────────────────

const variantStyles: Record<ToastVariant, React.CSSProperties> = {
  default: { borderLeftColor: "var(--bp-border)" },
  success: { borderLeftColor: "var(--bp-green)" },
  error:   { borderLeftColor: "var(--bp-red)" },
  warning: { borderLeftColor: "var(--bp-warning)" },
  info:    { borderLeftColor: "var(--bp-blue)" },
};

const variantIcons: Record<ToastVariant, string> = {
  default: "●",
  success: "✓",
  error:   "✕",
  warning: "⚠",
  info:    "ℹ",
};

const variantIconColors: Record<ToastVariant, string> = {
  default: "var(--bp-text-muted)",
  success: "var(--bp-green)",
  error:   "var(--bp-red)",
  warning: "var(--bp-warning)",
  info:    "var(--bp-blue)",
};

interface ToastCardProps {
  item: ToastItem;
  onDismiss: (id: string) => void;
}

function ToastCard({ item, onDismiss }: ToastCardProps): React.ReactElement {
  const variant: ToastVariant = item.variant ?? "default";

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.6rem",
        background: "var(--bp-surface)",
        border: "1px solid var(--bp-border)",
        borderLeft: `3px solid ${variantStyles[variant].borderLeftColor}`,
        borderRadius: "var(--bp-radius)",
        padding: "0.75rem 0.85rem",
        boxShadow: "var(--bp-shadow)",
        minWidth: "260px",
        maxWidth: "380px",
        animation: "bp-toast-in 0.15s ease",
      }}
    >
      <span
        style={{
          flexShrink: 0,
          fontSize: "0.8rem",
          color: variantIconColors[variant],
          marginTop: "0.05rem",
        }}
      >
        {variantIcons[variant]}
      </span>
      <span
        style={{
          flex: 1,
          fontFamily: "var(--bp-font-body)",
          fontSize: "var(--bp-text-sm)",
          color: "var(--bp-text)",
          lineHeight: 1.4,
        }}
      >
        {item.message}
      </span>
      <button
        onClick={() => onDismiss(item.id)}
        aria-label="Dismiss"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--bp-text-dim)",
          fontSize: "0.7rem",
          padding: "0",
          flexShrink: 0,
          lineHeight: 1,
          marginTop: "0.05rem",
          transition: "color var(--bp-transition-fast)",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--bp-text)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--bp-text-dim)"; }}
      >
        ✕
      </button>
      <style>{`@keyframes bp-toast-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  );
}

// ── ToastProvider ─────────────────────────────────────────────────────────────

export interface ToastProviderProps {
  children: React.ReactNode;
  /** Position on screen */
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
  /** Default duration in ms (0 = persistent) */
  defaultDuration?: number;
}

const positionStyles: Record<string, React.CSSProperties> = {
  "top-right":     { top: "1rem", right: "1rem" },
  "top-left":      { top: "1rem", left: "1rem" },
  "bottom-right":  { bottom: "1rem", right: "1rem" },
  "bottom-left":   { bottom: "1rem", left: "1rem" },
  "top-center":    { top: "1rem", left: "50%", transform: "translateX(-50%)" },
  "bottom-center": { bottom: "1rem", left: "50%", transform: "translateX(-50%)" },
};

export function ToastProvider({
  children,
  position = "bottom-right",
  defaultDuration = 4000,
}: ToastProviderProps): React.ReactElement {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counterRef = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, options?: Omit<ToastItem, "id" | "message">) => {
      const id = `bp-toast-${++counterRef.current}`;
      const duration = options?.duration ?? defaultDuration;
      setToasts((prev) => [...prev, { id, message, ...options }]);
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
    },
    [dismiss, defaultDuration]
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {toasts.length > 0 && (
        <div
          aria-live="assertive"
          style={{
            position: "fixed",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            zIndex: "var(--bp-z-toast)" as unknown as number,
            ...positionStyles[position],
          }}
        >
          {toasts.map((item) => (
            <ToastCard key={item.id} item={item} onDismiss={dismiss} />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

/** Standalone Toast component — for when you manage your own toast state */
export interface ToastProps {
  message: string;
  variant?: ToastVariant;
  onDismiss?: () => void;
  style?: React.CSSProperties;
}

export function Toast({ message, variant = "default", onDismiss, style }: ToastProps): React.ReactElement {
  const v = variant;
  return (
    <div
      role="alert"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.6rem",
        background: "var(--bp-surface)",
        border: "1px solid var(--bp-border)",
        borderLeft: `3px solid ${variantStyles[v].borderLeftColor}`,
        borderRadius: "var(--bp-radius)",
        padding: "0.75rem 0.85rem",
        boxShadow: "var(--bp-shadow)",
        ...style,
      }}
    >
      <span style={{ flexShrink: 0, fontSize: "0.8rem", color: variantIconColors[v] }}>
        {variantIcons[v]}
      </span>
      <span style={{ flex: 1, fontFamily: "var(--bp-font-body)", fontSize: "var(--bp-text-sm)", color: "var(--bp-text)", lineHeight: 1.4 }}>
        {message}
      </span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "var(--bp-text-dim)", fontSize: "0.7rem", padding: 0, flexShrink: 0,
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}
