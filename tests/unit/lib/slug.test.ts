import { describe, expect, it } from 'vitest';
import { 
  generateSlug, 
  isValidSlug, 
  sanitizeSlug,  
} from '../../../src/lib/slug';

describe('generateSlug', () => {
  it('creates basic slug from first and last name', () => {
    expect(generateSlug('John', 'Doe')).toBe('john-doe');
    expect(generateSlug('Jane', 'Smith')).toBe('jane-smith');
  });

  it('handles special characters', () => {
    expect(generateSlug('José', 'García')).toBe('jose-garcia');
    expect(generateSlug('John-Paul', 'O\'Connor')).toBe('john-paul-o-connor');
  });

  it('handles spaces and multiple hyphens', () => {
    expect(generateSlug('Mary Ann', 'Johnson')).toBe('mary-ann-johnson');
    expect(generateSlug('A--B', 'C--D')).toBe('a-b-c-d');
  });

  it('removes leading and trailing hyphens', () => {
    expect(generateSlug('-John', 'Doe-')).toBe('john-doe');
    expect(generateSlug('--Jane--', '--Smith--')).toBe('jane-smith');
  });

  it('handles empty strings', () => {
    expect(generateSlug('', 'Doe')).toBe('doe');
    expect(generateSlug('John', '')).toBe('john');
    expect(generateSlug('', '')).toBe('');
  });

  it('converts to lowercase', () => {
    expect(generateSlug('JOHN', 'DOE')).toBe('john-doe');
    expect(generateSlug('CamelCase', 'Name')).toBe('camelcase-name');
  });

  it('may create slugs that fail validation (edge case)', () => {
    // Short names create slugs < 5 chars, which fail isValidSlug
    expect(generateSlug('Al', 'Li')).toBe('al-li');
    expect(isValidSlug(generateSlug('Al', 'Li'))).toBe(false);
  });
});

describe('isValidSlug', () => {
  it('accepts valid slugs', () => {
    expect(isValidSlug('john-doe')).toBe(true);
    expect(isValidSlug('jane-smith-123')).toBe(true);
    expect(isValidSlug('abcde')).toBe(true); // 5 chars minimum
    expect(isValidSlug('user-1')).toBe(true);
  });

  it('rejects invalid slugs', () => {
    expect(isValidSlug('')).toBe(false);
    expect(isValidSlug('ab')).toBe(false); // Too short
    expect(isValidSlug('abcd')).toBe(false); // Too short (< 5 chars)
    expect(isValidSlug('-john')).toBe(false); // Starts with hyphen
    expect(isValidSlug('john-')).toBe(false); // Ends with hyphen
    expect(isValidSlug('john_doe')).toBe(false); // Contains underscore
    expect(isValidSlug('JOHN-DOE')).toBe(false); // Contains uppercase
    expect(isValidSlug('john--doe')).toBe(false); // Double hyphen
  });

  it('rejects very long slugs', () => {
    const longSlug = 'a'.repeat(51);
    expect(isValidSlug(longSlug)).toBe(false);
  });
});

describe('sanitizeSlug', () => {
  it('sanitizes user input', () => {
    expect(sanitizeSlug('John_Doe')).toBe('john-doe');
    expect(sanitizeSlug('JANE SMITH')).toBe('jane-smith');
    expect(sanitizeSlug('  -josé-  ')).toBe('jose');
  });

  it('handles long input (no length limit)', () => {
    const longInput = 'a'.repeat(60);
    expect(sanitizeSlug(longInput)).toBe('a'.repeat(60));
  });

  it('handles special characters', () => {
    expect(sanitizeSlug('user@example.com')).toBe('user-example-com');
    expect(sanitizeSlug('100% awesome!')).toBe('100-awesome');
  });
});
