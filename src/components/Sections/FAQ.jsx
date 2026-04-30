import React, { useState } from 'react'
import './FAQ.css'

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
  {
    question: "What is CryptoHub?",
    answer:
      "CryptoHub is a platform for real-time crypto tracking, market insights, and portfolio management."
  },
  {
    question: "Is CryptoHub free to use?",
    answer:
      "Yes, CryptoHub offers a free plan. Premium features are available with paid plans."
  },
  {
    question: "Where does CryptoHub get its data?",
    answer:
      "We fetch data from trusted crypto market APIs to ensure accurate and real-time updates."
  },
  {
    question: "Can I track my portfolio?",
    answer:
      "Yes, you can create and manage your crypto portfolio directly on CryptoHub."
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. We use industry-standard encryption and security practices to protect user data."
  },

  // NEW QUESTIONS 👇

  {
    question: "Do I need an account to use CryptoHub?",
    answer:
      "You can browse market data without an account, but you’ll need to sign up to track your portfolio and access personalized features."
  },
  {
    question: "Which cryptocurrencies are supported?",
    answer:
      "CryptoHub supports major cryptocurrencies like Bitcoin, Ethereum, and many altcoins, with new assets added regularly."
  },
  {
    question: "How often is the data updated?",
    answer:
      "Market data is updated in real-time or near real-time depending on the data source."
  },
  {
    question: "Can I connect my exchange account?",
    answer:
      "Currently, manual portfolio tracking is supported. Exchange integrations may be added in future updates."
  },
  {
    question: "Is there a mobile app available?",
    answer:
      "CryptoHub is fully responsive and works on mobile browsers. A dedicated mobile app is under development."
  },
  {
    question: "How do I reset my password?",
    answer:
      "You can reset your password using the 'Forgot Password' option on the login page."
  },
  {
    question: "Does CryptoHub provide investment advice?",
    answer:
      "No. CryptoHub provides data and insights, but does not offer financial or investment advice."
  },
  {
    question: "Can I export my portfolio data?",
    answer:
      "Export functionality may be available in premium plans or upcoming updates."
  },
  {
    question: "What premium features are available?",
    answer:
      "Premium plans may include advanced analytics, alerts, and enhanced portfolio tracking features."
  },
  {
    question: "How can I contact support?",
    answer:
      "You can contact support via the Contact Us page or email provided in the footer."
  }
];

  const toggleFAQ = (idx) => {
    setActiveIndex(activeIndex === idx ? null : idx);
  }
  return (
    <div className="faq-page">
      <div className="faq-title">Frequently Asked Questions</div>
      <p className="faq-subtitle" >Find quick answers about CryptoHub and how it works.</p>

      <div className="faq-container">
        {faqData.map((item, idx) => (
          <div key={idx} className={`faq-item ${activeIndex === idx ? "active" : ""}`}>
            <button
              className="faq-question"
              onClick={() => toggleFAQ(idx)}
              aria-expanded={activeIndex === idx}
              aria-controls={`faq-answer-${idx}`}
            >
              {item.question}
            </button>
            <div
              id={`faq-answer-${idx}`}
              className={`faq-answer ${activeIndex === idx ? "show" : ""}`}
              role="region"
            >
              {item.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FAQ