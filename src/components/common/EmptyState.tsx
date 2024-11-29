import React from 'react';

interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-dark-card/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-dark-border">
      {message}
    </div>
  );
}