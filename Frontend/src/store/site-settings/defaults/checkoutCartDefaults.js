export const checkoutCartDefaults = {
  checkoutSettings: {
    returnsTitle: 'RETURNS',
    returnsText: 'We accept returns within 30 days of shipping for all unused items with tags. Full priced items are returnable for refund or store credit. Sale items are returnable for store credit only. Final sale items are final sale and are not returnable.',
    guaranteeText: 'GUARANTEED SAFE CHECKOUT',
    contactTitle: 'CONTACT US',
    contactEmail: 'hello@underpure.com',
    contactPhone: '+92 300 0000000',
    contactServiceHours: 'M-F, 10AM-6PM EST',
    logoUrl: '/Logo.svg',
    shippingProtectionTitle: 'Shipping Protection',
    shippingProtectionProvider: 'UnderPure',
    shippingProtectionFee: 1.95,
    shippingProtectionDesc: 'If your package is lost, stolen, or damaged, UnderPure will refund or replace it.',
    paymentTitle: 'PAYMENT',
    paymentSubtitle: 'All transactions are secure and encrypted.',
    codTitle: 'Cash on Delivery (COD)',
    codDescription: 'You will pay for your order in cash when it is delivered to your address.',
    defaultCountry: 'Pakistan',
    supportedCountries: [
      'Pakistan'
    ],
    linkRefundText: 'Refund policy',
    linkShippingText: 'Shipping',
    linkPrivacyText: 'Privacy policy',
    linkTermsText: 'Terms of service',
    linkContactText: 'Contact',
    dialogRefundTitle: 'Returns',
    dialogRefundHeading1: 'Returns',
    dialogRefundBody1: 'We accept returns within 30 days of shipping for all unused items with tags. Full priced items are returnable for refund or store credit. Sale items are returnable for store credit only. Final sale items are final sale and are not returnable.',
    dialogRefundHeading2: '',
    dialogRefundBody2: '',
    dialogShippingTitle: 'Shipping Policy',
    dialogShippingHeading1: 'Shipping Policy',
    dialogShippingBody1: 'We process all orders within 1-2 business days. Standard shipping typically takes 5-7 business days, depending on your location. Expedited shipping options are available at checkout for an additional cost. Please note that during holidays or major sales events, processing times may be slightly delayed.',
    dialogShippingHeading2: 'Delivery & Tracking',
    dialogShippingBody2: 'Once your order has shipped, you will receive an email confirmation with tracking information. If you have any issues with your delivery, please contact our customer support team.',
    dialogPrivacyTitle: 'Privacy Policy',
    dialogPrivacyHeading1: 'LAST UPDATED: SEPTEMBER 26, 2023',
    dialogPrivacyBody1: 'UnderPure, LLC. values its customers and respects your privacy, and wants you to be familiar with how we collect, use and disclose information. This Privacy Policy describes our practices in connection with information that we collect through our websites and mobile software applications operated by or on behalf of UnderPure, including the website located at https://www.underpure.com. This Privacy Policy also applies to information collected through off-line means - such as information collected through our boutiques, pop-ups, which are collectively known as "UnderPure Retail Properties" in this Privacy Policy.\n\nWe encourage you to read this Privacy Policy before using the UnderPure Online Properties, visiting UnderPure Retail Properties, or providing information to us. By using the UnderPure Online Properties, visiting UnderPure Retail Properties, or providing information to us, you understand that we will collect, use and disclose your information in accordance with this Privacy Policy.',
    dialogPrivacyHeading2: 'UPDATES TO THIS POLICY',
    dialogPrivacyBody2: 'We may change this Privacy Policy at any time. Please take a look at the "Last Updated" legend at the top of this page to see when this Privacy Policy was last revised. Any changes to this Privacy Policy will become effective on the "Last Updated" date indicated above. By using the UnderPure Online Properties or providing information to us following such changes, you will have accepted the revised Privacy Policy.',
    dialogTermsTitle: 'Terms of Service',
    dialogTermsHeading1: 'Use of site',
    dialogTermsBody1: 'Thank you for visiting our Web Site. Your use of the Site is governed by the following terms of use, rules or guidelines. These Terms govern your access and use of UnderPure\'s Site and online store at www.underpure.com. In using this Site or purchasing products on the Site, you are bound to these Terms. If you do not agree to comply with these terms, you must exit the Site and cease access, use, and purchase activity.',
    dialogTermsHeading2: 'Product use & purchase of product',
    dialogTermsBody2: 'The materials contained on this Site are to be used solely for private, personal and non-commercial purposes. You are prohibited from reselling any merchandise secured through the Site, and are prohibited from making commercial or otherwise non-personal use of the Site and any of its contents. Product descriptions and photos are for informational purposes only. Product styles, designs and colors shown on the Site may be subject to change without notice.\n\nWe cannot guarantee product availability for all products at any given time. Product availability is determined at the time when you are emailed a shipping confirmation. UnderPure reserves the right to refuse orders, reject current and future access of our Site, and limit order quantities in our sole discretion.',
    dialogContactTitle: 'Contact',
    dialogContactHeading: 'CONTACT US',
    dialogContactServiceHours: 'M-F, 10AM-6PM EST'
  },
  cartSettings: {
    basic: {
      title: 'Your bag',
      emptyMessage: 'Your bag is empty.',
      checkoutText: 'CONTINUE TO CHECKOUT',
      viewBagText: 'VIEW BAG',
      subtotalText: 'Subtotal',
      removeText: 'Remove',
      taxShippingText: 'Taxes and shipping calculated at checkout',
      shippingNotice: 'Free Shipping on U.S. Orders Rs. 195+ and easy returns. Some items may ship separately.'
    },
    shippingBar: {
      enabled: true,
      threshold: 250,
      awayMessage: "You're Rs. X away from free shipping!",
      achievedMessage: "You've unlocked free shipping!",
      progressColor: '#000000',
      backgroundColor: '#e5e7eb'
    },
    gifting: {
      enabled: true,
      title: 'Gifting a lover?',
      description: 'Make it extra special with a UnderPure gift box.',
      image: '',
      products: [
        { id: 1, name: 'HEART', price: 28 },
        { id: 2, name: 'STANDARD', price: 15 }
      ]
    },
    discover: {
      enabled: true,
      title: 'Discover new in lingerie, clothing and other exclusive styles.',
      collections: [
        { id: 1, name: 'LINGERIE', image: '', url: '/collections/lingerie' },
        { id: 2, name: 'CLOTHING', image: '', url: '/collections/clothing' },
        { id: 3, name: 'BESTSELLERS', image: '', url: '/collections/best-sellers' }
      ]
    },
    crossSells: {
      enabled: true,
      title: 'Pairs Well With'
    },
    recommendations: {
      enabled: true,
      title: '',
      mode: 'auto',
      limit: 4,
      customProducts: []
    },
    loyaltyBanner: {
      enabled: true,
      title: 'UnderPure with Benefits',
      description: 'Join our loyalty program to access exclusive benefits and earn UnderPure Coins every time you shop.',
      buttonText: 'SIGN UP',
      footerText: 'Already a member? Log in'
    },
    policies: {
      enabled: true,
      title: 'Our Policies',
      items: [
        {
          id: 1,
          title: 'Order Processing',
          content: 'We process all orders within 1-2 business days. Standard shipping typically takes 5-7 business days, depending on your location.\n\nExpedited shipping orders placed before 12pm will ship out the same business day.'
        },
        {
          id: 2,
          title: 'Shipping Info',
          content: 'We offer complimentary standard shipping on all orders over the free shipping threshold. For orders under that threshold, standard shipping rates apply.'
        },
        {
          id: 3,
          title: 'Returns',
          content: 'We accept returns on unworn merchandise with all original tags attached, initiated within 30 days of your order shipping. Full-priced merchandise can be returned for exchange, store credit or refund.\n\nSale items may be returned for exchange or store credit only. Items marked \'FINAL SALE\' are final sale and are non-returnable.'
        }
      ]
    }
  },
  footerData: {
    smsBannerEnabled: true,
    smsBannerHeading: 'For a good time & 15% off, text LOVER to UnderPure (35387)',
    smsBannerSubtext: 'Sign up here for SMS texts and receive 15% off your first purchase. Plus, be the first to know about new arrivals, collaborations, exclusive offers and private events.',
    smsBannerDisclaimer: 'Valid only in the United States. By signing up via text, you agree to receive recurring automated promotional and personalized marketing text messages (e.g. cart reminders) from UnderPure at the cell number used when signing up. Consent is not a condition of any purchase. Reply HELP for help and STOP to cancel. Msg frequency varies. Msg and data rates may apply. View terms will open in a new tab & Privacy will open in a new tab.',
    headerHelp: {
      chatText: "Let's chat!",
      phone: "+923228483029",
      email: "underpure18@gmail.com",
      returnsText: "Returns center",
      returnsLink: "/returns",
      faqText: "FAQ",
      faqLink: "/faqs"
    },
    boutiquesEnabled: true,
    boutiqueTitle: '',
    boutiqueDescription: '',
    boutiqueLocations: [],
    boutiqueImage: '',
    boutiqueCta: '',
    boutiqueCtaLink: '',
    contactTitle: 'Contact Us',
    contactServiceHours: 'M-F, 10AM-6PM EST',
    contactEmail: 'hello@underpure.com',
    contactPhone: '+92 300 0000000',
    columns: [
      {
        id: 1, title: 'Shop All', links: [
          { id: 1, name: 'New Arrivals', url: '/collections/new-arrivals' },
          { id: 2, name: 'Lingerie', url: '/collections/lingerie' },
          { id: 3, name: 'Clothing', url: '/collections/clothing' },
          { id: 4, name: 'Best Sellers', url: '/collections/best-sellers' },
          { id: 5, name: 'Sale', url: '/collections/sale' },
        ]
      },
      {
        id: 2, title: 'Get Help', links: [
          { id: 6, name: 'About Us', url: '/about-us' },
          { id: 7, name: 'FAQs', url: '/faqs' },
          { id: 8, name: 'Sign In', url: '/login' },
          { id: 9, name: 'Loyalty Program', url: '/loyalty-program' },
        ]
      },
    ],
    companyInfoTitle: 'COMPANY INFO',
    companyInfoLinks: [
      { id: 1, label: 'About Us', url: '/about-us' },
      { id: 2, label: 'Boutiques', url: '/boutiques' },
      { id: 3, label: 'Loyalty Program', url: '/loyalty-program' },
      { id: 4, label: 'Take Our Survey', url: '/survey' },
    ],
    socialLinks: {
      instagram: 'https://instagram.com/',
      tiktok: 'https://tiktok.com/',
      pinterest: 'https://pinterest.com/',
      facebook: 'https://facebook.com/',
      youtube: 'https://youtube.com/',
    },
    copyrightText: '© 2026, Underpure. All Rights Reserved.',
    bigLogoEnabled: true,
    bigLogoText: 'UNDERPURE',
    legalLinks: [
      { id: 1, name: 'Privacy Policy', url: '/pages/privacy' },
      { id: 2, name: 'Terms Of Use', url: '/pages/terms' },
    ]
  }
};
