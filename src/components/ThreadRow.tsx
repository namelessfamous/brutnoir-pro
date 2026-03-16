import React from "react";

export interface ThreadParticipant {
  name: string;
  number: string;
}

export interface ThreadLatestMessage {
  body?: string | null;
  direction?: "inbound" | "outbound";
}

export interface ThreadFromNumber {
  number?: string | null;
}

export interface ThreadRowThread {
  id: string;
  participants: ThreadParticipant[];
  from_number_detail?: ThreadFromNumber | null;
  latest_message?: ThreadLatestMessage | null;
  last_message_at?: string | null;
  created_at: string;
}

export interface ThreadRowProps {
  thread: ThreadRowThread;
  selected: boolean;
  onSelect: () => void;
}

function formatRelative(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ThreadRow({ thread, selected, onSelect }: ThreadRowProps): React.ReactElement {
  const first = thread.participants[0];
  const name = first
    ? first.name !== first.number ? first.name : first.number
    : "Unknown";
  const subtitle = thread.participants.length
    ? thread.participants.map((p) => p.number).join(", ")
    : thread.from_number_detail?.number ?? "";
  const preview = thread.latest_message?.body ?? "";
  const timestamp = thread.last_message_at ?? thread.created_at;
  const isInbound = thread.latest_message?.direction === "inbound";

  const baseStyle: React.CSSProperties = {
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
    gap: "0.75rem",
    padding: "0.75rem 1rem",
    textAlign: "left",
    background: selected ? "var(--bp-green-bg)" : "transparent",
    borderLeft: selected ? "2px solid var(--bp-green)" : "2px solid transparent",
    borderBottom: "1px solid var(--bp-border)",
    cursor: "pointer",
    transition: "background 0.1s",
    border: "none",
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: "var(--bp-border)",
    borderLeftWidth: "2px",
    borderLeftStyle: "solid",
    borderLeftColor: selected ? "var(--bp-green)" : "transparent",
  };

  return (
    <button
      type="button"
      onClick={onSelect}
      style={baseStyle}
      onMouseEnter={(e) => {
        if (!selected) (e.currentTarget as HTMLButtonElement).style.background = "var(--bp-surface)";
      }}
      onMouseLeave={(e) => {
        if (!selected) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
      }}
    >
      {/* Avatar */}
      <div
        style={{
          flexShrink: 0,
          width: "2.25rem",
          height: "2.25rem",
          borderRadius: "50%",
          background: "var(--bp-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--bp-font-mono)",
          fontSize: "0.65rem",
          color: "var(--bp-text)",
          letterSpacing: "0.1em",
        }}
      >
        {name.charAt(0).toUpperCase()}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "0.25rem" }}>
          <span
            style={{
              fontFamily: "var(--bp-font-mono)",
              fontSize: "0.65rem",
              fontWeight: "bold",
              letterSpacing: "0.1em",
              color: "var(--bp-text)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {name}
          </span>
          <span style={{ flexShrink: 0, fontFamily: "var(--bp-font-mono)", fontSize: "0.45rem", color: "var(--bp-text-muted)", letterSpacing: "0.1em" }}>
            {formatRelative(timestamp)}
          </span>
        </div>
        <div style={{ fontFamily: "var(--bp-font-mono)", fontSize: "0.5rem", color: "var(--bp-text-muted)", letterSpacing: "0.08em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {subtitle}
        </div>
        {preview && (
          <div style={{ marginTop: "0.15rem", fontFamily: "var(--bp-font-mono)", fontSize: "0.55rem", color: isInbound ? "var(--bp-text)" : "var(--bp-text-muted)", letterSpacing: "0.05em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {!isInbound && <span style={{ color: "var(--bp-text-dim)" }}>You: </span>}
            {preview}
          </div>
        )}
      </div>
    </button>
  );
}
