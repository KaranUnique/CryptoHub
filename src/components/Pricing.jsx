import "./Pricing.css";

export default function Pricing() {
      const plans = [
  {
    name: "Free",
    price: "₹0",
    description: "Get started with essential crypto tools.",
    features: [
      { label: "Track top 50 cryptocurrencies", available: true },
      { label: "Real-time price updates", available: true },
      { label: "Basic charts & analytics", available: true },
      { label: "Coin detail pages", available: true },
      { label: "Responsive dashboard", available: true },
      { label: "Portfolio tracking", available: false },
      { label: "Price alerts & notifications", available: false },
      { label: "Ad-free experience", available: false },
      { label: "Advanced charting tools", available: false },
    ],
  },
  {
    name: "Pro",
    price: "₹399/month",
    description: "Unlock advanced features for serious traders.",
    features: [
      { label: "Track up to 500 coins", available: true },
      { label: "Advanced charting tools", available: true },
      { label: "Portfolio tracking", available: true },
      { label: "Price alerts & notifications", available: true },
      { label: "Ad-free experience", available: true },
      { label: "Unlimited coins & watchlists", available: false },
      { label: "Export data to CSV/Excel", available: false },
      { label: "1-on-1 onboarding & support", available: false },
    ],
  },
  {
    name: "Premium",
    price: "₹999/month",
    description: "All-access pass for power users and professionals.",
    features: [
      { label: "Unlimited coins & watchlists", available: true },
      { label: "Customizable analytics", available: true },
      { label: "Export data to CSV/Excel", available: true },
      { label: "Early access to new features", available: true },
      { label: "1-on-1 onboarding & support", available: true },
    ],
  },
];

  return (
    <div className="pricing-page">
      <div data-aos="fade-in" className="pricing-title">Pricing Plans</div>
      <div data-aos="fade-in" className="pricing-desc">Choose the plan that fits your crypto journey. Upgrade anytime!</div>
      <div className="pricing-cards">
        {plans.map((plan, index) => (
          <div key={index} data-aos={index % 2 === 0 ? "fade-up" : "fade-down"} className="pricing-card">
            <h2>{plan.name}</h2>
            <div className="price">{plan.price}</div>
            <div className="desc">{plan.description}</div>
            <ul className="pricing-features">
              {plan.features.map((feature, i) => (
  <li
    key={i}
    className={feature.available ? "feature-available" : "feature-unavailable"}
  >
    {feature.available ? "✔" : "✖"} {feature.label}
  </li>
))}

            </ul>
            <button class="pricing-button">
              {plan.name === "Free" ? "Start for Free" : "Get Started"}
            </button>
          </div>
        ))}
      </div>
      <div data-aos="fade-out" style={{textAlign: 'center', marginTop: '40px', color: '#bdbdbd', fontSize: '1.1rem'}}>
        All plans include secure access, regular updates, and community support.
      </div>
    </div>
  );
}
