# @namelessfamous/brutnoir-pro

Enterprise-grade dark admin design system for Nameless Famous internal tools (nf-whip, FrontStage, Backstage).

Dark-first, monospace-forward, serif headings. Zero dependencies beyond React.

## Install

```bash
npm install @namelessfamous/brutnoir-pro
```

> Requires React 18+. Published to GitHub Packages under `@namelessfamous`.

## Setup

Wrap your app with `ThemeProvider` and render `GlobalStyles` once:

```tsx
import { ThemeProvider, GlobalStyles } from "@namelessfamous/brutnoir-pro";

export default function App({ children }) {
  return (
    <ThemeProvider>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
}
```

`ThemeProvider` reads `localStorage["brutnoir-pro-theme"]`, falls back to `prefers-color-scheme`, defaults to dark. Sets `data-theme` on `<html>`.

## Theme

```tsx
import { useTheme } from "@namelessfamous/brutnoir-pro";

function ThemeButton() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>{theme}</button>;
}
```

## Components

| Component | Description |
|-----------|-------------|
| `AdminLayout` | Fixed sidebar (220px) + scrollable main area |
| `Sidebar` | Nav container with title, items, footer |
| `NavItem` | Sidebar link with active state (green accent) |
| `PageHeader` | Section + serif title + optional action |
| `DataTable` | Generic typed table with loading/empty/actions |
| `Modal` | Dark overlay modal with form + submit support |
| `Button` | `primary` / `ghost` / `danger`, `sm` / `md` |
| `Badge` | `success` / `danger` / `info` / `neutral` / `warning` |
| `Chip` | Colored tag with auto-contrast text, remove button |
| `ConfirmRow` | Inline confirm-delete table row |
| `FormField` | Label + error wrapper |
| `Input` | Borderless input with bottom-border focus |
| `Textarea` | Same treatment as Input |
| `Select` | Styled select with focus state |
| `ColorInput` | Color picker with preview swatch |
| `ThemeToggle` | Toggle button for dark/light |
| `GlobalStyles` | Injects CSS vars + base reset |

## Design Tokens

CSS variables injected on `:root` (dark) and `[data-theme="light"]`:

- `--bg-primary` / `--bg-surface` / `--bg-elevated`
- `--border` / `--border-focus`
- `--text-primary` / `--text-muted` / `--text-dim`
- `--accent` / `--accent-hover` / `--accent-bg` (green)
- `--danger` / `--danger-hover` / `--danger-bg`
- `--info` / `--info-bg`
- `--font-display` (Georgia serif) / `--font-mono` (Courier New)
