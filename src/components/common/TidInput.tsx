import React from 'react';
import { Copy, Check } from 'lucide-react';
import { copyToClipboard } from '../../utils/tidUtils';

interface TidInputProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  maxLength?: number;
  placeholder?: string;
  showCopy?: boolean;
  showCharCount?: boolean;
  className?: string;
  formatOnChange?: (value: string) => string;
}

export default function TidInput({
  value,
  onChange,
  readOnly = false,
  maxLength = 16,
  placeholder,
  showCopy = false,
  showCharCount = false,
  className = '',
  formatOnChange
}: TidInputProps) {
  const [displayValue, setDisplayValue] = React.useState(value);
  const [copied, setCopied] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  React.useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setDisplayValue(newValue);
    
    const formattedValue = newValue.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
    if (formatOnChange) {
      onChange(formatOnChange(formattedValue));
    } else {
      onChange(formattedValue);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const formattedValue = pastedText.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
    
    if (formatOnChange) {
      onChange(formatOnChange(formattedValue));
    } else {
      onChange(formattedValue);
    }
    setDisplayValue(formattedValue);
  };

  const handleBlur = () => {
    if (formatOnChange) {
      const formattedValue = formatOnChange(displayValue);
      setDisplayValue(formattedValue);
      onChange(formattedValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (readOnly) return;
    
    // Allow: backspace, delete, tab, escape, enter, ctrl+v, cmd+v, arrows
    if ([8, 46, 9, 27, 13, 37, 39].includes(e.keyCode) || 
        ((e.ctrlKey || e.metaKey) && e.keyCode === 86)) {
      return;
    }
    
    // Block non-hex characters
    if (!/^[0-9a-fA-F]$/.test(e.key)) {
      e.preventDefault();
      return;
    }
    
    // Block input if we're at max length and not trying to edit
    if (displayValue.length >= maxLength && 
        !inputRef.current?.selectionStart && 
        !inputRef.current?.selectionEnd) {
      e.preventDefault();
    }
  };

  const handleCopy = async () => {
    try {
      await copyToClipboard(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      <input
        ref={inputRef}
        type="text"
        value={displayValue}
        onChange={handleChange}
        onPaste={handlePaste}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        maxLength={maxLength}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`block w-full rounded-md border-gray-300 dark:border-dark-border dark:bg-dark-input dark:text-white shadow-sm focus:border-dark-accent-primary focus:ring-dark-accent-primary transition-colors ${
          readOnly ? 'bg-gray-50 dark:bg-dark-hover text-gray-500 dark:text-gray-400 cursor-not-allowed' : ''
        } ${className}`}
      />
      {showCopy && (
        <button
          type="button"
          onClick={handleCopy}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          title="Copy ID"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      )}
      {showCharCount && displayValue && (
        <div className="absolute right-12 top-1/2 -translate-y-1/2 pr-3">
          <span className="text-xs text-gray-400">
            {displayValue.length}/{maxLength}
          </span>
        </div>
      )}
    </div>
  );
}