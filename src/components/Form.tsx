/**
 * brutnoir-os · Form
 * Input · Select · MultiSelect · Typeahead
 */

"use client";

import {
  useState,
  type ChangeEvent,
  type CSSProperties,
} from "react";
import { colors, fonts } from "../tokens";

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputBase: CSSProperties = {
  width: "100%",
  background: colors.noir,
  color: colors.cream,
  border: `1px solid ${colors.noirBorder}`,
  fontFamily: fonts.mono,
  fontSize: 12,
  padding: "6px 10px",
  outline: "none",
  transition: "border-color 0.1s, box-shadow 0.1s",
};

const labelStyle: CSSProperties = {
  fontFamily: fonts.mono,
  fontSize: 10,
  color: colors.creamMuted,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
};

// ─── Input ────────────────────────────────────────────────────────────────────

interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  error?: string;
  disabled?: boolean;
  icon?: string;
  style?: CSSProperties;
  className?: string;
}

export function Input({
  label, placeholder, value, onChange,
  type = "text", error, disabled, icon, style, className,
}: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && <label style={labelStyle}>{label}</label>}
      <div style={{ position: "relative" }}>
        {icon && (
          <span style={{
            position: "absolute", left: 8, top: "50%",
            transform: "translateY(-50%)",
            color: colors.creamMuted, fontSize: 12,
          }}>
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={className}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            ...inputBase,
            paddingLeft: icon ? 28 : 10,
            borderColor: error ? colors.crimson : focused ? colors.acid : colors.noirBorder,
            boxShadow: focused ? `0 0 0 2px ${colors.acid}22` : "none",
            opacity: disabled ? 0.4 : 1,
            cursor: disabled ? "not-allowed" : "text",
            ...style,
          }}
        />
      </div>
      {error && (
        <span style={{ fontFamily: fonts.mono, fontSize: 10, color: colors.crimson }}>
          {error}
        </span>
      )}
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  options: (SelectOption | string)[];
  value?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  style?: CSSProperties;
  className?: string;
}

export function Select({ label, options, value, onChange, placeholder, style, className }: SelectProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && <label style={labelStyle}>{label}</label>}
      <select
        value={value}
        onChange={onChange}
        className={className}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...inputBase,
          borderColor: focused ? colors.acid : colors.noirBorder,
          boxShadow: focused ? `0 0 0 2px ${colors.acid}22` : "none",
          appearance: "none",
          // Custom chevron using inline SVG
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23c8f53c'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 10px center",
          paddingRight: 28,
          ...style,
        }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => {
          const v = typeof opt === "string" ? opt : opt.value;
          const l = typeof opt === "string" ? opt : opt.label;
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
    </div>
  );
}

// ─── MultiSelect ──────────────────────────────────────────────────────────────

interface MultiSelectProps {
  label?: string;
  options: (SelectOption | string)[];
  value?: string[];
  onChange?: (value: string[]) => void;
  style?: CSSProperties;
}

export function MultiSelect({ label, options, value = [], onChange, style }: MultiSelectProps) {
  const toggle = (v: string) => {
    const next = value.includes(v) ? value.filter((x) => x !== v) : [...value, v];
    onChange?.(next);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, ...style }}>
      {label && <label style={labelStyle}>{label}</label>}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 4,
        padding: 6,
        background: colors.noir,
        border: `1px solid ${colors.noirBorder}`,
        minHeight: 36,
      }}>
        {options.map((opt) => {
          const v = typeof opt === "string" ? opt : opt.value;
          const l = typeof opt === "string" ? opt : opt.label;
          const selected = value.includes(v);
          return (
            <button
              key={v}
              type="button"
              onClick={() => toggle(v)}
              style={{
                background: selected ? colors.acid : colors.noirSurface,
                color: selected ? colors.noir : colors.creamMuted,
                border: `1px solid ${selected ? colors.acid : colors.noirBorder}`,
                fontFamily: fonts.mono,
                fontSize: 10,
                padding: "2px 8px",
                cursor: "pointer",
                transition: "all 0.1s",
                letterSpacing: "0.04em",
              }}
            >
              {l}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Typeahead ────────────────────────────────────────────────────────────────

interface TypeaheadProps {
  label?: string;
  options: (SelectOption | string)[];
  value?: string;
  onChange?: (option: SelectOption | string) => void;
  placeholder?: string;
  style?: CSSProperties;
}

export function Typeahead({ label, options, value, onChange, placeholder, style }: TypeaheadProps) {
  const [query, setQuery] = useState(value ?? "");
  const [open, setOpen] = useState(false);

  const filtered = options.filter((opt) => {
    const l = typeof opt === "string" ? opt : opt.label;
    return l.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 4, ...style }}>
      {label && <label style={labelStyle}>{label}</label>}
      <input
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
        style={{ ...inputBase }}
      />
      {open && filtered.length > 0 && (
        <div style={{
          position: "absolute",
          top: label ? "calc(100% - 2px)" : "calc(100% + 2px)",
          left: 0,
          right: 0,
          zIndex: 100,
          background: colors.noirMid,
          border: `1px solid ${colors.noirBorder}`,
          boxShadow: `3px 3px 0px ${colors.acid}`,
          maxHeight: 160,
          overflow: "auto",
          animation: "nf-slideDown 0.1s ease",
        }}>
          {filtered.map((opt, i) => {
            const l = typeof opt === "string" ? opt : opt.label;
            return (
              <button
                key={i}
                type="button"
                onMouseDown={() => {
                  setQuery(l);
                  onChange?.(opt);
                  setOpen(false);
                }}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  background: "transparent",
                  border: "none",
                  color: colors.cream,
                  padding: "6px 10px",
                  fontFamily: fonts.mono,
                  fontSize: 12,
                  cursor: "pointer",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = `${colors.acid}22`)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {l}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
