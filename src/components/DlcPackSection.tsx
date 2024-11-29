import React from 'react';
import type { GameLink } from '../types';
import LinksList from './LinksList';
import { useTranslation } from 'react-i18next';

interface DlcPackSectionProps {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  links: GameLink;
  setLinks: (links: GameLink) => void;
}

export default function DlcPackSection({
  enabled,
  setEnabled,
  links,
  setLinks,
}: DlcPackSectionProps) {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          id="dlc-pack-toggle"
        />
        <label htmlFor="dlc-pack-toggle" className="text-sm font-medium text-gray-700 dark:text-white">
          {t('dlcPack.include')}
        </label>
      </div>

      {enabled && (
        <div className="pl-6">
          <LinksList
            title={t('dlcPack.links')}
            links={links}
            setLinks={setLinks}
            showTypeSelector={false}
          />
        </div>
      )}
    </div>
  );
}