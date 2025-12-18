//@@viewOn:imports
import "./Blog.css";
import { PAGE_TEXT } from "../constants/pages";
//@@viewOff:imports

//@@viewOn:helpers
const blogPosts = [
  {
    title: "What is Cryptocurrency?",
    date: "August 2025",
    excerpt:
      "Cryptocurrency is a digital or virtual currency that uses cryptography for security. It operates independently of a central bank and enables peer-to-peer transactions on a decentralized network called blockchain.",
    content: `Cryptocurrency is a digital or virtual currency that uses cryptography for security. It operates independently of a central bank and enables peer-to-peer transactions on a decentralized network called blockchain. Bitcoin was the first cryptocurrency, but now there are thousands, each with unique features and use cases.`,
  },
  {
    title: "How to Get Started with Crypto",
    date: "August 2025",
    excerpt:
      "Learn the basics of getting started with crypto: choosing an exchange, securing your account, and making your first purchase.",
    content: `1. Choose a reputable crypto exchange. 2. Create and secure your account. 3. Fund your wallet and start buying coins. 4. Always research before investing and use strong security practices.`,
  },
  {
    title: "Popular Cryptocurrencies in 2025",
    date: "August 2025",
    excerpt:
      "Explore the most popular cryptocurrencies: Bitcoin, Ethereum, Solana, Cardano, and more.",
    content: `Bitcoin (BTC): The first and most well-known cryptocurrency. Ethereum (ETH): Known for smart contracts and decentralized apps. Solana, Cardano, Polygon, and more: Each offers unique features and use cases.`,
  },
  {
    title: "Crypto Safety Tips",
    date: "August 2025",
    excerpt:
      "Stay safe in the crypto world with these essential security tips.",
    content: `- Use strong, unique passwords and enable 2FA. - Never share your private keys. - Be cautious of scams and phishing attempts. - Only use trusted wallets and exchanges.`,
  },
];
//@@viewOff:helpers

export default function Blog() {
  //@@viewOn:render
  return (
    <div className="blog-page">
      <div className="blog-title">{PAGE_TEXT.BLOG.TITLE}</div>
      <div className="blog-desc">
        {PAGE_TEXT.BLOG.SUBTITLE}
      </div>
      <div className="blog-list">
        {blogPosts.map((post, idx) => (
          <div className="blog-card" key={idx}>
            <div className="blog-card-title">{post.title}</div>
            <div className="blog-card-date">{post.date}</div>
            <div className="blog-card-excerpt">{post.excerpt}</div>
            {/* In a real app, add a 'Read more' link or modal for full content */}
          </div>
        ))}
      </div>
    </div>
  );
  //@@viewOff:render
}
