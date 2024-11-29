import React from 'react';
import { Plus } from 'lucide-react';

interface AddButtonProps {
  onClick: () => void;
  disabled?: boolean;
  title?: string;
  children: React.ReactNode;
}

export default function AddButton({ onClick, disabled, title, children }: AddButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 dark:bg-dark-accent-primary rounded-md hover:bg-indigo-700 dark:hover:bg-dark-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title={disabled ? title : undefined}
    >
      <Plus className="w-4 h-4 mr-1" />
      {children}
    </button>
  );
}