import React from 'react';
import { Database, FileJson, Save, Trash2, Package } from 'lucide-react';
import packageJson from '../package.json';
import GameForm from './components/GameForm';
import ThemeToggle from './components/ThemeToggle';
import LanguageToggle from './components/LanguageToggle';
import JsonActions from './components/JsonActions';
import { useTranslation } from 'react-i18next';
import type { GameData } from './types';
import { validateTid } from './utils/tidUtils';

function App() {
  const { t } = useTranslation();
  const [currentData, setCurrentData] = React.useState<GameData | null>(null);
  const version = packageJson.version;

  const handleClearData = () => {
    if (window.confirm(t('actions.clearConfirm'))) {
      setCurrentData(null);
    }
  };

  const handleSave = async (data: GameData) => {
    setCurrentData(data);
    try {
      // Validate base ID
      if (!data.base.id || !validateTid(data.base.id, true)) {
        alert('Invalid Base ID. Must be 16 hexadecimal characters ending with 000');
        return;
      }
      
      // Validate all DLC TIDs
      for (const dlc of data.dlcs) {
        if (!dlc.id || !validateTid(dlc.id)) {
          alert(`Invalid DLC ID: ${dlc.id}. Must be 16 hexadecimal characters.`);
          return;
        }
      }
      
      // Validate all Update TIDs
      for (const update of data.updates) {
        if (!update.id || !validateTid(update.id)) {
          alert(`Invalid Update ID: ${update.id}. Must be 16 hexadecimal characters.`);
          return;
        }
      }
      
      const rawBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const rawUrl = URL.createObjectURL(rawBlob);
      const rawLink = document.createElement('a');
      rawLink.href = rawUrl;
      rawLink.download = `${data.base.id}.json`;
      rawLink.click();
      URL.revokeObjectURL(rawUrl);
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-bg transition-colors">
      <header className="bg-white dark:bg-dark-card shadow-md dark:shadow-dark-accent/5">
        <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="w-8 h-8 text-indigo-600 dark:text-dark-accent-primary" />
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {t('appTitle')}
                </h1>
                <span className="text-sm font-normal text-blue-500 dark:text-blue-400">v{version}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-2 sm:px-0">
          <div className="bg-white dark:bg-dark-card rounded-lg shadow-lg dark:shadow-dark-accent/5 px-5 py-6 sm:px-6">
            <div className="border-b border-gray-200 dark:border-dark-border pb-5 mb-5">
              <div className="flex items-center">
                <FileJson className="w-6 h-6 text-gray-400 dark:text-dark-text-secondary mr-2" />
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  {t('newEntry')}
                </h2>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                {t('formDescription')}
              </p>
            </div>
            <div className="flex flex-col space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <JsonActions currentData={currentData} onLoad={setCurrentData} />
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    form="game-form"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 dark:bg-dark-accent-primary rounded-md hover:bg-indigo-700 dark:hover:bg-dark-accent-hover transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-dark-bg"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {t('actions.save')}
                  </button>
                  <button
                    type="button"
                    onClick={handleClearData}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t('actions.clearData')}
                  </button>
                </div>
              </div>
              <GameForm id="game-form" onSave={handleSave} initialData={currentData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;