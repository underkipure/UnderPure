export const catalogDefaults = {
  collectionSettings: {
    customTabTitles: { sale: 'Upto 75% Off' },
    bannerConfig: {
      title: 'Category Title',
      description: 'Shop the latest collection here.',
      image: '',
      height: 'medium'
    },
    sortOptions: [
      { id: 'newest', name: 'Newest First' },
      { id: 'price-asc', name: 'Price: Low to High' },
      { id: 'price-desc', name: 'Price: High to Low' },
      { id: 'best-selling', name: 'Best Selling' }
    ],
    quickShopText: 'QUICK SHOP',
    defaultLayout: 'grid-4',
    productsPerPage: 24,
    defaultSort: 'newest',
    emptyMessage: 'No products found in this collection.',
    showQuickViewOnHover: true,
    filtersToShow: ['Size', 'Color', 'Price Range', 'Category', 'Availability', 'Material', 'Style']
  },
  productDetailSettings: {
    galleryStyle: 'side-scroll',
    buttonTexts: {
      addToCart: 'ADD TO BAG',
      outOfStock: 'SOLD OUT'
    },
    titles: {
      relatedProducts: 'Selected For You, Lover',
      reviewsHeader: 'Customer Reviews',
      accordionMaterials: 'Materials & Care',
      accordionShipping: 'Shipping Info',
      accordionReturns: 'Returns Info'
    },
    relatedProductsConfig: {
      sourceType: 'same-category',
      badge: '',
      categorySlug: '',
      categoryMappings: {},
      limit: 4
    },
    perks: [
      {
        id: 1,
        enabled: true,
        icon: 'Package',
        text: 'Free shipping on orders over Rs. 195+',
        link: '/faqs',
        openModal: ''
      },
      {
        id: 2,
        enabled: true,
        icon: 'RotateCcw',
        text: 'Easy Returns',
        link: '',
        openModal: 'returns'
      },
      {
        id: 3,
        enabled: true,
        icon: 'Gift',
        text: 'Make it a gift with an UnderPure signature gift box',
        link: '/contact',
        openModal: ''
      }
    ],
    installmentNote: {
      enabled: true,
      provider: 'afterpay',
      installments: 4,
      customText: ''
    },
    showSocialShare: true,
    customAccordions: [],
    sizeGuide: {
      enabled: true,
      linkText: 'Size Guide',
      note: 'Note: This is a placeholder size guide. Real images/data can be connected via the admin panel.',
      columns: ['Size', 'Bust (in)', 'Waist (in)', 'Hip (in)'],
      table: [
        { id: 1, 'Size': 'XS', 'Bust (in)': '32 - 33', 'Waist (in)': '24 - 25', 'Hip (in)': '34 - 35' },
        { id: 2, 'Size': 'S', 'Bust (in)': '34 - 35', 'Waist (in)': '26 - 27', 'Hip (in)': '36 - 37' },
        { id: 3, 'Size': 'M', 'Bust (in)': '36 - 37', 'Waist (in)': '28 - 29', 'Hip (in)': '38 - 39' },
        { id: 4, 'Size': 'L', 'Bust (in)': '38.5 - 40', 'Waist (in)': '30.5 - 32', 'Hip (in)': '40.5 - 42' },
        { id: 5, 'Size': 'XL', 'Bust (in)': '41.5 - 43', 'Waist (in)': '33.5 - 35', 'Hip (in)': '43.5 - 45' }
      ]
    },
    accordions: {
      fabricCare: '<p>Hand wash cold with like colors. Lay flat to dry. Do not bleach. Iron on low heat if needed.</p>',
      shippingInfo: '<p>Free standard shipping on all Pakistan orders over Rs. 5000. Orders process within 1-2 business days.</p>',
      returnsInfo: '<p>We accept returns of unworn, unwashed items with tags attached within 30 days of delivery. Final sale items cannot be returned.</p>'
    }
  }
};
