import React, { useEffect, useRef, useState } from "react";

export interface LogStreamProps {
  projectId: string;
  apiUrl: string;
  onDone?: () => void;
}

export function LogStream({ projectId, apiUrl, onDone }: LogStreamProps): React.ReactElement {
  const [logs, setLogs] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const url = `${apiUrl}/api/projects/${projectId}/status`;
    const source = new EventSource(url);

    source.addEventListener("log", (e: MessageEvent) => {
      setLogs((prev) => [...prev, e.data as string]);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    });

    source.addEventListener("done", () => {
      setDone(true);
      source.close();
      onDone?.();
    });

    source.onerror = () => {
      setError("Connection lost. Check orchestrator logs.");
      source.close();
    };

    return () => {
      source.close();
    };
  }, [projectId, apiUrl, onDone]);

  return (
    <div
      style={{
        border: "1px solid var(--bp-border)",
        borderRadius: "var(--bp-radius)",
        background: "var(--bp-bg)",
        padding: "0.75rem 1rem",
        boxShadow: "var(--bp-shadow-inset)",
      }}
    >
      {/* Status header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "0.65rem",
          borderBottom: "1px solid var(--bp-border)",
          paddingBottom: "0.5rem",
        }}
      >
        {done ? (
          <span style={{ color: "var(--bp-green)", fontSize: "0.85rem" }}>✓</span>
        ) : (
          <span
            style={{
              display: "inline-block",
              width: "0.65rem",
              height: "0.65rem",
              border: "2px solid var(--bp-green)",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "bp-spin 0.7s linear infinite",
              flexShrink: 0,
            }}
          />
        )}
        <span
          style={{
            fontFamily: "var(--bp-font-mono)",
            fontSize: "var(--bp-text-xs)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--bp-green)",
          }}
        >
          {done ? "Provisioning complete" : "Provisioning in progress…"}
        </span>
      </div>

      {/* Log output */}
      <div
        style={{
          height: "18rem",
          overflowY: "auto",
          fontFamily: "var(--bp-font-mono)",
          fontSize: "var(--bp-text-sm)",
          lineHeight: 1.6,
        }}
      >
        {logs.map((line, i) => (
          <div key={i}>
            <span style={{ color: "var(--bp-text-dim)", userSelect: "none" }}>{">"} </span>
            <span style={{ color: "var(--bp-green)" }}>{line}</span>
          </div>
        ))}
        {error && (
          <div style={{ color: "var(--bp-red)" }}>{error}</div>
        )}
        {!done && logs.length === 0 && !error && (
          <div style={{ color: "var(--bp-text-muted)" }}>Connecting…</div>
        )}
        <div ref={bottomRef} />
      </div>

      <style>{`@keyframes bp-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
