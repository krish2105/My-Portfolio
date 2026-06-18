export const isValidUrl = (urlString: string): boolean => {
  if (!urlString) return false;
  if (urlString.startsWith("mailto:")) return true;
  try {
    new URL(urlString);
    return true;
  } catch {
    return false;
  }
};
