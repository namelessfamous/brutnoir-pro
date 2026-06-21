/**
 * brutnoir-pro · E-Commerce Module
 * Framework-agnostic e-commerce UI components.
 * No Next.js · No Stripe · No framer-motion · No cmdk · No @headlessui
 */

// ── Shared types ──────────────────────────────────────────────────────────────
export type {
  Product,
  ProductVariant,
  VariantOptionGroup,
  CartItem,
  WishlistItem,
  RecentlyViewedItem,
  SortOption,
  FilterConfig,
  CompareField,
  SearchProduct,
  RenderLink,
  RenderLinkProps,
} from "./types";
export { defaultRenderLink } from "./helpers";

// ── Components ────────────────────────────────────────────────────────────────
export { ProductCard } from "./ProductCard";
export type { ProductCardProps } from "./ProductCard";

export { ProductDetail } from "./ProductDetail";
export type {
  ProductDetailProps,
  ProductDetailBreadcrumb,
  ProductDetailReviews,
} from "./ProductDetail";

export { CartPopover } from "./CartPopover";
export type { CartPopoverProps } from "./CartPopover";

export { CollectionGrid } from "./CollectionGrid";
export type { CollectionGridProps } from "./CollectionGrid";

export { CompareDrawer } from "./CompareDrawer";
export type { CompareDrawerProps } from "./CompareDrawer";

export { ProductQuickview } from "./ProductQuickview";
export type { ProductQuickviewProps } from "./ProductQuickview";

export { SearchCommand } from "./SearchCommand";
export type { SearchCommandProps } from "./SearchCommand";

export { Wishlist } from "./Wishlist";
export type { WishlistProps } from "./Wishlist";

export { RecentlyViewed } from "./RecentlyViewed";
export type { RecentlyViewedProps } from "./RecentlyViewed";

export { default as SmartVariantSelector, canUseSmartSelector, DEFAULT_CLOTHING_COLORS } from "./SmartVariantSelector";
export type { SmartVariantSelectorProps } from "./SmartVariantSelector";
