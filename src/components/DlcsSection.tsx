import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Search } from 'lucide-react';
import type { DLC } from '../types';
import { formatTid, validateTid } from '../utils/tidUtils';
import LinksList from './LinksList';

interface DlcsSectionProps {
  dlcs: DLC[];
  setDlcs: (dlcs: DLC[]) => void;
}

export default function DlcsSection({ dlcs, setDlcs }: DlcsSectionProps) {
  const [searchTid, setSearchTid] = React.useState('');
  
  const addDlc = () => {
    setDlcs([...dlcs, { id: '', version: '', links: {}, addedDate: new Date().toISOString() }]);
  };
  
  const handleTidChange = (index: number, value: string) => {
    let formattedValue = value.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
    if (formattedValue.length > 16) formattedValue = formattedValue.slice(0, 16);
    updateDlc(index, 'id', formattedValue);
  };

  const updateDlc = (index: number, field: keyof DLC, value: any) => {
    const newDlcs = [...dlcs];
    newDlcs[index] = { ...newDlcs[index], [field]: value };
    setDlcs(newDlcs);
  };

  const removeDlc = (index: number) => {
    setDlcs(dlcs.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">DLCs</h2>
        </div>
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search DLC by TID..."
              value={searchTid}
              onChange={(e) => setSearchTid(e.target.value.toUpperCase())}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-dark-border rounded-md leading-5 bg-white dark:bg-dark-input text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={addDlc}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 dark:bg-dark-accent-primary rounded-md hover:bg-indigo-700 dark:hover:bg-dark-accent-hover transition-colors"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add DLC
        </button>
      </div>

      {dlcs
        .filter(dlc => !searchTid || dlc.id.includes(searchTid))
        .map((dlc, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-2">
          <div className="flex justify-between items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">DLC ID</label>
              <input
                type="text"
                value={formatTid(dlc.id)}
                onChange={(e) => handleTidChange(index, e.target.value)}
                maxLength={16}
                pattern="[0-9A-Fa-f]{16}"
                placeholder="DLC ID"
                className="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-input dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {dlc.id && !validateTid(dlc.id) && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  TID must be 16 hexadecimal characters
                </p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Version</label>
              <input
                type="text"
                value={dlc.version}
                onChange={(e) => updateDlc(index, 'version', e.target.value)}
                placeholder="Version"
                className="w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-input dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <button
              type="button"
              onClick={() => removeDlc(index)}
              className="p-2 text-red-600 hover:text-red-900 self-end"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <LinksList
            title="DLC Links"
            links={dlc.links}
            setLinks={(links) => updateDlc(index, 'links', links)}
          />
        </div>
      ))}
    </div>
  );
}