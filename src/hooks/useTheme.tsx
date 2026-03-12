import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { darkTheme, lightTheme } from "../tokens";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: Theme): void {
  const vars = theme === "dark" ? darkTheme : lightTheme;
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}

export function ThemeProvider({
  children,
  defaultTheme,
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
}): React.ReactElement {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme ?? "dark";
    const stored = localStorage.getItem("bp-theme") as Theme | null;
    if (stored === "dark" || stored === "light") return stored;
    if (defaultTheme) return defaultTheme;
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem("bp-theme", t);
    applyTheme(t);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
