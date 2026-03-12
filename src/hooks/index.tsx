/**
 * brutnoir-os · ScreenContext
 * OS-level state: windows, focus, notifications
 */

"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type JSX,
  type ReactNode,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WindowConfig {
  id?: string;
  title: string;
  icon?: string;
  content?: ReactNode;
  defaultX?: number;
  defaultY?: number;
  defaultWidth?: number;
  defaultHeight?: number;
  resizable?: boolean;
  controls?: boolean;
}

export interface WindowState extends Required<Pick<WindowConfig, "id" | "title">> {
  icon?: string;
  content?: ReactNode;
  defaultX: number;
  defaultY: number;
  defaultWidth: number;
  defaultHeight: number;
  resizable: boolean;
  controls: boolean;
  minimized: boolean;
  zIndex: number;
}

export interface NotificationConfig {
  title?: string;
  message: string;
  variant?: "default" | "success" | "error" | "warning" | "info";
  duration?: number;
}

export interface NotificationState extends NotificationConfig {
  id: number;
}

export interface ScreenContextValue {
  windows: WindowState[];
  activeWindow: string | null;
  notifications: NotificationState[];
  openWindow: (win: WindowConfig) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  notify: (msg: NotificationConfig) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ScreenContext = createContext<ScreenContextValue | null>(null);

export function useScreen(): ScreenContextValue {
  const ctx = useContext(ScreenContext);
  if (!ctx) throw new Error("useScreen must be used within <Screen>");
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ScreenProvider({ children }: { children: ReactNode }): JSX.Element {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationState[]>([]);

  const openWindow = useCallback((win: WindowConfig) => {
    const id = win.id ?? `win-${Date.now()}`;
    setWindows((prev) => {
      if (prev.find((w) => w.id === id)) {
        setActiveWindow(id);
        return prev.map((w) =>
          w.id === id ? { ...w, minimized: false, zIndex: Date.now() } : w
        );
      }
      return [
        ...prev,
        {
          id,
          title: win.title,
          icon: win.icon,
          content: win.content,
          defaultX: win.defaultX ?? 80,
          defaultY: win.defaultY ?? 40,
          defaultWidth: win.defaultWidth ?? 480,
          defaultHeight: win.defaultHeight ?? 320,
          resizable: win.resizable ?? true,
          controls: win.controls ?? true,
          minimized: false,
          zIndex: Date.now(),
        },
      ];
    });
    setActiveWindow(id);
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    setActiveWindow((prev) => (prev === id ? null : prev));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: !w.minimized } : w))
    );
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: Date.now() } : w))
    );
    setActiveWindow(id);
  }, []);

  const notify = useCallback((msg: NotificationConfig) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, ...msg }]);
    setTimeout(
      () => setNotifications((prev) => prev.filter((n) => n.id !== id)),
      msg.duration ?? 4000
    );
  }, []);

  return (
    <ScreenContext.Provider
      value={{ windows, activeWindow, notifications, openWindow, closeWindow, minimizeWindow, focusWindow, notify }}
    >
      {children}
    </ScreenContext.Provider>
  );
}
