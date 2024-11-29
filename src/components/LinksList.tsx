import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { GameLink } from '../types';

interface LinksListProps {
  title: string;
  links: GameLink;
  setLinks: (links: GameLink) => void;
}

export default function LinksList({ title, links, setLinks }: LinksListProps) {
  const addLink = () => {
    setLinks({ ...links, [getDomainPlaceholder('')]: '' });
  };

  const getDomainPlaceholder = (url: string): string => {
    try {
      const domain = new URL(url).hostname;
      return domain.split('.')[0];
    } catch {
      return '';
    }
  };

  const updateLink = (oldKey: string, newKey: string, value: string) => {
    const newLinks = { ...links };
    delete newLinks[oldKey];
    newLinks[newKey] = value;
    setLinks(newLinks);
  };

  const removeLink = (key: string) => {
    const newLinks = { ...links };
    delete newLinks[key];
    setLinks(newLinks);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700 dark:text-white">{title}</label>
        <button
          type="button"
          onClick={addLink}
          className="inline-flex items-center px-2 py-1 text-sm text-indigo-600 dark:text-dark-accent-primary hover:text-indigo-900 dark:hover:text-dark-accent-hover"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Link
        </button>
      </div>
      {Object.entries(links).map(([key, value]) => (
        <div key={key} className="flex gap-2">
          <input
            type="url"
            value={value}
            onChange={(e) => {
              const newValue = e.target.value;
              const suggestedKey = getDomainPlaceholder(newValue);
              updateLink(key, key === '' ? suggestedKey : key, newValue);
            }}
            placeholder="URL"
            className="flex-[3] rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-input dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <input
            type="text"
            value={key}
            onChange={(e) => updateLink(key, e.target.value, value)}
            placeholder="Link name"
            className="flex-1 rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-input dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <button
            type="button"
            onClick={() => removeLink(key)}
            className="p-2 text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}