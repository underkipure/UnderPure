export const loyaltyDefaults = {
  loyaltySettings: {
    signupBonus: 200,
    pointsPerSpend: 10,
    spendUnit: 1000,
    redemptionRatio: 0.1,
    birthdayBonus: 500,
    tier2Threshold: 500,
    tier3Threshold: 1000
  },
  loyaltyData: {
    heroImage: '',
    faqBannerImage: '',
    heroTitle: 'UnderPure with benefits',
    heroSubtitle: 'Join our loyalty program to access exclusive benefits every time you shop. The more you spend, the better your benefits. Earn one UPCoin for every dollar spent. Create an account now to start earning rewards.',
    faqTitle: 'got questions?',
    tiers: [
      {
        id: 1,
        tier: 'tier 1',
        subtitle: 'enrolled on creation',
        image: '',
        benefits: [
          'Free standard shipping on all Pakistan orders Rs. 5000+',
          'Complimentary styling consultation',
          'Early access to seasonal sales & launches'
        ]
      },
      {
        id: 2,
        tier: 'tier 2',
        subtitle: '500 UPCoins',
        image: '',
        benefits: [
          'Plus, 20% off during your birthday month*',
          'Double UPCoin events for select collections',
          'Free 30 day returns',
          'Plus, free standard shipping on all Pakistan orders Rs. 5000+',
          'Complimentary styling consultation',
          'Early access to seasonal sales & launches'
        ]
      },
      {
        id: 3,
        tier: 'tier 3',
        subtitle: '1500 UPCoins',
        image: '',
        benefits: [
          'Invites to exclusive UnderPure events',
          'Curated holiday gift',
          'Plus, 20% off during your birthday month*',
          'Free 30 day returns',
          'Double UPCoin events for select collections',
          'Free standard shipping on all Pakistan orders Rs. 5000+',
          'Complimentary styling consultation',
          'Early access to seasonal sales & launches'
        ]
      },
      {
        id: 4,
        tier: 'tier 4',
        subtitle: '3000 UPCoins',
        image: '',
        benefits: [
          'Luxe holiday gift',
          'VIP client concierge',
          'Free monogramming*',
          'Free 2-day shipping on all Pakistan orders',
          'Free returns',
          'Plus, 20% off during your birthday month*',
          'Free 30 day returns',
          'Double UPCoin events for select collections',
          'Invites to exclusive UnderPure events',
          'Complimentary styling consultation',
          'VIP early access to seasonal sales & launches'
        ]
      },
      {
        id: 5,
        tier: 'tier 5',
        subtitle: 'the mile high club\n50000 UPCoins',
        image: '',
        benefits: [
          'Design an exclusive 3-piece lingerie set with the UnderPure design team',
          'Includes roundtrip flight & one night hotel accommodations',
          'Plus, free 2-day shipping on all Pakistan orders',
          'Free Returns',
          'Luxe holiday gift',
          'VIP client concierge',
          'Free monogramming*',
          '20% off during your birthday month*',
          'Free 30 day returns',
          'Double UPCoin events for select collections',
          'Invites to exclusive UnderPure events',
          'Complimentary styling consultation',
          'VIP early access to seasonal sales & launches',
          '*Restrictions apply'
        ]
      }
    ],
    faqs: [
      { id: 1, q: 'How do I join?', a: 'Customers can join the loyalty program by creating an account on our website. Joining is free!' },
      { id: 2, q: 'What is a UPCoin?', a: 'UPCoins are points you earn on every purchase. Rs. 1 spent = 1 UPCoin.' },
      { id: 3, q: 'When does my loyalty tier reset?', a: 'Your tier status is valid for a rolling 12-month period from the date you enter the tier.' },
      { id: 4, q: 'How do I redeem my birthday discount?', a: 'Make sure your birthday is entered in your account profile. You will receive an email with your unique code on your birthday.' },
      { id: 5, q: 'How do I sign up for a fit or style consultation?', a: 'As a member, you can reach out to our concierge team at underpure18@gmail.com.com to schedule your virtual or in-person consultation.' },
      { id: 6, q: 'How will I be given early access to seasonal sales and launches?', a: 'You will receive exclusive email invitations before sales and launches open to the general public.' },
      { id: 7, q: 'How can I access 15% off duty early or double UPCoin events?', a: 'Keep an eye on your email inbox! We will notify members when these special events are happening.' },
      { id: 8, q: 'How do I redeem free 2-day shipping on all orders?', a: 'Once you reach Tier 4 or 5, the free 2-day shipping option will automatically appear at checkout when logged into your account.' },
      { id: 9, q: 'Will dollars spent prior to UnderPure Insider sign up count towards my tier total?', a: 'Unfortunately, no. You must have an active account at the time of purchase to earn UPCoins.' },
      { id: 10, q: 'When will my new purchase be reflected on the loyalty page?', a: 'Points typically appear in your account 14 days after your order has shipped.' },
      { id: 11, q: 'What items can be monogrammed, and how do I redeem this service?', a: 'Select silk items are eligible for monogramming. Tier 4 and 5 members can contact concierge to arrange this service.' },
      { id: 12, q: 'What is VIP client concierge?', a: 'A dedicated team member will be available via phone or email to assist you with styling, priority pre-orders, and personalized gifting.' }
    ]
  }
};
