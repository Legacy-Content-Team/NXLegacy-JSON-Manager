export const BASE_INCREMENT = 65536;

export function normalizeVersion(version: string | number, forceMultiple: boolean = false): string {
  const numericValue = typeof version === 'string' ? parseInt(version, 10) : version;
  
  if (isNaN(numericValue) || numericValue < 0) {
    return '0';
  }

  if (!forceMultiple) {
    return numericValue.toString();
  }

  // Round to nearest multiple of 65536 for updates
  const remainder = numericValue % BASE_INCREMENT;
  if (remainder === 0) {
    return numericValue.toString();
  }
  
  return (numericValue - remainder + BASE_INCREMENT).toString();
}

export function calculateNextVersion(currentVersion: string): string {
  const current = parseInt(currentVersion, 10);
  return isNaN(current) ? BASE_INCREMENT.toString() : (current + BASE_INCREMENT).toString();
}

export function isValidVersion(version: string | number, forceMultiple: boolean = false): boolean {
  const numericValue = typeof version === 'string' ? parseInt(version, 10) : version;
  if (isNaN(numericValue) || numericValue < 0) return false;
  if (!forceMultiple) return true;
  return numericValue % BASE_INCREMENT === 0;
}