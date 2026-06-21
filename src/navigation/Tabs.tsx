import React, { useState } from "react";

export interface TabItem {
  id: string;
  label: React.ReactNode;
  content?: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  /** Controlled active tab id */
  activeId?: string;
  /** Default active tab id (uncontrolled) */
  defaultActiveId?: string;
  onChange?: (id: string) => void;
  /** Whether to render tab panels */
  renderPanels?: boolean;
  style?: React.CSSProperties;
  tabBarStyle?: React.CSSProperties;
}

export function Tabs({
  tabs,
  activeId,
  defaultActiveId,
  onChange,
  renderPanels = true,
  style,
  tabBarStyle,
}: TabsProps): React.ReactElement {
  const [internalActive, setInternalActive] = useState<string>(
    defaultActiveId ?? tabs[0]?.id ?? ""
  );

  const currentId = activeId ?? internalActive;

  const handleClick = (id: string) => {
    if (!activeId) setInternalActive(id);
    onChange?.(id);
  };

  const activeTab = tabs.find((t) => t.id === currentId);

  return (
    <div style={style}>
      {/* Tab bar */}
      <div
        role="tablist"
        style={{
          display: "flex",
          borderBottom: "1px solid var(--bp-border)",
          gap: 0,
          ...tabBarStyle,
        }}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === currentId;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`bp-tab-panel-${tab.id}`}
              id={`bp-tab-${tab.id}`}
              disabled={tab.disabled}
              onClick={() => !tab.disabled && handleClick(tab.id)}
              style={{
                background: "none",
                border: "none",
                borderBottom: isActive ? "2px solid var(--bp-green)" : "2px solid transparent",
                marginBottom: "-1px",
                padding: "0.6rem 1rem",
                cursor: tab.disabled ? "not-allowed" : "pointer",
                fontFamily: "var(--bp-font-body)",
                fontSize: "var(--bp-text-sm)",
                fontWeight: isActive ? "600" : "400",
                color: isActive ? "var(--bp-text)" : "var(--bp-text-muted)",
                opacity: tab.disabled ? 0.4 : 1,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                transition: "color var(--bp-transition-fast), border-color var(--bp-transition-fast)",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                if (!tab.disabled && !isActive)
                  e.currentTarget.style.color = "var(--bp-text)";
              }}
              onMouseLeave={(e) => {
                if (!tab.disabled && !isActive)
                  e.currentTarget.style.color = "var(--bp-text-muted)";
              }}
            >
              {tab.label}
              {tab.badge !== undefined && (
                <span
                  style={{
                    background: isActive ? "var(--bp-green)" : "var(--bp-border)",
                    color: isActive ? "var(--bp-bg)" : "var(--bp-text-muted)",
                    fontFamily: "var(--bp-font-mono)",
                    fontSize: "var(--bp-text-xs)",
                    padding: "0 0.35rem",
                    borderRadius: "var(--bp-radius-sm)",
                    lineHeight: "1.5",
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab panels */}
      {renderPanels && activeTab?.content && (
        <div
          role="tabpanel"
          id={`bp-tab-panel-${currentId}`}
          aria-labelledby={`bp-tab-${currentId}`}
          style={{ paddingTop: "1rem" }}
        >
          {activeTab.content}
        </div>
      )}
    </div>
  );
}
