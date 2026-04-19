/**
 * @file UI component library for Aegis Vault
 *
 * This module exports all reusable UI components organized by category:
 * loading states, modals, forms, data display, navigation, and accessibility.
 */

// Loading states
export { Loading, LoadingOverlay, LoadingSkeleton } from './loading';

// Dialogs and overlays
export { Modal, ConfirmModal } from './modal';

// Notifications
export { ToastProvider, useToast } from './toast';

// Tab navigation
export { Tabs, VerticalTabs } from './tabs';

// Form inputs
export { Input, TextArea } from './input';

// Badges and labels
export { Badge, StatusBadge, CounterBadge, BadgeGroup } from './badge';

// Progress indicators
export { Progress, CircularProgress, StepsProgress } from './progress';

// Cards
export { Card, CardHeader, CardFooter, StatCard } from './card';

// Buttons
export { Button } from './button';

// Tooltips
export { Tooltip, InfoTooltip, HelpTooltip } from './tooltip';

// Dropdowns
export { Dropdown, SelectDropdown } from './dropdown';

// Avatars
export { Avatar, AvatarGroup, WalletAvatar } from './avatar';

// Alerts
export { Alert, BannerAlert } from './alert';

// Layout utilities
export { Divider, Spacer, EmptyState, SectionHeader } from './layout-utils';

// Copy and display
export { CopyButton, AddressDisplay, TxHashDisplay } from './copy-button';

// Data visualization
export { NumberTicker, Countdown, TokenAmount, PercentageChange } from './data-display';

// Accordions
export { Accordion, AccordionItem, Collapsible, ExpandableCard, Details } from './accordion';

// Steppers
export { Stepper, Timeline, Breadcrumbs } from './stepper';

// Statistics display
export { StatsCard, StatsGrid, Metric, KeyValueList, ComparisonStat, Sparkline } from './stats-display';

// Specialized form inputs
export { SearchInput, AmountInput, NumberStepper } from './form-inputs';

// Skeleton loaders
export { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard, SkeletonTableRow, SkeletonStats, SkeletonListItem, SkeletonChart, SkeletonForm } from './skeleton';

// Status indicators
export { NetworkStatus, TxStatus, WalletStatus, StakingStatus } from './status-indicators';

// Filters
export { FilterChip, FilterGroup, SortDropdown, DateRangeFilter } from './filters';

// Data tables
export { DataTable, Pagination, PageSizeSelector } from './data-table';

// Settings controls
export { ThemeToggle, LanguageSelector, CurrencySelector, SettingsItem, SettingsGroup } from './settings';

// Notifications
export { NotificationItem, NotificationBell, NotificationPanel } from './notifications';

// Toggle controls
export { Switch, Checkbox, RadioGroup, SegmentedControl } from './toggle-controls';

// Range inputs
export { Slider, RangeSlider, Rating, ColorPicker } from './range-inputs';

// Crypto-specific displays
export { QRCodeDisplay, TokenLogo, TokenPair, PriceDisplay, NetworkBadge, GasEstimate } from './crypto-display';

// Scroll & List Components
export { ScrollToTop, ScrollProgress, InfiniteScrollTrigger, PullToRefresh, VirtualizedList, StickySection } from './scroll-components';

// Animation Components
export { AnimatedCounter, FlipCounter, TypingAnimation, FadeInView, StaggerChildren, Pulse, Shimmer, Confetti } from './animations';

// State Components
export { EmptyState as ContentEmptyState, NoData, LoadingState, ErrorState, SuccessState, ConnectionState } from './states';

// Accessibility Components
export { KeyboardShortcutsProvider, useKeyboardShortcuts, useShortcut, KeyboardShortcutsDisplay, KeyboardHint, FocusTrap, SkipLink, LiveRegion, AccessibleIconButton, VisuallyHidden } from './accessibility';

// Command & Search
export { CommandPalette, SearchInput as GlobalSearchInput, QuickActions } from './command-palette';

// Navigation Components
export { Breadcrumbs as NavBreadcrumbs, Pagination as NavPagination, SimplePagination, PageSizeSelector as NavPageSizeSelector, LinkTabs, SidebarNav } from './navigation';

// Skeleton Components
export * from './skeletons';

// Rich Table Components
export { RichTable } from './rich-table';
export type { TableColumn, TablePagination } from './rich-table';
