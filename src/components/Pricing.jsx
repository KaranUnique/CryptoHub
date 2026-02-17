// Pricing.jsx - FIXED & PRODUCTION READY VERSION
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import './Pricing.css';
import {
  FiCheck, FiX, FiInfo, FiArrowRight, FiStar, FiShield, FiClock,
  FiUsers, FiTrendingUp, FiZap, FiPlus
} from "react-icons/fi";
import { plans, faqs, comparisonFeatures } from "../data/pricingPlansData";

export default function Pricing() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // FIXED: Proper scroll handler with cleanup
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrollTop / docHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // FIXED: Memoized handlers to prevent re-renders
  const handlePlanClick = useCallback((planName) => {
    if (planName === "Explorer") {
      navigate("/signup");
    } else {
      // Simulate payment modal
      const modal = document.getElementById('payment-modal');
      if (modal) {
        modal.showModal();
      } else {
        alert("Payment coming soon! 🚀");
      }
    }
  }, [navigate]);

  const toggleBillingCycle = useCallback(() => {
    setBillingCycle(prev => prev === "monthly" ? "yearly" : "monthly");
  }, []);

  const getPrice = useCallback((planPrice, cycle) => {
    if (cycle === "yearly") {
      const monthlyPrice = parseFloat(planPrice.replace('$', '')) || 0;
      const yearlyPrice = (monthlyPrice * 12 * 0.83).toFixed(0); // 17% discount
      return `$${yearlyPrice}/year`;
    }
    return `${planPrice}/mo`;
  }, []);

  // FIXED: Animation variants for controlled animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 }
    },
    hover: {
      y: -10,
      scale: 1.02,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      {/* FIXED: Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 z-50 origin-left"
        style={{ scaleX: scrollProgress }}
        initial={false}
        animate={{ scaleX: scrollProgress }}
        transition={{ duration: 0.1 }}
      />

      {/* Hero Header */}
      <motion.section
        className="relative py-24 px-6 overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Background Glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={itemVariants}
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-12 px-6 py-3 bg-white/20 dark:bg-white/10 backdrop-blur-xl rounded-full border border-white/30 mx-auto max-w-max"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring" }}
          >
            <FiTrendingUp className="text-purple-400 w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Trusted by 10K+ Traders
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-black mb-8 leading-tight bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Unlock Your Crypto Potential
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-16 leading-relaxed"
            variants={itemVariants}
          >
            Choose the perfect plan for your trading journey with lightning-fast signals and enterprise-grade tools.
          </motion.p>

          {/* FIXED: Working Billing Toggle */}
          <motion.div
            className="flex flex-col justify-center items-center gap-6 p-8 bg-white/20 dark:bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 max-w-lg mx-auto"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring" }}
          >
            <div className="flex flex-col lg:flex-row justify-center items-center gap-6">
              <span className={`text-lg font-semibold ${billingCycle === 'monthly' ? 'text-gray-900 dark:dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400'}`}>
                Monthly
              </span>

              <motion.button
                className="relative w-28 h-14 rounded-full p-2 bg-white/30 dark:bg-white/20 backdrop-blur-xl border-2 border-white/40 shadow-xl"
                onClick={toggleBillingCycle}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                aria-label="Toggle billing cycle"
              >
                <motion.div
                  className="absolute top-2 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg flex items-center justify-center shadow-purple-500/50"
                  animate={{
                    x: billingCycle === 'yearly' ? 56 : 0
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  }}
                >
                  <FiZap className="text-white w-5 h-5" />
                </motion.div>
              </motion.button>

              <span className={`text-lg font-semibold flex items-center gap-2 ${billingCycle === 'yearly' ? 'text-gray-900 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400'}`}>
                Yearly
              </span>
            </div>

            <AnimatePresence mode="wait">
              {billingCycle === 'yearly' && (
                <motion.div
                  key="save-badge"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <span className="px-3 py-1 bg-green-500/20 text-green-500 text-xs font-bold rounded-full flex items-center gap-1">
                    Save 17%
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Pricing Cards */}
      <motion.section
        className="py-20 px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 lg:gap-12">
          {plans.map((plan) => {

            const currentPrice = getPrice(plan?.price, billingCycle);

            return (
              <motion.div
                key={plan.name}
                className={`glass-panel rounded-3xl p-1 relative overflow-hidden group
                  ${plan.highlight ? 'ring-4 ring-purple-500/20 shadow-2xl shadow-purple-500/25 lg:scale-[1.02]' : 'shadow-xl'}`}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true }}
              >
                {/* Card Background */}
                <div className="h-full w-full bg-linear-to-br bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[1.75rem] p-8 flex flex-col relative z-10 border border-white/30 dark:border-gray-700/50">

                  {/* Popular Badge */}
                  {plan.highlight && (
                    <motion.div
                      className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-3 rounded-full text-sm font-bold shadow-2xl whitespace-nowrap"
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      <FiStar className="inline mr-2 -mt-1 w-4 h-4" />
                      Most Popular
                    </motion.div>
                  )}

                  {/* Header */}
                  <div className="text-center mb-8 flex-1">
                    <h3 className="text-3xl font-black mb-6">
                      {plan.name}
                    </h3>
                    <div className="mb-6">
                      <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 mb-2">
                        {currentPrice}
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">
                        billed {billingCycle}
                      </p>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-12">
                    {plan.features.map((feature, i) => (
                      <motion.div
                        key={i}
                        className={`flex items-center gap-4 py-1 rounded-xl transition-all duration-300 group/feature hover:bg-white/50 dark:hover:bg-gray-800/50 ${feature.available ? '' : 'opacity-60'
                          }`}
                        whileHover={{ paddingLeft: '2.5rem' }}
                      >
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center shadow-lg shrink-0 ${feature.available
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/40'
                          : 'bg-gray-200/50 dark:bg-gray-700/50 text-gray-400 border-2 border-gray-300/50 dark:border-gray-600/50'
                          }`}>
                          {feature.available ? <FiCheck className="w-6 h-6" /> : <FiX className="w-6 h-6" />}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{feature.label}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    className={`w-full py-6 px-8 rounded-2xl font-bold text-lg uppercase tracking-wider shadow-2xl transition-all duration-300 overflow-hidden relative ${plan.highlight
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-purple-500/40 hover:shadow-purple-500/60 hover:-translate-y-1'
                      : 'bg-gray-700 dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200/50 dark:border-gray-600/50 hover:bg-gray-800 dark:hover:bg-gray-900'
                      }`}
                    onClick={() => handlePlanClick(plan.name)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {plan.name === "Explorer" ? "Get Started Free" : "Upgrade Now"}
                      <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* FIXED: Working Comparison Table */}
      <motion.section
        className="py-20 px-6 bg-linear-to-b from-gray-50/50 to-transparent dark:from-gray-900/50"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-20" variants={itemVariants}>
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Compare All Plans
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              See every feature side by side and choose what fits your strategy
            </p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-white/30 dark:border-gray-700/50 shadow-2xl">
              <thead>
                <tr className="border-b border-gray-200/50 dark:border-gray-700/50">
                  <th className="p-6 text-left font-bold text-lg">Feature</th>
                  {plans.map((plan) => (
                    <th key={plan.name} className="p-6 text-center relative">
                      <div>
                        <div className="text-2xl font-black mb-1">{plan.name}</div>
                        <div className="text-sm text-gray-500 uppercase tracking-wider">
                          {getPrice(plan.price, billingCycle)}
                        </div>
                      </div>
                      {plan.highlight && (
                        <div className="w-3/4 md:w-1/2 mx-auto mt-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                          Most Popular
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                {comparisonFeatures.map((feature, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-6 font-semibold text-lg text-gray-900 dark:text-white">
                      {feature.name}
                    </td>
                    {plans.map((plan) => {
                      const available = plan.features.find(f =>
                        f.label?.toLowerCase().includes(feature.name.toLowerCase())
                      )?.available || false;
                      return (
                        <td key={plan.name} className="p-8 text-center">
                          {available ? (
                            <div className="flex items-center justify-center gap-2 text-emerald-600 font-semibold">
                              <FiCheck className="w-6 h-6" />
                              <span>Yes</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2 text-gray-400">
                              <FiX className="w-6 h-6" />
                              <span>Upgrade</span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.section>

      {/* FIXED: Working FAQ Section */}
      <motion.section
        className="py-24 px-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-5xl md:text-6xl font-black text-center mb-20 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Frequently Asked Questions
          </motion.h2>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="glass-panel rounded-2xl overflow-hidden shadow-xl"
                variants={itemVariants}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <motion.button
                  className="w-full py-8 px-10 text-left hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300"
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                      {faq.question}
                    </h4>
                    <motion.div
                      animate={{ rotate: openFaqIndex === index ? 90 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FiPlus className="w-7 h-7 text-gray-500" />
                    </motion.div>
                  </div>
                </motion.button>

                <AnimatePresence>
                  {openFaqIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-10 pb-8 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
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

      {/* FIXED: Payment Modal */}
      <dialog id="payment-modal" className="backdrop:bg-black/80 p-8 w-full max-w-md mx-auto">
        <motion.form
          className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/50 dark:border-gray-700/50"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
        >
          <h3 className="text-3xl font-black mb-8 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Payment Setup
          </h3>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12 text-lg leading-relaxed">
            Secure payment processing is rolling out soon.
            You'll be the first to know when it's live!
          </p>
          <div className="space-y-4">
            <button
              type="button"
              className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-4 px-6 rounded-2xl font-bold shadow-lg transition-all hover:shadow-xl hover:-translate-y-1"
              onClick={() => {
                const modal = document.getElementById('payment-modal');
                modal?.close();
              }}
            >
              Close
            </button>
            <button
              type="button"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 px-6 rounded-2xl font-bold shadow-lg shadow-purple-500/40 transition-all hover:shadow-xl hover:-translate-y-1"
            >
              Notify Me When Ready
            </button>
          </div>
        </motion.form>
      </dialog>

      <style jsx>{`
        dialog[open] {
          animation: modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes modalSlideIn {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}