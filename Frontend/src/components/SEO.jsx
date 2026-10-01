import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSiteSettingsStore } from '../store/siteSettingsStore';

const SITE_URL = 'https://www.underpure.com';

/**
 * Helper to ensure absolute URL for social sharing (WhatsApp & FB require absolute HTTPS URLs)
 */
const toAbsoluteUrl = (pathOrUrl) => {
  if (!pathOrUrl) return `${SITE_URL}/logo.png`;
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }
  const cleanPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_URL}${cleanPath}`;
};

/**
 * Format image URL for optimal 1200x630 OpenGraph / WhatsApp previews
 */
const toSocialShareImage = (imgUrl) => {
  const abs = toAbsoluteUrl(imgUrl);
  if (abs.includes('cloudinary.com') && abs.includes('/upload/')) {
    // Inject Cloudinary social crop transform if not already present
    if (!abs.includes('w_1200') && !abs.includes('c_fill')) {
      return abs.replace('/upload/', '/upload/f_auto,q_auto,w_1200,h_630,c_fill,g_auto/');
    }
  }
  return abs;
};

/**
 * Strip HTML tags from descriptions for clean meta tags
 */
const cleanDescription = (rawText) => {
  if (!rawText) return '';
  return String(rawText)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200);
};

export default function SEO({
  title,
  description,
  image,
  url,
  type = 'website',
  productData = null,
  schema = null,
  noIndex = false,
}) {
  const { storeName, globalSeoSettings } = useSiteSettingsStore();

  const defaultTitle = storeName || 'UnderPure Official Store | Premium Luxury Clothing & Lingerie';
  const defaultDescription =
    globalSeoSettings?.description ||
    'Official UnderPure Store: Shop UnderPure online for premium luxury clothing, designer lingerie, handcrafted apparel, and everyday intimates with fast delivery across Pakistan.';
  const defaultImage = globalSeoSettings?.ogImage || `${SITE_URL}/logo.png`;

  const metaTitle = title ? `${title} | ${storeName || 'UnderPure'}` : defaultTitle;
  const metaDescription = cleanDescription(description) || defaultDescription;
  const canonicalUrl = toAbsoluteUrl(url || (typeof window !== 'undefined' ? window.location.pathname : '/'));
  const socialImage = toSocialShareImage(image || defaultImage);

  // Generate Google Merchant / Schema.org Product Rich Snippet if product data is supplied
  let productSchema = null;
  if (productData) {
    const isOut = productData.availability === 'out of stock' || productData.stockCount === 0;
    productSchema = {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: productData.name || title,
      image: [socialImage],
      description: metaDescription,
      sku: String(productData.id || productData.sku || ''),
      brand: {
        '@type': 'Brand',
        name: productData.brand || 'UnderPure',
      },
      offers: {
        '@type': 'Offer',
        url: canonicalUrl,
        priceCurrency: productData.currency || 'PKR',
        price: Number(productData.price || 0).toFixed(2),
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        availability: isOut ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
        seller: {
          '@type': 'Organization',
          name: 'UnderPure',
        },
      },
    };
  }

  const activeSchema = schema || productSchema;

  return (
    <Helmet>
      {/* Standard SEO Meta Tags */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonicalUrl} />
      <meta
        name="robots"
        content={noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}
      />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content={productData ? 'product' : type} />
      <meta property="og:site_name" content={storeName || 'UnderPure'} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={socialImage} />
      <meta property="og:image:secure_url" content={socialImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={metaTitle} />
      <meta property="og:locale" content="en_US" />

      {/* Meta Product Catalog Microdata Tags (For Instagram & Facebook Shop Sync) */}
      {productData && (
        <>
          <meta property="product:brand" content={productData.brand || 'UnderPure'} />
          <meta
            property="product:availability"
            content={productData.availability === 'out of stock' || productData.stockCount === 0 ? 'out of stock' : 'in stock'}
          />
          <meta property="product:condition" content={productData.condition || 'new'} />
          <meta property="product:price:amount" content={Number(productData.price || 0).toFixed(2)} />
          <meta property="product:price:currency" content={productData.currency || 'PKR'} />
          {productData.id && <meta property="product:retailer_item_id" content={String(productData.id)} />}
          {productData.slug && <meta property="product:item_group_id" content={String(productData.slug)} />}
          {productData.category && <meta property="product:category" content={String(productData.category)} />}
        </>
      )}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={socialImage} />
      <meta name="twitter:image:alt" content={metaTitle} />

      {/* Schema.org JSON-LD for Google Rich Snippets */}
      {activeSchema && (
        <script type="application/ld+json">
          {JSON.stringify(activeSchema)}
        </script>
      )}
    </Helmet>
  );
}
