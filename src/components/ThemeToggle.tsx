import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, preference, setPreference } = useTheme();

  const handleClick = () => {
    switch (preference) {
      case 'light':
        setPreference('dark');
        break;
      case 'dark':
        setPreference('system');
        break;
      case 'system':
        setPreference('light');
        break;
    }
  };

  const getIcon = () => {
    switch (preference) {
      case 'light':
        return <Sun className="w-5 h-5 text-gray-600 dark:text-white" />;
      case 'dark':
        return <Moon className="w-5 h-5 text-gray-600 dark:text-white" />;
      case 'system':
        return <Monitor className="w-5 h-5 text-gray-600 dark:text-white" />;
    }
  };

  return (
    <button
      onClick={handleClick}
      className="p-2 rounded-lg bg-gray-100 dark:bg-dark-card hover:bg-gray-200 dark:hover:bg-dark-border transition-colors"
      aria-label="Toggle theme"
    >
      {getIcon()}
    </button>
  );
}