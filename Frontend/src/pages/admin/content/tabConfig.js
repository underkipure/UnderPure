import {
  Layout,
  Grid,
  Package,
  ShoppingCart,
  CreditCard,
  Menu,
  Layers,
  Megaphone,
  Star,
  MessageCircle,
  Lock,
  FileText,
  Type,
} from 'lucide-react';

export const TAB_GROUPS = [
  {
    group: 'Storefront Pages',
    tabs: [
      { key: 'homepage', label: 'Home Page', icon: Layout },
      { key: 'collection', label: 'Collection', icon: Grid },
      { key: 'product-detail', label: 'Product Detail', icon: Package },
      { key: 'cart', label: 'Cart', icon: ShoppingCart },
      { key: 'checkout', label: 'Checkout', icon: CreditCard },
    ],
  },
  {
    group: 'Navigation & Layout',
    tabs: [
      { key: 'header-footer', label: 'Header & Footer', icon: Menu },
      { key: 'mega-menu', label: 'Mega Menu', icon: Layers },
      { key: 'announcement', label: 'Announcement', icon: Megaphone },
      { key: 'popup', label: 'Welcome Popup', icon: Star },
      { key: 'chat-widget', label: 'Chat Widget', icon: MessageCircle },
    ],
  },
  {
    group: 'Accounts & Loyalty',
    tabs: [
      { key: 'auth', label: 'Login/Signup', icon: Lock },
      { key: 'account', label: 'User Account', icon: Star },
      { key: 'lovelist', label: 'Lovelist', icon: Star },
      { key: 'loyalty', label: 'Loyalty', icon: Star },
    ],
  },
  {
    group: 'Information & Help',
    tabs: [
      { key: 'about-us', label: 'About Us', icon: FileText },
      { key: 'contact-us', label: 'Contact Us', icon: FileText },
      { key: 'faqs', label: 'FAQs', icon: Type },
      { key: 'size-guide', label: 'Size Guide', icon: FileText },
      { key: 'bra-size', label: 'Find Your Bra Size', icon: FileText },
      { key: 'returns', label: 'Returns', icon: FileText },
      { key: 'careers', label: 'Careers', icon: FileText },
      { key: 'custom-pages', label: 'Custom Pages', icon: FileText },
    ],
  },
  {
    group: 'Legal & Compliance',
    tabs: [
      { key: 'terms', label: 'Terms of Service', icon: FileText },
      { key: 'privacy', label: 'Privacy Policy', icon: FileText },
      { key: 'cookie-declaration', label: 'Cookie Declaration', icon: FileText },
      { key: 'do-not-sell', label: 'Do Not Sell My Data', icon: FileText },
      { key: 'customer-data', label: 'Customer Data Requests', icon: FileText },
      { key: 'affiliates', label: 'Affiliates', icon: FileText },
    ],
  },
];

export const ALL_TABS = TAB_GROUPS.flatMap((g) => g.tabs);
