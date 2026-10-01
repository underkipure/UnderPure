import React from "react";
import { useSiteSettingsStore } from "../../store/siteSettingsStore";
import { useProductStore } from "../../store/productStore";
import { renderQuoteHeading } from "./utils/quoteHeadingRenderer";
import FeedSlider from "./components/FeedSlider";
import PressQuotesSection from "./components/PressQuotesSection";

export default function ShopTheFeed() {
  const shopTheFeed = useSiteSettingsStore((s) => s.shopTheFeed);
  const storedQuotes = useSiteSettingsStore((s) => s.pressQuotes);
  const homeSectionToggles = useSiteSettingsStore((s) => s.homeSectionToggles);
  const showPressQuotes = homeSectionToggles?.pressQuotes !== false;
  const storeProducts = useProductStore((s) => s.products);
  const feedProducts = storeProducts || [];

  // Only display quotes that are genuinely configured in storedQuotes
  const displayQuotes = [1, 2, 3]
    .map((idx) => {
      const qKey = `quote${idx}`;
      const hKey = `heading${idx}`;
      const sKey = `style${idx}`;
      const rawQuote = storedQuotes?.[qKey];
      if (!rawQuote || !rawQuote.trim()) return null;

      const cleanQuote = rawQuote.replace(/^["']|["']$/g, '').trim();
      const customHeading = storedQuotes?.[hKey] || '';
      const customStyle = storedQuotes?.[sKey] || 'serif-bold';
      const logoText = customHeading
        ? renderQuoteHeading(customHeading, customStyle, 'serif-bold')
        : null;

      return { logoText, quote: cleanQuote };
    })
    .filter(Boolean);

  // Filter valid feed items
  const validFeedImages = (shopTheFeed?.images || []).map((img, index) => {
    const product = feedProducts.find(
      (p) => p.slug === img.productSlug,
    );
    const imageSrc = img.image || product?.image_url;
    if (!imageSrc) return null;
    return { ...img, imageSrc, product, index };
  }).filter(Boolean);

  const hasFeed = validFeedImages.length > 0;
  const hasQuotes = showPressQuotes && displayQuotes.length > 0;

  if (!hasFeed && !hasQuotes) return null;

  return (
    <>
      {/* Shop The Feed Section */}
      {hasFeed && (
        <FeedSlider 
          title={shopTheFeed?.title}
          validFeedImages={validFeedImages}
        />
      )}

      {/* Press Quotes Section */}
      {hasQuotes && (
        <PressQuotesSection 
          storedQuotes={storedQuotes}
          displayQuotes={displayQuotes}
        />
      )}
    </>
  );
}
