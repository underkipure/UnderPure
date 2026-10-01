export const engagementDefaults = {
  popupSettings: {
    enabled: true,
    discountText: '15% OFF',
    heading: 'YOUR FIRST ORDER',
    text: 'Get VIP access to our newest launches, limited-edition sets, sales, and more.',
    buttonText: 'SIGN UP',
    image: '',
    bgColor: '#ffffff',
    textColor: '#000000',
    buttonColor: '#000000',
    buttonTextColor: '#ffffff'
  },
  chatWidgetData: {
    enabled: true,
    title: "Hi there, how can we help?",
    searchPlaceholder: "Search for answers",
    leaveMessageText: "Leave us a message",
    whatsappNumber: "+923000000000",
    questions: [
      { id: 1, question: "How can I track my order?", answer: "Once your order has shipped, you will receive a confirmation email with a tracking number. You can also track your order by logging into your account and viewing Order History." },
      { id: 2, question: "What is the status of my return?", answer: "Once we receive your return, please allow 5-7 business days for inspection and processing. Refunds will be issued to your original payment method." },
      { id: 3, question: "Can I change my shipping address?", answer: "Orders can be modified within 1 hour of placement. Please contact customer support immediately via WhatsApp or email if you need to update your address." },
      { id: 4, question: "What is your return & exchange policy?", answer: "We accept returns within 30 days of delivery for unworn items in original condition with tags attached. Intimates and final sale items are non-returnable." },
    ]
  }
};
