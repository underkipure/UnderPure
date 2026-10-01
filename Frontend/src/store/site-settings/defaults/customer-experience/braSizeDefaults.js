export const braSizeDefaults = {
  braSizeData: {
    hero: {
      image: "",
      headingLine1: "find your",
      headingItalic: "bra",
      headingLine2: "size",
      description: "Are you wearing the right size? What size are you in Underpure? Finding the right bra can be hard, but we're here to help. Let us get you the support you need.",
      buttonText: "GET STARTED"
    },
    navTabs: [
      { label: "Find Your Bra Size", anchor: "find-size" },
      { label: "Bra Style Guide", anchor: "style-guide" },
      { label: "Get Support", anchor: "support" },
      { label: "Schedule A Fitting", anchor: "fitting" },
      { label: "Sister Sizing", anchor: "sister-sizing" }
    ],
    intro: {
      heading: "before we get",
      headingItalic: "started...",
      description: "Start by standing in front of a mirror wearing your best-fitting, non-padded underwire bra. You'll also need a soft measuring tape. Remember to measure in inches."
    },
    sections: [
      {
        headingPrefix: "the",
        headingItalic: "band",
        anchor: "the-band",
        image: "",
        imageAlt: "Measuring the band",
        paragraphs: [
          "Your bra's band provides most of its support (not the straps!) Most women are wearing a band that's too loose."
        ],
        steps: [
          "With a measuring tape, measure below your bust, directly below the wire of your bra.",
          "Ensure the tape is parallel to the floor, i.e at the same level on your back, sides and front.",
          "Enter this number in the \"band measurement\" box below."
        ],
        hotTip: "In between numbers? Round to the nearest whole number."
      },
      {
        headingPrefix: "the",
        headingItalic: "bust",
        anchor: "the-bust",
        image: "",
        imageAlt: "Measuring the bust",
        paragraphs: [],
        steps: [
          "Loop the measuring tape around your back, just under your shoulder blades to measure around the fullest part of your bust.",
          "Keep the measuring tape level from end to end, ensuring it is close, but not too tight, to find a comfortable and snug position.",
          "Enter this number in the \"bust measurement\" box below."
        ],
        hotTip: "If the measurement falls on the half inch, round it up!"
      }
    ],
    calculator: {
      headingPrefix: "your",
      headingItalic: "Underpure",
      headingSuffix: "size",
      description: "Our products may vary in size from your universal sizing. Use the calculator below to determine your best fitting Underpure sizes.",
      bandPlaceholder: "Band measurement",
      bustPlaceholder: "Bust measurement",
      buttonText: "GET MY SIZE",
      resultMessage: "Our collection is the best fit for your range.",
      shopButtons: [
        { label: "SHOP BRAS", url: "/collection" }
      ],
      note: "All sizes in inches"
    },
    extraSections: [
      {
        anchor: "style-guide",
        headingPrefix: "bra",
        headingItalic: "style guide",
        description: "Not sure which style is right for you? Explore our core silhouettes.",
        items: [
          {
            image: "",
            title: "The Demi",
            description: "A classic half-cup silhouette that offers medium coverage and natural lift."
          },
          {
            image: "",
            title: "The Balconette",
            description: "Features wider set straps and a sweetheart neckline for beautiful framing."
          },
          {
            image: "",
            title: "The Triangle",
            description: "Wire-free comfort with natural shape, perfect for smaller busts."
          },
          {
            image: "",
            title: "The Plunge",
            description: "Deep V-neckline ideal for low-cut tops, creating beautiful cleavage."
          },
          {
            image: "",
            title: "The Longline",
            description: "Extended band for smoothing and support, doubles as a crop top."
          },
          {
            image: "",
            title: "The Strapless",
            description: "Versatile support without the straps, essential for bare-shoulder looks."
          },
          {
            image: "",
            title: "The Bralette",
            description: "Ultimate soft comfort for everyday lounging and layering."
          },
          {
            image: "",
            title: "The Push-Up",
            description: "Maximum lift and enhancement for when you want extra volume."
          }
        ]
      }
    ],
    fitSection: {
      description: "Band too tight or straps sliding off your shoulders? Get schooled on all things bra fit & sister sizing below.",
      buttonText: "BRA FIT 101",
      buttonUrl: "/"
    },
    supportSection: {
      headingPrefix: "we",
      headingItalic: "support you",
      description: "Still need help? Chat with a Underpure stylist for more information, or book an in-store fitting with a bra specialist below (we recommend a professional fitting every 6 months to a year).",
      buttonText: "CHAT WITH UNDERPURE"
    }
  }
};
