export function debounce<T extends(...args: unknown[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  // eslint-disable-next-line func-names
  return function (...args: Parameters<T>): void {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => func(...args), wait);
  };
}
