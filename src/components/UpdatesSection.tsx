import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { Update } from '../types';
import LinksList from './LinksList';
import { validateTid } from '../utils/tidUtils';
import { normalizeVersion, calculateNextVersion, BASE_INCREMENT } from '../utils/versionUtils';
import { useTranslation } from 'react-i18next';
import EmptyState from './common/EmptyState';
import AddButton from './common/AddButton';
import DeleteButton from './common/DeleteButton';

interface UpdatesSectionProps {
  updates: Update[];
  setUpdates: (updates: Update[]) => void;
  baseId?: string;
}

export default function UpdatesSection({ updates, setUpdates, baseId }: UpdatesSectionProps) {
  const { t } = useTranslation();

  const getUpdateId = (baseId: string): string => {
    if (!baseId || !validateTid(baseId, true)) return '';
    return baseId.slice(0, -3) + '800';
  };

  const addUpdate = () => {
    if (!baseId || !validateTid(baseId, true)) return;
    
    const updateId = getUpdateId(baseId);
    const lastUpdate = updates[0];
    const nextVersion = lastUpdate 
      ? calculateNextVersion(lastUpdate.version)
      : BASE_INCREMENT.toString();

    setUpdates([
      {
        id: updateId,
        version: nextVersion,
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
    const newVersion = normalizeVersion(version, true); // Force multiple of 65536
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

  const isValidBaseId = baseId && validateTid(baseId, true);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('updates.title')}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('updates.versionNote')}</p>
        </div>
        <AddButton
          onClick={addUpdate}
          disabled={!isValidBaseId}
          title={!isValidBaseId ? t('validation.enterBaseTidFirstUpdates') : undefined}
        >
          {t('updates.addUpdate')}
        </AddButton>
      </div>

      {!isValidBaseId && updates.length === 0 && (
        <EmptyState message={t('validation.enterBaseTidFirstUpdates')} />
      )}

      {updates.map((update, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                  {t('updates.id')}
                </label>
                <input
                  type="text"
                  value={update.id}
                  readOnly
                  maxLength={16}
                  className="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-hover text-gray-500 dark:text-gray-400 cursor-not-allowed font-mono"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                    {t('updates.version')}
                  </label>
                  <input
                    type="text"
                    value={update.version}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      updateVersion(index, value);
                    }}
                    className="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-input dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-mono"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => updateVersion(index, calculateNextVersion(update.version))}
                  className="px-3 py-2 mt-6 text-sm font-medium text-white bg-indigo-600 dark:bg-dark-accent-primary rounded-md hover:bg-indigo-700 dark:hover:bg-dark-accent-hover transition-colors"
                  title={t('updates.nextVersion')}
                >
                  +{BASE_INCREMENT}
                </button>
              </div>
            </div>
            <DeleteButton onClick={() => removeUpdate(index)} className="self-end" />
          </div>

          <LinksList
            title={t('updates.links')}
            links={update.links}
            setLinks={(links) => updateLinks(index, links)}
          />
        </div>
      ))}
    </div>
  );
}