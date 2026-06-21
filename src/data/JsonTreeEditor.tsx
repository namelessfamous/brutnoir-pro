"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonArray;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];

type PrimitiveType = "string" | "number" | "boolean" | "null";

function getType(v: JsonValue): string {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  return typeof v;
}

function typeChipLabel(v: JsonValue): string {
  const t = getType(v);
  switch (t) {
    case "string": return "str";
    case "number": return "num";
    case "boolean": return "bool";
    case "null": return "null";
    case "object": return "{}";
    case "array": return "[]";
    default: return t;
  }
}

function coerceTo(v: JsonValue, toType: PrimitiveType): JsonPrimitive {
  switch (toType) {
    case "string":
      if (v === null) return "";
      if (typeof v === "object") return JSON.stringify(v);
      return String(v);
    case "number": {
      const n = Number(v);
      return isNaN(n) ? 0 : n;
    }
    case "boolean":
      if (typeof v === "string") return v === "true" || v === "1";
      return Boolean(v);
    case "null":
      return null;
  }
}

// ─── Shared style tokens ──────────────────────────────────────────────────────

const FONT = "var(--bp-font-mono)";
const FS = "0.78rem";
const FS_SM = "0.68rem";

const chipStyle: React.CSSProperties = {
  fontFamily: FONT,
  fontSize: "0.62rem",
  letterSpacing: "0.04em",
  color: "var(--bp-text-dim)",
  background: "var(--bp-surface)",
  border: "1px solid var(--bp-border)",
  borderRadius: "2px",
  padding: "0 4px",
  lineHeight: "1.5",
  userSelect: "none",
  flexShrink: 0,
};

const iconBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontFamily: FONT,
  fontSize: FS_SM,
  padding: "0 3px",
  lineHeight: 1,
  color: "var(--bp-text-dim)",
};

const addBtnStyle: React.CSSProperties = {
  background: "none",
  border: "1px solid var(--bp-border)",
  borderRadius: "2px",
  cursor: "pointer",
  fontFamily: FONT,
  fontSize: "0.65rem",
  padding: "1px 6px",
  lineHeight: "1.6",
  color: "var(--bp-green)",
  letterSpacing: "0.04em",
};

const inlineInputStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  borderBottom: "1px solid var(--bp-border)",
  color: "var(--bp-text)",
  fontFamily: FONT,
  fontSize: FS,
  outline: "none",
  padding: "0 2px",
  minWidth: "4ch",
  maxWidth: "100%",
};

// ─── Immutable path helpers ───────────────────────────────────────────────────

function setIn(obj: JsonObject, path: (string | number)[], value: JsonValue): JsonObject {
  if (path.length === 0) return obj;
  const [head, ...tail] = path;
  if (tail.length === 0) {
    if (Array.isArray(obj)) {
      const arr = [...(obj as JsonArray)];
      arr[head as number] = value;
      return arr as unknown as JsonObject;
    }
    return { ...obj, [head]: value };
  }
  if (Array.isArray(obj)) {
    const arr = [...(obj as JsonArray)];
    arr[head as number] = setIn(arr[head as number] as JsonObject, tail, value);
    return arr as unknown as JsonObject;
  }
  return {
    ...obj,
    [head]: setIn((obj[head as string] ?? {}) as JsonObject, tail, value),
  };
}

function deleteIn(obj: JsonObject, path: (string | number)[]): JsonObject {
  if (path.length === 0) return obj;
  const [head, ...tail] = path;
  if (tail.length === 0) {
    if (Array.isArray(obj)) {
      const arr = [...(obj as JsonArray)];
      arr.splice(head as number, 1);
      return arr as unknown as JsonObject;
    }
    const copy = { ...obj };
    delete copy[head as string];
    return copy;
  }
  if (Array.isArray(obj)) {
    const arr = [...(obj as JsonArray)];
    arr[head as number] = deleteIn(arr[head as number] as JsonObject, tail);
    return arr as unknown as JsonObject;
  }
  return {
    ...obj,
    [head]: deleteIn((obj[head as string] ?? {}) as JsonObject, tail),
  };
}

function renameKey(obj: JsonObject, path: (string | number)[], oldKey: string, newKey: string): JsonObject {
  if (path.length === 0) {
    const entries = Object.entries(obj).map(([k, v]) => [k === oldKey ? newKey : k, v]);
    return Object.fromEntries(entries);
  }
  const [head, ...tail] = path;
  if (Array.isArray(obj)) {
    const arr = [...(obj as JsonArray)];
    arr[head as number] = renameKey(arr[head as number] as JsonObject, tail, oldKey, newKey);
    return arr as unknown as JsonObject;
  }
  return {
    ...obj,
    [head]: renameKey((obj[head as string] ?? {}) as JsonObject, tail, oldKey, newKey),
  };
}

// ─── PrimitiveEditor ─────────────────────────────────────────────────────────

function PrimitiveEditor({
  value,
  onChange,
  readOnly,
}: {
  value: JsonPrimitive;
  onChange: (v: JsonPrimitive) => void;
  readOnly?: boolean;
}) {
  const [focused, setFocused] = useState(false);

  const focusedInput: React.CSSProperties = {
    ...inlineInputStyle,
    borderBottomColor: focused ? "var(--bp-green)" : "var(--bp-border)",
    width: typeof value === "string" ? `${Math.max(6, value.length + 1)}ch` : "8ch",
  };

  if (value === null) {
    return (
      <span style={{ fontFamily: FONT, fontSize: FS, color: "var(--bp-text-dim)", fontStyle: "italic" }}>
        null
      </span>
    );
  }

  if (typeof value === "boolean") {
    if (readOnly) {
      return (
        <span style={{ fontFamily: FONT, fontSize: FS, color: "var(--bp-green)" }}>
          {String(value)}
        </span>
      );
    }
    return (
      <select
        value={String(value)}
        onChange={(e) => onChange(e.target.value === "true")}
        style={{
          background: "var(--bp-surface)",
          border: "1px solid var(--bp-border)",
          borderRadius: "2px",
          color: "var(--bp-green)",
          fontFamily: FONT,
          fontSize: FS,
          padding: "0 4px",
          outline: "none",
          cursor: "pointer",
        }}
      >
        <option value="true">true</option>
        <option value="false">false</option>
      </select>
    );
  }

  if (typeof value === "number") {
    return (
      <input
        type="number"
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange(Number(e.target.value))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ ...focusedInput, color: "var(--bp-warning)", width: "10ch" }}
      />
    );
  }

  // string
  return (
    <input
      type="text"
      value={value as string}
      readOnly={readOnly}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{ ...focusedInput, color: "var(--bp-text)" }}
    />
  );
}

// ─── TypeSwitch ───────────────────────────────────────────────────────────────

function TypeSwitch({
  value,
  onChange,
}: {
  value: JsonValue;
  onChange: (v: JsonValue) => void;
}) {
  const t = getType(value);
  if (t === "object" || t === "array") return null;

  return (
    <select
      value={t}
      onChange={(e) => {
        const newType = e.target.value as PrimitiveType;
        onChange(coerceTo(value as JsonPrimitive, newType));
      }}
      title="Change type"
      style={{
        background: "var(--bp-bg)",
        border: "1px solid var(--bp-border)",
        borderRadius: "2px",
        color: "var(--bp-text-dim)",
        fontFamily: FONT,
        fontSize: "0.62rem",
        padding: "0 3px",
        outline: "none",
        cursor: "pointer",
        marginLeft: "3px",
      }}
    >
      <option value="string">str</option>
      <option value="number">num</option>
      <option value="boolean">bool</option>
      <option value="null">null</option>
    </select>
  );
}

// ─── JsonNode ─────────────────────────────────────────────────────────────────

function JsonNode({
  nodeKey,
  value,
  path,
  depth,
  onRootChange,
  readOnly,
}: {
  nodeKey: string | number;
  value: JsonValue;
  path: (string | number)[];
  depth: number;
  onRootChange: (updater: (root: JsonObject) => JsonObject) => void;
  readOnly?: boolean;
  isLast?: boolean;
}) {
  const [expanded, setExpanded] = useState(depth < 2);
  const [editingKey, setEditingKey] = useState(false);
  const [keyDraft, setKeyDraft] = useState(String(nodeKey));
  const [addingKey, setAddingKey] = useState(false);
  const [newKeyDraft, setNewKeyDraft] = useState("");
  const [hovered, setHovered] = useState(false);
  const keyInputRef = useRef<HTMLInputElement>(null);
  const newKeyInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingKey && keyInputRef.current) keyInputRef.current.focus();
  }, [editingKey]);

  useEffect(() => {
    if (addingKey && newKeyInputRef.current) newKeyInputRef.current.focus();
  }, [addingKey]);

  const isObject = typeof value === "object" && value !== null && !Array.isArray(value);
  const isArray = Array.isArray(value);
  const isExpandable = isObject || isArray;

  const handleValueChange = useCallback(
    (newVal: JsonValue) => {
      onRootChange((root) => setIn(root, path, newVal));
    },
    [onRootChange, path]
  );

  const handleDelete = () => {
    onRootChange((root) => deleteIn(root, path));
  };

  const handleKeyRename = () => {
    if (!editingKey) return;
    const newKey = keyDraft.trim();
    if (!newKey || newKey === String(nodeKey)) {
      setEditingKey(false);
      setKeyDraft(String(nodeKey));
      return;
    }
    const parentPath = path.slice(0, -1);
    onRootChange((root) => renameKey(root, parentPath, String(nodeKey), newKey));
    setEditingKey(false);
  };

  const handleAddKey = () => {
    const key = newKeyDraft.trim() || `key${Object.keys(value as JsonObject).length}`;
    onRootChange((root) => setIn(root, [...path, key], ""));
    setNewKeyDraft("");
    setAddingKey(false);
  };

  const handleAddItem = () => {
    const arr = value as JsonArray;
    onRootChange((root) => setIn(root, [...path, arr.length], ""));
  };

  const handleTypeChange = (newVal: JsonValue) => {
    onRootChange((root) => setIn(root, path, newVal));
  };

  // ── Collapsed summary
  const collapsedSummary = isObject
    ? `{ ${Object.keys(value as JsonObject).length} key${Object.keys(value as JsonObject).length !== 1 ? "s" : ""} }`
    : isArray
    ? `[ ${(value as JsonArray).length} item${(value as JsonArray).length !== 1 ? "s" : ""} ]`
    : "";

  const rowPad = "0.35rem 0";
  const indentBorderColor = "var(--bp-border)";

  return (
    <div style={{ position: "relative" }}>
      {/* Row */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.35rem",
          padding: rowPad,
          background: hovered && !readOnly ? "var(--bp-surface)" : "transparent",
          borderRadius: "2px",
          minHeight: "1.8rem",
        }}
      >
        {/* Expand toggle */}
        {isExpandable ? (
          <button
            onClick={() => setExpanded((p) => !p)}
            style={{
              ...iconBtnStyle,
              color: "var(--bp-green)",
              fontSize: "0.65rem",
              width: "1rem",
              textAlign: "center",
              flexShrink: 0,
            }}
          >
            {expanded ? "▼" : "▶"}
          </button>
        ) : (
          <span style={{ width: "1rem", flexShrink: 0 }} />
        )}

        {/* Key label */}
        {typeof nodeKey === "number" ? (
          <span
            style={{
              fontFamily: FONT,
              fontSize: FS_SM,
              color: "var(--bp-text-dim)",
              flexShrink: 0,
              minWidth: "1.5ch",
              textAlign: "right",
            }}
          >
            {nodeKey}
          </span>
        ) : editingKey && !readOnly ? (
          <input
            ref={keyInputRef}
            value={keyDraft}
            onChange={(e) => setKeyDraft(e.target.value)}
            onBlur={handleKeyRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleKeyRename();
              if (e.key === "Escape") { setEditingKey(false); setKeyDraft(String(nodeKey)); }
            }}
            style={{
              ...inlineInputStyle,
              borderBottomColor: "var(--bp-green)",
              color: "var(--bp-text-muted)",
              width: `${Math.max(4, keyDraft.length + 1)}ch`,
            }}
          />
        ) : (
          <span
            onClick={() => !readOnly && setEditingKey(true)}
            title={readOnly ? undefined : "Click to rename key"}
            style={{
              fontFamily: FONT,
              fontSize: FS,
              color: "var(--bp-text-muted)",
              flexShrink: 0,
              cursor: readOnly ? "default" : "text",
              borderBottom: !readOnly && hovered ? "1px dashed var(--bp-border)" : "1px solid transparent",
            }}
          >
            {nodeKey}
          </span>
        )}

        <span style={{ color: "var(--bp-border)", fontFamily: FONT, fontSize: FS, flexShrink: 0 }}>:</span>

        {/* Value or collapsed summary */}
        {isExpandable ? (
          expanded ? (
            <span style={{ ...chipStyle }}>{typeChipLabel(value)}</span>
          ) : (
            <span
              onClick={() => setExpanded(true)}
              style={{
                fontFamily: FONT,
                fontSize: FS_SM,
                color: "var(--bp-text-dim)",
                cursor: "pointer",
                fontStyle: "italic",
              }}
            >
              {collapsedSummary}
            </span>
          )
        ) : (
          <>
            <PrimitiveEditor
              value={value as JsonPrimitive}
              onChange={handleValueChange}
              readOnly={readOnly}
            />
            {!readOnly && (
              <TypeSwitch value={value} onChange={handleTypeChange} />
            )}
            <span style={chipStyle}>{typeChipLabel(value)}</span>
          </>
        )}

        {/* Actions (hover) */}
        {!readOnly && hovered && depth > 0 && (
          <button
            onClick={handleDelete}
            title="Remove"
            style={{ ...iconBtnStyle, color: "var(--bp-red)", marginLeft: "auto" }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Children */}
      {isExpandable && expanded && (
        <div
          style={{
            marginLeft: "1.5rem",
            paddingLeft: "0.75rem",
            borderLeft: `2px solid ${indentBorderColor}`,
          }}
        >
          {isObject &&
            Object.entries(value as JsonObject).map(([k, v], i, arr) => (
              <JsonNode
                key={k}
                nodeKey={k}
                value={v}
                path={[...path, k]}
                depth={depth + 1}
                onRootChange={onRootChange}
                readOnly={readOnly}
                isLast={i === arr.length - 1}
              />
            ))}

          {isArray &&
            (value as JsonArray).map((v, i) => (
              <JsonNode
                key={i}
                nodeKey={i}
                value={v}
                path={[...path, i]}
                depth={depth + 1}
                onRootChange={onRootChange}
                readOnly={readOnly}
                isLast={i === (value as JsonArray).length - 1}
              />
            ))}

          {/* Empty state */}
          {isObject && Object.keys(value as JsonObject).length === 0 && (
            <div style={{ fontFamily: FONT, fontSize: FS_SM, color: "var(--bp-text-dim)", padding: "0.25rem 0", fontStyle: "italic" }}>
              empty object
            </div>
          )}
          {isArray && (value as JsonArray).length === 0 && (
            <div style={{ fontFamily: FONT, fontSize: FS_SM, color: "var(--bp-text-dim)", padding: "0.25rem 0", fontStyle: "italic" }}>
              empty array
            </div>
          )}

          {/* Add key / Add item */}
          {!readOnly && isObject && (
            <div style={{ padding: "0.35rem 0" }}>
              {addingKey ? (
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <span style={{ width: "1rem" }} />
                  <input
                    ref={newKeyInputRef}
                    placeholder="key name"
                    value={newKeyDraft}
                    onChange={(e) => setNewKeyDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddKey();
                      if (e.key === "Escape") { setAddingKey(false); setNewKeyDraft(""); }
                    }}
                    onBlur={handleAddKey}
                    style={{
                      ...inlineInputStyle,
                      borderBottomColor: "var(--bp-green)",
                      width: "12ch",
                    }}
                  />
                  <span style={{ fontFamily: FONT, fontSize: FS_SM, color: "var(--bp-text-dim)" }}>→ &quot;&quot;</span>
                </div>
              ) : (
                <button onClick={() => setAddingKey(true)} style={addBtnStyle}>
                  + key
                </button>
              )}
            </div>
          )}

          {!readOnly && isArray && (
            <div style={{ padding: "0.35rem 0" }}>
              <button onClick={handleAddItem} style={addBtnStyle}>
                + item
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── JsonTreeEditor ───────────────────────────────────────────────────────────

export interface JsonTreeEditorProps {
  value: Record<string, unknown>;
  onChange: (v: Record<string, unknown>) => void;
  readOnly?: boolean;
}

export function JsonTreeEditor({ value, onChange, readOnly }: JsonTreeEditorProps) {
  const [rawMode, setRawMode] = useState(false);
  const [rawText, setRawText] = useState(() => JSON.stringify(value, null, 2));
  const [rawError, setRawError] = useState<string | null>(null);
  const [rawFocused, setRawFocused] = useState(false);

  // Sync rawText when switching to raw mode
  const enterRaw = () => {
    setRawText(JSON.stringify(value, null, 2));
    setRawError(null);
    setRawMode(true);
  };

  const exitRaw = () => {
    try {
      const parsed = JSON.parse(rawText);
      if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
        setRawError("Root must be a JSON object { }");
        return;
      }
      setRawError(null);
      onChange(parsed as Record<string, unknown>);
      setRawMode(false);
    } catch {
      setRawError("Invalid JSON — fix before switching back");
    }
  };

  const handleRawChange = (text: string) => {
    setRawText(text);
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
        setRawError("Root must be a JSON object { }");
        return;
      }
      setRawError(null);
      onChange(parsed as Record<string, unknown>);
    } catch {
      setRawError("Invalid JSON");
    }
  };

  const handleRootChange = useCallback(
    (updater: (root: JsonObject) => JsonObject) => {
      const next = updater(value as JsonObject);
      onChange(next as Record<string, unknown>);
    },
    [value, onChange]
  );

  const [addingRootKey, setAddingRootKey] = useState(false);
  const [rootKeyDraft, setRootKeyDraft] = useState("");
  const rootKeyInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (addingRootKey && rootKeyInputRef.current) rootKeyInputRef.current.focus();
  }, [addingRootKey]);

  const handleAddRootKey = () => {
    const key = rootKeyDraft.trim() || `key${Object.keys(value).length}`;
    onChange({ ...value, [key]: "" });
    setRootKeyDraft("");
    setAddingRootKey(false);
  };

  return (
    <div
      style={{
        background: "var(--bp-bg)",
        border: "1px solid var(--bp-border)",
        borderRadius: "2px",
        overflow: "hidden",
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.4rem 0.75rem",
          borderBottom: "1px solid var(--bp-border)",
          background: "var(--bp-surface)",
        }}
      >
        <span
          style={{
            fontFamily: FONT,
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--bp-text-dim)",
          }}
        >
          {rawMode ? "raw json" : `json — ${Object.keys(value).length} key${Object.keys(value).length !== 1 ? "s" : ""}`}
        </span>

        <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
          {!readOnly && !rawMode && (
            <button
              onClick={() => setAddingRootKey(true)}
              style={addBtnStyle}
              title="Add a top-level key"
            >
              + key
            </button>
          )}
          <button
            onClick={rawMode ? exitRaw : enterRaw}
            style={{
              ...addBtnStyle,
              color: rawMode ? "var(--bp-green)" : "var(--bp-text-dim)",
              borderColor: rawMode ? "var(--bp-green)" : "var(--bp-border)",
            }}
            title={rawMode ? "Switch back to tree view" : "Edit raw JSON"}
          >
            {rawMode ? "← tree" : "⌗ raw"}
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "0.5rem 0.75rem" }}>
        {rawMode ? (
          <>
            <textarea
              value={rawText}
              readOnly={readOnly}
              onChange={(e) => handleRawChange(e.target.value)}
              onFocus={() => setRawFocused(true)}
              onBlur={() => setRawFocused(false)}
              spellCheck={false}
              rows={14}
              style={{
                width: "100%",
                background: "var(--bp-surface)",
                border: `1px solid ${rawError ? "var(--bp-red)" : rawFocused ? "var(--bp-green)" : "var(--bp-border)"}`,
                borderRadius: "2px",
                color: "var(--bp-text)",
                fontFamily: FONT,
                fontSize: "0.78rem",
                lineHeight: 1.6,
                resize: "vertical",
                outline: "none",
                padding: "0.65rem 0.75rem",
                boxSizing: "border-box",
                transition: "border-color 0.15s",
              }}
            />
            {rawError && (
              <div style={{ color: "var(--bp-red)", fontFamily: FONT, fontSize: FS_SM, marginTop: "0.25rem" }}>
                {rawError}
              </div>
            )}
          </>
        ) : (
          <>
            {Object.keys(value).length === 0 && !addingRootKey ? (
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: FS_SM,
                  color: "var(--bp-text-dim)",
                  fontStyle: "italic",
                  padding: "0.5rem 0",
                }}
              >
                empty — click &quot;+ key&quot; to add a field
              </div>
            ) : (
              Object.entries(value).map(([k, v]) => (
                <JsonNode
                  key={k}
                  nodeKey={k}
                  value={v as JsonValue}
                  path={[k]}
                  depth={1}
                  onRootChange={handleRootChange}
                  readOnly={readOnly}
                />
              ))
            )}

            {/* Inline root key adder */}
            {!readOnly && addingRootKey && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.35rem 0" }}>
                <span style={{ width: "1rem" }} />
                <input
                  ref={rootKeyInputRef}
                  placeholder="key name"
                  value={rootKeyDraft}
                  onChange={(e) => setRootKeyDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddRootKey();
                    if (e.key === "Escape") { setAddingRootKey(false); setRootKeyDraft(""); }
                  }}
                  onBlur={handleAddRootKey}
                  style={{
                    ...inlineInputStyle,
                    borderBottomColor: "var(--bp-green)",
                    width: "14ch",
                  }}
                />
                <span style={{ fontFamily: FONT, fontSize: FS_SM, color: "var(--bp-text-dim)" }}>→ &quot;&quot;</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
