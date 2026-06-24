import React from "react";

export type SkeletonVariant = "text" | "circular" | "rectangular";

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: SkeletonVariant;
  count?: number;
  style?: React.CSSProperties;
  className?: string;
}

const KEYFRAMES = `
@keyframes bp-skeleton-pulse {
  0%   { opacity: 1; }
  50%  { opacity: 0.4; }
  100% { opacity: 1; }
}
`;

function sizeProp(v: string | number | undefined): string | undefined {
  if (v === undefined) return undefined;
  return typeof v === "number" ? `${v}px` : v;
}

function SingleSkeleton({
  width,
  height,
  variant = "text",
  style,
  className,
}: Omit<SkeletonProps, "count">): React.ReactElement {
  const w = sizeProp(width);
  const h = sizeProp(height);

  const shapeStyle: React.CSSProperties =
    variant === "circular"
      ? {
          width:        w ?? "40px",
          height:       h ?? "40px",
          borderRadius: "50%",
        }
      : variant === "rectangular"
      ? {
          width:        w ?? "100%",
          height:       h ?? "80px",
          borderRadius: "var(--bp-radius-sm)",
        }
      : /* text */
        {
          width:        w ?? "100%",
          height:       h ?? "1em",
          borderRadius: "var(--bp-radius-sm)",
        };

  return (
    <span
      className={className}
      style={{
        display: "block",
        background: "var(--bp-border)",
        animation: "bp-skeleton-pulse 1.6s ease-in-out infinite",
        ...shapeStyle,
        ...style,
      }}
      aria-hidden="true"
    />
  );
}

export function Skeleton({
  width,
  height,
  variant = "text",
  count = 1,
  style,
  className,
}: SkeletonProps): React.ReactElement {
  return (
    <>
      <style>{KEYFRAMES}</style>
      {count === 1 ? (
        <SingleSkeleton
          width={width}
          height={height}
          variant={variant}
          style={style}
          className={className}
        />
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {Array.from({ length: count }).map((_, i) => (
            <SingleSkeleton
              key={i}
              width={i === count - 1 && variant === "text" ? "70%" : width}
              height={height}
              variant={variant}
              style={style}
              className={className}
            />
          ))}
        </div>
      )}
    </>
  );
}
