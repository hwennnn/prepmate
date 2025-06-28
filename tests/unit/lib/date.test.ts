import { describe, expect, it } from 'vitest';
import { formatDateRange, formatResumeDate } from '~/lib/date';

describe('formatResumeDate', () => {
  it('formats a date to "Month Year" format', () => {
    const date = new Date(2024, 4, 15); // May 15, 2024
    expect(formatResumeDate(date)).toBe('May 2024');
  });

  it('handles different months correctly', () => {
    const january = new Date(2023, 0, 1);
    const december = new Date(2023, 11, 31);
    
    expect(formatResumeDate(january)).toBe('Jan 2023');
    expect(formatResumeDate(december)).toBe('Dec 2023');
  });

  it('handles different years correctly', () => {
    const date2020 = new Date(2020, 6, 1);
    const date2025 = new Date(2025, 6, 1);
    
    expect(formatResumeDate(date2020)).toBe('Jul 2020');
    expect(formatResumeDate(date2025)).toBe('Jul 2025');
  });

  it('handles edge case dates', () => {
    const veryOldDate = new Date(1990, 0, 1);
    const futureDate = new Date(2030, 11, 31);
    
    expect(formatResumeDate(veryOldDate)).toBe('Jan 1990');
    expect(formatResumeDate(futureDate)).toBe('Dec 2030');
  });
});

describe('formatDateRange', () => {
  const startDate = new Date(2022, 2, 1); // March 2022
  const endDate = new Date(2024, 7, 1); // August 2024

  it('formats a complete date range', () => {
    expect(formatDateRange(startDate, endDate)).toBe('Mar 2022 - Aug 2024');
  });

  it('formats an ongoing date range with isOngoing=true', () => {
    expect(formatDateRange(startDate, endDate, true)).toBe('Mar 2022 - Present');
  });

  it('formats an ongoing date range with isOngoing=true and no endDate', () => {
    expect(formatDateRange(startDate, undefined, true)).toBe('Mar 2022 - Present');
  });

  it('formats only start date when no end date and not ongoing', () => {
    expect(formatDateRange(startDate)).toBe('Mar 2022');
  });

  it('handles same month and year for start and end', () => {
    const sameMonth = new Date(2022, 2, 15);
    expect(formatDateRange(startDate, sameMonth)).toBe('Mar 2022 - Mar 2022');
  });

  it('handles short-term positions (same year)', () => {
    const endSameYear = new Date(2022, 5, 1); // June 2022
    expect(formatDateRange(startDate, endSameYear)).toBe('Mar 2022 - Jun 2022');
  });

  it('prioritizes isOngoing flag over endDate', () => {
    // Even with endDate provided, isOngoing=true should show "Present"
    expect(formatDateRange(startDate, endDate, true)).toBe('Mar 2022 - Present');
  });

  it('handles long-term positions spanning multiple years', () => {
    const longTermEnd = new Date(2027, 10, 1); // November 2027
    expect(formatDateRange(startDate, longTermEnd)).toBe('Mar 2022 - Nov 2027');
  });
}); 