import React from 'react';
import { Plus, Copy, Check } from 'lucide-react';
import type { DLC } from '../types';
import { formatTid, validateTid, generateDlcId, copyToClipboard } from '../utils/tidUtils';
import { useTranslation } from 'react-i18next';
import LinksList from './LinksList';
import SearchInput from './common/SearchInput';
import EmptyState from './common/EmptyState';
import AddButton from './common/AddButton';
import DeleteButton from './common/DeleteButton';

interface DlcsSectionProps {
  dlcs: DLC[];
  setDlcs: (dlcs: DLC[]) => void;
  baseId?: string;
}

export default function DlcsSection({ dlcs, setDlcs, baseId }: DlcsSectionProps) {
  const { t } = useTranslation();
  const [searchTid, setSearchTid] = React.useState('');
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  
  const addDlc = () => {
    if (!baseId || !validateTid(baseId, true)) return;
    
    const existingSuffixes = dlcs.map(dlc => parseInt(dlc.id.slice(-3), 16));
    let nextSuffix = 1;
    while (existingSuffixes.includes(nextSuffix)) {
      nextSuffix++;
    }
    
    const newDlc = {
      id: generateDlcId(baseId, nextSuffix.toString(16).padStart(3, '0')),
      version: '0',
      links: {},
      addedDate: new Date().toISOString()
    };
    setDlcs([...dlcs, newDlc]);
  };
  
  const validateDlcTid = (tid: string): boolean => {
    if (!baseId || !validateTid(baseId, true)) return false;
    const basePrefix = baseId.slice(0, 12);
    const expectedChar = generateDlcId(baseId).charAt(12);
    return tid.startsWith(basePrefix) && 
           tid.charAt(12) === expectedChar && 
           validateTid(tid);
  };

  const handleTidChange = (index: number, value: string) => {
    if (!baseId || !validateTid(baseId, true)) return;
    
    const prefix = baseId.slice(0, 12);
    const nextChar = generateDlcId(baseId).charAt(12);
    const suffix = value.slice(-3);
    const newId = prefix + nextChar + suffix;
    
    const newDlcs = [...dlcs];
    newDlcs[index] = { ...newDlcs[index], id: newId };
    setDlcs(newDlcs);
  };

  const updateDlc = (index: number, field: keyof DLC, value: any) => {
    const newDlcs = [...dlcs];
    newDlcs[index] = { ...newDlcs[index], [field]: value };
    setDlcs(newDlcs);
  };

  const removeDlc = (index: number) => {
    setDlcs(dlcs.filter((_, i) => i !== index));
  };

  const handleCopyId = async (id: string) => {
    try {
      await copyToClipboard(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const isValidBaseId = baseId && validateTid(baseId, true);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('dlcs.title')}</h2>
        </div>
        <div className="flex-1">
          <SearchInput
            value={searchTid}
            onChange={setSearchTid}
            placeholder={t('dlcs.searchPlaceholder')}
          />
        </div>
        <AddButton
          onClick={addDlc}
          disabled={!isValidBaseId}
          title={!isValidBaseId ? t('validation.enterBaseTidFirst') : undefined}
        >
          {t('dlcs.addDlc')}
        </AddButton>
      </div>

      {!isValidBaseId && dlcs.length === 0 && (
        <EmptyState message={t('validation.enterBaseTidFirst')} />
      )}

      {dlcs
        .filter(dlc => !searchTid || dlc.id.includes(searchTid))
        .map((dlc, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-2">
            <div className="flex justify-between items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                  {t('dlcs.id')}
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex gap-2 flex-1">
                    <input
                      type="text"
                      value={dlc.id.slice(0, 12)}
                      readOnly
                      className="w-32 rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-hover text-gray-500 dark:text-gray-400 cursor-not-allowed font-mono"
                    />
                    <input
                      type="text"
                      value={dlc.id.charAt(12)}
                      readOnly
                      className="w-12 rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-hover text-gray-500 dark:text-gray-400 cursor-not-allowed font-mono"
                    />
                    <input
                      type="text"
                      value={dlc.id.slice(13)}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
                        handleTidChange(index, value);
                      }}
                      maxLength={3}
                      placeholder="###"
                      className="w-20 rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-input dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyId(dlc.id)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    title={t('common.copy')}
                  >
                    {copiedId === dlc.id ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {dlc.id && !validateDlcTid(dlc.id) && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {t('validation.invalidDlcId')}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                  {t('dlcs.version')}
                </label>
                <input
                  type="text"
                  value={dlc.version}
                  onChange={(e) => updateDlc(index, 'version', e.target.value)}
                  placeholder={t('common.version')}
                  className="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-input dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <DeleteButton onClick={() => removeDlc(index)} className="self-end" />
            </div>

            <LinksList
              title={t('dlcs.links')}
              links={dlc.links}
              setLinks={(links) => updateDlc(index, 'links', links)}
            />
          </div>
        ))}
    </div>
  );
}