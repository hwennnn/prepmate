import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Ensures a URL has a proper protocol prefix (https://)
 * @param url - The URL to format
 * @returns The URL with https:// prefix if no protocol was present
 */
export function formatUrlProtocol(url: string): string {
  if (!url) return url;

  // If URL already has protocol, return as is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Add https:// prefix for URLs without protocol
  return `https://${url}`;
}
