import React from "react";

export type GridCols =
  | number
  | { sm?: number; md?: number; lg?: number; xl?: number };

export interface GridProps {
  cols?: GridCols;
  gap?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

function colsToValue(cols: number): string {
  return `repeat(${cols}, minmax(0, 1fr))`;
}

export function Grid({
  cols = 1,
  gap = "16px",
  children,
  style,
  className,
}: GridProps): React.ReactElement {
  // Responsive cols: inject a <style> block for breakpoints if object form
  const isResponsive = typeof cols === "object" && cols !== null;

  let gridTemplateColumns = "repeat(1, minmax(0, 1fr))";
  let styleTag: string | null = null;

  if (typeof cols === "number") {
    gridTemplateColumns = colsToValue(cols);
  } else if (isResponsive) {
    const responsive = cols as { sm?: number; md?: number; lg?: number; xl?: number };
    // Default (mobile): 1 column
    gridTemplateColumns = colsToValue(1);

    const uid = `bp-grid-${Math.random().toString(36).slice(2, 8)}`;
    const rules: string[] = [];
    if (responsive.sm) rules.push(`@media(min-width:640px){.${uid}{grid-template-columns:${colsToValue(responsive.sm)};}}`);
    if (responsive.md) rules.push(`@media(min-width:768px){.${uid}{grid-template-columns:${colsToValue(responsive.md)};}}`);
    if (responsive.lg) rules.push(`@media(min-width:1024px){.${uid}{grid-template-columns:${colsToValue(responsive.lg)};}}`);
    if (responsive.xl) rules.push(`@media(min-width:1280px){.${uid}{grid-template-columns:${colsToValue(responsive.xl)};}}`);

    styleTag = rules.join("");

    return (
      <>
        {styleTag && <style>{styleTag}</style>}
        <div
          className={[uid, className].filter(Boolean).join(" ")}
          style={{
            display: "grid",
            gridTemplateColumns,
            gap,
            ...style,
          }}
        >
          {children}
        </div>
      </>
    );
  }

  return (
    <div
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns,
        gap,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
