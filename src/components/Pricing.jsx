import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Pricing() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const handlePlanClick = (planName) => {
    if (planName === "Free") {
      navigate("/signup");
    } else {
      alert("💳 Payment Gateway Coming Soon!\n\nWe're working on integrating secure payment options. Stay tuned!");
    }
  };

  const plans = [
    {
      name: "Free",
      price: "₹0",
      yearlyPrice: "₹0",
      description: "Perfect for getting started with crypto tracking",
      features: [
        "Track top 50 cryptocurrencies",
        "Real-time price updates",
        "Basic charts & analytics",
        "Coin detail pages",
        "Responsive dashboard",
      ],
      limitations: [
        "Portfolio tracking",
        "Price alerts & notifications",
        "Ad-free experience",
        "Advanced charting tools",
      ],
    },
    {
      name: "Pro",
      price: "₹399",
      yearlyPrice: "₹3,990",
      description: "Advanced tools for serious crypto traders",
      popular: true,
      features: [
        "Track up to 500 coins",
        "Advanced charting tools",
        "Portfolio tracking with analytics",
        "Real-time price alerts",
        "Ad-free experience",
        "Priority customer support",
        "Market insights & reports",
      ],
      limitations: [
        "Unlimited coins & watchlists",
        "Export data to CSV/Excel",
        "Early access to new features",
      ],
    },
    {
      name: "Premium",
      price: "₹999",
      yearlyPrice: "₹9,990",
      description: "Everything you need for professional trading",
      features: [
        "Unlimited coins & watchlists",
        "Advanced portfolio analytics",
        "Export data to CSV/Excel",
        "Early access to new features",
        "Dedicated account manager",
        "Custom alerts & automations",
        "Tax reporting assistance",
      ],
      limitations: [],
    },
  ];

  const comparisonFeatures = [
    { feature: "Tracked Cryptocurrencies", values: ["50", "500", "Unlimited"] },
    { feature: "Real-time Updates", values: [true, true, true] },
    { feature: "Portfolio Tracking", values: [false, true, true] },
    { feature: "Price Alerts", values: [false, true, true] },
    { feature: "Advanced Charts", values: [false, true, true] },
    { feature: "Data Export", values: [false, false, true] },
    { feature: "API Access", values: [false, false, true] },
    { feature: "Priority Support", values: [false, true, true] },
  ];

  const faqs = [
    {
      q: "Can I change plans later?",
      a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.",
    },
    {
      q: "Is there a free trial?",
      a: "All paid plans come with a 14-day free trial. No credit card required to start.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept all major credit cards, debit cards, UPI, and net banking.",
    },
    {
      q: "Can I cancel anytime?",
      a: "Absolutely. Cancel your subscription anytime with no questions asked.",
    },
  ];

  const containerBg = isDark
    ? 'bg-gradient-to-b from-[#0a0a1b] via-[#0f0f23] to-[#0a0a1b]'
    : 'bg-gradient-to-b from-gray-50 via-white to-gray-50';

  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const textTertiary = isDark ? 'text-gray-500' : 'text-gray-600';

  const cardBg = (popular) => popular
    ? isDark
      ? 'bg-gradient-to-b from-purple-900/20 to-gray-900/50 border-2 border-purple-500 shadow-2xl shadow-purple-500/20 lg:scale-105'
      : 'bg-white border-2 border-purple-500 shadow-2xl lg:scale-105'
    : isDark
      ? 'bg-gray-900/50 border border-gray-800 hover:border-gray-700 shadow-xl'
      : 'bg-white border border-gray-200 hover:border-gray-300 shadow-lg';

  const buttonBg = (popular) => popular
    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/30'
    : isDark
      ? 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white'
      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg';

  return (
    <div className={`min-h-screen ${containerBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">

        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20 animate-fade-in">
          <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 ${textPrimary} animate-slide-down`}>
            Choose Your Plan
          </h1>

          <p className={`text-base sm:text-lg lg:text-xl max-w-2xl mx-auto mb-6 sm:mb-8 lg:mb-10 px-4 ${textSecondary}`}>
            Start free and upgrade as you grow. All plans include essential crypto tracking tools.
          </p>

          {/* Billing Toggle */}
          <div className={`inline-flex items-center gap-2 sm:gap-3 p-1.5 rounded-full animate-fade-in ${isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-200 border border-gray-300'
            }`}>
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium text-xs sm:text-sm transition-all duration-300 ${billingCycle === "monthly"
                ? isDark
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg'
                  : 'bg-white text-gray-900 shadow-md'
                : isDark
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium text-xs sm:text-sm transition-all duration-300 relative ${billingCycle === "yearly"
                ? isDark
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg'
                  : 'bg-white text-gray-900 shadow-md'
                : isDark
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs font-bold bg-green-500 text-white rounded-full">
                -17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20 lg:mb-24">
          {plans.map((plan, index) => (
            <div key={plan.name} className={`relative rounded-2xl transition-all duration-300 hover:-translate-y-2 ${cardBg(plan.popular)} hover:shadow-2xl animate-fade-in`} style={{ animationDelay: `${index * 100}ms` }}>
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="px-3 sm:px-5 py-1 sm:py-1.5 rounded-full text-xs font-bold bg-black dark:bg-gradient-to-r dark:from-purple-600 dark:to-pink-600 text-white shadow-2xl ring-2 ring-white ring-offset-2 ring-offset-transparent">
                    MOST POPULAR
                  </div>
                </div>
              )}
              <div className="p-6 sm:p-8">
                {/* Plan Header */}
                <div className="mb-6 sm:mb-8">
                  <h3 className={`text-xl sm:text-2xl font-bold mb-2 ${textPrimary}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-xs sm:text-sm ${textSecondary}`}>
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6 sm:mb-8">
                  <div className="flex items-end gap-1 mb-2">
                    <span className={`text-4xl sm:text-5xl font-bold ${plan.popular
                      ? 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'
                      : textPrimary
                      }`}>
                      {billingCycle === "monthly" ? plan.price : plan.yearlyPrice}
                    </span>
                    {plan.price !== "₹0" && (
                      <span className={`text-base sm:text-lg pb-1 sm:pb-2 ${textTertiary}`}>
                        /{billingCycle === "monthly" ? "mo" : "yr"}
                      </span>
                    )}
                  </div>
                  {billingCycle === "yearly" && plan.price !== "₹0" && (
                    <p className={`text-xs sm:text-sm ${textTertiary}`}>
                      Billed annually
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handlePlanClick(plan.name)}
                  className={`w-full py-3 sm:py-3.5 px-6 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105 mb-6 sm:mb-8 ${buttonBg(plan.popular)}`}
                >
                  {plan.name === "Free" ? "Get Started" : "Start Free Trial"}
                </button>

                {/* Features */}
                <div>
                  <div className={`text-xs font-semibold uppercase tracking-wide mb-3 sm:mb-4 ${textTertiary}`}>
                    What's Included
                  </div>
                  <ul className="space-y-2.5 sm:space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 sm:gap-3">
                        <svg
                          className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 ${plan.popular ? 'text-purple-500' : 'text-green-500'
                            }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className={`text-xs sm:text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                    {plan.limitations.map((limitation, i) => (
                      <li key={i} className="flex items-start gap-2 sm:gap-3">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {limitation}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Comparison Table */}
        <div className="mb-16 sm:mb-20 lg:mb-24 animate-fade-in">
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 ${textPrimary}`}>
            Compare Plans
          </h2>

          <div className={`rounded-2xl overflow-hidden ${isDark ? 'bg-gray-900/50 border border-gray-800' : 'bg-white border border-gray-200'
            } shadow-xl`}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className={isDark ? 'bg-gray-800/50' : 'bg-gray-50'}>
                    <th className={`py-4 sm:py-5 px-4 sm:px-6 text-left text-xs sm:text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                      Features
                    </th>
                    {plans.map((plan) => (
                      <th key={plan.name} className={`py-4 sm:py-5 px-4 sm:px-6 text-center text-xs sm:text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={isDark ? 'divide-y divide-gray-800' : 'divide-y divide-gray-200'}>
                  {comparisonFeatures.map((row, rowIndex) => (
                    <tr key={rowIndex} className={isDark ? 'hover:bg-gray-800/30' : 'hover:bg-gray-50'}>
                      <td className={`py-4 sm:py-5 px-4 sm:px-6 text-xs sm:text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                        {row.feature}
                      </td>
                      {row.values.map((value, colIndex) => (
                        <td key={colIndex} className="py-4 sm:py-5 px-4 sm:px-6 text-center">
                          {typeof value === "boolean" ? (
                            value ? (
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )
                          ) : (
                            <span className={`text-xs sm:text-sm font-medium ${textSecondary}`}>
                              {value}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16 sm:mb-20 lg:mb-24 animate-fade-in">
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 ${textPrimary}`}>
            Frequently Asked Questions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`rounded-xl transition-all duration-300 overflow-hidden ${isDark ? 'bg-gray-900/50 border border-gray-800' : 'bg-white border border-gray-300 shadow-sm'
                  }`}
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 hover:bg-opacity-80 transition-colors"
                >
                  <h3 className={`font-semibold text-sm sm:text-base ${textPrimary}`}>
                    {faq.q}
                  </h3>
                  <svg
                    className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180' : ''
                      } ${textSecondary}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${openFaqIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                  <p className={`px-5 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-sm ${textSecondary}`}>
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}