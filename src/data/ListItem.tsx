import React from "react";

export interface ListItemProps {
  /** Primary text / title */
  title: React.ReactNode;
  /** Secondary text / description */
  description?: React.ReactNode;
  /** Leading avatar or icon */
  avatar?: React.ReactNode;
  /** Trailing actions (buttons, badges, etc.) */
  actions?: React.ReactNode;
  /** Optional metadata line (e.g. timestamp, tag) */
  meta?: React.ReactNode;
  /** Highlight the item as unread/active */
  unread?: boolean;
  /** Make the whole item clickable */
  onClick?: () => void;
  /** Add a bottom border separator */
  bordered?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function ListItem({
  title,
  description,
  avatar,
  actions,
  meta,
  unread = false,
  onClick,
  bordered = true,
  style,
  className,
}: ListItemProps): React.ReactElement {
  const clickable = Boolean(onClick);

  return (
    <>
      <style>{`
        .bp-list-item {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 0.75rem;
          padding: 0.625rem 1rem;
          font-family: var(--bp-font-body);
          font-size: var(--bp-text-sm);
          color: var(--bp-text);
          background: transparent;
          transition: background var(--bp-transition-fast);
        }
        .bp-list-item--bordered {
          border-bottom: 1px solid var(--bp-border);
        }
        .bp-list-item--clickable {
          cursor: pointer;
        }
        .bp-list-item--clickable:hover {
          background: var(--bp-bg);
        }
        .bp-list-item--unread {
          background: color-mix(in srgb, var(--bp-green-bg) 60%, transparent);
        }
        .bp-list-item--unread:hover {
          background: color-mix(in srgb, var(--bp-green-bg) 80%, transparent);
        }
        .bp-list-item__avatar {
          flex-shrink: 0;
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 50%;
          border: 1px solid #000;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bp-bg);
          font-size: 1rem;
        }
        .bp-list-item__avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .bp-list-item__body {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .bp-list-item__title {
          font-weight: 600;
          color: var(--bp-text);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .bp-list-item__description {
          color: var(--bp-text-muted);
          font-size: var(--bp-text-xs);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .bp-list-item__meta {
          color: var(--bp-text-dim);
          font-size: var(--bp-text-xs);
        }
        .bp-list-item__actions {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
      `}</style>
      <div
        className={[
          "bp-list-item",
          bordered ? "bp-list-item--bordered" : "",
          clickable ? "bp-list-item--clickable" : "",
          unread ? "bp-list-item--unread" : "",
          className ?? "",
        ].filter(Boolean).join(" ")}
        style={style}
        onClick={onClick}
        role={clickable ? "button" : undefined}
        tabIndex={clickable ? 0 : undefined}
        onKeyDown={clickable ? (e) => {
          if (e.key === "Enter" || e.key === " ") onClick?.();
        } : undefined}
      >
        {avatar && (
          <div className="bp-list-item__avatar">
            {typeof avatar === "string"
              ? <img src={avatar} alt="" />
              : avatar}
          </div>
        )}
        <div className="bp-list-item__body">
          <div className="bp-list-item__title">{title}</div>
          {description && <div className="bp-list-item__description">{description}</div>}
          {meta && <div className="bp-list-item__meta">{meta}</div>}
        </div>
        {actions && <div className="bp-list-item__actions">{actions}</div>}
      </div>
    </>
  );
}

// ── ListGroup convenience wrapper ─────────────────────────────────────────────

export interface ListGroupProps {
  children: React.ReactNode;
  /** Outer border + shadow card style */
  card?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function ListGroup({
  children,
  card = false,
  style,
  className,
}: ListGroupProps): React.ReactElement {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        ...(card ? {
          border: "2px solid #000",
          borderRadius: "var(--bp-radius)",
          boxShadow: "4px 4px 0 0 #000",
          overflow: "hidden",
          background: "var(--bp-surface)",
        } : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
}
