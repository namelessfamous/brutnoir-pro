import React, { useRef, useState } from "react";

export interface FileUploadProps {
  onFiles: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  maxSize?: number;
  label?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const DefaultUploadIcon = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export function FileUpload({
  onFiles,
  multiple = false,
  accept,
  maxSize,
  label = "Drag & drop files here",
  icon,
  disabled = false,
  style,
  className,
}: FileUploadProps): React.ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const files = Array.from(fileList);

    if (maxSize) {
      const oversized = files.filter((f) => f.size > maxSize);
      if (oversized.length) {
        setError(`File too large. Max size: ${(maxSize / 1024 / 1024).toFixed(1)} MB`);
        return;
      }
    }
    setError(null);
    onFiles(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    processFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    // reset so same file can be re-selected
    e.target.value = "";
  };

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        ...style,
      }}
    >
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload area"
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (!disabled && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: isDragOver ? "2px dashed var(--bp-green)" : "2px dashed #000",
          borderRadius: "var(--bp-radius-sm)",
          background: isDragOver ? "var(--bp-green-bg)" : "var(--bp-surface)",
          padding: "40px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          transition: "border-color var(--bp-transition-fast), background var(--bp-transition-fast)",
          textAlign: "center",
          userSelect: "none",
        }}
      >
        <span
          style={{
            color: isDragOver ? "var(--bp-green)" : "var(--bp-text-muted)",
            transition: "color var(--bp-transition-fast)",
          }}
        >
          {icon ?? <DefaultUploadIcon />}
        </span>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span
            style={{
              fontSize: "var(--bp-text-base)",
              fontFamily: "var(--bp-font-body)",
              fontWeight: 500,
              color: "var(--bp-text)",
            }}
          >
            {label}
          </span>
          <span
            style={{
              fontSize: "var(--bp-text-sm)",
              fontFamily: "var(--bp-font-body)",
              color: "var(--bp-text-muted)",
            }}
          >
            or click to browse
          </span>
          {maxSize && (
            <span
              style={{
                fontSize: "var(--bp-text-xs)",
                fontFamily: "var(--bp-font-mono)",
                color: "var(--bp-text-dim)",
                marginTop: "2px",
              }}
            >
              Max {(maxSize / 1024 / 1024).toFixed(1)} MB
            </span>
          )}
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) inputRef.current?.click();
          }}
          style={{
            border: "1px solid #000",
            borderRadius: "var(--bp-radius-sm)",
            background: "var(--bp-bg)",
            color: "var(--bp-text)",
            padding: "6px 16px",
            fontSize: "var(--bp-text-xs)",
            fontFamily: "var(--bp-font-mono)",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            cursor: disabled ? "not-allowed" : "pointer",
            boxShadow: "1px 1px 0 0 #000",
            transition: "box-shadow var(--bp-transition-fast), transform var(--bp-transition-fast)",
          }}
          onMouseEnter={(e) => {
            if (!disabled) {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translate(1px,1px)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "1px 1px 0 0 #000";
            e.currentTarget.style.transform = "none";
          }}
        >
          Browse Files
        </button>
      </div>

      {error && (
        <span
          style={{
            fontSize: "var(--bp-text-xs)",
            fontFamily: "var(--bp-font-body)",
            color: "var(--bp-red)",
          }}
        >
          {error}
        </span>
      )}

      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        disabled={disabled}
        onChange={handleChange}
        style={{ display: "none" }}
        aria-hidden="true"
      />
    </div>
  );
}
