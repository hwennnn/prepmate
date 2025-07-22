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
    expect(generateSlug('Al', 'B')).toBe('al-b');
    expect(isValidSlug(generateSlug('Al', 'B'))).toBe(false);
  });
});

