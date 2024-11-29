import React from 'react';
import { Copy, Check } from 'lucide-react';
import type { GameLink } from '../types';
import { formatTid, validateTid, copyToClipboard } from '../utils/tidUtils';
import LinksList from './LinksList';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const [displayValue, setDisplayValue] = React.useState(baseId);
  const [copied, setCopied] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  React.useEffect(() => {
    setDisplayValue(baseId);
  }, [baseId]);

  const handleTidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDisplayValue(value);
    
    const formattedValue = value.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
    if (formattedValue.length <= 16) {
      let finalValue = formattedValue;
      if (finalValue.length === 16) {
        finalValue = finalValue.slice(0, 13) + '000';
      }
      setBaseId(finalValue);
    }
  };

  const handleTidPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const formattedValue = pastedText.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
    
    if (formattedValue.length <= 16) {
      let finalValue = formattedValue;
      if (finalValue.length === 16) {
        finalValue = finalValue.slice(0, 13) + '000';
      }
      setBaseId(finalValue);
      setDisplayValue(finalValue);
    }
  };

  const handleTidBlur = () => {
    setDisplayValue(baseId);
  };

  const handleTidKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, ctrl+v, cmd+v
    if ([8, 46, 9, 27, 13].includes(e.keyCode) || 
        ((e.ctrlKey || e.metaKey) && e.keyCode === 86)) {
      return;
    }
    
    // Block non-hex characters
    if (!/^[0-9a-fA-F]$/.test(e.key)) {
      e.preventDefault();
      return;
    }
    
    // Block input if we're at max length and not trying to edit
    if (displayValue.length >= 16 && !e.ctrlKey && !e.metaKey && 
        e.keyCode !== 37 && e.keyCode !== 39) { // Allow left/right arrows
      e.preventDefault();
    }
  };

  const handleCopyTid = async () => {
    try {
      await copyToClipboard(baseId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleVersionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setVersion(value);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('baseGame.title')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-white">
            {t('baseGame.id')} {t('common.required')}
          </label>
          <div className="mt-1 relative flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={displayValue}
              onChange={handleTidChange}
              onPaste={handleTidPaste}
              onBlur={handleTidBlur}
              onKeyDown={handleTidKeyDown}
              maxLength={16}
              placeholder={t('baseGame.tidPlaceholder')}
              className="block w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-input dark:text-white shadow-sm focus:border-dark-accent-primary focus:ring-dark-accent-primary transition-colors font-mono"
              required
            />
            <button
              type="button"
              onClick={handleCopyTid}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title={t('common.copy')}
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            {displayValue && (
              <div className="absolute right-12 top-1/2 -translate-y-1/2 pr-3">
                <span className="text-xs text-gray-400">
                  {t('baseGame.characterCount', { current: displayValue.length, max: 16 })}
                </span>
              </div>
            )}
          </div>
          {baseId && !validateTid(baseId, true) && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {t('validation.invalidBaseId')}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-white">
            {t('baseGame.version')} {t('common.required')}
          </label>
          <input
            type="text"
            value={version}
            onChange={handleVersionChange}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-input dark:text-white shadow-sm focus:border-dark-accent-primary focus:ring-dark-accent-primary transition-colors font-mono"
            required
          />
        </div>
      </div>
      <LinksList
        title={t('baseGame.links')}
        links={links}
        setLinks={setLinks}
      />
    </div>
  );
}