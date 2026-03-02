export function getBooleanFlag(key: string): boolean | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const value = window.localStorage.getItem(key);
    if (value === "true") {
      return true;
    }
    if (value === "false") {
      return false;
    }
    return null;
  } catch {
    return null;
  }
}

export function setBooleanFlag(key: string, value: boolean): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(key, value ? "true" : "false");
  } catch {
    // Ignore localStorage write failures to keep UI functional.
  }
}
