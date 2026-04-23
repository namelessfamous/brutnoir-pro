import React from "react";
import { useTheme } from "../hooks/useTheme";

export function ThemeToggle(): React.ReactElement {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontFamily: "var(--bp-font-mono)",
        fontSize: "0.75rem",
        letterSpacing: "0.2em",
        color: "var(--bp-text-muted)",
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
      {theme === "dark" ? "☀ LIGHT" : "☾ DARK"}
    </button>
  );
}
