import { TRPCError } from '@trpc/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    getErrorCode,
    getErrorDigest,
    isDevelopment,
    normalizeErrorMessage
} from '../../../src/lib/error-utils';

describe('normalizeErrorMessage', () => {
  it('extracts message from Error instance', () => {
    const error = new Error('Something went wrong');
    expect(normalizeErrorMessage(error)).toBe('Something went wrong');
  });

  it('extracts message from TRPCError instance', () => {
    const error = new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Invalid input provided',
    });
    expect(normalizeErrorMessage(error)).toBe('Invalid input provided');
  });

  it('returns string error as-is', () => {
    expect(normalizeErrorMessage('String error message')).toBe('String error message');
  });

  it('returns default message for unknown error types', () => {
    expect(normalizeErrorMessage(123)).toBe('An unexpected error occurred.');
    expect(normalizeErrorMessage(null)).toBe('An unexpected error occurred.');
    expect(normalizeErrorMessage(undefined)).toBe('An unexpected error occurred.');
  });

  it('handles object without message property', () => {
    expect(normalizeErrorMessage({ someProperty: 'value' })).toBe('An unexpected error occurred.');
  });

  it('handles empty string error', () => {
    expect(normalizeErrorMessage('')).toBe('');
  });

  it('handles Error with empty message', () => {
    const error = new Error('');
    expect(normalizeErrorMessage(error)).toBe('');
  });
});

describe('getErrorCode', () => {
  it('extracts code from TRPCError', () => {
    const error = new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Not authorized',
    });
    expect(getErrorCode(error)).toBe('UNAUTHORIZED');
  });

  it('extracts code from object with code property', () => {
    const error = { code: 'CUSTOM_ERROR', message: 'Custom error' };
    expect(getErrorCode(error)).toBe('CUSTOM_ERROR');
  });

  it('converts non-string code to string', () => {
    const error = { code: 404 };
    expect(getErrorCode(error)).toBe('404');
  });

  it('returns undefined for Error instances without code', () => {
    const error = new Error('Standard error');
    expect(getErrorCode(error)).toBeUndefined();
  });

  it('returns undefined for null/undefined', () => {
    expect(getErrorCode(null)).toBeUndefined();
    expect(getErrorCode(undefined)).toBeUndefined();
  });

  it('returns undefined for objects without code property', () => {
    expect(getErrorCode({ message: 'No code here' })).toBeUndefined();
  });

  it('returns undefined for primitive values', () => {
    expect(getErrorCode('string')).toBeUndefined();
    expect(getErrorCode(123)).toBeUndefined();
  });
});

describe('getErrorDigest', () => {
  it('extracts digest from object with digest property', () => {
    const error = { digest: 'abc123', message: 'Error with digest' };
    expect(getErrorDigest(error)).toBe('abc123');
  });

  it('converts non-string digest to string', () => {
    const error = { digest: 12345 };
    expect(getErrorDigest(error)).toBe('12345');
  });

  it('returns undefined for objects without digest property', () => {
    expect(getErrorDigest({ message: 'No digest here' })).toBeUndefined();
  });

  it('returns undefined for null/undefined', () => {
    expect(getErrorDigest(null)).toBeUndefined();
    expect(getErrorDigest(undefined)).toBeUndefined();
  });

  it('returns undefined for Error instances without digest', () => {
    const error = new Error('Standard error');
    expect(getErrorDigest(error)).toBeUndefined();
  });

  it('returns undefined for primitive values', () => {
    expect(getErrorDigest('string')).toBeUndefined();
    expect(getErrorDigest(123)).toBeUndefined();
  });

  it('handles complex object with digest', () => {
    const error = { 
      digest: 'complex-digest-123',
      code: 'ERROR',
      message: 'Complex error',
      stack: 'Stack trace...'
    };
    expect(getErrorDigest(error)).toBe('complex-digest-123');
  });
});

describe('isDevelopment', () => {
  beforeEach(() => {
    vi.stubGlobal('process', {
      env: {}
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns true when NODE_ENV is development', () => {
    vi.stubGlobal('process', {
      env: { NODE_ENV: 'development' }
    });
    expect(isDevelopment()).toBe(true);
  });

  it('returns false when NODE_ENV is production', () => {
    vi.stubGlobal('process', {
      env: { NODE_ENV: 'production' }
    });
    expect(isDevelopment()).toBe(false);
  });

  it('returns false when NODE_ENV is test', () => {
    vi.stubGlobal('process', {
      env: { NODE_ENV: 'test' }
    });
    expect(isDevelopment()).toBe(false);
  });

  it('returns false when NODE_ENV is undefined', () => {
    vi.stubGlobal('process', {
      env: {}
    });
    expect(isDevelopment()).toBe(false);
  });

  it('returns false when NODE_ENV is empty string', () => {
    vi.stubGlobal('process', {
      env: { NODE_ENV: '' }
    });
    expect(isDevelopment()).toBe(false);
  });
}); 