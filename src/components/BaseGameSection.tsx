import React from 'react';
import type { GameLink } from '../types';
import { formatTid, validateTid } from '../utils/tidUtils';
import LinksList from './LinksList';

interface BaseGameSectionProps {
  baseId: string;
  setBaseId: (id: string) => void;
  version: string;
  setVersion: (version: string) => void;
  links: GameLink;
  setLinks: (links: GameLink) => void;
}

export default function BaseGameSection({
  baseId,
  setBaseId,
  version,
  setVersion,
  links,
  setLinks,
}: BaseGameSectionProps) {
  const handleTidChange = (value: string) => {
    let formattedValue = value.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
    if (formattedValue.length > 16) formattedValue = formattedValue.slice(0, 16);
    setBaseId(formattedValue);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Base Game</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-white">Base ID *</label>
          <input
            type="text"
            value={formatTid(baseId)}
            onChange={(e) => handleTidChange(e.target.value)}
            maxLength={16}
            pattern="[0-9A-Fa-f]{13}000"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-input dark:text-white shadow-sm focus:border-dark-accent-primary focus:ring-dark-accent-primary transition-colors"
            required
          />
          {baseId && !validateTid(baseId, true) && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              TID must be 16 hexadecimal characters ending with 000
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-white">Version *</label>
          <input
            type="number"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-input dark:text-white shadow-sm focus:border-dark-accent-primary focus:ring-dark-accent-primary transition-colors"
            required
          />
        </div>
      </div>
      <LinksList
        title="Base Links"
        links={links}
        setLinks={setLinks}
      />
    </div>
  );
}