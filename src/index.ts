/**
 * brutnoir-pro v0.4
 * Enterprise Dark Admin Design System · Nameless Famous
 * Win95/Brutalist aesthetic — dark, bold, structured.
 */

// ── Tokens ────────────────────────────────────────────────────────────────────
export { darkTheme, lightTheme, tokens, palette } from "./tokens";
export type { ColorKey, FontKey, SpaceKey, TextSizeKey, RadiusKey, ZKey } from "./tokens";

// ── Global Styles ─────────────────────────────────────────────────────────────
export { GlobalStyles, darkThemeCss, lightThemeCss } from "./tokens/GlobalStyles";

// ── Hooks ─────────────────────────────────────────────────────────────────────
export { useTheme, ThemeProvider } from "./hooks/useTheme";

// ── Primitives ────────────────────────────────────────────────────────────────
export { Checkbox } from "./primitives/Checkbox";
export type { CheckboxProps } from "./primitives/Checkbox";

export { Radio } from "./primitives/Radio";
export type { RadioProps, RadioOption } from "./primitives/Radio";

export { Switch } from "./primitives/Switch";
export type { SwitchProps } from "./primitives/Switch";

export { Range } from "./primitives/Range";
export type { RangeProps } from "./primitives/Range";

export { Button } from "./primitives/Button";
export type { ButtonProps } from "./primitives/Button";

export { Input } from "./primitives/Input";
export type { InputProps } from "./primitives/Input";

export { Textarea } from "./primitives/Textarea";
export type { TextareaProps } from "./primitives/Textarea";

export { Select } from "./primitives/Select";
export type { SelectProps } from "./primitives/Select";

export { Badge } from "./primitives/Badge";
export type { BadgeProps } from "./primitives/Badge";

export { Chip } from "./primitives/Chip";
export type { ChipProps } from "./primitives/Chip";

export { Avatar } from "./primitives/Avatar";
export type { AvatarProps } from "./primitives/Avatar";

export { Tooltip } from "./primitives/Tooltip";
export type { TooltipProps } from "./primitives/Tooltip";

export { ThemeToggle } from "./primitives/ThemeToggle";

export { SegmentedControl } from "./primitives/SegmentedControl";
export type { SegmentedControlProps, SegmentedControlOption } from "./primitives/SegmentedControl";

export { FileUpload } from "./primitives/FileUpload";
export type { FileUploadProps } from "./primitives/FileUpload";

export { InputGroup } from "./primitives/InputGroup";
export type { InputGroupProps } from "./primitives/InputGroup";

export { NfSvgIcon, COLOR_VAR, makeIcon } from "./primitives/NfSvgIcon";
export type { NfSvgIconProps, NfIconColor } from "./primitives/NfSvgIcon";

// ── Layout ────────────────────────────────────────────────────────────────────
export { Accordion } from "./layout/Accordion";
export type { AccordionProps, AccordionItem } from "./layout/Accordion";

export { Drawer } from "./layout/Drawer";
export type { DrawerProps, DrawerPlacement } from "./layout/Drawer";

export { AdminLayout, NavItem } from "./layout/AdminLayout";
export type { AdminLayoutProps, NavItemProps } from "./layout/AdminLayout";

export { Sidebar } from "./layout/Sidebar";
export type { SidebarProps, SidebarItem, SidebarGroup } from "./layout/Sidebar";

export { PageHeader } from "./layout/PageHeader";
export type { PageHeaderProps } from "./layout/PageHeader";

export { Card } from "./layout/Card";
export type { CardProps } from "./layout/Card";

export { AppBar, Header } from "./layout/AppBar";
export type { AppBarProps, HeaderProps } from "./layout/AppBar";

export { Divider } from "./layout/Divider";
export type { DividerProps } from "./layout/Divider";

export { StatCard } from "./layout/StatCard";
export type { StatCardProps, StatCardTrend } from "./layout/StatCard";

export { Grid } from "./layout/Grid";
export type { GridProps, GridCols } from "./layout/Grid";

export { Section } from "./layout/Section";
export type { SectionProps } from "./layout/Section";

// ── Feedback ──────────────────────────────────────────────────────────────────
export { Alert } from "./feedback/Alert";
export type { AlertProps, AlertVariant } from "./feedback/Alert";

export { Progress } from "./feedback/Progress";
export type { ProgressProps, ProgressVariant } from "./feedback/Progress";

export { Modal } from "./feedback/Modal";
export type { ModalProps } from "./feedback/Modal";

export { ConfirmRow } from "./feedback/ConfirmRow";
export type { ConfirmRowProps } from "./feedback/ConfirmRow";

export { Toast, ToastProvider, useToast } from "./feedback/Toast";
export type { ToastProps, ToastProviderProps, ToastItem, ToastVariant, ToastContextValue } from "./feedback/Toast";

export { Spinner, Loader } from "./feedback/Spinner";
export type { SpinnerProps, LoaderProps } from "./feedback/Spinner";

export { EmptyState } from "./feedback/EmptyState";
export type { EmptyStateProps } from "./feedback/EmptyState";

export { Skeleton } from "./feedback/Skeleton";
export type { SkeletonProps, SkeletonVariant } from "./feedback/Skeleton";

// ── Navigation ────────────────────────────────────────────────────────────────
export { Pagination } from "./navigation/Pagination";
export type { PaginationProps } from "./navigation/Pagination";

export { Tabs } from "./navigation/Tabs";
export type { TabsProps, TabItem } from "./navigation/Tabs";

export { Breadcrumb } from "./navigation/Breadcrumb";
export type { BreadcrumbProps, BreadcrumbItem } from "./navigation/Breadcrumb";

export { StepIndicator } from "./navigation/StepIndicator";
export type { StepIndicatorProps, StepIndicatorStep } from "./navigation/StepIndicator";

export { Dropdown, Menu } from "./navigation/Dropdown";
export type { DropdownProps, DropdownItem, MenuProps, MenuItemProps } from "./navigation/Dropdown";

export { ButtonGroup } from "./navigation/ButtonGroup";
export type { ButtonGroupProps } from "./navigation/ButtonGroup";

// ── Data ──────────────────────────────────────────────────────────────────────
export { StaticTable } from "./data/StaticTable";
export type { StaticTableProps, StaticTableColumn } from "./data/StaticTable";

export { ListItem, ListGroup } from "./data/ListItem";
export type { ListItemProps, ListGroupProps } from "./data/ListItem";

export { DataTable } from "./data/DataTable";
export type {
  Column,
  DataTableColumn,
  DataTableAction,
  DataTablePagination,
  DataTableSort,
  DataTableProps,
} from "./data/DataTable";

export { LogStream } from "./data/LogStream";
export type { LogStreamProps } from "./data/LogStream";

export { FormField } from "./data/FormField";
export type { FormFieldProps } from "./data/FormField";

export { ColorInput } from "./data/ColorInput";
export type { ColorInputProps } from "./data/ColorInput";

export { JsonTreeEditor } from "./data/JsonTreeEditor";
export type { JsonTreeEditorProps } from "./data/JsonTreeEditor";

// ── Messaging ─────────────────────────────────────────────────────────────────
export { MessageBubble } from "./messaging/MessageBubble";
export type {
  MessageBubbleProps,
  MessageBubbleMessage,
  MessageAttachment,
  MessageDirection,
  MessageStatus,
} from "./messaging/MessageBubble";

export { ComposeBar } from "./messaging/ComposeBar";
export type { ComposeBarProps } from "./messaging/ComposeBar";

export { ThreadRow } from "./messaging/ThreadRow";
export type {
  ThreadRowProps,
  ThreadRowThread,
  ThreadParticipant,
  ThreadLatestMessage,
  ThreadFromNumber,
} from "./messaging/ThreadRow";

// ── Composite ─────────────────────────────────────────────────────────────────
export { SelectionCard } from "./composite/SelectionCard";
export type { SelectionCardProps } from "./composite/SelectionCard";

// ── E-Commerce ────────────────────────────────────────────────────────────────
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
} from "./ecommerce/types";
export { defaultRenderLink } from "./ecommerce/helpers";

export { ProductCard } from "./ecommerce/ProductCard";
export type { ProductCardProps } from "./ecommerce/ProductCard";

export { ProductDetail } from "./ecommerce/ProductDetail";
export type {
  ProductDetailProps,
  ProductDetailBreadcrumb,
  ProductDetailReviews,
} from "./ecommerce/ProductDetail";

export { CartPopover } from "./ecommerce/CartPopover";
export type { CartPopoverProps } from "./ecommerce/CartPopover";

export { CollectionGrid } from "./ecommerce/CollectionGrid";
export type { CollectionGridProps } from "./ecommerce/CollectionGrid";

export { CompareDrawer } from "./ecommerce/CompareDrawer";
export type { CompareDrawerProps } from "./ecommerce/CompareDrawer";

export { ProductQuickview } from "./ecommerce/ProductQuickview";
export type { ProductQuickviewProps } from "./ecommerce/ProductQuickview";

export { SearchCommand } from "./ecommerce/SearchCommand";
export type { SearchCommandProps } from "./ecommerce/SearchCommand";

export { Wishlist } from "./ecommerce/Wishlist";
export type { WishlistProps } from "./ecommerce/Wishlist";

export { RecentlyViewed } from "./ecommerce/RecentlyViewed";
export type { RecentlyViewedProps } from "./ecommerce/RecentlyViewed";

export {
  SmartVariantSelector,
  canUseSmartSelector,
  DEFAULT_CLOTHING_COLORS,
} from "./ecommerce/index";
export type { SmartVariantSelectorProps } from "./ecommerce/index";
