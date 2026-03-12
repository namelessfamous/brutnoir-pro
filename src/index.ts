/**
 * brutnoir-os
 * Neobrutal Noir Design System · Nameless Famous
 *
 * @example
 * import { Screen, Window, Button, useScreen } from "@namelessfamous/brutnoir-os";
 */

// ── Layout ────────────────────────────────────────────────────────────────────
export { Screen } from "./components/Screen";
export { Window } from "./components/Window";
export { MenuBar } from "./components/MenuBar";
export type { MenuBarItem } from "./components/MenuBar";
export { ScreenDock } from "./components/ScreenDock";
export type { DockApp } from "./components/ScreenDock";
export { DesktopView } from "./components/DesktopView";
export type {
  DesktopItem,
  SidebarItem,
  SidebarSection,
  DesktopPreference,
  DesktopPreferenceOption,
  DesktopViewMode,
  DesktopIconSize,
  DesktopViewProps,
} from "./components/DesktopView";

// ── Core ──────────────────────────────────────────────────────────────────────
export { Header, Text, Icon } from "./components/Typography";
export {
  Button,
  ButtonLink,
  Badge,
  Spinner,
  Card,
  Divider,
} from "./components/Primitives";
export type { ButtonVariant, ButtonSize, BadgeVariant } from "./components/Primitives";

// ── Menu ──────────────────────────────────────────────────────────────────────
export { MenuItem, MenuDivider, MenuDropdown } from "./components/Menu";

// ── Form ──────────────────────────────────────────────────────────────────────
export { Input, Select, MultiSelect, Typeahead } from "./components/Form";
export type { SelectOption } from "./components/Form";

// ── Overlays ──────────────────────────────────────────────────────────────────
export { Modal, Notification, Popover } from "./components/Overlays";
export type { NotificationVariant } from "./components/Overlays";

// ── Hooks ─────────────────────────────────────────────────────────────────────
export { useScreen, ScreenProvider } from "./hooks";
export type {
  ScreenContextValue,
  WindowConfig,
  WindowState,
  NotificationConfig,
  NotificationState,
} from "./hooks";

// ── Tokens ────────────────────────────────────────────────────────────────────
export { colors, fonts, radii, shadows, tokens } from "./tokens";
export type { ColorKey, FontKey } from "./tokens";
export { GlobalStyles } from "./tokens/GlobalStyles";
