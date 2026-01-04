// ✅ Import images correctly (VERY IMPORTANT in React)
import blog1 from "../assets/blog1.jpg";
import blog2 from "../assets/blog2.jpg";
import blog3 from "../assets/blog3.jpg";
import blog4 from "../assets/blog4.jpg";

export const blogPosts = [
  {
    title: "What is Cryptocurrency?",
    date: "August 2025",
    image: blog1,
    toc: [
      "Introduction",
      "How Cryptocurrency Works",
      "Blockchain Technology",
      "Why People Use Crypto",
      "Conclusion",
    ],
    sections: [
      {
        heading: "Introduction",
        text: `
Cryptocurrency is a type of digital money.
It exists only online and cannot be touched like cash.
It uses cryptography to keep transactions secure.
`,
      },
      {
        heading: "How Cryptocurrency Works",
        text: `
Cryptocurrency works on a technology called blockchain.
Blockchain is a public record of all transactions.
Once data is added, it cannot be changed.
`,
      },
      {
        heading: "Blockchain Technology",
        text: `
Blockchain removes the need for middlemen like banks.
All users can see transactions transparently.
This makes the system more secure and trustworthy.
`,
      },
      {
        heading: "Why People Use Crypto",
        text: `
People use crypto for fast payments and low fees.
It allows global transfers without banks.
It also gives financial freedom.
`,
      },
      {
        heading: "Conclusion",
        text: `
Cryptocurrency is still growing.
Learning the basics helps you stay safe and informed.
`,
      },
    ],
  },

  {
    title: "How to Get Started with Crypto",
    date: "August 2025",
    image: blog2,
    toc: [
      "Choose an Exchange",
      "Create an Account",
      "Secure Your Wallet",
      "Make Your First Purchase",
    ],
    sections: [
      {
        heading: "Choose an Exchange",
        text: `
A crypto exchange is where you buy and sell crypto.
Popular exchanges include Binance and Coinbase.
Always choose a trusted platform.
`,
      },
      {
        heading: "Create an Account",
        text: `
Sign up using your email and verify identity.
Use a strong password.
Never share your login details.
`,
      },
      {
        heading: "Secure Your Wallet",
        text: `
Enable two-factor authentication (2FA).
Store private keys safely.
Security is very important in crypto.
`,
      },
      {
        heading: "Make Your First Purchase",
        text: `
Start with a small amount.
Learn before investing large money.
Never invest what you cannot afford to lose.
`,
      },
    ],
  },

  {
    title: "Popular Cryptocurrencies in 2025",
    date: "August 2025",
    image: blog3,
    toc: ["Bitcoin", "Ethereum", "Altcoins"],
    sections: [
      {
        heading: "Bitcoin",
        text: `
Bitcoin is the first cryptocurrency.
It is often called digital gold.
It has limited supply.
`,
      },
      {
        heading: "Ethereum",
        text: `
Ethereum allows smart contracts.
Many apps run on Ethereum blockchain.
It is very popular among developers.
`,
      },
      {
        heading: "Altcoins",
        text: `
Altcoins include Solana, Cardano, and Polygon.
They offer faster transactions and lower fees.
`,
      },
    ],
  },

  {
    title: "Crypto Safety Tips",
    date: "August 2025",
    image: blog4,
    toc: ["Strong Passwords", "Avoid Scams", "Safe Storage", "Final Advice"],
    sections: [
      {
        heading: "Strong Passwords",
        text: `
Always use strong and unique passwords.
Avoid using the same password everywhere.
`,
      },
      {
        heading: "Avoid Scams",
        text: `
Never click unknown links.
Beware of fake giveaways.
`,
      },
      {
        heading: "Safe Storage",
        text: `
Use hardware wallets for long-term storage.
Keep backup phrases offline.
`,
      },
      {
        heading: "Final Advice",
        text: `
Crypto is powerful but risky.
Stay educated and cautious.
`,
      },
    ],
  },
];