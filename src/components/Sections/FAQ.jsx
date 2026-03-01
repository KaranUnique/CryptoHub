import React,{useState} from 'react'
import './FAQ.css'

const FAQ = () => {
const [activeIndex, setActiveIndex] = useState(null);

  
const faqData = [
  {
    question: "What is CryptoHub?",
    answer: (
      <>
        <p>
          CryptoHub is a comprehensive cryptocurrency tracking platform designed to help users monitor the crypto market in real time.
        </p>

        <div>
          <p>• Track live cryptocurrency prices and trends</p>
          <p>• Analyze market insights and performance data</p>
          <p>• Manage and monitor your personal crypto portfolio</p>
        </div>

        <p>
          It is built to provide simple and user-friendly tools for both beginners and experienced traders.
        </p>
      </>
    )
  },
  {
    question: "Is CryptoHub free to use?",
    answer: (
      <>
        <p>
          Yes, CryptoHub offers a free plan that provides access to essential features.
        </p>

        <div>
          <p>• Real-time crypto price tracking</p>
          <p>• Market overview and insights</p>
          <p>• Basic portfolio management</p>
        </div>

        <p>
          Premium features may be available for users who need advanced analytics and tools.
        </p>
      </>
    )
  },
  {
    question: "Where does CryptoHub get its data?",
    answer: (
      <>
        <p>
          CryptoHub collects data from trusted cryptocurrency market APIs and exchange platforms.
        </p>

        <div>
          <p>• Live price feeds</p>
          <p>• Market capitalization data</p>
          <p>• Trading volume statistics</p>
        </div>

        <p>
          The platform continuously updates its data to ensure accuracy and reliability.
        </p>
      </>
    )
  },
  {
    question: "Can I track my portfolio?",
    answer: (
      <>
        <p>
          Yes, users can create and manage their crypto portfolio directly on CryptoHub.
        </p>

        <div>
          <p>• Add cryptocurrencies you own</p>
          <p>• Track profit and loss</p>
          <p>• Monitor overall portfolio performance</p>
        </div>

        <p>
          This helps users make informed investment decisions.
        </p>
      </>
    )
  },
  {
    question: "Is my data secure?",
    answer: (
      <>
        <p>
          Yes, we follow industry-standard security practices to protect user information.
        </p>

        <div>
          <p>• Secure authentication systems</p>
          <p>• Encrypted data handling</p>
          <p>• Protected API integrations</p>
        </div>

        <p>
          User privacy and security are a top priority for CryptoHub.
        </p>
      </>
    )
  }
];
   
  
  
const toogleFAQ=(idx)=>{
    setActiveIndex(activeIndex === idx ? null : idx);
}
  return (
    <div className="faq-page">
        <div className="faq-title">Frequently Asked Questions</div>
        <p className="faq-subtitle" >Find quick answers about CryptoHub and how it works.</p>

        <div className="faq-container">
            {faqData.map((item,idx)=>(
                <div key={idx} className={`faq-item ${activeIndex === idx ? "active" : ""}`}>
                    
                    <button className="faq-question" onClick={()=>toogleFAQ(idx)}>{item.question}</button>
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
