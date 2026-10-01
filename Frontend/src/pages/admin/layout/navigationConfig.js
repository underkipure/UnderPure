import { 
  LayoutDashboard, 
  ShoppingBag, 
  FolderTree,
  Package,
  Award,
  Files, 
  Users, 
  Star,
  Settings, 
  Tag,
  ArrowDownLeft,
  ClipboardList,
  Plus,
  ExternalLink,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

export const navGroups = [
  {
    title: 'Store & Catalog',
    items: [
      { name: 'Dashboard',       path: '/admin',            icon: LayoutDashboard },
      { name: 'Products',        path: '/admin/products',   icon: ShoppingBag },
      { name: 'Categories',      path: '/admin/categories', icon: FolderTree },
      { name: 'Badges',          path: '/admin/badges',     icon: Award },
      { name: 'Promotions',      path: '/admin/promotions', icon: Tag },
    ]
  },
  {
    title: 'Orders & Customers',
    items: [
      { name: 'Orders',          path: '/admin/orders',     icon: Package },
      { name: 'Return Requests', path: '/admin/returns',    icon: ArrowDownLeft },
      { name: 'Customers',       path: '/admin/customers',  icon: Users },
      { name: 'Reviews',         path: '/admin/reviews',    icon: Star },
      { name: 'Survey Reports',  path: '/admin/surveys',    icon: ClipboardList },
    ]
  },
  {
    title: 'CMS & Settings',
    items: [
      { name: 'Content Editor',  path: '/admin/content',    icon: Files },
      { name: 'Settings',        path: '/admin/settings',   icon: Settings },
    ]
  }
];

export const allNavItems = navGroups.flatMap(g => g.items);

export const getQuickActions = (navigate, toggleCollapse, isCollapsed) => [
  { name: 'Add New Product',        action: () => navigate('/admin/products'),   icon: Plus },
  { name: 'Edit Storefront Content',action: () => navigate('/admin/content'),    icon: Files },
  { name: 'Open Live Storefront',   action: () => window.open('/', '_blank'),    icon: ExternalLink },
  { name: 'Toggle Compact Sidebar', action: toggleCollapse,                      icon: isCollapsed ? ChevronRight : ChevronLeft },
];
