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
    expect(normalizeErrorMessage(null)).toBe('An unexpected error occurred.');
    expect(normalizeErrorMessage(undefined)).toBe('An unexpected error occurred.');
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

  it('returns undefined for objects without code property', () => {
    expect(getErrorCode({ message: 'No code here' })).toBeUndefined();
  });
});

describe('getErrorDigest', () => {
  it('extracts digest from object with digest property', () => {
    const error = { digest: 'abc123', message: 'Error with digest' };
    expect(getErrorDigest(error)).toBe('abc123');
  });

  it('returns undefined for objects without digest property', () => {
    expect(getErrorDigest({ message: 'No digest here' })).toBeUndefined();
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
});