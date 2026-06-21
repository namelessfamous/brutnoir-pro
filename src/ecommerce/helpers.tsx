/**
 * brutnoir-pro · E-Commerce Helpers
 * JSX helpers that can't live in types.ts.
 */

import React from "react";
import type { RenderLinkProps } from "./types";

/**
 * Default fallback render link — plain anchor tag.
 * Pass your router's Link as `renderLink` to replace this.
 */
export function defaultRenderLink({
  href,
  children,
  style,
  onClick,
  "aria-label": ariaLabel,
}: RenderLinkProps): React.ReactElement {
  return (
    <a href={href} style={style} onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>} aria-label={ariaLabel}>
      {children}
    </a>
  );
}
