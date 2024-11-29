import React from 'react';
import { Database, FileJson, Save, Trash2, Package, Upload } from 'lucide-react';
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
  const [isDragging, setIsDragging] = React.useState(false);
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file || !file.name.endsWith('.json')) {
      alert(t('validation.dropJsonOnly'));
      return;
    }

    const tid = file.name.replace(/\.json$/, '');
    if (!validateTid(tid, true)) {
      alert(t('validation.invalidTidFilename'));
      return;
    }

    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const normalizedJson = normalizeJsonStructure(json);
      normalizedJson.base.id = tid;
      setCurrentData(normalizedJson);
    } catch (error) {
      console.error('Error loading JSON:', error);
      alert(`Error loading JSON: ${(error as Error).message}`);
    }
  };

  const normalizeJsonStructure = (json: any): GameData => {
    const normalizeDate = (obj: any) => {
      if (obj.addedDate) return obj.addedDate;
      if (obj.added_date) return obj.added_date;
      return new Date().toISOString();
    };

    const base = {
      id: '',  // Will be set from filename
      version: typeof json.base?.version === 'number' ? json.base.version : 0,
      links: json.base?.links || {},
      addedDate: normalizeDate(json.base || {}),
    };

    const updates = (json.updates || []).map((update: any) => ({
      id: update.id || '',
      version: (typeof update.version === 'number' ? update.version : 0).toString(),
      links: update.links || {},
      addedDate: normalizeDate(update)
    }));

    const dlcs = (json.dlcs || []).map((dlc: any) => ({
      id: dlc.id || '',
      version: (typeof dlc.version === 'number' ? dlc.version : 0).toString(),
      links: dlc.links || {},
      addedDate: normalizeDate(dlc)
    }));

    const dlc_pack = json.dlc_pack ? {
      links: json.dlc_pack.links || {},
      addedDate: normalizeDate(json.dlc_pack)
    } : undefined;

    return { base, updates, dlcs, dlc_pack };
  };

  return (
    <div 
      className="min-h-screen bg-gray-100 dark:bg-dark-bg transition-colors relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 bg-indigo-500/10 dark:bg-dark-accent-primary/20 backdrop-blur-sm z-50 pointer-events-none">
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-xl p-6 md:p-8 text-center transform scale-110 transition-transform max-w-sm mx-auto">
              <Upload className="w-12 h-12 text-indigo-500 dark:text-dark-accent-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t('common.dragAndDrop.title')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('common.dragAndDrop.subtitle')}
              </p>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white dark:bg-dark-card shadow-md dark:shadow-dark-accent/5">
        <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Database className="w-8 h-8 text-indigo-600 dark:text-dark-accent-primary" />
              <div className="flex flex-col">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
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

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-lg dark:shadow-dark-accent/5 p-4 md:p-6">
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
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <JsonActions currentData={currentData} onLoad={setCurrentData} />
              </div>
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                <button
                  type="submit"
                  form="game-form"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 dark:bg-dark-accent-primary rounded-md hover:bg-indigo-700 dark:hover:bg-dark-accent-hover transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-dark-bg"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {t('actions.save')}
                </button>
                <button
                  type="button"
                  onClick={handleClearData}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t('actions.clearData')}
                </button>
              </div>
            </div>
            <GameForm id="game-form" onSave={handleSave} initialData={currentData} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;