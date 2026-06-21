import React, { useState, useRef, KeyboardEvent } from "react";
import { Button } from "../primitives/Button";
import { Textarea } from "../primitives/Textarea";

export interface ComposeBarProps {
  onSend: (body: string) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
}

export function ComposeBar({
  onSend,
  disabled = false,
  placeholder = "Type a message… (⌘+Enter to send)",
}: ComposeBarProps): React.ReactElement {
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const canSend = body.trim().length > 0 && !sending && !disabled;

  const handleSend = async () => {
    if (!canSend) return;
    const text = body.trim();
    setBody("");
    setSending(true);
    try {
      await onSend(text);
    } finally {
      setSending(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      void handleSend();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: "0.5rem",
        borderTop: "1px solid var(--bp-border)",
        background: "var(--bp-bg)",
        padding: "0.65rem 0.75rem",
      }}
    >
      <Textarea
        ref={textareaRef}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled || sending}
        style={{ flex: 1, minHeight: "2.5rem", resize: "none" }}
      />
      <Button
        onClick={() => void handleSend()}
        disabled={!canSend}
        loading={sending}
        size="sm"
        title="Send"
        style={{ whiteSpace: "nowrap", flexShrink: 0, alignSelf: "flex-end" }}
      >
        Send ↑
      </Button>
    </div>
  );
}
