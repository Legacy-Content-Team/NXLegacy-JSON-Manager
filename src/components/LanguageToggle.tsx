import React from 'react';
import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function LanguageToggle() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 rounded-lg bg-gray-100 dark:bg-dark-card hover:bg-gray-200 dark:hover:bg-dark-hover transition-colors"
      aria-label="Toggle language"
    >
      <Languages className="w-5 h-5 text-gray-600 dark:text-gray-300" />
    </button>
  );
}