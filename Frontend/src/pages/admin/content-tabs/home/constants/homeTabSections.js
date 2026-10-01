import {
  Layout,
  ImageIcon,
  Camera,
  Star,
} from 'lucide-react';

export const HOME_SECTIONS = [
  {
    key: 'hero',
    label: 'Hero Section',
    icon: ImageIcon,
    desc: 'Main full-screen hero banner with heading and CTA button',
  },
  {
    key: 'categoryBanners',
    label: 'Category Banners',
    icon: Layout,
    desc: 'Grid of category image banners below the hero',
  },
  {
    key: 'sportBanner',
    label: 'Sport Banner',
    icon: ImageIcon,
    desc: 'Full-width UnderPure Sport promotional banner',
  },
  {
    key: 'featuredBanners',
    label: 'Featured Banners',
    icon: Layout,
    desc: 'Two-column featured collection banners',
  },
  {
    key: 'pleasureSwimBanners',
    label: 'Pleasure & Swim Banners',
    icon: Layout,
    desc: 'Pleasure and Swim collection promotional banners',
  },
  {
    key: 'newArrivals',
    label: 'New Arrivals Carousel',
    icon: Star,
    desc: 'Product carousel showing newly added items',
  },
  {
    key: 'bestSellers',
    label: 'Best Sellers Carousel',
    icon: Star,
    desc: 'Product carousel showing best-selling items',
  },
  {
    key: 'shopTheFeed',
    label: 'Shop The Feed',
    icon: Camera,
    desc: 'Instagram/social feed image grid',
  },
  {
    key: 'pressQuotes',
    label: 'Press Quotes (Vogue, etc.)',
    icon: Star,
    desc: 'Press & magazine quotes displayed above Brand Description',
  },
  {
    key: 'brandDescription',
    label: 'Brand SEO Description Section',
    icon: Layout,
    desc: 'Luxury Lingerie & Ready-to-Wear heading & paragraphs at bottom of Home page',
  },
];
