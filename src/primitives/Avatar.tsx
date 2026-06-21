import React from "react";

export interface AvatarProps {
  /** Display name — used for initials fallback */
  name?: string;
  /** Image src URL */
  src?: string;
  /** Alternative text for the image */
  alt?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Optional status indicator */
  status?: "online" | "offline" | "away" | "busy";
  style?: React.CSSProperties;
  className?: string;
}

const sizeMap: Record<string, { width: string; height: string; fontSize: string }> = {
  xs: { width: "1.5rem",  height: "1.5rem",  fontSize: "var(--bp-text-xs)" },
  sm: { width: "2rem",    height: "2rem",     fontSize: "var(--bp-text-xs)" },
  md: { width: "2.5rem",  height: "2.5rem",   fontSize: "var(--bp-text-sm)" },
  lg: { width: "3rem",    height: "3rem",     fontSize: "var(--bp-text-base)" },
  xl: { width: "4rem",    height: "4rem",     fontSize: "var(--bp-text-md)" },
};

const statusColors: Record<string, string> = {
  online:  "#A3DA08",
  offline: "#727272",
  away:    "#E2B51D",
  busy:    "#F1300E",
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function getColorFromName(name: string): string {
  const colors = [
    "#4a8fc8", "#A78BFA", "#FB923C", "#F472B6",
    "#22D3EE", "#8C738B", "#A3DA08", "#E2B51D",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function Avatar({
  name,
  src,
  alt,
  size = "md",
  status,
  style,
  className,
}: AvatarProps): React.ReactElement {
  const dims = sizeMap[size];
  const initials = name ? getInitials(name) : "?";
  const bgColor = name ? getColorFromName(name) : "var(--bp-border)";

  const containerStyle: React.CSSProperties = {
    position: "relative",
    display: "inline-flex",
    flexShrink: 0,
    width: dims.width,
    height: dims.height,
  };

  const avatarStyle: React.CSSProperties = {
    width: dims.width,
    height: dims.height,
    borderRadius: "50%",
    background: bgColor,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--bp-font-body)",
    fontSize: dims.fontSize,
    fontWeight: "600",
    color: "#ffffff",
    overflow: "hidden",
    flexShrink: 0,
    border: "1px solid var(--bp-border)",
    ...style,
  };

  const statusDotSize = size === "xs" || size === "sm" ? "0.5rem" : "0.65rem";

  return (
    <div style={containerStyle} className={className}>
      <div style={avatarStyle}>
        {src ? (
          <img
            src={src}
            alt={alt ?? name ?? "avatar"}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <span aria-label={name}>{initials}</span>
        )}
      </div>
      {status && (
        <span
          aria-label={`Status: ${status}`}
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: statusDotSize,
            height: statusDotSize,
            borderRadius: "50%",
            background: statusColors[status],
            border: "2px solid var(--bp-bg)",
          }}
        />
      )}
    </div>
  );
}
