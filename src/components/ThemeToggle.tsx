import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';
import { useThemeStore } from '../store/themeStore';

const ThemeToggle: React.FC = () => {
  const { darkMode, toggleDarkMode } = useThemeStore();

  return (
    <button
      onClick={toggleDarkMode}
      className={`
        relative p-2 rounded-full w-12 h-12
        transition-all duration-500 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${darkMode 
          ? 'bg-gray-800 focus:ring-yellow-500 hover:bg-gray-700' 
          : 'bg-blue-100 focus:ring-blue-500 hover:bg-blue-200'
        }
      `}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-full h-full">
        <span
          className={`
            absolute inset-0 flex items-center justify-center
            transition-all duration-500 transform
            ${darkMode ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'}
          `}
        >
          <MoonIcon className="w-6 h-6 text-yellow-300" />
        </span>
        <span
          className={`
            absolute inset-0 flex items-center justify-center
            transition-all duration-500 transform
            ${darkMode ? '-rotate-90 opacity-0' : 'rotate-0 opacity-100'}
          `}
        >
          <SunIcon className="w-6 h-6 text-yellow-500" />
        </span>
      </div>
    </button>
  );
};

export default ThemeToggle; 