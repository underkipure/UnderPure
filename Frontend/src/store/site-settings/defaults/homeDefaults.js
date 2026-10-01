export const homeDefaults = {
  heroData: {
    heading: 'NEW ARRIVALS',
    buttonText: 'SHOP NOW',
    buttonLink: '/collections/new-arrivals',
    mediaType: 'image', // 'image' or 'video'
    mediaUrl: 'https://res.cloudinary.com/dhlvm5n1q/image/upload/v1783428958/hero_media/zbrlylhibwlfk1fd7cpq.png',
    buttonColor: '#FFFFFF'
  },
  homeSectionToggles: {
    hero: true,
    categoryBanners: true,
    sportBanner: true,
    featuredBanners: true,
    pleasureSwimBanners: true,
    newArrivals: true,
    bestSellers: true,
    shopTheFeed: true,
    pressQuotes: true,
    brandDescription: true,
  },
  categoryBanners: [
    {
      id: 1,
      categorySlug: 'pure-du-sport',
      image: 'https://res.cloudinary.com/dhlvm5n1q/image/upload/v1783435355/hero_media/dx5opa4tfva0jwohuixb.jpg',
      title: 'Pure du sport',
      buttonText: 'Shop activewear',
      buttonColor: '#FFFFFF'
    },
    {
      id: 2,
      categorySlug: 'stockings',
      image: 'https://res.cloudinary.com/dhlvm5n1q/image/upload/v1783437607/hero_media/zgu4fszalnbb81qcp8fu.jpg',
      title: 'Stockings',
      buttonText: 'SHOP NOW',
      buttonColor: '#FFFFFF'
    }
  ],
  featuredBanners: [
    {
      id: 1,
      categorySlug: 'lingerie',
      image: 'https://res.cloudinary.com/dhlvm5n1q/image/upload/v1783431505/hero_media/lvdctwg8hnj49mmw1ims.jpg',
      title: 'Luxury Lingerie',
      buttonText: 'SHOP LINGERIE',
      buttonColor: '#FFFFFF'
    },
    {
      id: 2,
      categorySlug: 'dresses',
      image: 'https://res.cloudinary.com/dhlvm5n1q/image/upload/v1783437607/hero_media/zgu4fszalnbb81qcp8fu.jpg',
      title: 'New Season',
      buttonText: 'SHOP NOW',
      buttonColor: '#FFFFFF'
    }
  ],
  pleasureSwimBanners: [],
  sportBanner: {
    categorySlug: 'pure-du-sport',
    title: '',
    subtitle: 'Performance meets elegance',
    image: 'https://res.cloudinary.com/dhlvm5n1q/image/upload/v1783434888/hero_media/m4usoyida1vnfmg9di8i.jpg',
    link: '',
    buttonText: 'EXPLORE SPORT',
    buttonColor: '#000000'
  },
  shopTheFeed: {
    title: '',
    subtitle: '',
    images: []
  },
  homeCarousels: {
    newArrivals: { title: 'NEW ARRIVALS', limit: 8, categorySlug: '', badge: '' },
    bestSellers: { title: 'BEST SELLERS', limit: 8, categorySlug: '', badge: '' }
  },
  brandDescription: {
    heading: '',
    p1: '',
    p2: '',
    p3: '',
    p4: ''
  },
  pressQuotes: {
    sectionHeading: '',
    heading1: '',
    style1: '',
    heading2: '',
    style2: '',
    heading3: '',
    style3: '',
    quote1: '',
    quote2: '',
    quote3: ''
  }
};
