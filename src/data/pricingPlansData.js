// SAMPLE DATA - REQUIRED FOR WORKING CODE
export const plans = [
  {
    name: "Explorer",
    price: "$0",
    period: "/month",
    description: "Perfect for beginners",
    highlight: false,
    features: [
      { label: "Basic Market Data", available: true },
      { label: "5 Signals/Day", available: true },
      { label: "Email Alerts", available: true },
      { label: "Mobile App", available: true },
      { label: "Real-time Charts", available: false },
      { label: "Priority Support", available: false },
    ]
  },
  {
    name: "Trader",
    price: "$29",
    period: "",
    description: "For active traders",
    highlight: true,
    features: [
      { label: "Basic Market Data", available: true },
      { label: "Unlimited Signals", available: true },
      { label: "SMS + Email Alerts", available: true },
      { label: "Mobile App Pro", available: true },
      { label: "Real-time Charts", available: true },
      { label: "24/7 Priority Support", available: true },
    ]
  },
  {
    name: "Pro",
    price: "$99",
    period: "",
    description: "Enterprise features",
    highlight: false,
    features: [
      { label: "Everything in Trader", available: true },
      { label: "Advanced Analytics", available: true },
      { label: "API Access", available: true },
      { label: "Custom Alerts", available: true },
      { label: "Dedicated Manager", available: true },
      { label: "White-label App", available: true },
    ]
  }
];

export const comparisonFeatures = [
  { name: "Market Data" },
  { name: "Signals" },
  { name: "Alerts" },
  { name: "Charts" },
  { name: "Support" },
  { name: "API Access" }
];

export const faqs = [
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, Apple Pay, Google Pay, and cryptocurrency payments through our secure gateway."
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes! Cancel anytime with no questions asked. Your subscription will continue until the end of the billing period."
  },
  {
    question: "Is there a free trial?",
    answer: "The Explorer plan is completely free forever. All paid plans come with a 14-day money-back guarantee."
  },
  {
    question: "How secure is my data?",
    answer: "We use enterprise-grade encryption (AES-256) and comply with GDPR, SOC 2 Type II standards. Your data is safe."
  }
];