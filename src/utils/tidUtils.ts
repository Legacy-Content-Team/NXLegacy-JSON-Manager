export function formatTid(tid: string): string {
  return tid.toUpperCase();
}

export function validateTid(tid: string, isBase: boolean = false): boolean {
  if (tid.length !== 16) return false;
  if (!/^[0-9A-F]{16}$/.test(tid.toUpperCase())) return false;
  if (isBase && !tid.toUpperCase().endsWith('000')) return false;
  return true;
}

export function ensureTidFormat(tid: string, isBase: boolean = false): string {
  let formatted = tid.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
  if (formatted.length > 16) formatted = formatted.slice(0, 16);
  if (isBase && formatted.length === 16 && !formatted.endsWith('000')) {
    formatted = formatted.slice(0, 13) + '000';
  }
  return formatted;
}

export function getNextHexChar(char: string): string {
  const hexChars = '0123456789ABCDEF';
  const index = hexChars.indexOf(char.toUpperCase());
  if (index === -1) return '0';
  return hexChars[(index + 1) % 16];
}

export function generateDlcId(baseTid: string, suffix: string = ''): string {
  if (!validateTid(baseTid, true)) return '';
  
  const prefix = baseTid.slice(0, 12);
  const baseChar = baseTid.charAt(12).toUpperCase();
  const nextChar = getNextHexChar(baseChar);
  
  const formattedSuffix = suffix.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
  return prefix + nextChar + formattedSuffix.padStart(3, '0');
}

export function splitTidForDisplay(tid: string): { prefix: string; char: string; suffix: string } {
  return {
    prefix: tid.slice(0, 12),
    char: tid.charAt(12),
    suffix: tid.slice(13)
  };
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  
  // Fallback for older browsers
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand('copy');
    textArea.remove();
    return Promise.resolve();
  } catch (error) {
    textArea.remove();
    return Promise.reject(error);
  }
}