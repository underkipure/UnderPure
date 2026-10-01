export const accountDefaults = {
  accountData: {
    heroImage: "",
    dashboard: {
      welcomeText: 'WELCOME BACK',
      subtitleText: 'View your recent orders and manage your account details.'
    },
    navigation: {
      tab1: 'MY ACCOUNT',
      tab2: 'ORDER HISTORY',
      tab3: 'LOVELIST'
    },
    emptyStates: {
      ordersEmptyTitle: "YOU HAVEN'T PLACED ANY ORDERS YET.",
      ordersEmptySubtitle: "Discover our latest arrivals and find something you love.",
      ordersShopButton: "SHOP NEW ARRIVALS",
      lovelistEmptyTitle: "YOUR LOVELIST IS EMPTY.",
      lovelistEmptySubtitle: "Save your favorite pieces here.",
      lovelistShopButton: "EXPLORE COLLECTION"
    },
    personalInfo: {
      title: "PERSONAL INFORMATION",
      firstNameLabel: "First Name",
      lastNameLabel: "Last Name",
      emailLabel: "Email",
      phoneLabel: "Phone",
      dobLabel: "Date of Birth",
      buttonText: "UPDATE PROFILE"
    },
    password: {
      title: "CHANGE PASSWORD",
      currentLabel: "Current Password",
      newLabel: "New Password",
      buttonText: "UPDATE PASSWORD"
    },
    addressBook: {
      title: "ADDRESS BOOK",
      addButton: "ADD NEW ADDRESS",
      editButton: "Edit",
      deleteButton: "Delete",
      defaultBadge: "DEFAULT"
    },
    orders: {
      tableHeaders: {
        id: "ORDER ID",
        date: "DATE",
        total: "TOTAL",
        status: "STATUS",
        action: "ACTION"
      },
      viewDetails: "VIEW DETAILS"
    },
    loyalty: {
      enabled: true,
      title: "LOYALTY",
      statusPrefix: "You are currently in Tier 1 with",
      statusSuffix: "UPcoins.",
      earnText: "Earn 500 UPcoins to unlock Tier 2.",
      buttonText: "DISCOVER"
    },
    storeCredit: {
      enabled: true,
      title: "STORE CREDIT",
      emptyText: "You don't have any store credit."
    },
    marketing: {
      enabled: true,
      title: "MARKETING PREFERENCES",
      emailLabel: "Email"
    },
    logout: {
      button1: "Sign out",
      button2: "Sign out of all devices"
    },
    logoutButton: "LOG OUT",
    footerLinks: {
      country: "United States",
      links: [
        { id: 1, label: "Refund policy", url: "/policies/refund-policy" },
        { id: 2, label: "Shipping", url: "/policies/shipping-policy" },
        { id: 3, label: "Privacy policy", url: "/policies/privacy-policy" },
        { id: 4, label: "Terms of service", url: "/policies/terms-of-service" },
        { id: 5, label: "Contact information", url: "/pages/contact" },
      ]
    }
  }
};
