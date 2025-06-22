/**
 * Formats a Date object to "Month Year" format (e.g., "May 2027")
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatResumeDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

/**
 * Formats a date range for resume display
 * @param startDate - The start date
 * @param endDate - The end date (optional if currently ongoing)
 * @param isOngoing - Whether the position/education is currently ongoing
 * @returns Formatted date range string
 */
export function formatDateRange(
  startDate: Date,
  endDate?: Date,
  isOngoing = false,
): string {
  const start = formatResumeDate(startDate);

  if (isOngoing) {
    return `${start} - Present`;
  }

  if (endDate) {
    const end = formatResumeDate(endDate);
    return `${start} - ${end}`;
  }

  return start;
}
