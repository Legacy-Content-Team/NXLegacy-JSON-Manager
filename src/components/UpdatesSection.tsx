import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { Update } from '../types';
import LinksList from './LinksList';
import { validateTid } from '../utils/tidUtils';

interface UpdatesSectionProps {
  updates: Update[];
  setUpdates: (updates: Update[]) => void;
  baseId?: string;
}

export default function UpdatesSection({ updates, setUpdates, baseId }: UpdatesSectionProps) {
  const calculateNextVersion = (currentVersion: string): string => {
    const baseIncrement = 65536;
    const current = parseInt(currentVersion, 10);
    return isNaN(current) ? baseIncrement.toString() : (current + baseIncrement).toString();
  };

  const getUpdateId = (baseId: string): string => {
    if (!baseId || !validateTid(baseId, true)) return '';
    return baseId.slice(0, -3) + '800';
  };

  const addUpdate = () => {
    const updateId = baseId ? getUpdateId(baseId) : '';
    setUpdates([
      {
        id: updateId,
        version: '',
        links: {},
        addedDate: new Date().toISOString(),
      },
      ...updates,
    ]);
  };

  const removeUpdate = (index: number) => {
    setUpdates(updates.filter((_, i) => i !== index));
  };

  const updateVersion = (index: number, version: string) => {
    let newVersion = version;
    const numericValue = parseInt(version, 10);
    
    if (!isNaN(numericValue)) {
      // Round to nearest multiple of 65536
      if (numericValue > 0) {
        const remainder = numericValue % 65536;
        newVersion = remainder === 0 ? version : (numericValue - remainder + 65536).toString();
      }
    }
    
    const newUpdates = updates.map((update, i) => 
      i === index ? { ...update, version: newVersion } : update
    );
    
    setUpdates(newUpdates);
  };

  const updateLinks = (index: number, links: Record<string, string>) => {
    const newUpdates = [...updates];
    newUpdates[index] = { ...newUpdates[index], links };
    setUpdates(newUpdates);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Updates</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Version must be a multiple of 65536</p>
        </div>
        <button
          type="button"
          onClick={addUpdate}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 dark:bg-dark-accent-primary rounded-md hover:bg-indigo-700 dark:hover:bg-dark-accent-hover transition-colors"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Update
        </button>
      </div>

      {updates.map((update, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Update ID</label>
                <input
                  type="text"
                  value={update.id}
                  readOnly
                  maxLength={16}
                  className="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-input dark:text-white shadow-sm bg-gray-50 dark:bg-dark-hover cursor-not-allowed"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Version</label>
                  <input
                    type="text"
                  value={update.version}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    updateVersion(index, value);
                  }}
                  className="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-input dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => updateVersion(index, calculateNextVersion(update.version))}
                  className="px-3 py-2 mt-6 text-sm font-medium text-white bg-indigo-600 dark:bg-dark-accent-primary rounded-md hover:bg-indigo-700 dark:hover:bg-dark-accent-hover transition-colors"
                >
                  +65536
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeUpdate(index)}
              className="p-2 text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 self-end"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <LinksList
            title="Update Links"
            links={update.links}
            setLinks={(links) => updateLinks(index, links)}
          />
        </div>
      ))}
    </div>
  );
}