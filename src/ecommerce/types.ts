/**
 * brutnoir-pro · E-Commerce Shared Types
 * Framework-agnostic. No Next.js, no Stripe, no external deps.
 */

import React from "react";

// ── Product ───────────────────────────────────────────────────────────────────

export interface ProductVariant {
  name: string;
  description?: string;
  price?: string;
  /** Stripe price ID — consumed by the app, not the design system */
  stripePriceId?: string;
  /** Stripe product ID — consumed by the app, not the design system */
  stripeProductId?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  /** Formatted price string, e.g. "$49" or "Free" */
  price: string;
  /** Original / compare-at price for strikethrough display */
  comparePrice?: string;
  description?: string;
  imageSrc: string;
  imageAlt?: string;
  category?: string;
  brand?: string;
  variants?: ProductVariant[];
  stripeProductId?: string;
}

// ── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: string;
  title: string;
  slug: string;
  productSlug: string;
  variantName: string;
  variantDescription?: string;
  quantity: number;
  price: string;
  imageSrc?: string;
  stripePriceId?: string;
  stripeProductId?: string;
}

// ── Wishlist ──────────────────────────────────────────────────────────────────

export type WishlistItem = Pick<
  Product,
  "id" | "name" | "slug" | "price" | "imageSrc" | "imageAlt" | "category" | "description" | "variants" | "stripeProductId"
>;

// ── Recently Viewed ───────────────────────────────────────────────────────────

export interface RecentlyViewedItem {
  id: string;
  name: string;
  slug: string;
  price: string;
  imageSrc: string;
  imageAlt?: string;
  category?: string;
  viewedAt: number;
}

// ── Collection / Filters ──────────────────────────────────────────────────────

export type SortOption = "newest" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

export interface FilterConfig {
  id: string;
  label: string;
  values: string[];
}

// ── Compare ───────────────────────────────────────────────────────────────────

export interface CompareField {
  key: string;
  label: string;
  /** Custom renderer for this field. Receives the product, returns ReactNode. */
  render?: (product: Product) => React.ReactNode;
}

// ── Search ────────────────────────────────────────────────────────────────────

export interface SearchProduct {
  id: string;
  name: string;
  slug: string;
  price: string;
  description?: string;
  imageSrc?: string;
  category?: string;
}

// ── Render Props ──────────────────────────────────────────────────────────────

export interface RenderLinkProps {
  href: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  /** aria-label for the link */
  "aria-label"?: string;
}

/**
 * Render prop for framework-agnostic links.
 * Pass your router's Link component so the design system stays decoupled.
 *
 * @example
 * // Next.js
 * renderLink={({ href, children, style, onClick }) => (
 *   <Link href={href} style={style} onClick={onClick}>{children}</Link>
 * )}
 *
 * @example
 * // React Router
 * renderLink={({ href, children, style }) => (
 *   <RouterLink to={href} style={style}>{children}</RouterLink>
 * )}
 */
export type RenderLink = (props: RenderLinkProps) => React.ReactElement;


