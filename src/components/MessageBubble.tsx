import React from "react";
import { Badge } from "./Badge";

export interface MessageAttachment {
  id: string | number;
  content_type: string;
  file?: string | null;
  url?: string | null;
}

export type MessageDirection = "inbound" | "outbound";
export type MessageStatus = "queued" | "sending" | "sent" | "delivered" | "failed" | string;

export interface MessageBubbleMessage {
  id: string | number;
  direction: MessageDirection;
  body?: string | null;
  status: MessageStatus;
  attachments: MessageAttachment[];
  sent_at?: string | null;
  created_at: string;
  error_message?: string | null;
}

export interface MessageBubbleProps {
  message: MessageBubbleMessage;
}

function statusVariant(status: MessageStatus): "green" | "gray" | "amber" | "red" | "muted" {
  switch (status) {
    case "delivered": return "green";
    case "sent": return "gray";
    case "sending":
    case "queued": return "amber";
    case "failed": return "red";
    default: return "muted";
  }
}

function formatTime(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export function MessageBubble({ message }: MessageBubbleProps): React.ReactElement {
  const isOutbound = message.direction === "outbound";

  const bubbleStyle: React.CSSProperties = {
    padding: "0.6rem 0.85rem",
    fontFamily: "var(--bp-font-mono)",
    fontSize: "0.7rem",
    lineHeight: 1.5,
    borderRadius: "0.25rem",
    background: isOutbound ? "var(--bp-green)" : "var(--bp-surface)",
    color: isOutbound ? "var(--bp-bg)" : "var(--bp-text)",
    borderBottomRightRadius: isOutbound ? "0" : undefined,
    borderBottomLeftRadius: isOutbound ? undefined : "0",
  };

  const metaStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    flexDirection: isOutbound ? "row-reverse" : "row",
    fontFamily: "var(--bp-font-mono)",
    fontSize: "0.45rem",
    color: "var(--bp-text-muted)",
    letterSpacing: "0.1em",
    marginTop: "0.2rem",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.2rem",
        maxWidth: "75%",
        alignSelf: isOutbound ? "flex-end" : "flex-start",
        alignItems: isOutbound ? "flex-end" : "flex-start",
      }}
    >
      {message.body && <div style={bubbleStyle}>{message.body}</div>}

      {message.attachments.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {message.attachments.map((att) =>
            att.content_type.startsWith("image/") ? (
              <img
                key={att.id}
                src={att.file ?? att.url ?? ""}
                alt="MMS attachment"
                style={{ maxHeight: "10rem", border: "1px solid var(--bp-border)", objectFit: "contain" }}
              />
            ) : (
              <a
                key={att.id}
                href={att.file ?? att.url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: "var(--bp-font-mono)", fontSize: "0.55rem", color: "var(--bp-green)" }}
              >
                {att.content_type} file
              </a>
            )
          )}
        </div>
      )}

      <div style={metaStyle}>
        <span>{formatTime(message.sent_at ?? message.created_at)}</span>
        {isOutbound && <Badge variant={statusVariant(message.status)}>{message.status}</Badge>}
        {message.error_message && (
          <span
            style={{ color: "var(--bp-red)", maxWidth: "16rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
            title={message.error_message}
          >
            {message.error_message}
          </span>
        )}
      </div>
    </div>
  );
}
