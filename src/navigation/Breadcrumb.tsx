import React from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  /** Custom link renderer */
  LinkComponent?: React.ElementType;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  style?: React.CSSProperties;
}

export function Breadcrumb({
  items,
  separator = "/",
  style,
}: BreadcrumbProps): React.ReactElement {
  return (
    <nav aria-label="Breadcrumb" style={style}>
      <ol
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.35rem",
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          const LinkComp = item.LinkComponent ?? "a";

          return (
            <React.Fragment key={i}>
              <li style={{ display: "flex", alignItems: "center" }}>
                {item.href && !isLast ? (
                  <LinkComp
                    href={item.href}
                    style={{
                      fontFamily: "var(--bp-font-body)",
                      fontSize: "var(--bp-text-sm)",
                      color: "var(--bp-text-muted)",
                      textDecoration: "none",
                      transition: "color var(--bp-transition-fast)",
                    }}
                    onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
                      e.currentTarget.style.color = "var(--bp-text)";
                    }}
                    onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
                      e.currentTarget.style.color = "var(--bp-text-muted)";
                    }}
                  >
                    {item.label}
                  </LinkComp>
                ) : (
                  <span
                    aria-current={isLast ? "page" : undefined}
                    style={{
                      fontFamily: "var(--bp-font-body)",
                      fontSize: "var(--bp-text-sm)",
                      color: isLast ? "var(--bp-text)" : "var(--bp-text-muted)",
                      fontWeight: isLast ? "600" : "400",
                    }}
                  >
                    {item.label}
                  </span>
                )}
              </li>
              {!isLast && (
                <li
                  aria-hidden="true"
                  style={{
                    fontFamily: "var(--bp-font-mono)",
                    fontSize: "var(--bp-text-xs)",
                    color: "var(--bp-text-dim)",
                    userSelect: "none",
                  }}
                >
                  {separator}
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
