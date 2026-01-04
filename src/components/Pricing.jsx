import "./Pricing.css";
import { plans } from "../data/pricingPlansData";

export default function Pricing() {

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
      <div data-aos="fade-out" style={{ textAlign: 'center', marginTop: '40px', color: '#bdbdbd', fontSize: '1.1rem' }}>
        All plans include secure access, regular updates, and community support.
      </div>
    </div>
  );
}
