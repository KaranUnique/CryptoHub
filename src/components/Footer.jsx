import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const { isDark } = useTheme();

  return (
    <footer
      className={`w-full py-6 sm:py-8 border-t ${isDark
          ? 'bg-[#0a0a1b] border-gray-800 text-gray-400'
          : 'bg-white border-gray-200 text-gray-600'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs sm:text-sm">
          Copyright © 2025, Cryptoplace - All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
