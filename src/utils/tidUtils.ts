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