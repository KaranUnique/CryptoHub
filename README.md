# CryptoHub
<div align="center">

  <img src="./src/assets/CryptoHub.png" alt="CryptoHub Preview" width="100%">
  
  [![Live Demo](https://img.shields.io/badge/Live-Demo-7927ff?style=for-the-badge)](https://crypto-hub-rosy.vercel.app)
  [![GitHub Stars](https://img.shields.io/github/stars/KaranUnique/CryptoHub?style=for-the-badge&logo=github)](https://github.com/KaranUnique/CryptoHub/stargazers)
  [![GitHub Forks](https://img.shields.io/github/forks/KaranUnique/CryptoHub?style=for-the-badge&logo=github)](https://github.com/KaranUnique/CryptoHub/network/members)
  [![License](https://img.shields.io/badge/License-MIT-2193b0?style=for-the-badge)](LICENSE)
</div>

<br>


A modern, beginner-friendly cryptocurrency dashboard built with React and Vite.  
CryptoHub allows users to track real-time crypto prices, analyze coins with charts, and explore crypto-related content—all in one place.

---

## 📑 Table of Contents

- [🎯 Who Is This Project For?](#-who-is-this-project-for)
- [🌟 Key Features](#-key-features)
- [📄 Pages](#-pages)
- [🚀 Getting Started (Local Setup)](#-getting-started-local-setup)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [❗ Common Issues](#-common-issues)
  - [Build for Production](#build-for-production)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🤝 Contributing](#-contributing)
  - [How to Contribute](#how-to-contribute)
  - [Development Guidelines](#development-guidelines)
  - [Areas We're Looking For](#areas-were-looking-for)
- [📋 Code of Conduct](#-code-of-conduct)
- [👨‍💼 Project Leadership](#-project-leadership)
- [📄 License](#-license)
- [🔗 Deployment](#-deployment)
  - [Deploy to Vercel (Recommended)](#deploy-to-vercel-recommended)
- [📞 Support & Contact](#-support--contact)

---

## 🎯 Who Is This Project For?

This project is ideal for beginners who want to learn React, APIs, and open-source contribution through a real-world project.

## 🌟 Key Features

- 🚀 Live crypto prices and market data (powered by CoinGecko API)
- 📈 Interactive price charts (powered by Victory)
- 🔍 Search and filter cryptocurrencies
- 💱 Multi-currency support (USD, EUR, INR)
- 🌙 Dark/Light theme toggle with localStorage persistence
- 📰 Educational blog with crypto guides
- 💡 Feature updates and announcements
- 💰 Pricing page with sample plans
- 🎨 Modern glassmorphic UI with smooth transitions
- 📱 Fully responsive design for mobile and desktop

## 📄 Pages

- **Home:** Hero section, cryptocurrency search, trending coins, and market overview
- **Coin:** Detailed coin analytics, interactive price chart, and key metrics
- **Pricing:** User-focused pricing plans (coming soon)
- **Blog:** Crypto news and beginner-friendly guides
- **Features:** Updates and upcoming feature announcements

## 🚀 Getting Started (Local Setup)

### Prerequisites
Before starting, make sure you have:
- Node.js version 14 or above
- npm (comes with Node.js)
- Git

### Installation

1. **Clone the repository:**
```sh
   git clone https://github.com/KaranUnique/CryptoHub.git
   cd CryptoHub
```

2. **Install dependencies:**
```sh
   npm install
```

3. **Set up environment variables:**
   Create a `.env` file in the project root:
```
VITE_CG_API_KEY=your-coingecko-api-key
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```
   - `VITE_CG_API_KEY`: Get your free API key from [CoinGecko API](https://www.coingecko.com/en/api)
   - Firebase credentials: Get these from [Firebase Console](https://console.firebase.google.com/) → Project Settings → Your Apps

4. **Start the development server:**
```sh
   npm run dev
```

5. **Open in your browser:**
   Visit [http://localhost:5173](http://localhost:5173)

### ❗ Common Issues

- If `npm install` fails, make sure Node.js is installed correctly.
- If the app doesn't load, check that the API key is added correctly in the `.env` file.
- Restart the dev server after changing environment variables.

### Build for Production
```sh
npm run build
```

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite
- **Routing:** React Router DOM v6
- **Charts:** Victory
- **API:** CoinGecko (free)
- **Styling:** Modern CSS (Glassmorphism, Gradients)
- **Theme:** Dark/Light mode with localStorage
- **Deployment:** Vercel

## 📁 Project Structure
```
CryptoHub/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   ├── arrow_icon.png
│   │   ├── logo.png
│   │   └── cryptologo.png
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── Navbar.css
│   ├── context/
│   │   └── CoinContext.jsx
│   ├── pages/
│   │   ├── Home/
│   │   │   ├── Home.jsx
│   │   │   ├── Home.css
│   │   │   └── Coin/
│   │   │       ├── Coin.jsx
│   │   │       └── Coin.css
│   │   ├── Pricing/
│   │   │   ├── Pricing.jsx
│   │   │   └── Pricing.css
│   │   ├── Blog/
│   │   │   ├── Blog.jsx
│   │   │   └── Blog.css
│   │   └── Features/
│   │       ├── Features.jsx
│   │       └── Features.css
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── .env (local only, not in git)
├── .gitignore
├── package.json
└── README.md
```

## 🤝 Contributing

We welcome contributions from the community, especially from first-time open-source contributors!
Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.

### How to Contribute
No prior open-source experience is required to contribute to this project.

1. **Fork the repository** by clicking the "Fork" button at the top-right of this page
2. **Clone your fork:**
```sh
   git clone https://github.com/your-username/CryptoHub.git
   cd CryptoHub
```
3. **Create a new branch** for your feature or fix:
```sh
   git checkout -b feature/your-feature-name
```
4. **Make your changes** and test thoroughly
5. **Commit your changes** with a clear message:
```sh
   git commit -m "Add your feature description"
```
6. **Push to your fork:**
```sh
   git push origin feature/your-feature-name
```
7. **Open a Pull Request** on the main repository with a clear description of your changes

### Development Guidelines

- Follow the existing code style and structure
- Use meaningful variable and function names
- Test your changes before submitting a PR
- Update documentation if you add new features
- Keep commits atomic and well-documented

### Areas We're Looking For

- Bug fixes and performance improvements
- New features (e.g., more cryptocurrencies, additional metrics)
- UI/UX enhancements
- Documentation improvements
- Blog content and educational resources
- Accessibility improvements

## 📋 Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors. Harassment, discrimination, or any form of abuse will not be tolerated.

## 👨‍💼 Project Leadership

- **Admin & Mentor:** KaranUnique

Feel free to reach out to the admin for questions, guidance, or support.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "Add New Project" and import this repository
4. Add environment variables in the Vercel dashboard:
   - `VITE_CG_API_KEY`: Your CoinGecko API key
5. Deploy and get your live URL!

## 📞 Support & Contact

For questions or issues, please:
- Open an Issue on GitHub
- Contact the admin: KaranUnique

---

**Happy coding! 🚀 Together, let's build the future of crypto dashboards!**

---

## ⭐ Show Your Support

If you find this project helpful, please give it a ⭐️ on GitHub!
