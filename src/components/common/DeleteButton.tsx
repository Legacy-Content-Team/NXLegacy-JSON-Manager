import React from 'react';
import { Trash2 } from 'lucide-react';

interface DeleteButtonProps {
  onClick: () => void;
  className?: string;
}

export default function DeleteButton({ onClick, className = '' }: DeleteButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ${className}`}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}