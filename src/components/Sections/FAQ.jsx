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
        "Yes. We use industry-standard security practices to protect user data."
    }
  ];
  const toogleFAQ = (idx) => {
    setActiveIndex(activeIndex === idx ? null : idx);
  }
  return (
    <div className="faq-page">
      <div className="faq-title">Frequently Asked Questions</div>
      <p className="faq-subtitle" >Find quick answers about CryptoHub and how it works.</p>

      <div className="faq-container">
        {faqData.map((item, idx) => (
          <div key={idx} className={`faq-item ${activeIndex === idx ? "active" : ""}`}>

            <button className="faq-question" onClick={() => toogleFAQ(idx)}>{item.question}</button>
            <div
              className={`faq-answer ${activeIndex === idx ? "show" : ""}`}
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