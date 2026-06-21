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
        border: "1px solid var(--bp-border)",
        borderRadius: "var(--bp-radius-sm)",
        cursor: "pointer",
        fontFamily: "var(--bp-font-mono)",
        fontSize: "var(--bp-text-xs)",
        letterSpacing: "0.12em",
        color: "var(--bp-text-muted)",
        padding: "0.3rem 0.6rem",
        transition: "color var(--bp-transition-fast), border-color var(--bp-transition-fast)",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
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
      {theme === "dark" ? "☀" : "☾"}
      {theme === "dark" ? "LIGHT" : "DARK"}
    </button>
  );
}
