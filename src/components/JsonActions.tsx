import React, { useRef } from 'react';
import { FileJson, Upload } from 'lucide-react';
import type { GameData } from '../types';
import { validateTid } from '../utils/tidUtils';
import { useTranslation } from 'react-i18next';

interface JsonActionsProps {
  currentData: GameData | null;
  onLoad: (data: GameData) => void;
}

export default function JsonActions({ currentData, onLoad }: JsonActionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const [showPreview, setShowPreview] = React.useState(false);

  const handleViewJson = () => {
    setShowPreview(!showPreview);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const tid = file.name.replace(/\.json$/, '');

    if (!validateTid(tid, true)) {
      alert('Invalid TID in filename. Must be 16 hexadecimal characters ending with 000');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        const normalizedJson = normalizeJsonStructure(json);
        normalizedJson.base.id = tid; // Set the base ID from filename
        
        // Validate base game structure
        if (!normalizedJson.base || (normalizedJson.base.version !== 0 && !normalizedJson.base.version)) {
          throw new Error('Missing base game version');
        }
        
        if (!normalizedJson.base.links || typeof normalizedJson.base.links !== 'object') {
          throw new Error('Invalid base game links format');
        }

        // Validate updates
        normalizedJson.updates = Array.isArray(normalizedJson.updates) ? normalizedJson.updates : [];
        
        // Validate DLCs
        normalizedJson.dlcs = Array.isArray(normalizedJson.dlcs) ? normalizedJson.dlcs : [];
        
        // Validate DLC pack if present
        if (normalizedJson.dlc_pack && (!normalizedJson.dlc_pack.links || !normalizedJson.dlc_pack.addedDate)) {
          throw new Error('Invalid DLC pack structure');
        }
        
        // Load the validated data
        onLoad(normalizedJson);
        
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
        alert(`Error loading JSON: ${(error as Error).message}`);
      }
    };
    reader.readAsText(file);
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
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-white bg-white dark:bg-dark-card border border-gray-300 dark:border-dark-border rounded-md hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors"
        >
          <Upload className="w-4 h-4 mr-2" />
          {t('jsonActions.load')}
        </button>
        <button
          type="button"
          onClick={handleViewJson}
          disabled={!currentData}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 dark:bg-dark-accent-primary rounded-md hover:bg-indigo-700 dark:hover:bg-dark-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileJson className="w-4 h-4 mr-2" />
          {t('jsonActions.view')}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="application/json"
          className="hidden"
        />
      </div>
      
      {showPreview && currentData && (
        <div className="mt-4 bg-gray-50 dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-dark-border flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              {t('jsonActions.preview')}
            </h3>
            <button
              onClick={() => setShowPreview(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ×
            </button>
          </div>
          <pre className="p-4 overflow-auto text-sm text-gray-800 dark:text-gray-200 font-mono">
            {JSON.stringify(currentData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}