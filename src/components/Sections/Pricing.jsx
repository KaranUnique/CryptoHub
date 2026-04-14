import { useTheme } from "../../context/useTheme";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheck,
  FiX,
  FiArrowRight,
  FiStar,
  FiTrendingUp,
  FiZap,
  FiPlus,
} from "react-icons/fi";
import { plans, faqs, comparisonFeatures } from "../../data/pricingPlansData";

export default function Pricing() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrollTop / docHeight);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePlanClick = useCallback(
    (planName) => {
      if (planName === "Explorer") {
        navigate("/signup");
      } else {
        const modal = document.getElementById("payment-modal");
        if (modal) {
          modal.showModal();
        } else {
          alert("Payment coming soon! 🚀");
        }
      }
    },
    [navigate],
  );

  const toggleBillingCycle = useCallback(() => {
    setBillingCycle((prev) => (prev === "monthly" ? "yearly" : "monthly"));
  }, []);

  const getPrice = useCallback((planPrice, cycle) => {
    if (cycle === "yearly") {
      const monthlyPrice = parseFloat(planPrice.replace("$", "")) || 0;
      const yearlyPrice = (monthlyPrice * 12 * 0.83).toFixed(0);
      return `$${yearlyPrice}/year`;
    }
    return `${planPrice}/mo`;
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
    hover: {
      y: -8,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className={`min-h-screen ${isDark ? "dark" : ""}`}>
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 z-50 origin-left"
        style={{ scaleX: scrollProgress }}
        initial={false}
        animate={{ scaleX: scrollProgress }}
        transition={{ duration: 0.1 }}
      />

      {/* Hero Section */}
      <motion.section
        className="relative py-28 px-6 lg:px-8 overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Ambient Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-1/3 w-96 h-96 bg-gradient-to-br from-purple-300/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gradient-to-tr from-blue-300/20 to-transparent rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 mb-10 px-5 py-2.5 bg-purple-500/10 dark:bg-purple-500/20 backdrop-blur-xl rounded-full border border-purple-400/30 dark:border-purple-400/40"
            variants={itemVariants}
          >
            <FiTrendingUp className="text-purple-500 w-4 h-4" />
            <span className="text-sm font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wide">
              Simple, Transparent Pricing
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            className="text-6xl lg:text-7xl font-black mb-8 leading-tight bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Plans Built For Growth
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-16 leading-relaxed font-light"
            variants={itemVariants}
          >
            Choose the plan that perfectly fits your trading strategy and unlock
            powerful features
          </motion.p>

          {/* Billing Toggle */}
          <motion.div className="inline-block mb-4" variants={itemVariants}>
            <div className="flex items-center gap-6 p-1.5 bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  billingCycle === "monthly"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 relative ${
                  billingCycle === "yearly"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                Yearly
                {billingCycle === "yearly" && (
                  <span className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">
                    Save 17%
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Pricing Cards Section */}
      <motion.section
        className="py-16 px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-6">
            {plans.map((plan, idx) => {
              const currentPrice = getPrice(plan?.price, billingCycle);

              return (
                <motion.div
                  key={plan.name}
                  variants={cardVariants}
                  whileHover="hover"
                  className={`relative rounded-3xl group transition-all duration-300 ${
                    plan.highlight
                      ? "md:scale-105 overflow-visible"
                      : "overflow-hidden"
                  }`}
                >
                  {/* Card Background with Glass Effect */}
                  <div
                    className={`h-full rounded-3xl backdrop-blur-xl border transition-all duration-300 flex flex-col ${
                      plan.highlight
                        ? "bg-gradient-to-br from-purple-500/20 to-pink-500/10 border-purple-400/30 dark:border-purple-400/40 shadow-2xl shadow-purple-500/20 dark:shadow-purple-500/30 p-8 pt-14"
                        : "bg-white/50 dark:bg-gray-900/50 border-gray-200/50 dark:border-gray-700/50 shadow-xl dark:shadow-2xl p-8"
                    }`}
                  >
                    {/* Popular Badge */}
                    {plan.highlight && (
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2 whitespace-nowrap">
                          <FiStar className="w-4 h-4" />
                          Most Popular
                        </div>
                      </div>
                    )}

                    {/* Plan Name */}
                    <h3 className="text-2xl lg:text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                      {plan.name}
                    </h3>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                        {currentPrice}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">
                        {billingCycle === "yearly"
                          ? "per year, billed annually"
                          : "per month"}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed flex-grow">
                      {plan.description}
                    </p>

                    {/* Features List */}
                    <div className="space-y-3 mb-10 flex-grow">
                      {plan.features.map((feature, i) => (
                        <div
                          key={i}
                          className={`flex items-start gap-3 text-sm lg:text-base font-medium transition-all ${
                            feature.available
                              ? "text-gray-900 dark:text-gray-100"
                              : "text-gray-500 dark:text-gray-500 opacity-60"
                          }`}
                        >
                          <div
                            className={`mt-0.5 flex-shrink-0 rounded-lg flex items-center justify-center w-5 h-5 ${
                              feature.available
                                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                            }`}
                          >
                            {feature.available ? (
                              <FiCheck className="w-3.5 h-3.5" />
                            ) : (
                              <FiX className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <span>{feature.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <motion.button
                      onClick={() => handlePlanClick(plan.name)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-5 px-6 rounded-2xl font-bold text-base uppercase tracking-wide transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${
                        plan.highlight
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-purple-500/40 hover:shadow-purple-500/60 hover:shadow-xl"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      {plan.name === "Explorer"
                        ? "Get Started Free"
                        : "Upgrade Now"}
                      <FiArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Comparison Table */}
      <motion.section
        className="py-20 px-6 lg:px-8 bg-gradient-to-b from-gray-50/50 dark:from-gray-900/30 to-transparent"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-5xl lg:text-6xl font-black mb-4 text-gray-900 dark:text-white">
              Compare Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              See what's included in each plan
            </p>
          </motion.div>

          <motion.div className="overflow-x-auto" variants={itemVariants}>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="p-6 text-left font-bold text-lg text-gray-900 dark:text-white">
                    Feature
                  </th>
                  {plans.map((plan) => (
                    <th key={plan.name} className="p-6 text-center min-w-max">
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {plan.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {getPrice(plan.price, billingCycle)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {comparisonFeatures.map((feature, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="p-6 font-semibold text-gray-900 dark:text-white">
                      {feature.name}
                    </td>
                    {plans.map((plan) => {
                      const hasFeature = plan.features.find((f) =>
                        f.label
                          ?.toLowerCase()
                          .includes(feature.name.toLowerCase()),
                      )?.available;

                      return (
                        <td key={plan.name} className="p-6 text-center">
                          {hasFeature ? (
                            <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                              <FiCheck className="w-5 h-5" />
                              <span className="hidden sm:inline">Included</span>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        className="py-20 px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-3xl mx-auto">
          <motion.h2
            className="text-5xl lg:text-6xl font-black text-center mb-16 text-gray-900 dark:text-white"
            variants={itemVariants}
          >
            Questions?
          </motion.h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl hover:border-gray-300 dark:hover:border-gray-600 transition-all"
                variants={itemVariants}
              >
                <button
                  onClick={() =>
                    setOpenFaqIndex(openFaqIndex === index ? null : index)
                  }
                  className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openFaqIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <FiPlus className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openFaqIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-8 pb-6 text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-6">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Payment Modal */}
      <dialog id="payment-modal" className="backdrop:bg-black/50 p-6 max-w-md">
        <motion.div
          className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-700 shadow-2xl"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Upgrade Your Plan
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Secure payment processing is coming soon. We'll notify you as soon
            as it's available!
          </p>
          <div className="space-y-3 flex flex-col-reverse">
            <button
              onClick={() => document.getElementById("payment-modal")?.close()}
              className="w-full py-3 px-6 rounded-xl font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
            <button className="w-full py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl">
              Notify Me
            </button>
          </div>
        </motion.div>
      </dialog>
    </div>
  );
}
