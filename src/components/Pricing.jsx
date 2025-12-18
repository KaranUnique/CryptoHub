//@@viewOn:imports
import "./Pricing.css";
import { PAGE_TEXT } from "../constants/pages";
import { BUTTONS } from "../constants/buttons";
//@@viewOff:imports

//@@viewOn:constants
const PLAN_IDS = {
  FREE: "free",
  PRO: "pro",
  PREMIUM: "premium",
};

const PLANS = [
  {
    id: PLAN_IDS.FREE,
    name: "Free",
    price: "₹0",
    description: "Get started with essential crypto tools.",
    features: [
      "Track top 50 cryptocurrencies",
      "Real-time price updates",
      "Basic charts & analytics",
      "Coin detail pages",
      "Responsive dashboard",
    ],
  },
  {
    id: PLAN_IDS.PRO,
    name: "Pro",
    price: "₹399/month",
    description: "Unlock advanced features for serious traders.",
    features: [
      "Track up to 500 coins",
      "Advanced charting tools",
      "Portfolio tracking",
      "Price alerts & notifications",
      "Ad-free experience",
    ],
  },
  {
    id: PLAN_IDS.PREMIUM,
    name: "Premium",
    price: "₹999/month",
    description: "All-access pass for power users and professionals.",
    features: [
      "Unlimited coins & watchlists",
      "Customizable analytics",
      "Export data to CSV/Excel",
      "Early access to new features",
      "1-on-1 onboarding & support",
    ],
  },
];
//@@viewOff:constants

export default function Pricing() {
  //@@viewOn:private
  //@@viewOff:private

  //@@viewOn:render
  return (
    <div className="pricing-page">
      <div className="pricing-title">{PAGE_TEXT.PRICING.TITLE}</div>
      <div className="pricing-desc">{PAGE_TEXT.PRICING.DESCRIPTION}</div>
      <div className="pricing-cards">
        {PLANS.map((plan, index) => (
          <div key={index} className="pricing-card">
            <h2>{plan.name}</h2>
            <div className="price">{plan.price}</div>
            <div className="desc">{plan.description}</div>
            <ul className="pricing-features">
              {plan.features.map((feature, i) => (
                <li key={i}>✔ {feature}</li>
              ))}
            </ul>
            <button>
              {plan.id === PLAN_IDS.FREE ? BUTTONS.START_FREE : BUTTONS.GET_STARTED}
            </button>
          </div>
        ))}
      </div>
      <div style={{textAlign: 'center', marginTop: '40px', color: '#bdbdbd', fontSize: '1.1rem'}}>
        {PAGE_TEXT.PRICING.FOOTNOTE}
      </div>
    </div>
  );
  //@@viewOff:render
}
