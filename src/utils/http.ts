export function getApiUrl(path: string): string {
  const configuredBase = import.meta.env.VITE_API_BASE_URL?.trim();
  if (configuredBase) {
    const normalizedBase = configuredBase.replace(/\/$/, "");
    return `${normalizedBase}${path}`;
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}${path}`;
  }

  return path;
}

export async function parseApiResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
  const text = await response.text();

  if (!text) {
    throw new Error(fallbackMessage);
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    const preview = text.replace(/\s+/g, " ").trim();
    const shortPreview = preview.length > 180 ? `${preview.slice(0, 177)}...` : preview;
    throw new Error(`${fallbackMessage} Received: ${shortPreview}`);
  }
}
