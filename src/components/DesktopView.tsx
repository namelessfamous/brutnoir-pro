/**
 * brutnoir-os · DesktopView
 * Finder-style layout: toolbar, sidebar, icon grid, preferences panel
 */

"use client";

import {
  useState,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { colors, fonts, shadows } from "../tokens";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DesktopItem {
  id: string;
  label: string;
  /** Emoji or unicode glyph shown as the icon */
  icon: string;
  type?: "app" | "folder" | "file" | "link";
  /** Called on single-click / selection */
  onClick?: () => void;
  /** Called on double-click / Enter key — open/launch */
  onOpen?: () => void;
}

export interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  onClick?: () => void;
}

export interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export interface DesktopPreferenceOption {
  label: string;
  value: string;
}

export interface DesktopPreference {
  id: string;
  label: string;
  type: "select" | "toggle" | "radio";
  value: string | boolean;
  options?: DesktopPreferenceOption[];
  onChange?: (val: string | boolean) => void;
}

export type DesktopViewMode = "icons" | "list";
export type DesktopIconSize = "sm" | "md" | "lg";

export interface DesktopViewProps {
  // Sidebar
  sidebar?: SidebarSection[];
  activeSidebarItem?: string;
  onSidebarSelect?: (id: string) => void;

  // Main content
  items?: DesktopItem[];
  selectedItem?: string;
  onSelect?: (id: string) => void;
  onOpen?: (id: string) => void;

  // Toolbar
  title?: string;
  canGoBack?: boolean;
  canGoForward?: boolean;
  onBack?: () => void;
  onForward?: () => void;
  showSearch?: boolean;
  searchValue?: string;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;

  // View options
  view?: DesktopViewMode;
  onViewChange?: (view: DesktopViewMode) => void;
  iconSize?: DesktopIconSize;

  // Preferences panel
  preferences?: DesktopPreference[];
  showPreferences?: boolean;
  onTogglePreferences?: () => void;

  // Status bar
  statusText?: string;

  // Layout
  style?: CSSProperties;
  className?: string;
}

// ─── Icon size map ─────────────────────────────────────────────────────────────

const iconSizeMap: Record<DesktopIconSize, { cell: number; glyph: number; label: number }> = {
  sm: { cell: 64,  glyph: 24, label: 11 },
  md: { cell: 80,  glyph: 32, label: 12 },
  lg: { cell: 100, glyph: 44, label: 13 },
};

// ─── DesktopView ──────────────────────────────────────────────────────────────

export function DesktopView({
  sidebar = [],
  activeSidebarItem,
  onSidebarSelect,
  items = [],
  selectedItem,
  onSelect,
  onOpen,
  title = "Desktop",
  canGoBack = false,
  canGoForward = false,
  onBack,
  onForward,
  showSearch = true,
  searchValue = "",
  searchPlaceholder = "Search…",
  onSearch,
  view = "icons",
  onViewChange,
  iconSize = "md",
  preferences = [],
  showPreferences = false,
  onTogglePreferences,
  statusText,
  style,
  className,
}: DesktopViewProps) {
  const [internalSearch, setInternalSearch] = useState(searchValue);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [hoveredSidebar, setHoveredSidebar] = useState<string | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(180);
  const resizingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(sidebarWidth);

  const sizes = iconSizeMap[iconSize];

  const handleSearch = (val: string) => {
    setInternalSearch(val);
    onSearch?.(val);
  };

  const handleItemClick = (item: DesktopItem) => {
    onSelect?.(item.id);
    item.onClick?.();
  };

  const handleItemDoubleClick = (item: DesktopItem) => {
    onOpen?.(item.id);
    item.onOpen?.();
  };

  const startSidebarResize = (e: React.MouseEvent) => {
    resizingRef.current = true;
    startXRef.current = e.clientX;
    startWidthRef.current = sidebarWidth;

    const onMove = (ev: MouseEvent) => {
      if (!resizingRef.current) return;
      const delta = ev.clientX - startXRef.current;
      setSidebarWidth(Math.max(120, Math.min(300, startWidthRef.current + delta)));
    };
    const onUp = () => {
      resizingRef.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        background: colors.noir,
        border: `1px solid ${colors.noirBorder}`,
        overflow: "hidden",
        height: "100%",
        fontFamily: fonts.mono,
        ...style,
      }}
    >
      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <Toolbar
        title={title}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        onBack={onBack}
        onForward={onForward}
        showSearch={showSearch}
        searchValue={internalSearch}
        searchPlaceholder={searchPlaceholder}
        onSearch={handleSearch}
        view={view}
        onViewChange={onViewChange}
        showPreferences={showPreferences}
        onTogglePreferences={onTogglePreferences}
        hasPreferences={preferences.length > 0}
      />

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* ── Sidebar ───────────────────────────────────────────────────────── */}
        {sidebar.length > 0 && (
          <>
            <div
              style={{
                width: sidebarWidth,
                flexShrink: 0,
                background: colors.noirLight,
                borderRight: `1px solid ${colors.noirBorder}`,
                overflowY: "auto",
                overflowX: "hidden",
                display: "flex",
                flexDirection: "column",
                gap: 4,
                padding: "8px 0",
              }}
            >
              {sidebar.map((section) => (
                <SidebarSectionView
                  key={section.title}
                  section={section}
                  activeId={activeSidebarItem}
                  hoveredId={hoveredSidebar}
                  onHover={setHoveredSidebar}
                  onSelect={(id) => {
                    onSidebarSelect?.(id);
                    section.items.find((i) => i.id === id)?.onClick?.();
                  }}
                />
              ))}
            </div>

            {/* Resize handle */}
            <div
              onMouseDown={startSidebarResize}
              style={{
                width: 4,
                flexShrink: 0,
                cursor: "col-resize",
                background: "transparent",
                borderRight: `1px solid ${colors.noirBorder}`,
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = `${colors.acid}33`)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            />
          </>
        )}

        {/* ── Main content ────────────────────────────────────────────────── */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
              padding: 12,
              background: colors.noir,
            }}
          >
            {view === "icons" ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(auto-fill, ${sizes.cell}px)`,
                  gap: 8,
                  alignContent: "start",
                }}
              >
                {items.map((item) => (
                  <DesktopIconCell
                    key={item.id}
                    item={item}
                    selected={selectedItem === item.id}
                    hovered={hoveredItem === item.id}
                    sizes={sizes}
                    onHover={setHoveredItem}
                    onClick={handleItemClick}
                    onDoubleClick={handleItemDoubleClick}
                  />
                ))}
                {items.length === 0 && (
                  <EmptyState />
                )}
              </div>
            ) : (
              <ListView
                items={items}
                selectedItem={selectedItem}
                onSelect={onSelect}
                onClick={handleItemClick}
                onDoubleClick={handleItemDoubleClick}
              />
            )}
          </div>

          {/* ── Preferences panel ───────────────────────────────────────── */}
          {showPreferences && preferences.length > 0 && (
            <PreferencesPanel preferences={preferences} />
          )}
        </div>
      </div>

      {/* ── Status bar ──────────────────────────────────────────────────────── */}
      <StatusBar
        count={items.length}
        selected={selectedItem ? items.find((i) => i.id === selectedItem) : undefined}
        statusText={statusText}
      />
    </div>
  );
}

// ─── Toolbar ─────────────────────────────────────────────────────────────────

interface ToolbarProps {
  title: string;
  canGoBack: boolean;
  canGoForward: boolean;
  onBack?: () => void;
  onForward?: () => void;
  showSearch: boolean;
  searchValue: string;
  searchPlaceholder: string;
  onSearch: (val: string) => void;
  view: DesktopViewMode;
  onViewChange?: (view: DesktopViewMode) => void;
  showPreferences: boolean;
  onTogglePreferences?: () => void;
  hasPreferences: boolean;
}

function Toolbar({
  title,
  canGoBack, canGoForward,
  onBack, onForward,
  showSearch, searchValue, searchPlaceholder, onSearch,
  view, onViewChange,
  showPreferences, onTogglePreferences, hasPreferences,
}: ToolbarProps) {
  return (
    <div
      style={{
        height: 38,
        background: colors.noirMid,
        borderBottom: `1px solid ${colors.noirBorder}`,
        display: "flex",
        alignItems: "center",
        padding: "0 8px",
        gap: 6,
        flexShrink: 0,
      }}
    >
      {/* Nav buttons */}
      <ToolbarButton
        label="‹"
        title="Back"
        disabled={!canGoBack}
        onClick={onBack}
        style={{ fontSize: 18, lineHeight: 1, paddingBottom: 1 }}
      />
      <ToolbarButton
        label="›"
        title="Forward"
        disabled={!canGoForward}
        onClick={onForward}
        style={{ fontSize: 18, lineHeight: 1, paddingBottom: 1 }}
      />

      {/* Title / breadcrumb */}
      <span
        style={{
          fontFamily: fonts.mono,
          fontSize: 13,
          color: colors.cream,
          letterSpacing: "0.06em",
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          padding: "0 4px",
        }}
      >
        {title}
      </span>

      {/* View toggle */}
      {onViewChange && (
        <div
          style={{
            display: "flex",
            border: `1px solid ${colors.noirBorderLight}`,
            overflow: "hidden",
          }}
        >
          <ViewToggleButton
            active={view === "icons"}
            title="Icon view"
            onClick={() => onViewChange("icons")}
          >
            ⊞
          </ViewToggleButton>
          <ViewToggleButton
            active={view === "list"}
            title="List view"
            onClick={() => onViewChange("list")}
          >
            ≡
          </ViewToggleButton>
        </div>
      )}

      {/* Search */}
      {showSearch && (
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <span
            style={{
              position: "absolute",
              left: 7,
              fontSize: 12,
              color: colors.creamMuted,
              pointerEvents: "none",
            }}
          >
            ⌕
          </span>
          <input
            type="text"
            value={searchValue}
            placeholder={searchPlaceholder}
            onChange={(e) => onSearch(e.target.value)}
            style={{
              background: colors.noirSurface,
              border: `1px solid ${colors.noirBorder}`,
              color: colors.cream,
              fontFamily: fonts.mono,
              fontSize: 12,
              padding: "3px 8px 3px 24px",
              width: 140,
              outline: "none",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = colors.acid;
              e.currentTarget.style.boxShadow = `0 0 0 2px ${colors.acid}22`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = colors.noirBorder;
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>
      )}

      {/* Preferences toggle */}
      {hasPreferences && (
        <ToolbarButton
          label="⚙"
          title="Toggle Preferences"
          onClick={onTogglePreferences}
          active={showPreferences}
          style={{ fontSize: 14 }}
        />
      )}
    </div>
  );
}

// ─── Toolbar sub-components ───────────────────────────────────────────────────

interface ToolbarButtonProps {
  label: string;
  title?: string;
  disabled?: boolean;
  active?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}

function ToolbarButton({ label, title, disabled, active, onClick, style }: ToolbarButtonProps) {
  const [hovered, setHovered] = useState(false);

  const bg = active
    ? `${colors.acid}22`
    : hovered && !disabled
    ? colors.noirSurface
    : "transparent";

  return (
    <button
      title={title}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: bg,
        border: `1px solid ${active ? colors.acid : "transparent"}`,
        color: disabled ? colors.noirBorderLight : hovered ? colors.acid : colors.creamMuted,
        fontFamily: fonts.mono,
        fontSize: 13,
        padding: "2px 7px",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 26,
        height: 24,
        transition: "all 0.1s",
        ...style,
      }}
    >
      {label}
    </button>
  );
}

interface ViewToggleButtonProps {
  children: ReactNode;
  active: boolean;
  title?: string;
  onClick: () => void;
}

function ViewToggleButton({ children, active, title, onClick }: ViewToggleButtonProps) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        background: active ? `${colors.acid}22` : "transparent",
        borderLeft: active ? `1px solid ${colors.acid}` : "none",
        borderRight: active ? `1px solid ${colors.acid}` : "none",
        borderTop: "none",
        borderBottom: "none",
        color: active ? colors.acid : colors.creamMuted,
        fontFamily: fonts.mono,
        fontSize: 15,
        padding: "1px 8px",
        cursor: "pointer",
        height: 24,
        display: "flex",
        alignItems: "center",
      }}
    >
      {children}
    </button>
  );
}

// ─── Sidebar section ──────────────────────────────────────────────────────────

interface SidebarSectionViewProps {
  section: SidebarSection;
  activeId?: string;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

function SidebarSectionView({
  section,
  activeId,
  hoveredId,
  onHover,
  onSelect,
}: SidebarSectionViewProps) {
  return (
    <div>
      {/* Section header */}
      <div
        style={{
          fontFamily: fonts.mono,
          fontSize: 10,
          color: colors.creamMuted,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          padding: "6px 12px 3px",
          userSelect: "none",
        }}
      >
        {section.title}
      </div>

      {/* Items */}
      {section.items.map((item) => {
        const isActive = activeId === item.id;
        const isHovered = hoveredId === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            onMouseEnter={() => onHover(item.id)}
            onMouseLeave={() => onHover(null)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              width: "100%",
              padding: "5px 12px",
              background: isActive
                ? `${colors.acid}22`
                : isHovered
                ? `${colors.acid}0f`
                : "transparent",
              border: "none",
              borderLeft: `2px solid ${isActive ? colors.acid : "transparent"}`,
              color: isActive ? colors.acid : isHovered ? colors.cream : colors.creamDim,
              fontFamily: fonts.mono,
              fontSize: 13,
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.1s",
            }}
          >
            <span style={{ fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: 1,
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Desktop icon cell ────────────────────────────────────────────────────────

interface DesktopIconCellProps {
  item: DesktopItem;
  selected: boolean;
  hovered: boolean;
  sizes: { cell: number; glyph: number; label: number };
  onHover: (id: string | null) => void;
  onClick: (item: DesktopItem) => void;
  onDoubleClick: (item: DesktopItem) => void;
}

function DesktopIconCell({
  item, selected, hovered, sizes,
  onHover, onClick, onDoubleClick,
}: DesktopIconCellProps) {
  return (
    <div
      title={item.label}
      onClick={() => onClick(item)}
      onDoubleClick={() => onDoubleClick(item)}
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={() => onHover(null)}
      style={{
        width: sizes.cell,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        padding: 6,
        background: selected
          ? `${colors.acid}22`
          : hovered
          ? `${colors.acid}0d`
          : "transparent",
        border: `1px solid ${selected ? colors.acid : "transparent"}`,
        boxShadow: selected ? shadows.sm : "none",
        cursor: "default",
        userSelect: "none",
        transition: "all 0.1s",
        animation: "nf-fadeIn 0.12s ease",
      }}
    >
      {/* Icon glyph */}
      <div
        style={{
          width: sizes.cell - 16,
          height: sizes.cell - 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: sizes.glyph,
          background: selected ? `${colors.acid}15` : colors.noirLight,
          border: `1px solid ${selected ? colors.acid : colors.noirBorder}`,
        }}
      >
        {item.icon}
      </div>

      {/* Label */}
      <span
        style={{
          fontFamily: fonts.mono,
          fontSize: sizes.label,
          color: selected ? colors.acid : colors.cream,
          textAlign: "center",
          width: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          letterSpacing: "0.02em",
        }}
      >
        {item.label}
      </span>
    </div>
  );
}

// ─── List view ────────────────────────────────────────────────────────────────

interface ListViewProps {
  items: DesktopItem[];
  selectedItem?: string;
  onSelect?: (id: string) => void;
  onClick: (item: DesktopItem) => void;
  onDoubleClick: (item: DesktopItem) => void;
}

function ListView({ items, selectedItem, onSelect, onClick, onDoubleClick }: ListViewProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  if (items.length === 0) return <EmptyState />;

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Header row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "32px 1fr 80px",
          padding: "4px 8px",
          borderBottom: `1px solid ${colors.noirBorder}`,
          background: colors.noirMid,
          fontFamily: fonts.mono,
          fontSize: 11,
          color: colors.creamMuted,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        <span />
        <span>Name</span>
        <span>Kind</span>
      </div>

      {items.map((item) => {
        const isSelected = selectedItem === item.id;
        const isHovered = hovered === item.id;

        return (
          <div
            key={item.id}
            onClick={() => onClick(item)}
            onDoubleClick={() => onDoubleClick(item)}
            onMouseEnter={() => setHovered(item.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: "grid",
              gridTemplateColumns: "32px 1fr 80px",
              padding: "5px 8px",
              background: isSelected
                ? `${colors.acid}22`
                : isHovered
                ? `${colors.acid}0d`
                : "transparent",
              borderLeft: `2px solid ${isSelected ? colors.acid : "transparent"}`,
              borderBottom: `1px solid ${colors.noirBorder}`,
              cursor: "default",
              userSelect: "none",
              transition: "all 0.1s",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            <span
              style={{
                fontFamily: fonts.mono,
                fontSize: 13,
                color: isSelected ? colors.acid : colors.cream,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {item.label}
            </span>
            <span
              style={{
                fontFamily: fonts.mono,
                fontSize: 11,
                color: colors.creamMuted,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {item.type ?? "file"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Preferences panel ────────────────────────────────────────────────────────

interface PreferencesPanelProps {
  preferences: DesktopPreference[];
}

function PreferencesPanel({ preferences }: PreferencesPanelProps) {
  return (
    <div
      style={{
        width: 220,
        flexShrink: 0,
        background: colors.noirLight,
        borderLeft: `1px solid ${colors.noirBorder}`,
        display: "flex",
        flexDirection: "column",
        animation: "bn-slideUp 0.15s ease",
      }}
    >
      {/* Panel header */}
      <div
        style={{
          padding: "8px 12px",
          borderBottom: `1px solid ${colors.noirBorder}`,
          fontFamily: fonts.mono,
          fontSize: 11,
          color: colors.creamMuted,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          background: colors.noirMid,
        }}
      >
        ⚙ Preferences
      </div>

      {/* Preference items */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px 0",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {preferences.map((pref) => (
          <PreferenceItem key={pref.id} pref={pref} />
        ))}
      </div>
    </div>
  );
}

interface PreferenceItemProps {
  pref: DesktopPreference;
}

function PreferenceItem({ pref }: PreferenceItemProps) {
  return (
    <div
      style={{
        padding: "8px 12px",
        borderBottom: `1px solid ${colors.noirBorder}`,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <label
        style={{
          fontFamily: fonts.mono,
          fontSize: 11,
          color: colors.creamMuted,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {pref.label}
      </label>

      {pref.type === "toggle" && (
        <ToggleSwitch
          value={pref.value as boolean}
          onChange={(v) => pref.onChange?.(v)}
        />
      )}

      {pref.type === "select" && pref.options && (
        <select
          value={pref.value as string}
          onChange={(e) => pref.onChange?.(e.target.value)}
          style={{
            background: colors.noirSurface,
            border: `1px solid ${colors.noirBorder}`,
            color: colors.cream,
            fontFamily: fonts.mono,
            fontSize: 12,
            padding: "4px 6px",
            cursor: "pointer",
            outline: "none",
            appearance: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%238a8577'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 8px center",
            paddingRight: 24,
          }}
        >
          {pref.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {pref.type === "radio" && pref.options && (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {pref.options.map((opt) => {
            const isSelected = pref.value === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => pref.onChange?.(opt.value)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: isSelected ? `${colors.acid}22` : "transparent",
                  border: `1px solid ${isSelected ? colors.acid : colors.noirBorder}`,
                  color: isSelected ? colors.acid : colors.creamDim,
                  fontFamily: fonts.mono,
                  fontSize: 12,
                  padding: "4px 8px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.1s",
                }}
              >
                <span style={{ color: isSelected ? colors.acid : colors.noirBorderLight }}>
                  {isSelected ? "◉" : "○"}
                </span>
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Toggle switch ────────────────────────────────────────────────────────────

function ToggleSwitch({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 40,
        height: 22,
        background: value ? colors.acid : colors.noirSurface,
        border: `1px solid ${value ? colors.acid : colors.noirBorder}`,
        boxShadow: value ? shadows.sm : "none",
        cursor: "pointer",
        position: "relative",
        display: "flex",
        alignItems: "center",
        padding: "0 3px",
        justifyContent: value ? "flex-end" : "flex-start",
        transition: "all 0.15s",
      }}
    >
      <div
        style={{
          width: 14,
          height: 14,
          background: value ? colors.noir : colors.noirBorderLight,
          transition: "all 0.15s",
        }}
      />
    </button>
  );
}

// ─── Status bar ───────────────────────────────────────────────────────────────

interface StatusBarProps {
  count: number;
  selected?: DesktopItem;
  statusText?: string;
}

function StatusBar({ count, selected, statusText }: StatusBarProps) {
  return (
    <div
      style={{
        height: 22,
        background: colors.noirMid,
        borderTop: `1px solid ${colors.noirBorder}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 10px",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: fonts.mono,
          fontSize: 11,
          color: colors.creamMuted,
          letterSpacing: "0.04em",
        }}
      >
        {statusText ?? `${count} item${count !== 1 ? "s" : ""}`}
      </span>

      {selected && (
        <span
          style={{
            fontFamily: fonts.mono,
            fontSize: 11,
            color: colors.acid,
            letterSpacing: "0.04em",
          }}
        >
          {selected.icon} {selected.label}
        </span>
      )}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: 40,
        color: colors.creamMuted,
        fontFamily: fonts.mono,
        fontSize: 13,
        opacity: 0.6,
        userSelect: "none",
      }}
    >
      <span style={{ fontSize: 32 }}>▫</span>
      <span>No items</span>
    </div>
  );
}
